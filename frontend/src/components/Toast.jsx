import { useState, useEffect } from 'react';

export default function Toast({ message, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!message) return;

    // Fade in
    requestAnimationFrame(() => setVisible(true));

    // Start fade out after 2.5s
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2500);

    // Fully dismiss after 3s
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setFading(false);
      if (onDismiss) onDismiss();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
    };
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ease-out ${
        visible && !fading
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="bg-terminal-surface border border-accent/30 glow-green rounded-lg px-4 py-2.5 flex items-center gap-2.5 shadow-2xl backdrop-blur-sm">
        <span className="text-accent text-sm">✓</span>
        <span className="font-mono text-xs text-accent">{message}</span>
      </div>
    </div>
  );
}
