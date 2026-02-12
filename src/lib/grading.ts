// IIT Madras BS Degree Grading System

export type Grade = "S" | "A" | "B" | "C" | "D" | "E" | "U";

export const GRADE_POINTS: Record<Grade, number> = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  U: 0, // Fail
};

export const GRADE_OPTIONS: { value: Grade; label: string; points: number }[] = [
  { value: "S", label: "S (10)", points: 10 },
  { value: "A", label: "A (9)", points: 9 },
  { value: "B", label: "B (8)", points: 8 },
  { value: "C", label: "C (7)", points: 7 },
  { value: "D", label: "D (6)", points: 6 },
  { value: "E", label: "E (5)", points: 5 },
  { value: "U", label: "U (0 - Fail)", points: 0 },
];

export type DegreeDomain = "ds" | "es";

export interface Subject {
  id: string;
  name: string;
  credits: number;
  level: string;
  category: string;
}

export interface SubjectEntry {
  id: string;
  subjectId: string;
  subjectName: string;
  credits: number;
  grade: Grade;
}

// CGPA = Sum(credits_i * grade_points_i) / Sum(credits_i)
export function calculateCGPA(entries: SubjectEntry[]): number {
  if (entries.length === 0) return 0;

  const totalCredits = entries.reduce((sum, e) => sum + e.credits, 0);
  if (totalCredits === 0) return 0;

  const totalGradePoints = entries.reduce(
    (sum, e) => sum + e.credits * GRADE_POINTS[e.grade],
    0
  );

  return totalGradePoints / totalCredits;
}

// Calculate CGPA combining multiple groups of entries
export function calculateCombinedCGPA(
  ...groups: SubjectEntry[][]
): number {
  const allEntries = groups.flat();
  return calculateCGPA(allEntries);
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
