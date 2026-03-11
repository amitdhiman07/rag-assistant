// Api service for making HTTP requests to the backend API
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// functions to upload a pdf file to the backend
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
};

// function to ask a question to the backend and get an answer
export const askQuestion = async (question) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ask`, { question });
    return response.data;
  } catch (error) {
    console.error("Error asking question:", error);
    throw error;
  }
};
