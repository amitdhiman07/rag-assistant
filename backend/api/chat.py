#------------ chat.py --------------
from pydantic import BaseModel
from fastapi import APIRouter
from rag.retriever import ask_question

class QuestionRequest(BaseModel):
    question: str

router = APIRouter()

@router.post("/ask")
async def chat(request: QuestionRequest):
    # call ask_question from retriever module
    answer = ask_question(request.question)
    return {"answer": answer}
