import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupChats } from '../utils/chatHelpers';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

function Settings({ darkMode, setDarkMode }) {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState({ today: [], yesterday: [], earlier: [] });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0); // 0=Initial, 1=Confirm, 2=Deleting
  const [error, setError] = useState('');

  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch('/chat/getRecentChat', { credentials: 'include' });
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

  const handleNewChat = () => {
    navigate('/chat');
  };

  const handleSelectChat = (chatId) => {
    navigate('/chat', { state: { chatId } });
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const res = await fetch(`/chat/deleteChat/${chatId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) await fetchChats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate('/');
  };

  const confirmDeleteAccount = async () => {
    setDeleteStep(2);
    setError('');
    const result = await deleteAccount();
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setDeleteStep(0);
    }
  };

  const resetDate = user?.usage?.resetAt ? new Date(user.usage.resetAt) : null;
  const formattedReset = resetDate 
    ? `${resetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} · ${resetDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
    : 'N/A';

  return (
    <div className="h-screen flex bg-ivory dark:bg-deepCharcoal overflow-hidden font-sans text-charcoal dark:text-warmOffWhite selection:bg-terracotta selection:text-white transition-colors duration-300">
      <Sidebar 
        chats={chats}
        activeChatId={null}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        <header className="flex items-center justify-between px-6 py-4 border-b border-subtleBorder dark:border-darkSubtleBorder bg-ivory/80 dark:bg-deepCharcoal/80 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden font-mono text-xs text-warmGray hover:text-charcoal dark:hover:text-warmOffWhite transition-colors"
            >
              [ MENU ]
            </button>
            <h1 className="font-serif text-lg tracking-tight text-charcoal dark:text-warmOffWhite">
              Settings
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-subtleBorder dark:border-darkSubtleBorder">
            <span className="font-sans text-sm font-medium">{user?.name || 'Engineer'}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-12 custom-scrollbar">
          <div className="w-full max-w-2xl mx-auto space-y-16">
            
            {/* Header */}
            <div className="space-y-1">
              <h2 className="font-serif text-3xl tracking-tight text-charcoal dark:text-warmOffWhite">NEXORA</h2>
              <h3 className="font-sans text-sm font-medium text-warmGray tracking-widest uppercase">Settings & Preferences</h3>
            </div>

            {/* Account */}
            <section className="space-y-6">
              <h4 className="font-mono text-[10px] text-warmGray uppercase tracking-widest border-b border-subtleBorder dark:border-darkSubtleBorder pb-2">Account</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="font-mono text-[10px] text-warmGray uppercase tracking-widest mb-1">Name</p>
                  <p className="font-sans text-base text-charcoal dark:text-warmOffWhite">{user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-warmGray uppercase tracking-widest mb-1">Email</p>
                  <p className="font-sans text-base text-charcoal dark:text-warmOffWhite">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-warmGray uppercase tracking-widest mb-1">Age</p>
                  <p className="font-sans text-base text-charcoal dark:text-warmOffWhite">{user?.age || 'N/A'}</p>
                </div>
              </div>
              <p className="font-mono text-[10px] text-warmGray mt-4">Read-only profile data provided by backend.</p>
            </section>

            {/* Usage */}
            <section className="space-y-6">
              <h4 className="font-mono text-[10px] text-warmGray uppercase tracking-widest border-b border-subtleBorder dark:border-darkSubtleBorder pb-2">Usage</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="font-mono text-[10px] text-warmGray uppercase tracking-widest mb-1">Tokens Used</p>
                  <p className="font-sans text-2xl font-light text-charcoal dark:text-warmOffWhite">{user?.usage?.totalTokenUsed?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-warmGray uppercase tracking-widest mb-1">Reset</p>
                  <p className="font-mono text-sm text-charcoal dark:text-warmOffWhite">{formattedReset}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-warmGray uppercase tracking-widest mb-1">Token Window</p>
                  <p className="font-sans text-sm font-medium text-[#5E8B7E] dark:text-[#76A898]">ACTIVE</p>
                </div>
              </div>
            </section>

            {/* Appearance */}
            <section className="space-y-6">
              <h4 className="font-mono text-[10px] text-warmGray uppercase tracking-widest border-b border-subtleBorder dark:border-darkSubtleBorder pb-2">Appearance</h4>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setDarkMode(false)}
                  className={`font-sans text-sm px-6 py-2 border transition-all rounded-sm ${!darkMode ? 'border-charcoal dark:border-warmOffWhite bg-[#F2F0ED] text-charcoal font-medium' : 'border-subtleBorder dark:border-darkSubtleBorder text-warmGray hover:border-warmGray'}`}
                >
                  Light
                </button>
                <button 
                  onClick={() => setDarkMode(true)}
                  className={`font-sans text-sm px-6 py-2 border transition-all rounded-sm ${darkMode ? 'border-warmOffWhite bg-[#1A1A1A] text-warmOffWhite font-medium' : 'border-subtleBorder text-warmGray hover:border-charcoal'}`}
                >
                  Dark
                </button>
              </div>
            </section>

            {/* Session */}
            <section className="space-y-6">
              <h4 className="font-mono text-[10px] text-warmGray uppercase tracking-widest border-b border-subtleBorder dark:border-darkSubtleBorder pb-2">Session</h4>
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-transparent border border-warmGray text-charcoal dark:text-warmOffWhite font-sans text-sm font-medium px-8 py-3 hover:border-terracotta hover:text-terracotta transition-all duration-200 rounded-sm disabled:opacity-50"
              >
                {isLoggingOut ? 'LOGGING OUT...' : 'LOG OUT'}
              </button>
            </section>

            {/* Danger Zone */}
            <section className="space-y-6 pt-8">
              <h4 className="font-mono text-[10px] text-terracotta uppercase tracking-widest border-b border-terracotta/30 pb-2">Danger Zone</h4>
              
              {error && (
                <div className="p-4 border border-terracotta bg-[#FFF9F8] dark:bg-[#2A1E1C] rounded-sm">
                  <span className="font-mono text-xs text-terracotta uppercase tracking-wide block mb-1">
                    [ REQUEST_FAILED ]
                  </span>
                  <p className="font-sans text-sm text-charcoal dark:text-warmOffWhite">{error}</p>
                </div>
              )}

              {deleteStep === 0 && (
                <button 
                  onClick={() => setDeleteStep(1)}
                  className="bg-transparent border border-terracotta/50 text-terracotta font-sans text-sm font-medium px-8 py-3 hover:bg-terracotta hover:text-white transition-all duration-200 rounded-sm"
                >
                  DELETE ACCOUNT
                </button>
              )}

              {deleteStep >= 1 && (
                <div className="p-6 border border-terracotta/50 bg-[#FFF9F8] dark:bg-[#1C1210] rounded-sm space-y-6">
                  <div className="space-y-2">
                    <h5 className="font-serif text-xl text-terracotta">Delete Account</h5>
                    <p className="font-sans text-sm text-charcoal dark:text-warmOffWhite/90 leading-relaxed max-w-sm">
                      This permanently deletes your Nexora account, conversations, and messages. This action cannot be undone.
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setDeleteStep(0); setError(''); }}
                      disabled={deleteStep === 2}
                      className="bg-transparent border border-warmGray text-charcoal dark:text-warmOffWhite font-sans text-sm font-medium px-6 py-2.5 hover:border-charcoal dark:hover:border-warmOffWhite transition-colors rounded-sm disabled:opacity-50"
                    >
                      CANCEL
                    </button>
                    <button 
                      onClick={confirmDeleteAccount}
                      disabled={deleteStep === 2}
                      className="bg-terracotta text-white font-sans text-sm font-semibold tracking-wide px-6 py-2.5 hover:bg-[#A35542] transition-colors rounded-sm disabled:opacity-70 disabled:cursor-wait"
                    >
                      {deleteStep === 2 ? 'DELETING...' : 'CONFIRM DELETION'}
                    </button>
                  </div>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
