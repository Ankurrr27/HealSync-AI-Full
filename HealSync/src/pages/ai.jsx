import React, { useState, useEffect, useRef } from 'react';

// Custom CSS for animations and non-Tailwind styles
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

  .message-enter {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-scroll-left {
    animation: scroll-left 40s linear infinite;
  }
  
  .animate-scroll-right {
    animation: scroll-right 40s linear infinite;
  }
`;

export default function AI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          text: `Hello! I'm your digital health companion Heal Singh . For a more detailed consultation, please consider contacting a human doctor.`,
          sender: 'ai',
        },
      ]);
    }, 1500);
  };
  
  const handlePromptClick = (prompt) => {
    setInput(prompt);
    handleSendMessage({ preventDefault: () => {} });
  };

  const prompts = [
    "What are common symptoms of the flu?",
    "How does intermittent fasting work?",
    "Explain the side effects of Ibuprofen.",
    "What are the benefits of a Mediterranean diet?",
    "Best stretches for lower back pain.",
    "How much water should I drink daily?",
    "What is the average resting heart rate?",
    "Tips for better sleep hygiene.",
    "Can stress cause physical symptoms?",
    "Differentiate between a cold and allergies.",
  ];
  const scrollingPrompts = [...prompts, ...prompts];

  return (
   <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-blue-50 bg-fixed font-sans">
      <style>{style}</style>
      
      {/* Header with Back Button */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md sticky top-0 z-10">
        <div className="flex items-center space-x-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Digital Health Companion
            </h1>
        </div>
        <button 
          onClick={() => window.history.back()} 
          className="text-gray-500 hover:text-blue-600 transition-colors flex items-center p-1 rounded-full hover:bg-gray-100"
          aria-label="Go back to home page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center h-full pt-10 text-center">
            <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-black p-2 mt-20">Heal Singh AI</h2>
            <p className="text-gray-900 text-lg mb-6 font-bold">
              Welcome! How can I assist with your health today?
            </p>
            <p className="text-xs text-red-500 max-w-sm mb-8">
              This page is under construction and will be soon launched <br />
              TILL THEN STAY TUNED ! 
            </p>
            
            {/* Suggested Prompts Panel - Automatically Scrolling Rows */}
            <div className="w-full max-w-full mx-auto space-y-8 overflow-hidden">
                
                {/* Row 1: Scroll Left */}
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

                {/* Row 2: Scroll Right */}
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

        {/* Dynamic chat messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex message-enter ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-3 rounded-xl max-w-xs md:max-w-md shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
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
                isTyping ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform -rotate-45"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}