import React, { useState, useEffect } from "react";
import { Mic, MicOff, MessageCircle } from "lucide-react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;

  const handleVoiceToggle = () => {
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };

  useEffect(() => {
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptPart);
        } else {
          interimTranscript += transcriptPart;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    return () => {
      recognition.stop();
    };
  }, [recognition]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl p-4 mb-4 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">AI Assistant</h3>
            <button
              onClick={handleVoiceToggle}
              className={`p-2 rounded-full ${
                listening
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {listening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
          <div className="h-40 overflow-y-auto bg-gray-50 p-2 rounded mb-2">
            {transcript || "How can I help you today?"}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTranscript("")}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};
