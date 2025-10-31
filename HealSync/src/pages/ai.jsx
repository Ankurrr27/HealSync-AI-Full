import React, { useEffect, useRef, useState } from "react";
import { patientData } from "./patientData"; // ensure you export properly from patientData.js

const style = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scroll-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
  @keyframes scroll-right {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
  }
  .message-enter { animation: fadeIn 0.3s ease-out; }
  .animate-scroll-left { animation: scroll-left 40s linear infinite; }
  .animate-scroll-right { animation: scroll-right 40s linear infinite; }
`;

export default function AI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const modelCacheRef = useRef(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const findAvailableGeminiModel = async () => {
    if (!apiKey) throw new Error("VITE_GEMINI_API_KEY not set in .env");
    if (modelCacheRef.current) return modelCacheRef.current;

    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const res = await fetch(listUrl);
    const data = await res.json();
    const models = data?.models || [];
    const preferred = models.find(
      (m) => /gemini/i.test(m.name) && !/vision|image|video/i.test(m.name)
    );
    modelCacheRef.current = preferred?.name || "models/gemini-1.5-flash";
    return modelCacheRef.current;
  };

  const callGenerateContent = async (modelName, prompt) => {
    const url = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!res.ok) throw new Error(`generateContent failed: ${res.status}`);
    const json = await res.json();
    let text =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ??
      json?.output?.[0]?.content?.parts?.[0]?.text ??
      json?.candidates?.[0]?.content?.[0]?.text ??
      "Sorry, no response.";

    return text.replace(/\\/g, "").replace(/\*/g, "").trim();
  };

  const buildPromptWithPatient = (userQuery) => `
You are Heal Singh, a friendly digital health assistant. Use the following patient record to give relevant and concise advice.

Patient Record:
${JSON.stringify(patientData, null, 2)}

Instructions:
- Avoid repeating the patient's name.
- Respond naturally and briefly.
- Keep tone friendly and factual.

User Question:
${userQuery}
`;

  const sendToGemini = async (userQuery) => {
    try {
      if (!apiKey) return "Missing API key. Please configure your .env file.";
      const modelName = await findAvailableGeminiModel();
      const prompt = buildPromptWithPatient(userQuery);
      return await callGenerateContent(modelName, prompt);
    } catch (err) {
      console.error(err);
      return "Sorry, I couldn't contact the AI service. Try again later.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    const aiReply = await sendToGemini(input);
    setMessages((prev) => [...prev, { text: aiReply, sender: "ai" }]);
    setIsTyping(false);
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    handleSendMessage({ preventDefault: () => {} });
  };

  const prompts = [
    "What are common symptoms of the flu?",
    "How does intermittent fasting work?",
    "Explain the side effects of Ibuprofen.",
    "Best stretches for lower back pain.",
    "How much water should I drink daily?",
    "Tips for better sleep hygiene.",
  ];
  const scrollingPrompts = [...prompts, ...prompts];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-blue-50 font-sans">
      <style>{style}</style>

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            Digital Health Companion
          </h1>
        </div>
        <button
          onClick={() => window.history.back()}
          className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center pt-16 px-3">
            <h2 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-blue-600 to-black">
              Heal <span className="text-black">Singh AI</span>
            </h2>
            <p className="text-gray-700 text-base sm:text-lg mt-3 font-medium">
              Hey there ! How can I assist with your health today?
            </p>

            {/* Scrolling Prompts */}
            <div className="w-full max-w-full mx-auto mt-10 space-y-6 overflow-hidden">
              <div className="flex animate-scroll-left whitespace-nowrap p-2 min-w-[200%]">
                {scrollingPrompts.map((prompt, i) => (
                  <button
                    key={`r1-${i}`}
                    onClick={() => handlePromptClick(prompt)}
                    className="flex-shrink-0 mr-3 px-3 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs sm:text-sm shadow-sm hover:bg-blue-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex animate-scroll-right whitespace-nowrap p-2 min-w-[200%]">
                {scrollingPrompts.map((prompt, i) => (
                  <button
                    key={`r2-${i}`}
                    onClick={() => handlePromptClick(prompt)}
                    className="flex-shrink-0 mr-3 px-3 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs sm:text-sm shadow-sm hover:bg-blue-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex message-enter ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-xl max-w-[85%] sm:max-w-md shadow-md ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start message-enter">
            <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm animate-pulse">
              AI is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-gray-200 sticky bottom-0"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health query..."
            className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isTyping}
            className={`p-3 text-white rounded-full ${
              isTyping
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 transform -rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
