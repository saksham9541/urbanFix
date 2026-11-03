package com.urbanfix.backend.complaint;

import jakarta.validation.constraints.NotBlank;

public class UpdateStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String resolutionNotes;
    private String resolutionImageUrl;

    public UpdateStatusRequest() {
    }

    public UpdateStatusRequest(String status, String resolutionNotes, String resolutionImageUrl) {
        this.status = status;
        this.resolutionNotes = resolutionNotes;
        this.resolutionImageUrl = resolutionImageUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
