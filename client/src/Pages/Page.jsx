import { useState, useEffect } from "react";
import { Copy, Check, Sparkles, MessageSquare, Hash, FileText, X as XIcon, Zap } from 'lucide-react';
import "../PageStyles/Page.css";


const XLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ThreadsLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.27 4.97a7.71 7.71 0 0 0-2.34.37 7.6 7.6 0 0 0-3.32 1.83 7.67 7.67 0 0 0-2.22 3.32 8.02 8.02 0 0 0 0 5.02 7.67 7.67 0 0 0 2.22 3.32 7.6 7.6 0 0 0 3.32 1.83 7.71 7.71 0 0 0 4.67-.37 7.6 7.6 0 0 0 3.32-1.83 7.67 7.67 0 0 0 2.22-3.32 8.02 8.02 0 0 0 0-5.02h-2.17a5.83 5.83 0 0 1 0 3.66 5.5 5.5 0 0 1-1.59 2.37 5.43 5.43 0 0 1-2.37 1.3 5.5 5.5 0 0 1-3.33-.27 5.43 5.43 0 0 1-2.37-1.3 5.5 5.5 0 0 1-1.59-2.37 5.75 5.75 0 0 1 0-3.66 5.5 5.5 0 0 1 1.59-2.37 5.43 5.43 0 0 1 2.37-1.3 5.5 5.5 0 0 1 2.91 0 5.43 5.43 0 0 1 2.37 1.3 5.5 5.5 0 0 1 1.59 2.37h2.17a7.67 7.67 0 0 0-2.22-3.32 7.6 7.6 0 0 0-3.32-1.83 7.71 7.71 0 0 0-2.34-.37z" />
    <path d="M12 8.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5zm0 4.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
  </svg>
);

const LinkedInLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);


function Page() {
  const [inputText, setInputText] = useState('');
  const [optimizedPost, setOptimizedPost] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  // Constants
  const MAX_CHARS = 280;
  const API_URL = import.meta.env.VITE_API_URL || '/api/shorten';

  useEffect(() => {
    setCharCount(inputText.length);
  }, [inputText]);

  const handleTrim = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError('');
    setShowResult(false);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to optimize post');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setOptimizedPost(data.data.optimizedPost);
        setHashtags(data.data.hashtags);
        setResultData(data.data);
        setShowResult(true);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!optimizedPost) return;
    const textArea = document.createElement("textarea");
    textArea.value = optimizedPost;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const resetForm = () => {
    setShowResult(false);
    setTimeout(() => {
      setInputText('');
      setOptimizedPost('');
      setHashtags([]);
      setResultData(null);
      setError('');
    }, 300);
  };

  // Helper for dynamic classes using the new CSS class names
  const getCharCountClass = () => {
    if (charCount > MAX_CHARS) return 'char-count-error';
    if (charCount > MAX_CHARS - 20) return 'char-count-warning';
    return 'char-count-success';
  };

  return (
    <div className="app-container">

      {/* --- Background Effects --- */}
      <div className="bg-dots"></div>
      <div className="bg-glow"></div>

      {/* Fixed Logo - Top Left */}
      <div className="fixed-logo">
        <div className="logo-box">
          <span className="relative z-10">T</span>
          <div className="logo-shine"></div>
        </div>
        <div className="brand-text">
          <span className="brand-name">TrimTweet</span>
          <span className="brand-subtitle">Smart Trim</span>
        </div>
      </div>

      {/* Fixed Contact Button - Top Right */}
      <button className="fixed-contact">
        <span className="relative z-10">Contact Support</span>
        <div className="btn-shimmer"></div>
      </button>

      {/* Hero Section */}
      <main className="hero">

        {/* Platform Icons */}
        <div className="platform-icons">
          <div className="icon-box hover-white">
            <XIcon className="w-5" />
          </div>
          <div className="icon-box hover-blue">
            <LinkedInLogo className="w-5" />
          </div>
          <div className="icon-box hover-white">
            <ThreadsLogo className="w-5" />
          </div>
        </div>

        {/* Headlines */}
        <h1 className="headline">
          Trim your posts to <br className="hidden-sm sm-block" />
          <span className="text-gradient">
            fit perfectly
          </span>
        </h1>
        <p className="subheadline">
          AI-powered shortening for X, LinkedIn, and Threads. <br className="hidden-sm sm-block" />
          Keep your message, lose the excess.
        </p>

        {/* Input and Output Area with Sliding Animation */}
        <div className={`content-wrapper ${showResult ? 'show-result' : ''}`}>
          
          {/* Input Area */}
          <div className="input-wrapper">
            <div className="input-glow"></div>

            <div className="input-container">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your post here..."
                className="main-textarea"
                spellCheck="false"
                disabled={showResult}
              />

              <div className="input-footer">
                <div className={`char-counter ${getCharCountClass()}`}>
                  {charCount} / {MAX_CHARS}
                </div>
                {charCount > MAX_CHARS && (
                  <span className="limit-msg">
                    <Zap className="w-3" /> Over limit
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Output Area */}
          {showResult && resultData && (
            <div className="output-wrapper">
              <div className="output-header">
                <div className="output-label">
                  <div className="output-line"></div>
                  <h3 className="output-title">Optimized Result</h3>
                </div>
                <div className="output-badge">
                  <span className={`char-counter ${resultData.characterCount <= 280 ? 'char-count-success' : 'char-count-error'}`} style={{ fontSize: '0.75rem' }}>
                    {resultData.characterCount} chars
                  </span>
                </div>
              </div>

              <div className="output-box">
                <p className="output-text">
                  {optimizedPost}
                </p>

                {/* Hashtags */}
                {hashtags && hashtags.length > 0 && (
                  <div className="hashtags-container">
                    <div className="hashtags-label">
                      <Hash className="w-4" />
                      <span>Suggested Hashtags</span>
                    </div>
                    <div className="hashtags-grid">
                      {hashtags.map((tag, index) => (
                        <div key={index} className="hashtag-pill">
                          #{tag.replace('#', '')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="output-actions">
                  <button
                    onClick={copyToClipboard}
                    className={`btn-copy ${copied ? 'btn-copy-success' : 'btn-copy-default'}`}
                  >
                    {copied ? <Check className="w-4" /> : <Copy className="w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="btn-reset"
                  >
                    <Sparkles className="w-4" />
                    New Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        {!showResult && (
          <button
            onClick={handleTrim}
            disabled={loading || inputText.length === 0}
            className="btn-trim"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 spin" />
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5" />
                <span>Trim It</span>
              </>
            )}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-box">
            <span className="flex items-center justify-center" style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)' }}>
              <XIcon className="w-4" />
            </span>
            {error}
          </div>
        )}

      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-blue">
                <FileText className="w-5" />
              </div>
              <h3 className="feature-title">Stays 270-280 chars</h3>
              <p className="feature-desc">
                Never worry about the character limit again. We optimize every post to fit perfectly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-purple">
                <MessageSquare className="w-5" />
              </div>
              <h3 className="feature-title">Preserves your voice</h3>
              <p className="feature-desc">
                It shortens your content while keeping your unique tone, style, and key message intact.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-emerald">
                <Hash className="w-5" />
              </div>
              <h3 className="feature-title">Smart hashtags</h3>
              <p className="feature-desc">
                Get better reach with automatically generated hashtags that are highly relevant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          © {new Date().getFullYear()} TrimTweet. Built with React & Gemini.
        </p>
      </footer>
    </div>
  );
}

export default Page;
