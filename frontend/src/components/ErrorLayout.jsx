import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ErrorLayout({ 
  code, 
  title, 
  description, 
  metadata = {}, 
  primaryAction, 
  secondaryAction 
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const defaultPrimary = {
    label: user ? 'RETURN TO WORKSPACE' : 'HOME',
    action: () => navigate(user ? '/chat' : '/')
  };

  const pAction = primaryAction || defaultPrimary;

  return (
    <div className="min-h-screen flex flex-col bg-ivory dark:bg-deepCharcoal font-sans text-charcoal dark:text-warmOffWhite selection:bg-terracotta selection:text-white transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-2xl w-full space-y-16 animate-in fade-in duration-700 ease-out">
          
          {/* Header Section */}
          <div className="space-y-6">
            <h1 className="font-serif text-6xl md:text-8xl text-charcoal dark:text-warmOffWhite tracking-tight leading-none">
              {code}
            </h1>
            <div className="space-y-3">
              <h2 className="font-sans text-lg md:text-xl font-medium text-charcoal dark:text-warmOffWhite uppercase tracking-widest">
                {title}
              </h2>
              <p className="font-sans text-base text-warmGray max-w-md leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button 
              onClick={pAction.action} 
              className="w-full sm:w-auto bg-charcoal dark:bg-warmOffWhite text-ivory dark:text-deepCharcoal font-sans text-sm font-semibold tracking-wide px-8 py-3.5 hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] transition-all duration-200 rounded-sm text-center focus:outline-none focus:ring-1 focus:ring-terracotta"
            >
              {pAction.label}
            </button>
            {secondaryAction && (
              <button 
                onClick={secondaryAction.action} 
                className="w-full sm:w-auto bg-transparent border border-warmGray dark:border-warmGray text-charcoal dark:text-warmOffWhite font-sans text-sm font-medium px-8 py-3.5 hover:border-terracotta hover:text-terracotta dark:hover:border-terracotta dark:hover:text-terracotta transition-colors duration-200 rounded-sm text-center"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>

          {/* Technical Metadata Block */}
          <div className="pt-16">
            <div className="border-t border-subtleBorder dark:border-darkSubtleBorder py-6">
              <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-y-3 font-mono text-[10px] uppercase tracking-widest">
                {Object.entries(metadata).map(([key, val]) => (
                  <React.Fragment key={key}>
                    <div className="text-warmGray">{key}</div>
                    <div className="text-charcoal dark:text-warmOffWhite font-medium">{val}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="font-mono text-[10px] text-warmGray uppercase tracking-widest border-t border-subtleBorder dark:border-darkSubtleBorder pt-4">
              NEXORA / v1.0.0
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
