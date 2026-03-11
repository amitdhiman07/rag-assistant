// global state management for the app
import { createContext, useContext, useState } from "react";
import { uploadPDF, askQuestion } from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // define your state variables here
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState([]);

  // functions to update the state variables can also be defined here and passed down through the context provider
  const uploadFile = async (file) => {
    setLoading(true);
    try {
      const response = await uploadPDF(file);
      setPdf(prev => [...prev, response.filename]);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);
    setLoading(true);
    try {
      const response = await askQuestion(message);
      setMessages((prevMessages) => [
        ...prevMessages,
       { role: "assistant", content: response.answer },
      ]);
    } catch (error) {
      console.error("Error asking question:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        messages,
        setMessages,
        loading,
        setLoading,
        pdf,
        setPdf,
        uploadFile,
        sendMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
