from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Ant Colony Optimization API"
    
    class Config:
        env_file = ".env"

settings = Settings()
