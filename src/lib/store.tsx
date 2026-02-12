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
// localStorage. Data is stored SEPARATELY for each domain so
// switching between DS ↔ ES never loses entries.
// ────────────────────────────────────────────────────────────

/** Per-domain bucket of entries (completed, ongoing, future) */
interface DomainData {
  completedEntries: SubjectEntry[];
  ongoingEntries: SubjectEntry[];
  futureEntries: SubjectEntry[];
}

interface PersistedState {
  domain: DegreeDomain;
  ds: DomainData;
  es: DomainData;
}

interface StoreContextValue {
  domain: DegreeDomain;
  completedEntries: SubjectEntry[];
  ongoingEntries: SubjectEntry[];
  futureEntries: SubjectEntry[];
  setDomain: (d: DegreeDomain) => void;
  setCompletedEntries: React.Dispatch<React.SetStateAction<SubjectEntry[]>>;
  addCompleted: () => void;
  removeCompleted: (id: string) => void;
  updateCompleted: (id: string, field: keyof SubjectEntry, value: string | number) => void;
  resetCompleted: () => void;
  // Ongoing (predict page)
  setOngoingEntries: React.Dispatch<React.SetStateAction<SubjectEntry[]>>;
  addOngoing: () => void;
  removeOngoing: (id: string) => void;
  updateOngoing: (id: string, field: keyof SubjectEntry, value: string | number) => void;
  resetOngoing: () => void;
  // Future (plan page)
  setFutureEntries: React.Dispatch<React.SetStateAction<SubjectEntry[]>>;
  addFuture: () => void;
  removeFuture: (id: string) => void;
  updateFuture: (id: string, field: keyof SubjectEntry, value: string | number) => void;
  resetFuture: () => void;
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

function emptyDomainData(): DomainData {
  return {
    completedEntries: [createEmptyEntry()],
    ongoingEntries: [createEmptyEntry()],
    futureEntries: [createEmptyEntry()],
  };
}

function loadFromStorage(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // Migrate old format (flat completedEntries) → new per-domain format
    if (
      parsed &&
      (parsed.domain === "ds" || parsed.domain === "es") &&
      Array.isArray(parsed.completedEntries) &&
      !parsed.ds &&
      !parsed.es
    ) {
      const migrated: PersistedState = {
        domain: parsed.domain,
        ds: emptyDomainData(),
        es: emptyDomainData(),
      };
      migrated[parsed.domain as DegreeDomain].completedEntries =
        parsed.completedEntries.length > 0
          ? parsed.completedEntries
          : [createEmptyEntry()];
      return migrated;
    }

    // New format validation
    if (
      parsed &&
      (parsed.domain === "ds" || parsed.domain === "es") &&
      parsed.ds &&
      parsed.es
    ) {
      return parsed as PersistedState;
    }
  } catch {
    // Corrupt data — ignore
  }
  return null;
}

