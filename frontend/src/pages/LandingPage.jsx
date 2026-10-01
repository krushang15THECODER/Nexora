import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage({ darkMode, setDarkMode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-terracotta selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-subtleBorder dark:border-darkSubtleBorder">
        <div className="flex items-end gap-3">
          <Link to="/">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-charcoal dark:text-warmOffWhite leading-none">
              Nexora
            </h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="font-sans text-sm font-medium text-charcoal dark:text-warmOffWhite hover:text-terracotta dark:hover:text-terracotta transition-colors">Documentation</a>
          <a href="#" className="font-sans text-sm font-medium text-charcoal dark:text-warmOffWhite hover:text-terracotta dark:hover:text-terracotta transition-colors">Models</a>
          <a href="#" className="font-sans text-sm font-medium text-charcoal dark:text-warmOffWhite hover:text-terracotta dark:hover:text-terracotta transition-colors">Research</a>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="ml-4 font-mono text-[10px] text-warmGray hover:text-terracotta dark:hover:text-terracotta transition-colors flex items-center gap-1.5 group"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-terracotta' : 'bg-charcoal dark:bg-warmOffWhite'} group-hover:bg-terracotta transition-colors`}></div>
            [ {darkMode ? 'LIGHT_MODE' : 'DARK_MODE'} ]
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-8 lg:py-6 xl:py-6 gap-8 lg:gap-8 xl:gap-12 items-center">
        
        {/* Left Column */}
        <section className="flex-1 flex flex-col justify-center space-y-6 lg:space-y-4 xl:space-y-6 w-full">
          
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8 bg-terracotta"></div>
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-warmGray uppercase">
              NEXT-GEN AI INTERFACE
            </span>
          </div>

          <div className="space-y-4 lg:space-y-3 xl:space-y-4 max-w-2xl">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.1] text-charcoal dark:text-warmOffWhite tracking-tight">
              A serious environment<br className="hidden sm:block" />
              for cognitive engineering.
            </h2>
            <p className="font-sans text-lg lg:text-xl text-warmGray dark:text-gray-400 leading-relaxed max-w-xl">
              Nexora provides a premium, calm, and intentional interface for interacting with advanced language models. Built for engineers, researchers, and professionals who demand clarity over noise.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link to="/login" className="w-full sm:w-auto bg-charcoal dark:bg-warmOffWhite text-ivory dark:text-deepCharcoal font-sans text-sm font-semibold tracking-wide px-8 py-3.5 hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] active:scale-95 shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-sm text-center focus:outline-none focus:ring-1 focus:ring-terracotta">
              Initialize Session &rarr;
            </Link>
            <button className="w-full sm:w-auto bg-transparent border border-warmGray dark:border-warmGray text-charcoal dark:text-warmOffWhite font-sans text-sm font-medium px-8 py-3.5 hover:border-terracotta hover:text-terracotta dark:hover:border-terracotta dark:hover:text-terracotta active:scale-95 transition-all duration-200 rounded-sm">
              Read Documentation
            </button>
          </div>
        </section>

        {/* Right Column: Terminal Panel */}
        <section className="flex-1 w-full max-w-lg lg:max-w-xl">
          <div className="w-full bg-ivory dark:bg-deepCharcoal border border-subtleBorder dark:border-darkSubtleBorder shadow-sm rounded-sm overflow-hidden flex flex-col">
            
            {/* Panel Header */}
            <div className="border-b border-subtleBorder dark:border-darkSubtleBorder px-4 py-2.5 flex justify-between items-center bg-[#F2F0ED] dark:bg-darkWarmGray">
              <div className="flex gap-1.5 items-center">
                <div className="w-2.5 h-2.5 rounded-full border border-subtleBorder dark:border-darkSubtleBorder bg-ivory dark:bg-deepCharcoal"></div>
                <div className="w-2.5 h-2.5 rounded-full border border-subtleBorder dark:border-darkSubtleBorder bg-ivory dark:bg-deepCharcoal"></div>
                <div className="w-2.5 h-2.5 rounded-full border border-subtleBorder dark:border-darkSubtleBorder bg-ivory dark:bg-deepCharcoal"></div>
              </div>
              <span className="font-mono text-xs text-warmGray">/workspace/session-01</span>
            </div>
            
            {/* Panel Body */}
            <div className="p-6 xl:p-6 space-y-5 xl:space-y-6">
              
              <div className="space-y-3 xl:space-y-3">
                <div className="font-mono text-xs text-[#5E8B7E] dark:text-[#76A898] font-medium tracking-wide">
                  &gt; SYSTEM READY
                </div>
                <h3 className="font-serif text-3xl text-charcoal dark:text-warmOffWhite">
                  Ready to Build
                </h3>
                <p className="font-sans text-base text-warmGray dark:text-gray-400 leading-relaxed">
                  Bring your code, architecture, and conversations into one focused workspace. Switch models, continue previous sessions, and keep your development context in one place.
                </p>
              </div>
              
              <div className="p-5 border border-subtleBorder dark:border-darkSubtleBorder bg-[#F2F0ED] dark:bg-darkWarmGray rounded-sm">
                <code className="font-mono text-sm text-charcoal dark:text-warmOffWhite block leading-relaxed">
                  &gt; context: active<br/>
                  &gt; models: available<br/>
                  &gt; sessions: persistent<br/>
                  &gt; workspace: ready
                </code>
              </div>

              {/* Input Control */}
              <div className="flex items-center gap-3 border border-subtleBorder dark:border-darkSubtleBorder bg-white dark:bg-deepCharcoal p-1.5 rounded-sm focus-within:border-charcoal dark:focus-within:border-warmOffWhite transition-colors">
                <input 
                  type="text" 
                  placeholder="Query system..." 
                  className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans text-sm px-3 py-2 text-charcoal dark:text-warmOffWhite placeholder-warmGray"
                />
                <button className="bg-charcoal dark:bg-warmOffWhite text-ivory dark:text-deepCharcoal font-mono text-xs font-semibold px-4 py-2 hover:bg-terracotta dark:hover:bg-terracotta hover:text-white dark:hover:text-white active:scale-95 transition-all duration-200 rounded-sm">
                  [EXECUTE]
                </button>
              </div>
              
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default LandingPage;
