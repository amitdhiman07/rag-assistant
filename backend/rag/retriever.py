# ---------- Retriever ----------#
from langchain_qdrant import QdrantVectorStore
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from qdrant_client import QdrantClient
from langchain_core.prompts import PromptTemplate
from config import settings


def get_retriever():
    # connect to the Qdrant vector database
    client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)

    # create the embedding model
    embedding_model = OllamaEmbeddings(
        model=settings.OLLAMA_EMBED_MODEL, base_url=settings.OLLAMA_BASE_URL
    )

    # create the retriever
    retriever = QdrantVectorStore(
        client=client,
        collection_name=settings.COLLECTION_NAME,
        embeddings=embedding_model,
    ).as_retriever()

    return retriever


def ask_question(question: str):
    template = PromptTemplate.from_template(
        input_variables=["context", "question"],
        template="""
        Answer the question based on the following context:
        {context}
        Question: {question}
        Answer:
        
    """,
    )

    llm = OllamaLLM(model=settings.OLLAMA_LLM_MODEL, base_url=settings.OLLAMA_BASE_URL)
    retriever = get_retriever()

    context = retriever.invoke(question)
    prompt = template.format(context=context, question=question)
    answer = llm.invoke(prompt)
    return answer
