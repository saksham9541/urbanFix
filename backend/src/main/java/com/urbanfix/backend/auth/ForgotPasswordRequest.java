package com.urbanfix.backend.auth;

import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {

    @NotBlank(message = "Username or Email is required")
    private String usernameOrEmail;

    // Optional role filter: "CITIZEN", "OFFICER", "ADMIN"
    private String role;

    public ForgotPasswordRequest() {
    }

    public ForgotPasswordRequest(String usernameOrEmail, String role) {
        this.usernameOrEmail = usernameOrEmail;
        this.role = role;
    }

    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
