import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useBlocker } from 'react-router-dom';

export function usePrompt(message, when = true) {
  const blocker = useBlocker(when);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmed = window.confirm(message);
      if (confirmed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);

  // Browser/sekme kapatma için
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (when) {
        e.preventDefault();
        e.returnValue = message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [when, message]);
} 