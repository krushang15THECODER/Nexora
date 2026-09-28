import React, { useState, useEffect, useCallback, useRef } from 'react';
import { groupChats, SUPPORTED_MODELS } from '../utils/chatHelpers';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import Composer from '../components/Composer';

const API_URL = import.meta.env.VITE_API_URL || '';

function Chat({ darkMode, setDarkMode }) {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState({ today: [], yesterday: [], earlier: [] });
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [isSending, setIsSending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(SUPPORTED_MODELS[0].id);
  const [error, setError] = useState('');
  
  const [composerText, setComposerText] = useState('');

  // Fetch recent chats on mount
  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/chat/getRecentChat`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setChats(groupChats(data.chats || []));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Fetch messages when activeChatId changes
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/msg/${activeChatId}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.msg || []);
        } else {
          setActiveChatId(null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeChatId]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setComposerText('');
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const res = await fetch(`${API_URL}/chat/deleteChat/${chatId}`, { 
        method: 'DELETE', 
        credentials: 'include' 
      });
      if (res.ok) {
        if (activeChatId === chatId) handleNewChat();
        await fetchChats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (content, model) => {
    if (!content.trim()) return;
    setError('');
    setIsSending(true);
    setComposerText('');

    // Optimistic UI for user message
    const tempUserMsg = { _id: Date.now().toString(), role: 'user', content };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const endpoint = activeChatId ? `${API_URL}/msg/${activeChatId}` : `${API_URL}/msg/`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content, model }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Unable to complete the request. Please try again.');
      }

      // If it was a new chat, update the active chat ID and refresh list
      if (!activeChatId && data.chatId) {
        setActiveChatId(data.chatId);
        await fetchChats();
      }

      // Update messages with actual saved user message and assistant reply
      setMessages(prev => {
        const filtered = prev.filter(m => m._id !== tempUserMsg._id);
        return [...filtered, data.userMessage, data.assistantMessage];
      });

    } catch (err) {
      setError(err.message);
      // Remove optimistic message on fail
      setMessages(prev => prev.filter(m => m._id !== tempUserMsg._id));
    } finally {
      setIsSending(false);
    }
  };

  // Find active chat title
  const allChats = [...chats.today, ...chats.yesterday, ...chats.earlier];
  const activeChat = allChats.find(c => c._id === activeChatId);
  const chatTitle = activeChat ? activeChat.topic : 'New Workspace';

  return (
    <div className="h-screen flex bg-ivory dark:bg-deepCharcoal overflow-hidden font-sans text-charcoal dark:text-warmOffWhite selection:bg-terracotta selection:text-white transition-colors duration-300">
      <Sidebar 
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Refined Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-subtleBorder dark:border-darkSubtleBorder bg-ivory/80 dark:bg-deepCharcoal/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden font-mono text-xs text-warmGray hover:text-charcoal dark:hover:text-warmOffWhite transition-colors"
            >
              [ MENU ]
            </button>
            <h1 className="font-serif text-lg tracking-tight text-charcoal dark:text-warmOffWhite truncate max-w-[200px] md:max-w-md">
              {chatTitle}
            </h1>
            <span className="hidden md:inline-block font-mono text-[10px] uppercase text-warmGray border border-subtleBorder dark:border-darkSubtleBorder px-1.5 py-0.5">
              {selectedModel}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setDarkMode(!darkMode)}
              className="font-mono text-[10px] text-warmGray hover:text-terracotta dark:hover:text-terracotta transition-colors flex items-center gap-1.5 group"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-terracotta' : 'bg-charcoal dark:bg-warmOffWhite'} group-hover:bg-terracotta transition-colors`}></div>
              [ DARK_MODE ]
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-subtleBorder dark:border-darkSubtleBorder">
              <span className="font-sans text-sm font-medium">{user?.name || 'Engineer'}</span>
              <button onClick={logout} className="font-mono text-[10px] text-warmGray hover:text-terracotta transition-colors">
                [ LOGOUT ]
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="m-4 p-4 border border-terracotta bg-[#FFF9F8] dark:bg-[#2A1E1C] rounded-sm absolute top-16 left-0 right-0 z-20 mx-4 lg:mx-8 shadow-sm">
            <span className="font-mono text-xs text-terracotta uppercase tracking-wide block mb-1">
              [ REQUEST_FAILED ]
            </span>
            <p className="font-sans text-sm text-charcoal dark:text-warmOffWhite">{error}</p>
          </div>
        )}

        <ChatArea 
          messages={messages} 
          isSending={isSending} 
          onSuggestedPrompt={setComposerText}
        />
        
        <Composer 
          onSendMessage={handleSendMessage}
          isSending={isSending}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          content={composerText}
          setContent={setComposerText}
        />
      </main>
    </div>
  );
}

export default Chat;
