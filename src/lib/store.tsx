"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { DegreeDomain, SubjectEntry, generateId } from "./grading";

// ────────────────────────────────────────────────────────────
// Shared state for completed subjects + domain, persisted to
// localStorage so data survives page refreshes AND is shared
// across Current / Predict / Plan tabs automatically.
// ────────────────────────────────────────────────────────────

interface StoreState {
  domain: DegreeDomain;
  completedEntries: SubjectEntry[];
}

interface StoreContextValue extends StoreState {
  setDomain: (d: DegreeDomain) => void;
  setCompletedEntries: React.Dispatch<React.SetStateAction<SubjectEntry[]>>;
  addCompleted: () => void;
  removeCompleted: (id: string) => void;
  updateCompleted: (id: string, field: keyof SubjectEntry, value: string | number) => void;
  resetCompleted: () => void;
}

const STORAGE_KEY = "cgpa-predictor-state";

function createEmptyEntry(): SubjectEntry {
  return {
    id: generateId(),
    subjectId: "",
    subjectName: "",
    credits: 4,
    grade: "S",
  };
}

function loadFromStorage(): StoreState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoreState;
    // Basic validation
    if (
      (parsed.domain === "ds" || parsed.domain === "es") &&
      Array.isArray(parsed.completedEntries)
    ) {
      return parsed;
    }
  } catch {
    // Corrupt data — ignore
  }
  return null;
}

function saveToStorage(state: StoreState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [domain, setDomainRaw] = useState<DegreeDomain>("ds");
  const [completedEntries, setCompletedEntries] = useState<SubjectEntry[]>([
    createEmptyEntry(),
  ]);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setDomainRaw(saved.domain);
      setCompletedEntries(
        saved.completedEntries.length > 0
          ? saved.completedEntries
          : [createEmptyEntry()]
      );
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage({ domain, completedEntries });
  }, [domain, completedEntries, hydrated]);

  const setDomain = useCallback((d: DegreeDomain) => {
    setDomainRaw(d);
    setCompletedEntries([createEmptyEntry()]);
  }, []);

  const addCompleted = useCallback(() => {
    setCompletedEntries((prev) => [...prev, createEmptyEntry()]);
  }, []);

  const removeCompleted = useCallback((id: string) => {
    setCompletedEntries((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      return filtered.length > 0 ? filtered : [createEmptyEntry()];
    });
  }, []);

  const updateCompleted = useCallback(
    (id: string, field: keyof SubjectEntry, value: string | number) => {
      setCompletedEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      );
    },
    []
  );

  const resetCompleted = useCallback(() => {
    setCompletedEntries([createEmptyEntry()]);
  }, []);

  // Prevent SSR mismatch — render children only after hydration
  if (!hydrated) {
    return null;
  }

  return (
    <StoreContext.Provider
      value={{
        domain,
        completedEntries,
        setDomain,
        setCompletedEntries,
        addCompleted,
        removeCompleted,
        updateCompleted,
        resetCompleted,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within <StoreProvider>");
  }
  return ctx;
}
