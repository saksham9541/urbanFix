package com.urbanfix.backend.complaint;

import java.time.Instant;

public class ComplaintResponse {

    private Long id;
    private String trackingNumber;
    private String title;
    private String description;
    private String category;
    private String severity;
    private String status;
    private Double latitude;
    private Double longitude;
    private String address;
    private String imageUrl;
    private String citizenUsername;
    private String citizenName;
    private String assignedOfficerUsername;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private Instant slaDeadline;
    private Boolean isSlaBreached;
    private Long slaRemainingMinutes;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant resolvedAt;
    private String resolutionNotes;
    private String resolutionImageUrl;

    public ComplaintResponse() {
    }

    public static ComplaintResponse fromEntity(Complaint complaint) {
        ComplaintResponse dto = new ComplaintResponse();
        dto.setId(complaint.getId());
        dto.setTrackingNumber(complaint.getTrackingNumber());
        dto.setTitle(complaint.getTitle());
        dto.setDescription(complaint.getDescription());
        dto.setCategory(complaint.getCategory());
        dto.setSeverity(complaint.getSeverity());
        dto.setStatus(complaint.getStatus());
        dto.setLatitude(complaint.getLatitude());
        dto.setLongitude(complaint.getLongitude());
        dto.setAddress(complaint.getAddress());
        dto.setImageUrl(complaint.getImageUrl());

        if (complaint.getCitizen() != null) {
            dto.setCitizenUsername(complaint.getCitizen().getUsername());
            String firstName = complaint.getCitizen().getFirstName() != null ? complaint.getCitizen().getFirstName() : "";
            String lastName = complaint.getCitizen().getLastName() != null ? complaint.getCitizen().getLastName() : "";
            dto.setCitizenName((firstName + " " + lastName).trim());
        }

        if (complaint.getAssignedOfficer() != null) {
            dto.setAssignedOfficerUsername(complaint.getAssignedOfficer().getUsername());
        }

        if (complaint.getDepartment() != null) {
            dto.setDepartmentId(complaint.getDepartment().getId());
            dto.setDepartmentName(complaint.getDepartment().getName());
            dto.setDepartmentCode(complaint.getDepartment().getCode());
        }

        dto.setSlaDeadline(complaint.getSlaDeadline());
        boolean breached = Boolean.TRUE.equals(complaint.getIsSlaBreached());
        if (!breached && complaint.getSlaDeadline() != null && !"RESOLVED".equalsIgnoreCase(complaint.getStatus()) && !"CLOSED".equalsIgnoreCase(complaint.getStatus())) {
            breached = Instant.now().isAfter(complaint.getSlaDeadline());
        }
        dto.setIsSlaBreached(breached);

        if (complaint.getSlaDeadline() != null) {
            long remaining = java.time.Duration.between(Instant.now(), complaint.getSlaDeadline()).toMinutes();
            dto.setSlaRemainingMinutes(remaining);
        } else {
            dto.setSlaRemainingMinutes(0L);
        }

        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setUpdatedAt(complaint.getUpdatedAt());
        dto.setResolvedAt(complaint.getResolvedAt());
        dto.setResolutionNotes(complaint.getResolutionNotes());
        dto.setResolutionImageUrl(complaint.getResolutionImageUrl());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCitizenUsername() {
        return citizenUsername;
    }

    public void setCitizenUsername(String citizenUsername) {
        this.citizenUsername = citizenUsername;
    }

    public String getCitizenName() {
        return citizenName;
    }

    public void setCitizenName(String citizenName) {
        this.citizenName = citizenName;
    }

    public String getAssignedOfficerUsername() {
        return assignedOfficerUsername;
    }

    public void setAssignedOfficerUsername(String assignedOfficerUsername) {
        this.assignedOfficerUsername = assignedOfficerUsername;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public Instant getSlaDeadline() {
        return slaDeadline;
    }

    public void setSlaDeadline(Instant slaDeadline) {
        this.slaDeadline = slaDeadline;
    }

    public Boolean getIsSlaBreached() {
        return isSlaBreached;
    }

    public void setIsSlaBreached(Boolean isSlaBreached) {
        this.isSlaBreached = isSlaBreached;
    }

    public Long getSlaRemainingMinutes() {
        return slaRemainingMinutes;
    }

    public void setSlaRemainingMinutes(Long slaRemainingMinutes) {
        this.slaRemainingMinutes = slaRemainingMinutes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public String getResolutionImageUrl() {
        return resolutionImageUrl;
    }

    public void setResolutionImageUrl(String resolutionImageUrl) {
        this.resolutionImageUrl = resolutionImageUrl;
    }
}

