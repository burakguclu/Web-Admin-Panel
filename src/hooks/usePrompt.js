import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function usePrompt(message, when = true) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBeforeUnload = useCallback(
    (event) => {
      if (when) {
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    },
    [when, message]
  );

  useEffect(() => {
    if (when) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [when, handleBeforeUnload]);

  useEffect(() => {
    if (!when) return;

    const unblock = navigate((nextLocation) => {
      if (window.confirm(message)) {
        return true;
      }
      return false;
    });

    return unblock;
  }, [when, navigate, message, location]);
} 