package com.urbanfix.backend.complaint;

import jakarta.validation.constraints.NotBlank;

public class ReopenComplaintRequest {

    @NotBlank(message = "Reopen reason is required")
    private String reason;

    public ReopenComplaintRequest() {
    }

    public ReopenComplaintRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
