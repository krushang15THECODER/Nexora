import React, { useRef, useEffect } from 'react';
import Message from './Message';

function ChatArea({ messages, isSending, onSuggestedPrompt, onRetry }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-2xl w-full space-y-8 sm:space-y-12 py-6 sm:py-12">
          
          <div className="space-y-2 sm:space-y-4 text-center">
            <h2 className="font-serif text-3xl text-charcoal dark:text-warmOffWhite tracking-tight">
              NEXORA
            </h2>
            <div className="space-y-1">
              <h3 className="font-sans text-base font-medium text-charcoal dark:text-warmOffWhite uppercase tracking-widest">
                Start a conversation
              </h3>
              <p className="font-sans text-sm text-warmGray">
                Ask a question, explore an idea, or work through a problem.
              </p>
            </div>
          </div>

          <div className="border-t border-subtleBorder dark:border-darkSubtleBorder pt-8">
            <h4 className="font-mono text-[10px] text-warmGray uppercase tracking-widest mb-4">Suggested Starting Points</h4>
            <div className="flex flex-col gap-0 border border-subtleBorder dark:border-darkSubtleBorder bg-white dark:bg-deepCharcoal rounded-sm overflow-hidden shadow-sm">
              {[
                "Explain a complex algorithm",
                "Review this system architecture",
                "Analyze this code",
                "Help me understand a database concept"
              ].map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => onSuggestedPrompt(prompt)}
                  className={`text-left font-sans text-sm text-charcoal dark:text-warmOffWhite px-5 py-4 hover:bg-[#F2F0ED]/50 dark:hover:bg-[#1A1A1A]/50 hover:pl-6 active:scale-[0.99] transition-all duration-200 ${
                    i !== 3 ? 'border-b border-subtleBorder dark:border-darkSubtleBorder' : ''
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-8 custom-scrollbar">
      <div className="w-full max-w-4xl mx-auto space-y-2">
        {messages.map((msg, index) => {
          let userContentForRetry = '';
          if (msg.role !== 'user' && index > 0 && messages[index - 1].role === 'user') {
            userContentForRetry = messages[index - 1].content;
          }
          return (
            <Message 
              key={msg._id || index} 
              message={msg} 
              index={index}
              onRetry={msg.role !== 'user' && onRetry && userContentForRetry ? () => onRetry(userContentForRetry) : undefined}
            />
          );
        })}
        
        {isSending && (
          <div className="py-8">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-charcoal dark:text-warmOffWhite mb-3">
              NEXORA
            </div>
            <div className="h-[1px] w-full bg-subtleBorder dark:bg-darkSubtleBorder mb-6"></div>
            <div className="font-mono text-xs text-warmGray animate-pulse flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-terracotta"></div>
              PROCESSING
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-8" />
      </div>
    </div>
  );
}

export default ChatArea;
