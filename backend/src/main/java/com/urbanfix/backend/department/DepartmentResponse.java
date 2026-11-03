package com.urbanfix.backend.department;

public class DepartmentResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private String contactEmail;
    private Integer defaultSlaHours;
    private long activeTicketsCount;
    private long resolvedTicketsCount;

    public DepartmentResponse() {
    }

    public DepartmentResponse(Long id, String name, String code, String description,
                              String contactEmail, Integer defaultSlaHours,
                              long activeTicketsCount, long resolvedTicketsCount) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.contactEmail = contactEmail;
        this.defaultSlaHours = defaultSlaHours;
        this.activeTicketsCount = activeTicketsCount;
        this.resolvedTicketsCount = resolvedTicketsCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public Integer getDefaultSlaHours() {
        return defaultSlaHours;
    }

    public void setDefaultSlaHours(Integer defaultSlaHours) {
        this.defaultSlaHours = defaultSlaHours;
    }

    public long getActiveTicketsCount() {
        return activeTicketsCount;
    }

    public void setActiveTicketsCount(long activeTicketsCount) {
        this.activeTicketsCount = activeTicketsCount;
    }

    public long getResolvedTicketsCount() {
        return resolvedTicketsCount;
    }

    public void setResolvedTicketsCount(long resolvedTicketsCount) {
        this.resolvedTicketsCount = resolvedTicketsCount;
    }
}

