'use client';

import { useEffect, useState } from 'react';

export function useToast(duration = 3500) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), duration);
    return () => clearTimeout(t);
  }, [message, duration]);

  return [message, setMessage] as const;
}
