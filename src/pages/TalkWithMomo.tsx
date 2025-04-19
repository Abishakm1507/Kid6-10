import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, SendHorizonal, Sparkles } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import Momo3D from '../components/Momo3D';

type Conversation = {
  id: string;
  sender: 'user' | 'momo';
  text: string;
  timestamp: number;
};

// Sample predefined prompts
const predefinedPrompts = [
  'Tell me about space!',
  'What are some fun animal facts?',
  'How does rain happen?',
  'Why is the sky blue?',
  'What\'s the tallest mountain?',
  'Tell me a fun fact!',
];

// Gemini API key
const GEMINI_API_KEY = 'AIzaSyCWrJSVq9l5749Eq2hFiYP1zAPKp0aP0cA';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Grok API key
const GROK_API_KEY = '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';
const GROK_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ElevenLabs API key
const ELEVENLABS_API_KEY = 'sk_0a698d0fe41e151a6beb111e56e8c33e47b779c45349290c';
const ELEVENLABS_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Using "Rachel" voice - you can change this to another voice ID

// Remove the genAI initialization

const TalkWithMomo: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteColor } = useUserStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      sender: 'momo',
      text: 'Hi there! I\'m Momo, your learning buddy! What would you like to know about today?',
      timestamp: Date.now(),
    }
  ]);
  
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom of chat when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversations]);
  
  useEffect(() => {
    // Create audio element for TTS playback
    const audio = new Audio();
    setAudioElement(audio);
    
    return () => {
      // Cleanup: stop audio when component unmounts
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);
  
  // Move speakText inside the component
  const speakText = async (text: string) => {
    if (!audioElement) return;
    
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + ELEVENLABS_VOICE_ID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      audioElement.src = audioUrl;
      audioElement.onplay = () => setIsSpeaking(true);
      audioElement.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl); // Clean up
      };
      
      await audioElement.play();
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setIsSpeaking(false);
    }
  };
  
  // Revert to the fetch implementation for Gemini API
  const fetchGeminiResponse = async (userMessage: string) => {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Momo, a friendly AI learning buddy for children. 
                  Respond to the following question in a simple, educational, and child-friendly way. 
                  Keep your response concise (around 3-4 sentences) and engaging for young learners: "${userMessage}"`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected API response format:', data);
        return "I'm having trouble thinking right now. Can you ask me something else?";
      }
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      return "I'm having trouble connecting to my brain. Can we try again in a moment?";
    }
  };
  
  // Updated to use Grok API
  const fetchGrokResponse = async (userMessage: string) => {
    try {
      const response = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROK_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are Momo, a friendly AI learning buddy for children. Your responses should be simple, educational, and child-friendly. Keep your responses concise (around 3-4 sentences) and engaging for young learners."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        }),
      });
  
      const data = await response.json();
      
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content;
      } else {
        console.error('Unexpected API response format:', data);
        return "I'm having trouble thinking right now. Can you ask me something else?";
      }
    } catch (error) {
      console.error('Error fetching from Grok API:', error);
      return "I'm having trouble connecting to my brain. Can we try again in a moment?";
    }
  };
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    const userMessage: Conversation = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      timestamp: Date.now(),
    };
    
    setConversations(prev => [...prev, userMessage]);
    const sentMessage = message;
    setMessage('');
    
    // Set speaking state for animation during API call
    setIsSpeaking(true);
    
    // Get response from Grok API
    const aiResponse = await fetchGrokResponse(sentMessage);
    
    const momoResponse: Conversation = {
      id: (Date.now() + 1).toString(),
      sender: 'momo',
      text: aiResponse,
      timestamp: Date.now(),
    };
    
    // Add Momo's response to the conversation
    setConversations(prev => [...prev, momoResponse]);
    
    // Speak the response (this will manage the isSpeaking state)
    await speakText(aiResponse);
  };
  
  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
  };
  
  return (
    <div className="pb-16 flex flex-col h-[calc(100vh-16rem)]">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate('/home')}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Talk with Momo
        </h1>
      </div>
      
      {/* Main content area - side by side layout */}
      <div className="flex flex-row gap-4 flex-grow">
        {/* 3D Character - Left side */}
        <div className="card w-1/3 flex items-center justify-center">
          <Momo3D speaking={isSpeaking} />
        </div>
        
        {/* Right side - Chat area */}
        <div className="w-2/3 flex flex-col">
          {/* Chat area */}
          <div 
            ref={chatContainerRef}
            className="card flex-grow overflow-y-auto mb-4 p-4"
          >
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`mb-4 ${
                  conversation.sender === 'user'
                    ? 'flex justify-end'
                    : 'flex justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    conversation.sender === 'user'
                      ? 'bg-[color:var(--primary)] text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                  style={
                    conversation.sender === 'user' 
                      ? { backgroundColor: favoriteColor } 
                      : {}
                  }
                >
                  {conversation.text}
                </div>
              </div>
            ))}
            
            {isSpeaking && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Suggested prompts */}
          <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
            {predefinedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="whitespace-nowrap px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              >
                {prompt}
              </button>
            ))}
          </div>
          
          {/* Message input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask Momo a question..."
              className="input-field flex-grow"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!message.trim() || isSpeaking}
              className={`p-3 rounded-full ${
                !message.trim() || isSpeaking
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[color:var(--primary)] text-white'
              }`}
              style={
                message.trim() && !isSpeaking 
                  ? { backgroundColor: favoriteColor } 
                  : {}
              }
            >
              <SendHorizonal className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalkWithMomo;