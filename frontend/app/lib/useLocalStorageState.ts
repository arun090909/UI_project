"use client";

import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";

export function useLocalStorageState<T>(key: string, fallbackValue: T) {
  const fallbackRef = useRef(fallbackValue);
  const snapshotCache = useRef<{ raw: string | null; value: T }>({
    raw: null,
    value: fallbackValue,
  });

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener(getLocalEventName(key), onStoreChange);

      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(getLocalEventName(key), onStoreChange);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === snapshotCache.current.raw) {
      return snapshotCache.current.value;
    }

    const parsedValue = storedValue ? (JSON.parse(storedValue) as T) : fallbackRef.current;
    snapshotCache.current = {
      raw: storedValue,
      value: parsedValue,
    };

    return parsedValue;
  }, [key]);

  const getServerSnapshot = useMemo(() => () => fallbackRef.current, []);
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (nextValue: T | ((currentValue: T) => T)) => {
      const currentValue = getSnapshot();
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (currentValue: T) => T)(currentValue)
          : nextValue;

      window.localStorage.setItem(key, JSON.stringify(resolvedValue));
      window.dispatchEvent(new Event(getLocalEventName(key)));
    },
    [getSnapshot, key],
  );

  return [value, setValue] as const;
}

function getLocalEventName(key: string) {
  return `local-storage:${key}`;
}
