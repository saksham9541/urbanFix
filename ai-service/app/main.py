from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import HealthResponse, InferenceRequest, InferenceResponse
from app.inference import detector

app = FastAPI(
    title="UrbanFix AI Service",
    description="Civic Issue Classification and Vision Inference Service",
    version="1.0.0"
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
        version="1.0.0"
    )


@app.post("/predict", response_model=InferenceResponse)
def detect_issue(request: InferenceRequest):
    return detector.predict(request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
