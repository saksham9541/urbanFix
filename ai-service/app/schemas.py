from pydantic import BaseModel, Field
from typing import List, Optional


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", description="Status of the AI service")
    service: str = Field(default="UrbanFix AI Service", description="Service name")
    version: str = Field(default="1.0.0", description="Semantic service version")


class BoundingBox(BaseModel):
    x_min: float
    y_min: float
    x_max: float
    y_max: float


class DetectionItem(BaseModel):
    label: str
    confidence: float
    box: Optional[BoundingBox] = None


class InferenceRequest(BaseModel):
    image_url: Optional[str] = None
    category_hint: Optional[str] = None


class InferenceResponse(BaseModel):
    issue_type: str
    confidence: float
    detected_items: List[DetectionItem] = []
    severity: str = "MEDIUM"

