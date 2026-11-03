package com.urbanfix.backend.auth;

import com.urbanfix.backend.security.JwtUtils;
import com.urbanfix.backend.security.UserDetailsImpl;
import com.urbanfix.backend.user.Role;
import com.urbanfix.backend.user.RoleName;
import com.urbanfix.backend.user.RoleRepository;
import com.urbanfix.backend.user.User;
import com.urbanfix.backend.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                roles
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName()
        );

        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setDepartmentId(signUpRequest.getDepartmentId());
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setIsActive(true);

        Set<Role> roles = new HashSet<>();
        String reqRole = signUpRequest.getRole();

        if (reqRole == null || reqRole.isBlank()) {
            Role citizenRole = roleRepository.findByName(RoleName.ROLE_CITIZEN.name())
                    .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_CITIZEN.name(), "Regular citizen")));
            roles.add(citizenRole);
        } else {
            String roleUpper = reqRole.trim().toUpperCase();
            if (!roleUpper.startsWith("ROLE_")) {
                roleUpper = "ROLE_" + roleUpper;
            }

            final String finalRoleName = roleUpper;
            Role assignedRole = roleRepository.findByName(finalRoleName)
                    .orElseGet(() -> roleRepository.save(new Role(finalRoleName, "Role for " + finalRoleName)));
            roles.add(assignedRole);
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        // Auto-authenticate registered user and generate token
        List<String> roleNames = savedUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String jwt = jwtUtils.generateTokenFromUsername(
                savedUser.getUsername(),
                savedUser.getId(),
                savedUser.getEmail(),
                roleNames
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                roleNames
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "id", userDetails.getId(),
                "username", userDetails.getUsername(),
                "email", userDetails.getEmail(),
                "firstName", userDetails.getFirstName() != null ? userDetails.getFirstName() : "",
                "lastName", userDetails.getLastName() != null ? userDetails.getLastName() : "",
                "roles", roles
        ));
    }
}

