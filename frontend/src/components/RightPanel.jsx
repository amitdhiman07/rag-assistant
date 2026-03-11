import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ReactMarkdown from "react-markdown";

const TypingDots = () => (
  <div className="flex items-end gap-3">
    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
      AI
    </div>
    <div className="bg-white border border-black/[0.06] px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
      <div className="flex gap-1 items-center h-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.8s" }}
          />
        ))}
      </div>
    </div>
  </div>
);

const ThinkingBar = () => (
  <div className="flex items-center gap-2 px-1">
    <div className="relative w-full h-0.5 bg-black/[0.06] rounded-full overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full w-1/3 bg-indigo-400 rounded-full"
        style={{
          animation: "shimmer 1.4s ease-in-out infinite",
        }}
      />
    </div>
    <span className="text-[10px] text-indigo-400 font-medium shrink-0 tracking-wide">thinking</span>
  </div>
);

const RightPanel = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, loading } = useAppContext();
  const bottomRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(400%); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .msg-enter {
          animation: fadeSlideUp 0.25s ease-out forwards;
        }
        .dot-pulse {
          animation: pulse-ring 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col h-full bg-[#fafafa]">

        {/* Header */}
        <div className="border-b border-black/[0.06] bg-white px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-5 h-5">
              <span className="dot-pulse absolute w-3 h-3 rounded-full bg-indigo-400/40"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 relative"></span>
            </div>
            <span className="text-sm font-semibold text-gray-800 tracking-tight">
              AI Document Assistant
            </span>
          </div>
          {loading && (
            <span className="text-[11px] text-indigo-400 font-medium tracking-wide animate-pulse">
              ● Analyzing...
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-3xl mx-auto space-y-5">

            {messages.length === 0 && !loading && (
              <div className="text-center py-24">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm font-medium">No documents yet</p>
                <p className="text-gray-400 text-xs mt-1">Upload a PDF on the left to get started</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`msg-enter flex items-end gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
                style={{ animationDelay: `${Math.min(index * 30, 150)}ms` }}
              >
                {msg.role !== "user" && (
                  <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm shadow-indigo-200">
                    AI
                  </div>
                )}

                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${msg.role === "user"
                      ? "bg-indigo-500 text-white max-w-md rounded-br-sm shadow-sm shadow-indigo-200"
                      : "bg-white border border-black/[0.06] text-gray-700 max-w-2xl rounded-bl-sm shadow-sm"
                    }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-[10px] font-bold shrink-0">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="msg-enter space-y-2">
                <TypingDots />
                <div className="ml-10">
                  <ThinkingBar />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-black/[0.06] bg-white px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className={`flex gap-2 items-end rounded-xl border transition-all duration-200 bg-[#fafafa] px-3 py-2
              ${loading ? "border-indigo-200" : "border-black/[0.08] focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-400/20"}`}
            >
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask something about your PDFs..."
                rows={1}
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none py-1 max-h-[120px] disabled:opacity-50"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="shrink-0 w-8 h-8 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center transition-all duration-150 shadow-sm shadow-indigo-200"
              >
                {loading ? (
                  <svg className="w-3.5 h-3.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-300 mt-1.5 text-right">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>

      </div>
    </>
  );
};

export default RightPanel;