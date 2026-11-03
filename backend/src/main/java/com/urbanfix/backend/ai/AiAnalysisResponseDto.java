package com.urbanfix.backend.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AiAnalysisResponseDto {

    @JsonProperty("detected_category")
    private String detectedCategory;

    @JsonProperty("category_name")
    private String categoryName;

    private Double confidence;

    @JsonProperty("suggested_severity")
    private String suggestedSeverity;

    @JsonProperty("detected_labels")
    private List<DetectionItemDto> detectedLabels;

    private String explanation;

    @JsonProperty("urgency_score")
    private Integer urgencyScore;

    @JsonProperty("ai_verified")
    private Boolean aiVerified;

    @JsonProperty("processing_time_ms")
    private Double processingTimeMs;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BoundingBoxDto {
        @JsonProperty("x_min")
        private Double xMin;

        @JsonProperty("y_min")
        private Double yMin;

        @JsonProperty("x_max")
        private Double xMax;

        @JsonProperty("y_max")
        private Double yMax;

        public Double getXMin() {
            return xMin;
        }

        public void setXMin(Double xMin) {
            this.xMin = xMin;
        }

        public Double getYMin() {
            return yMin;
        }

        public void setYMin(Double yMin) {
            this.yMin = yMin;
        }

        public Double getXMax() {
            return xMax;
        }

        public void setXMax(Double xMax) {
            this.xMax = xMax;
        }

        public Double getYMax() {
            return yMax;
        }

        public void setYMax(Double yMax) {
            this.yMax = yMax;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DetectionItemDto {
        private String label;
        private Double confidence;
        private BoundingBoxDto box;

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public Double getConfidence() {
            return confidence;
        }

        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }

        public BoundingBoxDto getBox() {
            return box;
        }

        public void setBox(BoundingBoxDto box) {
            this.box = box;
        }
    }

    public String getDetectedCategory() {
        return detectedCategory;
    }

    public void setDetectedCategory(String detectedCategory) {
        this.detectedCategory = detectedCategory;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getSuggestedSeverity() {
        return suggestedSeverity;
    }

    public void setSuggestedSeverity(String suggestedSeverity) {
        this.suggestedSeverity = suggestedSeverity;
    }

    public List<DetectionItemDto> getDetectedLabels() {
        return detectedLabels;
    }

    public void setDetectedLabels(List<DetectionItemDto> detectedLabels) {
        this.detectedLabels = detectedLabels;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Integer getUrgencyScore() {
        return urgencyScore;
    }

    public void setUrgencyScore(Integer urgencyScore) {
        this.urgencyScore = urgencyScore;
    }

    public Boolean getAiVerified() {
        return aiVerified;
    }

    public void setAiVerified(Boolean aiVerified) {
        this.aiVerified = aiVerified;
    }

    public Double getProcessingTimeMs() {
        return processingTimeMs;
    }

    public void setProcessingTimeMs(Double processingTimeMs) {
        this.processingTimeMs = processingTimeMs;
    }
}
