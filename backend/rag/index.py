# ----------- Index phase for RAG pipeline -----------#
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from qdrant_client import QdrantClient
from langchain_qdrant import QdrantVectorStore
from qdrant_client.models import Distance, VectorParams
from config import settings


def load_pdf(file_path: str):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    return documents


def chunk_document(documents):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)
    return chunks


def store_embeddings(chunks):
    embeddings = OllamaEmbeddings(
        model=settings.OLLAMA_EMBED_MODEL, base_url=settings.OLLAMA_BASE_URL
    )
    client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
    # check if collection exists, if not create it
    collections = client.get_collections().collections
    if settings.COLLECTION_NAME not in [c.name for c in collections]:
        client.create_collection(
            collection_name=settings.COLLECTION_NAME,
            vectors_config=VectorParams(size=768, distance=Distance.COSINE),
        )
    vector_store = QdrantVectorStore(
        client=client, collection_name=settings.COLLECTION_NAME, embeddings=embeddings
    )
    vector_store.add_documents(chunks)
    return vector_store
