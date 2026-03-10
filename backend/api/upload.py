#------------ upload api -------------

from fastapi import APIRouter, File, UploadFile
from rag.index import load_pdf , chunk_document , store_embeddings
from config import settings

router = APIRouter()

@router.post("/upload")
async def upload_file(file : UploadFile = File(...)):
    
    # check if the file is a PDF
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files are allowed"}
    
    # save the uploaded file 
    file_location = f"{settings.UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())
    # process the file
    document = load_pdf(file_location)
    chunks = chunk_document(document)  
    store_embeddings(chunks)
    return {"message": "File uploaded and processed successfully"}