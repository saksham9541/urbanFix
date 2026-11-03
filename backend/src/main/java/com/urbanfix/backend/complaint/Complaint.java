package com.urbanfix.backend.complaint;

import com.urbanfix.backend.user.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_number", length = 64, nullable = false, unique = true)
    private String trackingNumber;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(length = 50, nullable = false)
    private String category;

    @Column(length = 20)
    private String severity = "MEDIUM";

    @Column(length = 30)
    private String status = "SUBMITTED";

    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "ai_predicted_category", length = 50)
    private String aiPredictedCategory;

    @Column(name = "ai_confidence")
    private Double aiConfidence;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "citizen_id")
    private User citizen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private com.urbanfix.backend.department.Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @Column(name = "sla_deadline")
    private Instant slaDeadline;

    @Column(name = "is_sla_breached")
    private Boolean isSlaBreached = false;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "resolution_image_url", columnDefinition = "TEXT")
    private String resolutionImageUrl;

    @Column(name = "citizen_rating")
    private Integer citizenRating;

    @Column(name = "citizen_feedback", columnDefinition = "TEXT")
    private String citizenFeedback;

    @Column(name = "closed_at")
    private Instant closedAt;

    public Complaint() {
    }

    public Complaint(String trackingNumber, String title, String description, String category,
                     String severity, Double latitude, Double longitude, String address,
                     String imageUrl, User citizen) {
        this.trackingNumber = trackingNumber;
        this.title = title;
        this.description = description;
        this.category = category;
        this.severity = severity != null ? severity : "MEDIUM";
        this.status = "SUBMITTED";
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.imageUrl = imageUrl;
        this.citizen = citizen;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
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

    public String getAiPredictedCategory() {
        return aiPredictedCategory;
    }

    public void setAiPredictedCategory(String aiPredictedCategory) {
        this.aiPredictedCategory = aiPredictedCategory;
    }

    public Double getAiConfidence() {
        return aiConfidence;
    }

    public void setAiConfidence(Double aiConfidence) {
        this.aiConfidence = aiConfidence;
    }

    public User getCitizen() {
        return citizen;
    }

    public void setCitizen(User citizen) {
        this.citizen = citizen;
    }

    public com.urbanfix.backend.department.Department getDepartment() {
        return department;
    }

    public void setDepartment(com.urbanfix.backend.department.Department department) {
        this.department = department;
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

    public void setIsSlaBreached(Boolean slaBreached) {
        isSlaBreached = slaBreached;
    }

    public User getAssignedOfficer() {
        return assignedOfficer;
    }

    public void setAssignedOfficer(User assignedOfficer) {
        this.assignedOfficer = assignedOfficer;
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

    public Integer getCitizenRating() {
        return citizenRating;
    }

    public void setCitizenRating(Integer citizenRating) {
        this.citizenRating = citizenRating;
    }

    public String getCitizenFeedback() {
        return citizenFeedback;
    }

    public void setCitizenFeedback(String citizenFeedback) {
        this.citizenFeedback = citizenFeedback;
    }

    public Instant getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(Instant closedAt) {
        this.closedAt = closedAt;
    }
}

