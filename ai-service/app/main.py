from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json
from app.schemas import (
    HealthResponse,
    InferenceRequest,
    InferenceResponse,
    AiAnalysisRequest,
    AiAnalysisResponse,
)
from app.inference import detector

app = FastAPI(
    title="UrbanFix AI Vision Engine",
    description="Computer Vision & Civic Anomaly Classification Microservice",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        service="UrbanFix AI Service",
        version="1.0.0",
    )


@app.post("/detect", response_model=AiAnalysisResponse)
async def detect_issue(raw_req: Request):
    try:
        body_bytes = await raw_req.body()
        if body_bytes:
            data = json.loads(body_bytes.decode("utf-8"))
            request = AiAnalysisRequest(**data)
        else:
            request = AiAnalysisRequest()
    except Exception:
        request = AiAnalysisRequest()
    return detector.analyze(request)


@app.post("/detect-upload", response_model=AiAnalysisResponse)
async def detect_issue_upload(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category_hint: Optional[str] = Form(None),
):
    request = AiAnalysisRequest(
        image_url=file.filename,
        title=title,
        description=description,
        category_hint=category_hint,
    )
    return detector.analyze(request)


@app.post("/predict", response_model=InferenceResponse)
def predict_legacy(request: InferenceRequest):
    return detector.predict(request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
