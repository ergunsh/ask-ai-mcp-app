import { useState, useEffect } from 'react';

/**
 * Hook to track whether the window/document has focus.
 * Returns true when the user is actively focused on the page,
 * false when they've tabbed away or focused another window.
 */
export function useWindowFocus(): boolean {
  const [isFocused, setIsFocused] = useState(() => document.hasFocus());

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return isFocused;
}
