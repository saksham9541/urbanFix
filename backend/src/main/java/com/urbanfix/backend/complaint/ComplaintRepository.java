package com.urbanfix.backend.complaint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByTrackingNumber(String trackingNumber);
    List<Complaint> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
    List<Complaint> findByDepartmentIdOrderByCreatedAtDesc(Long departmentId);
    List<Complaint> findByAssignedOfficerIdOrderByCreatedAtDesc(Long officerId);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    List<Complaint> findByStatusOrderByCreatedAtDesc(String status);
    List<Complaint> findByCategoryOrderByCreatedAtDesc(String category);
    long countByStatus(String status);
}

