#--------- main entry point for the backend ---------
from fastapi import FastAPI
from api.upload import router as upload_router
from api.chat import router as chat_router
import os
from config import settings

# make sure uploads folder exists on startup
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI()

app.include_router(upload_router)
app.include_router(chat_router)
