import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContentProtection({ children }) {
  const [isScreenshotAttempted, setIsScreenshotAttempted] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  useEffect(() => {
    let timer;

    const showOverlay = () => {
      setIsScreenshotAttempted(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsScreenshotAttempted(false);
      }, 3000); // Overlay visible for 3 seconds
    };

    const handleKey = (e) => {
      // Allow developer tools: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key?.toLowerCase() === 'i' || e.key?.toLowerCase() === 'j' || e.key?.toLowerCase() === 'c')) ||
        ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'u')
      ) {
        return; // Let default behavior happen for dev tools
      }

      // Check for screenshot shortcuts
      const isPrintScreen = e.key === 'PrintScreen' || e.code === 'PrintScreen';
      const isCtrlShiftS = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key?.toLowerCase() === 's';
      const isWinShiftS = e.metaKey && e.shiftKey && e.key?.toLowerCase() === 's'; // Windows key is metaKey
      const isCmdShift4 = e.metaKey && e.shiftKey && e.key === '4';
      const isCmdShift5 = e.metaKey && e.shiftKey && e.key === '5';
      const isPrint = (e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'p';

      if (isPrintScreen || isCtrlShiftS || isWinShiftS || isCmdShift4 || isCmdShift5 || isPrint) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showOverlay();
        
        // Attempt to clear clipboard if user tries to copy screenshot
        try {
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText("Content protection: Screenshots are disabled.");
          }
        } catch (err) {
          // Ignore clipboard errors
        }
      }
    };

    const handleContextMenu = (e) => {
      // Allow context menu on specific interactive elements or explicitly allowed
      const target = e.target;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable ||
        target.closest('.allow-context')
      ) {
        return;
      }
      e.preventDefault();
    };

    const handleCopyCut = (e) => {
      const target = e.target;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable ||
        target.closest('.allow-copy')
      ) {
        return;
      }
      e.preventDefault();
      
      try {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText("Content protection: Copying is disabled.");
        }
      } catch (err) {}
    };

    const handleDragStart = (e) => {
      const target = e.target;
      // Disable dragging for images and links to prevent drag-to-desktop, 
      // unless they have an allow-drag class.
      if (target.tagName === 'IMG' || target.tagName === 'A' || target.closest('.protected-asset')) {
        if (!target.closest('.allow-drag')) {
          e.preventDefault();
        }
      }
    };

    const handleVisibilityChange = () => {
      setIsWindowFocused(document.visibilityState === 'visible');
    };

    const handleBlur = () => setIsWindowFocused(false);
    const handleFocus = () => setIsWindowFocused(true);

    window.addEventListener('keydown', handleKey, { capture: true });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        e.stopImmediatePropagation();
        showOverlay();
      }
    }, { capture: true });
    
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('copy', handleCopyCut, { capture: true });
    window.addEventListener('cut', handleCopyCut, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKey, { capture: true });
      window.removeEventListener('keyup', handleKey, { capture: true });
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('copy', handleCopyCut, { capture: true });
      window.removeEventListener('cut', handleCopyCut, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <>
      <div 
        className={`protected-content-wrapper transition-all duration-300 ease-in-out ${
          !isWindowFocused ? 'blur-[8px] grayscale-[50%] opacity-80' : 'blur-0 grayscale-0 opacity-100'
        }`}
      >
        {children}
      </div>

      <AnimatePresence>
        {isScreenshotAttempted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl text-white pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="text-center p-8 sm:p-12 border border-red-500/30 rounded-3xl bg-red-950/20 backdrop-blur-md max-w-md mx-4 shadow-2xl shadow-red-500/10"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight text-red-500">Action Blocked</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Screenshots, copying, and saving assets are restricted to protect the intellectual property of this portfolio.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
