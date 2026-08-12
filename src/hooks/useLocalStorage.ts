import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export const RemoveLocalStorageData = (key: string) => {
  localStorage.removeItem(key);
};

export const ClearLocalStorageData = () => {
  localStorage.clear();
};

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const saved = window.localStorage.getItem(key);

    if (saved === null) {
      return initialValue;
    }

    try {
      return JSON.parse(saved) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export const useLocalstorage = useLocalStorage;

