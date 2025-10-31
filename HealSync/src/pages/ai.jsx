import React, { useEffect, useRef, useState } from "react";
import { patientData } from "./patientData"; // make sure this file exports correctly

// --- Custom CSS animations ---
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

  // --- Detect available Gemini model ---
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

  // --- Core Gemini call ---
  const callGenerateContent = async (modelName, prompt) => {
    const url = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("generateContent error", res.status, txt);
      throw new Error(`generateContent failed: ${res.status}`);
    }

    const json = await res.json();
    let text =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ??
      json?.output?.[0]?.content?.parts?.[0]?.text ??
      json?.candidates?.[0]?.content?.[0]?.text ??
      JSON.stringify(json, null, 2);

    // ✅ Clean unwanted markdown symbols
    text = text.replace(/\\/g, "").replace(/\*/g, "");

    return text.trim();
  };

  // --- Build prompt with patient info ---
  const buildPromptWithPatient = (userQuery) => {
    return `
You are Heal Singh, a friendly digital health assistant. Use the following patient record to give relevant and concise advice.

Patient Record:
${JSON.stringify(patientData, null, 2)}

Instructions:
- Do not repeat the patient's name in your response.
- Avoid using bold or markdown.
- For greetings or casual talk, respond naturally without medical advice.
- Give short, factual, and easy-to-understand answers.

User Question:
${userQuery}
    `.trim();
  };

  // --- Send to Gemini ---
  const sendToGemini = async (userQuery) => {
    try {
      if (!apiKey) return "Missing API key. Please configure your .env file.";
      const modelName = await findAvailableGeminiModel();
      const prompt = buildPromptWithPatient(userQuery);
      const aiText = await callGenerateContent(modelName, prompt);
      return aiText;
    } catch (err) {
      console.error("sendToGemini error:", err);
      return "Sorry, I couldn't contact the AI service. Please try again later.";
    }
  };

  // --- Handle message send ---
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

  // --- Prompt buttons ---
  const handlePromptClick = (prompt) => {
    setInput(prompt);
    handleSendMessage({ preventDefault: () => {} });
  };

 const prompts = [
  "What are signs of the flu?",
  "How does fasting help the body?",
  "What are the side effects of painkillers?",
  "Why is the Mediterranean diet healthy?",
  "Easy stretches for back pain.",
  "How much water should I drink?",
  "What’s a normal heart rate?",
  "How to sleep better?",
  "Can stress make you sick?",
  "Cold vs allergies — what’s the difference?",
];

  const scrollingPrompts = [...prompts, ...prompts];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-blue-50 bg-fixed font-sans">
      <style>{style}</style>

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Heal Singh AI 
          </h1>
        </div>
        <button
          onClick={() => window.history.back()}
          className="text-gray-500 hover:text-blue-600 transition-colors flex items-center p-1 rounded-full hover:bg-gray-100"
          aria-label="Go back to home page"
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

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 ">
        {messages.length === 0 && (
          <div className="flex flex-col items-center h-full  text-center">
            <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-black p-2 mt-20">
              Heal Singh AI
            </h2>
            <p className="text-gray-900 text-lg mb-6 font-bold">
              Welcome! How can I assist with your health today?
            </p>
            

            {/* Scrolling Prompts */}
            <div className="w-full max-w-full mx-auto space-y-8 overflow-hidden">
              <div className="flex animate-scroll-left whitespace-nowrap p-2 min-w-[200%]">
                {scrollingPrompts.map((prompt, i) => (
                  <button
                    key={`r1-${i}`}
                    onClick={() => handlePromptClick(prompt)}
                    className="flex-shrink-0 mr-3 p-3 bg-white border border-blue-200 text-blue-600 rounded-lg text-sm shadow-sm hover:bg-blue-50 transition-colors"
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
                    className="flex-shrink-0 mr-3 p-3 bg-white border border-blue-200 text-blue-600 rounded-lg text-sm shadow-sm hover:bg-blue-50 transition-colors"
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
              className={`p-3 rounded-xl max-w-xs md:max-w-md shadow-md ${
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
            <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm animate-pulse rounded-bl-none">
              AI is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-gray-200 sticky bottom-0"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health query..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isTyping}
            className={`p-3 text-white rounded-full transition-colors ${
              isTyping
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform -rotate-45"
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
