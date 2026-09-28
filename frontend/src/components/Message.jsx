import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CopyButton = ({ text, label = "Copy" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={`font-mono text-[10px] uppercase transition-colors ${copied ? 'text-terracotta' : 'text-warmGray hover:text-charcoal dark:hover:text-warmOffWhite'}`}
    >
      {copied ? 'Copied' : label}
    </button>
  );
};

function Message({ message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className="py-8 group">
      <div className={`font-mono text-[10px] font-semibold uppercase tracking-widest mb-3 ${isUser ? 'text-warmGray' : 'text-charcoal dark:text-warmOffWhite'}`}>
        {isUser ? 'USER' : 'NEXORA'}
      </div>
      <div className="h-[1px] w-full bg-subtleBorder dark:bg-darkSubtleBorder mb-6"></div>
      
      <div className={`font-sans leading-relaxed break-words ${isUser ? 'text-base text-charcoal/90 dark:text-warmOffWhite/90' : 'text-[17px] text-charcoal dark:text-warmOffWhite font-normal'}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({node, ...props}) => <p className="mb-5 last:mb-0" {...props} />,
            a: ({node, ...props}) => <a className="text-terracotta underline underline-offset-4 decoration-terracotta/30 hover:decoration-terracotta transition-colors" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-5 space-y-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-5 space-y-2" {...props} />,
            li: ({node, ...props}) => <li {...props} />,
            h1: ({node, ...props}) => <h1 className="text-3xl font-serif mt-10 mb-5 text-charcoal dark:text-warmOffWhite" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-serif mt-8 mb-4 text-charcoal dark:text-warmOffWhite" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-sans font-medium mt-6 mb-3 text-charcoal dark:text-warmOffWhite" {...props} />,
            code: ({node, inline, className, children, ...props}) => {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              return !inline ? (
                <div className="my-6 rounded-sm border border-subtleBorder dark:border-darkSubtleBorder overflow-hidden bg-[#1A1A1A] text-[#E5E5E5] shadow-sm">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#333333] bg-[#121212]">
                    <span className="font-mono text-[10px] text-warmGray uppercase tracking-wider">
                      {match ? match[1] : 'code'}
                    </span>
                    <CopyButton text={codeString} />
                  </div>
                  <div className="p-4 overflow-x-auto custom-scrollbar">
                    <code className="font-mono text-sm leading-relaxed" {...props}>
                      {children}
                    </code>
                  </div>
                </div>
              ) : (
                <code className="font-mono text-[13px] px-1.5 py-0.5 rounded-sm bg-[#F2F0ED] dark:bg-[#2A2A2A] text-terracotta" {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>

      {/* Action Row for Assistant */}
      {!isUser && (
        <div className="flex items-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CopyButton text={message.content} />
          <button className="font-mono text-[10px] uppercase text-warmGray hover:text-charcoal dark:hover:text-warmOffWhite transition-colors">
            Retry
          </button>
          <button className="font-mono text-[10px] uppercase text-warmGray hover:text-charcoal dark:hover:text-warmOffWhite transition-colors">
            More
          </button>
        </div>
      )}
    </div>
  );
}

export default Message;
