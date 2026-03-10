# configuration file
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    QDRANT_HOST : str = 'localhost'
    QDRANT_PORT : int = 6333
    OLLAMA_BASE_URL : str = 'http://localhost:11434'
    OLLAMA_EMBED_MODEL : str = 'nomic-embed-text'
    OLLAMA_LLM_MODEL : str = 'llama3'
    UPLOAD_DIR: str = "uploads"
    COLLECTION_NAME: str = "documents"
    
    class Config:
        env_file = ".env"

settings = Settings()