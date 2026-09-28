import React, { useRef, useEffect } from 'react';
import { SUPPORTED_MODELS } from '../utils/chatHelpers';

function Composer({ onSendMessage, isSending, selectedModel, setSelectedModel, content, setContent }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!content.trim() || isSending) return;
    onSendMessage(content.trim(), selectedModel);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const isValid = content.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 lg:px-8 pb-8 pt-4 shrink-0">
      <div className={`relative flex flex-col border transition-all duration-200 bg-white dark:bg-deepCharcoal shadow-sm rounded-sm ${
        isSending 
          ? 'border-subtleBorder dark:border-darkSubtleBorder opacity-60' 
          : 'border-subtleBorder dark:border-darkSubtleBorder focus-within:border-terracotta/40 dark:focus-within:border-terracotta/40 focus-within:shadow-[0_0_0_1px_rgba(193,106,84,0.1)]'
      }`}>
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Query Nexora..."
          disabled={isSending}
          rows={1}
          className="w-full bg-transparent resize-none outline-none font-sans text-base text-charcoal dark:text-warmOffWhite placeholder-warmGray p-4 max-h-[200px] overflow-y-auto custom-scrollbar leading-relaxed"
        />
        
        <div className="flex justify-between items-center px-4 py-3 border-t border-subtleBorder/50 dark:border-darkSubtleBorder/50 bg-[#F9F8F6]/30 dark:bg-[#121212]/30">
          
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-warmGray uppercase tracking-widest">MODEL</span>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isSending}
              className="bg-transparent font-mono text-[11px] text-charcoal dark:text-warmOffWhite outline-none cursor-pointer hover:text-terracotta transition-colors appearance-none disabled:cursor-not-allowed"
            >
              {SUPPORTED_MODELS.map(model => (
                <option key={model.id} value={model.id} className="text-charcoal bg-white dark:bg-deepCharcoal">
                  {model.id}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isSending}
            className={`flex items-center gap-2 font-sans text-xs font-semibold tracking-wide px-4 py-2 transition-all duration-200 rounded-sm ${
              !isValid || isSending 
                ? 'bg-transparent text-warmGray cursor-not-allowed' 
                : 'bg-charcoal dark:bg-warmOffWhite text-ivory dark:text-deepCharcoal hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-terracotta'
            }`}
          >
            <span>&uarr;</span> SEND
          </button>
        </div>
      </div>
    </div>
  );
}

export default Composer;
