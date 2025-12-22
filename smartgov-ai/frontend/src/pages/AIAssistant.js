import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import '../styles/chat.css';

function AIAssistant() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSessions = async () => {
    try {
      const response = await chatAPI.getSessions();
      setSessions(response.data);
      if (response.data.length > 0) {
        setCurrentSession(response.data[0]);
        setMessages(response.data[0].messages);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await chatAPI.createSession();
      const newSession = response.data;
      setSessions([newSession, ...sessions]);
      setCurrentSession(newSession);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentSession) return;

    setLoading(true);
    const userMessage = input;
    setInput('');

    try {
      const response = await chatAPI.sendMessage(
        userMessage,
        currentSession.id,
        language,
        category
      );

      // Add messages to display
      setMessages([
        ...messages,
        {
          id: Date.now(),
          role: 'user',
          message: userMessage,
          timestamp: new Date(),
        },
        {
          id: Date.now() + 1,
          role: 'assistant',
          message: response.data.ai_response,
          timestamp: new Date(),
        },
      ]);

      // Speak response if enabled
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response.data.ai_response);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar slide-in-left">
        <button onClick={createNewSession} className="btn btn-primary btn-full">
          + New Chat
        </button>

        <div className="sessions-list">
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`session-item ${currentSession?.id === session.id ? 'active' : ''
                  }`}
                onClick={() => {
                  setCurrentSession(session);
                  setMessages(session.messages || []);
                }}
              >
                <span className="session-title">
                  {session.title || 'Untitled Chat'}
                </span>
                <span className="session-date">
                  {new Date(session.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="empty-sessions">
              <p>No chat sessions yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="chat-main slide-in-right">
        {currentSession ? (
          <>
            <div className="chat-header">
              <h2>SmartGov AI Assistant</h2>
              <div className="chat-controls">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="select-control"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select-control"
                >
                  <option value="general">General</option>
                  <option value="scheme_info">Scheme Info</option>
                  <option value="eligibility">Eligibility</option>
                  <option value="documents">Documents</option>
                </select>
              </div>
            </div>

            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-state fade-in">
                  <span className="empty-icon">💬</span>
                  <p>Start a conversation about government schemes</p>
                  <div className="suggested-prompts">
                    <button
                      onClick={() => setInput('What schemes am I eligible for?')}
                      className="prompt-btn"
                    >
                      What schemes am I eligible for?
                    </button>
                    <button
                      onClick={() =>
                        setInput('How do I apply for a government scheme?')
                      }
                      className="prompt-btn"
                    >
                      How do I apply for a scheme?
                    </button>
                    <button
                      onClick={() => setInput('What documents do I need?')}
                      className="prompt-btn"
                    >
                      What documents do I need?
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.role} slide-in-up`}
                  >
                    <div className="message-content">
                      {msg.role === 'user' && <span className="icon">👤</span>}
                      {msg.role === 'assistant' && <span className="icon">🤖</span>}
                      <div className="message-text">{msg.message}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <div className="input-group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about government schemes..."
                  className="chat-input"
                  rows="3"
                  disabled={loading}
                />
                <div className="input-actions">
                  <button
                    onClick={startListening}
                    className={`btn btn-secondary ${isListening ? 'pulse' : ''}`}
                    disabled={loading}
                    title="Click to speak"
                  >
                    🎤
                  </button>
                  <button
                    onClick={sendMessage}
                    className="btn btn-primary"
                    disabled={loading || !input.trim()}
                  >
                    {loading ? '⏳' : '↗️'} Send
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state fade-in">
            <span className="empty-icon">📝</span>
            <p>Create a new chat to get started</p>
            <button onClick={createNewSession} className="btn btn-primary">
              + Start Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIAssistant;
