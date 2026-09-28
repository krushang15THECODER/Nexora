import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login({ darkMode, setDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address.');
      return false;
    }
    if (!password) {
      setError('Password is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;
    
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.error);
    }
  };

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
          <span className="font-mono text-xs text-warmGray mb-[3px]">
            v1.0.0
          </span>
        </div>
        <Link to="/" className="font-sans text-sm font-medium text-warmGray hover:text-charcoal dark:hover:text-warmOffWhite transition-colors">
          &larr; Return to system
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-ivory dark:bg-deepCharcoal border border-subtleBorder dark:border-darkSubtleBorder shadow-sm rounded-sm p-8 lg:p-12">
          
          <div className="space-y-2 mb-10 text-center">
            <h2 className="font-serif text-3xl text-charcoal dark:text-warmOffWhite tracking-tight">
              AUTHENTICATE
            </h2>
            <p className="font-sans text-sm text-warmGray">
              Access your Nexora workspace.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 border border-terracotta/30 bg-[#FFF9F8] dark:bg-[#2A1E1C] rounded-sm">
              <span className="font-mono text-xs text-terracotta uppercase tracking-wide block mb-1">[ AUTH_FAILURE ]</span>
              <p className="font-sans text-sm text-charcoal dark:text-warmOffWhite">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="font-mono text-xs text-warmGray uppercase tracking-wide block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-darkWarmGray border border-subtleBorder dark:border-darkSubtleBorder text-charcoal dark:text-warmOffWhite font-sans text-sm px-4 py-2.5 outline-none focus:border-charcoal dark:focus:border-warmOffWhite transition-colors rounded-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs text-warmGray uppercase tracking-wide block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-darkWarmGray border border-subtleBorder dark:border-darkSubtleBorder text-charcoal dark:text-warmOffWhite font-sans text-sm px-4 py-2.5 outline-none focus:border-charcoal dark:focus:border-warmOffWhite transition-colors rounded-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal dark:bg-warmOffWhite text-ivory dark:text-deepCharcoal font-sans text-sm font-semibold tracking-wide px-8 py-3.5 mt-2 hover:bg-[#2A2A2A] dark:hover:bg-[#E5E5E5] transition-all duration-200 rounded-sm disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-terracotta"
            >
              {loading ? '[ AUTHENTICATING... ]' : '[ INITIALIZE SESSION ]'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-subtleBorder dark:border-darkSubtleBorder text-center">
            <p className="font-sans text-sm text-warmGray">
              Don't have an account?{' '}
              <Link to="/signup" className="text-charcoal dark:text-warmOffWhite hover:text-terracotta dark:hover:text-terracotta transition-colors font-medium">
                Create account &rarr;
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;
