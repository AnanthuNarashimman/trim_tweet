import { useState, useEffect } from "react";
import { Copy, Check, Sparkles, MessageSquare, Hash, FileText, X as XIcon, Zap, Github } from 'lucide-react';
import "../PageStyles/Page.css";

import logo from "../assets/logo.png";

const XLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ThreadsLogo = ({ className }) => (
  <svg viewBox="0 0 192 192" fill="currentColor" className={className}>
    <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
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
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [comingSoonMessage, setComingSoonMessage] = useState('');
  const [showContactCard, setShowContactCard] = useState(false);

  // Constants
  const MAX_CHARS = 280;
  const API_URL = import.meta.env.VITE_API_URL || '/api/shorten';

  const handleComingSoon = (platform) => {
    setComingSoonMessage(`${platform} support coming soon!`);
    setTimeout(() => setComingSoonMessage(''), 4500);
  };

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
        body: JSON.stringify({ text: inputText, includeHashtags }),
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
        <div className="logo-img-box">
          <img src={logo} alt="TrimTweet Logo" className="logo-img" />
        </div>
        <div className="brand-text">
          <span className="brand-name">TrimTweet</span>
          <span className="brand-subtitle">Smart Trim</span>
        </div>
      </div>

      {/* Fixed Contact Button - Top Right */}
      <button className="fixed-contact" onClick={() => setShowContactCard(!showContactCard)}>
        <span className="relative z-10">Contact</span>
        <div className="btn-shimmer"></div>
      </button>

      {/* Contact Card */}
      {showContactCard && (
        <>
          <div className="contact-overlay" onClick={() => setShowContactCard(false)}></div>
          <div className="contact-card">
            <div className="contact-card-header">
              <h3>Let's Connect</h3>
              <button className="contact-close" onClick={() => setShowContactCard(false)}>
                <XIcon className="w-4" />
              </button>
            </div>
            <div className="contact-links">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="contact-link">
                <Github className="w-5" />
                <div className="contact-link-text">
                  <span className="contact-link-title">GitHub</span>
                  <span className="contact-link-handle">@yourusername</span>
                </div>
              </a>
              <a href="https://x.com/yourusername" target="_blank" rel="noopener noreferrer" className="contact-link">
                <XLogo className="w-5" />
                <div className="contact-link-text">
                  <span className="contact-link-title">X (Twitter)</span>
                  <span className="contact-link-handle">@yourusername</span>
                </div>
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="contact-link">
                <LinkedInLogo className="w-5" />
                <div className="contact-link-text">
                  <span className="contact-link-title">LinkedIn</span>
                  <span className="contact-link-handle">/in/yourusername</span>
                </div>
              </a>
            </div>
          </div>
        </>
      )}

      {/* Hero Section */}
      <main className="hero">

        {/* Platform Icons */}
        <div className="platform-icons">
          <div className="icon-box hover-white">
            <XLogo className="w-5" />
          </div>
          <div className="icon-box hover-blue" onClick={() => handleComingSoon('LinkedIn')}>
            <LinkedInLogo className="w-5" />
          </div>
          <div className="icon-box hover-white" onClick={() => handleComingSoon('Threads')}>
            <ThreadsLogo className="w-5" />
          </div>
        </div>

        {/* Coming Soon Message */}
        {comingSoonMessage && (
          <div className="coming-soon-message">
            {comingSoonMessage}
          </div>
        )}

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

              {/* Hashtags Toggle */}
              <div className="hashtags-toggle">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    disabled={showResult}
                  />
                  <span className="toggle-text">
                    <Hash className="w-4" />
                    Include hashtags <span className="word-limit">({includeHashtags ? '30' : '40'} words)</span>
                  </span>
                </label>
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
                <Sparkles className="w-5 pulse" />
                <span>Optimizing<span className="loading-dots"></span></span>
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
        <p className="footer-text">TrimTweet. Built with React & Gemini.
        </p>
      </footer>
    </div>
  );
}

export default Page;
