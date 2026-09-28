import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = (e, chatId) => {
    e.stopPropagation();
    if (confirmDeleteId === chatId) {
      onDeleteChat(chatId);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(chatId);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const renderGroup = (title, groupChats) => {
    if (!groupChats || groupChats.length === 0) return null;
    return (
      <div className="mb-8 last:mb-0">
        <h4 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-warmGray mb-3 px-3">
          {title}
        </h4>
        <div className="space-y-0.5">
          {groupChats.map(chat => {
            const isActive = activeChatId === chat._id;
            return (
              <div 
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className={`group flex items-center justify-between px-3 py-2 cursor-pointer transition-all duration-200 rounded-sm mx-1 ${
                  isActive 
                    ? 'bg-[#F2F0ED] dark:bg-[#2A2A2A]' 
                    : 'hover:bg-ivory dark:hover:bg-[#1E1E1E]'
                }`}
              >
                <span className={`font-sans text-[13px] truncate pr-3 ${
                  isActive 
                    ? 'text-charcoal dark:text-warmOffWhite font-medium' 
                    : 'text-charcoal/80 dark:text-warmOffWhite/80'
                }`}>
                  {chat.topic || 'New Chat'}
                </span>
                
                {confirmDeleteId === chat._id ? (
                  <button 
                    onClick={(e) => handleDelete(e, chat._id)}
                    className="font-mono text-[10px] text-terracotta whitespace-nowrap bg-transparent"
                  >
                    [ SURE? ]
                  </button>
                ) : (
                  <button 
                    onClick={(e) => handleDelete(e, chat._id)}
                    className={`font-mono text-[10px] text-warmGray hover:text-terracotta opacity-0 group-hover:opacity-100 transition-opacity bg-transparent ${
                      isActive ? 'opacity-100' : ''
                    }`}
                  >
                    DEL
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-[280px] bg-white dark:bg-[#121212] border-r border-subtleBorder dark:border-[#2A2A2A] flex flex-col transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static
  `;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-charcoal/20 dark:bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="p-6">
          <div className="flex items-baseline gap-2 mb-8">
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-charcoal dark:text-warmOffWhite leading-none">
              Nexora
            </h1>
            <span className="font-mono text-[10px] text-warmGray">
              v1.0.0
            </span>
          </div>
          
          <button 
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 border border-charcoal dark:border-warmOffWhite text-charcoal dark:text-warmOffWhite font-sans text-xs font-semibold tracking-wide py-2.5 rounded-sm hover:bg-charcoal dark:hover:bg-warmOffWhite hover:text-ivory dark:hover:text-deepCharcoal transition-colors focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <span className="text-[14px] leading-none mb-[2px]">+</span> NEW CHAT
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
          {renderGroup('Today', chats.today)}
          {renderGroup('Yesterday', chats.yesterday)}
          {renderGroup('Earlier', chats.earlier)}
        </div>

        <div className="p-5 border-t border-subtleBorder dark:border-[#2A2A2A] bg-white dark:bg-[#121212]">
          <div className="mb-4">
            <p className="font-sans text-[13px] text-charcoal dark:text-warmOffWhite font-medium truncate">
              {user?.name || 'Engineer'}
            </p>
            <p className="font-mono text-[10px] text-warmGray truncate mt-0.5">
              {user?.email}
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/settings" className="font-mono text-[10px] uppercase text-warmGray hover:text-charcoal dark:hover:text-warmOffWhite transition-colors">
              Settings
            </Link>
            <button 
              onClick={logout}
              className="font-mono text-[10px] uppercase text-warmGray hover:text-terracotta dark:hover:text-terracotta transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
