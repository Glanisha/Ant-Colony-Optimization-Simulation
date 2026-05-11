from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import aco

app = FastAPI(title="Ant Colony Optimization API")

# CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(aco.router, prefix="/api/aco", tags=["aco"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Ant Colony Optimization API"}