function saveToStorage(state: PersistedState) {
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

  // Per-domain data stores
  const [dsData, setDsData] = useState<DomainData>(emptyDomainData);
  const [esData, setEsData] = useState<DomainData>(emptyDomainData);

  // Derived: current domain's data
  const currentData = domain === "ds" ? dsData : esData;
  const setCurrentData = domain === "ds" ? setDsData : setEsData;

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setDomainRaw(saved.domain);
      setDsData({
        completedEntries:
          saved.ds.completedEntries?.length > 0
            ? saved.ds.completedEntries
            : [createEmptyEntry()],
        ongoingEntries:
          saved.ds.ongoingEntries?.length > 0
            ? saved.ds.ongoingEntries
            : [createEmptyEntry()],
        futureEntries:
          saved.ds.futureEntries?.length > 0
            ? saved.ds.futureEntries
            : [createEmptyEntry()],
      });
      setEsData({
        completedEntries:
          saved.es.completedEntries?.length > 0
            ? saved.es.completedEntries
            : [createEmptyEntry()],
        ongoingEntries:
          saved.es.ongoingEntries?.length > 0
            ? saved.es.ongoingEntries
            : [createEmptyEntry()],
        futureEntries:
          saved.es.futureEntries?.length > 0
            ? saved.es.futureEntries
            : [createEmptyEntry()],
      });
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage({ domain, ds: dsData, es: esData });
  }, [domain, dsData, esData, hydrated]);

  // Domain switch — just change domain, data is preserved in separate buckets
  const setDomain = useCallback((d: DegreeDomain) => {
    setDomainRaw(d);
  }, []);

  // ── Completed helpers ──
  const completedEntries = currentData.completedEntries;

  const setCompletedEntries: React.Dispatch<React.SetStateAction<SubjectEntry[]>> =
    useCallback(
      (action) => {
        setCurrentData((prev) => ({
          ...prev,
          completedEntries:
            typeof action === "function" ? action(prev.completedEntries) : action,
        }));
      },
      [setCurrentData]
    );

  const addCompleted = useCallback(() => {
    setCurrentData((prev) => ({
      ...prev,
      completedEntries: [...prev.completedEntries, createEmptyEntry()],
    }));
  }, [setCurrentData]);

  const removeCompleted = useCallback(
    (id: string) => {
      setCurrentData((prev) => {
        const filtered = prev.completedEntries.filter((e) => e.id !== id);
        return {
          ...prev,
          completedEntries: filtered.length > 0 ? filtered : [createEmptyEntry()],
        };
      });
    },
    [setCurrentData]
  );

  const updateCompleted = useCallback(
    (id: string, field: keyof SubjectEntry, value: string | number) => {
      setCurrentData((prev) => ({
        ...prev,
        completedEntries: prev.completedEntries.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      }));
    },
    [setCurrentData]
  );

  const resetCompleted = useCallback(() => {
    setCurrentData((prev) => ({
      ...prev,
      completedEntries: [createEmptyEntry()],
    }));
  }, [setCurrentData]);

  // ── Ongoing helpers (predict page) ──
  const ongoingEntries = currentData.ongoingEntries;

  const setOngoingEntries: React.Dispatch<React.SetStateAction<SubjectEntry[]>> =
    useCallback(
      (action) => {
        setCurrentData((prev) => ({
          ...prev,
          ongoingEntries:
            typeof action === "function" ? action(prev.ongoingEntries) : action,
        }));
      },
      [setCurrentData]
    );

  const addOngoing = useCallback(() => {
    setCurrentData((prev) => ({
      ...prev,
      ongoingEntries: [...prev.ongoingEntries, createEmptyEntry()],
    }));
  }, [setCurrentData]);

  const removeOngoing = useCallback(
    (id: string) => {
      setCurrentData((prev) => {
        const filtered = prev.ongoingEntries.filter((e) => e.id !== id);
        return {
          ...prev,
          ongoingEntries: filtered.length > 0 ? filtered : [createEmptyEntry()],
        };
      });
    },
    [setCurrentData]
  );

  const updateOngoing = useCallback(
    (id: string, field: keyof SubjectEntry, value: string | number) => {
      setCurrentData((prev) => ({
        ...prev,
        ongoingEntries: prev.ongoingEntries.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      }));
    },
    [setCurrentData]
  );

  const resetOngoing = useCallback(() => {
    setCurrentData((prev) => ({
      ...prev,
      ongoingEntries: [createEmptyEntry()],
    }));
  }, [setCurrentData]);

  // ── Future helpers (plan page) ──
  const futureEntries = currentData.futureEntries;

  const setFutureEntries: React.Dispatch<React.SetStateAction<SubjectEntry[]>> =
    useCallback(
      (action) => {
        setCurrentData((prev) => ({
          ...prev,
          futureEntries:
            typeof action === "function" ? action(prev.futureEntries) : action,
        }));
      },
      [setCurrentData]
    );

  const addFuture = useCallback(() => {
    setCurrentData((prev) => ({
      ...prev,
      futureEntries: [...prev.futureEntries, createEmptyEntry()],
    }));
  }, [setCurrentData]);

  const removeFuture = useCallback(
    (id: string) => {
      setCurrentData((prev) => {
        const filtered = prev.futureEntries.filter((e) => e.id !== id);
        return {
          ...prev,
          futureEntries: filtered.length > 0 ? filtered : [createEmptyEntry()],
        };
      });
    },
    [setCurrentData]
  );

  const updateFuture = useCallback(
    (id: string, field: keyof SubjectEntry, value: string | number) => {
      setCurrentData((prev) => ({
        ...prev,
        futureEntries: prev.futureEntries.map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      }));
    },
    [setCurrentData]
  );

  const resetFuture = useCallback(() => {
    setCurrentData((prev) => ({
      ...prev,
      futureEntries: [createEmptyEntry()],
    }));
  }, [setCurrentData]);

  // Prevent SSR mismatch — render children only after hydration
  if (!hydrated) {
    return null;
  }

  return (
    <StoreContext.Provider
      value={{
        domain,
        completedEntries,
        ongoingEntries,
        futureEntries,
        setDomain,
        setCompletedEntries,
        addCompleted,
        removeCompleted,
        updateCompleted,
        resetCompleted,
        setOngoingEntries,
        addOngoing,
        removeOngoing,
        updateOngoing,
        resetOngoing,
        setFutureEntries,
        addFuture,
        removeFuture,
        updateFuture,
        resetFuture,
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
