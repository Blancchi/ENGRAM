
from fastapi import FastAPI

app = FastAPI(
    title="ENGRAM API",
    description="Backend API for ENGRAM – Alaala: My Personal AI Diary",
    version="0.1.0",
)


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "application": "ENGRAM",
        "message": "Backend is running successfully",
    }
