from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduGen AI"
    GROQ_API_KEY: str
    AZURE_STORAGE_CONNECTION_STRING: str
    AZURE_SEARCH_ENDPOINT: str
    AZURE_SEARCH_KEY: str
    AZURE_SQL_CONNECTION_STRING: str
    
    class Config:
        env_file = ".env"

settings = Settings()
