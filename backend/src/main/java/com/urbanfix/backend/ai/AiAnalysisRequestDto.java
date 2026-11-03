package com.urbanfix.backend.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AiAnalysisRequestDto {

    @JsonProperty("image_url")
    private String imageUrl;

    private String title;

    private String description;

    @JsonProperty("category_hint")
    private String categoryHint;

    public AiAnalysisRequestDto() {
    }

    public AiAnalysisRequestDto(String imageUrl, String title, String description, String categoryHint) {
        this.imageUrl = imageUrl;
        this.title = title;
        this.description = description;
        this.categoryHint = categoryHint;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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

    public String getCategoryHint() {
        return categoryHint;
    }

    public void setCategoryHint(String categoryHint) {
        this.categoryHint = categoryHint;
    }
}
