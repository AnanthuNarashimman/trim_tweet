import { useState } from "react";
import "../PageStyles/Page.css";

function Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isTrimming, setIsTrimming] = useState(false);
  const charLimit = 280;

  const handleTrim = () => {
    setIsTrimming(true);
    setTimeout(() => {
      const trimmed = input.length > charLimit
        ? input.substring(0, charLimit - 3) + "..."
        : input;
      setOutput(trimmed + "\n\n#productivity #socialmedia #tech");
      setIsTrimming(false);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert("Copied to clipboard!");
  };

  return (
    <div className="trim-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            TrimTweet
          </div>
          <button className="contact-btn">Contact</button>
        </div>
      </nav>

      {/* Main Content Card */}
      <main className="main-card">
        <div className="content-wrapper">
          {/* Left Side */}
          <div className="left-section">
            <div className="headline-area">
              <span className="new-label">New-content</span>
              <h1 className="headline-blue">Headline</h1>
              <p className="platform-list">X, Linkedin, and Threads</p>
            </div>

            <div className="platform-icons">
              <div className="platform-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <div className="platform-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div className="platform-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142l-.126.742a12.96 12.96 0 0 0-2.893-.123c-1.182.067-2.148.414-2.794.998-.579.524-.87 1.23-.821 1.983.04.687.46 1.316 1.184 1.772.645.407 1.481.604 2.416.57 1.237-.054 2.171-.543 2.794-1.458.39-.574.7-1.338.923-2.275.185-.772.286-1.61.3-2.488v-.025a1.058 1.058 0 0 1 1.039-1.061c.557 0 1.067.226 1.446.641.376.412.578.96.568 1.545-.024 1.406.185 2.687.623 3.808.6 1.538 1.66 2.61 3.157 3.19 1.27.492 2.726.655 4.331.486l.092.774c-1.711.18-3.286.002-4.684-.532-1.74-.665-2.986-1.936-3.7-3.774-.434-1.11-.65-2.34-.644-3.658.01-.792-.27-1.547-.788-2.127-.52-.58-1.21-.894-1.952-.888a2.056 2.056 0 0 0-2.025 2.04v.013c-.01.975-.12 1.906-.328 2.77-.173.716-.418 1.342-.725 1.857-.523.876-1.273 1.556-2.232 2.023-.95.464-2.036.698-3.234.698-1.605 0-3.014-.463-4.188-1.377-1.191-.928-1.931-2.258-2.202-3.957-.272-1.7-.135-3.548.408-5.492.543-1.943 1.496-3.708 2.836-5.243C6.324 1.627 8.818.545 12.18.545h.014c3.366.02 5.86 1.104 7.419 3.222 1.338 1.535 2.292 3.301 2.835 5.245.544 1.944.68 3.792.408 5.492-.271 1.7-1.011 3.029-2.202 3.957-1.174.914-2.583 1.377-4.188 1.377z"/>
                </svg>
              </div>
            </div>

            <h2 className="main-title">Trim your posts to fit perfectly</h2>
            <p className="main-description">
              AI-powered shortening for X, LinkedIn, and Threads. Keep your message, lose the excess.
            </p>
          </div>

          {/* Right Side - Input Card */}
          <div className="right-section">
            <div className="input-card">
              <div className="input-header">
                <span className="input-title">Paste text here</span>
                <button className="minimize-btn">−</button>
              </div>
              
              <textarea
                className="main-textarea"
                placeholder="Paste your post here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <div className="char-meta">
                <span className="char-label">char count</span>
                <span className="char-limit">/ #444 - limit</span>
              </div>

              <button 
                className="trim-btn"
                onClick={handleTrim}
                disabled={!input || isTrimming}
              >
                {isTrimming ? "Trimming..." : "Trim It"}
              </button>

              {output && (
                <>
                  <div className="copied-msg">Copied to Clipboard!</div>
                  <button className="copy-result-btn" onClick={copyToClipboard}>
                    Copy Result
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="features-section">
        <h3 className="features-title">FEATURES GRID</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>Stays 270-280 chars</h4>
            <p>Perfect fit guaranteed for all platforms.</p>
          </div>
          <div className="feature-card">
            <h4>Preserves your voice</h4>
            <p>Advanced AI keeps your tone exactly as it is.</p>
          </div>
          <div className="feature-card">
            <h4>Smart hashtags</h4>
            <p>Suggests 4-6 relevant tags to boost reach.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
