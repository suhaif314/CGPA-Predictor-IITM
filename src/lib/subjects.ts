import { Subject } from "./grading";
export type { Subject };

// ============================================================
// BS in Data Science and Applications - Subject Data
// ============================================================

export const DS_FOUNDATION_SUBJECTS: Subject[] = [
  { id: "ds-f-1", name: "Mathematics for Data Science I", credits: 4, level: "Foundation", category: "Mathematics" },
  { id: "ds-f-2", name: "Statistics for Data Science I", credits: 4, level: "Foundation", category: "Statistics" },
  { id: "ds-f-3", name: "Computational Thinking", credits: 4, level: "Foundation", category: "Programming" },
  { id: "ds-f-4", name: "English I", credits: 4, level: "Foundation", category: "English" },
  { id: "ds-f-5", name: "Mathematics for Data Science II", credits: 4, level: "Foundation", category: "Mathematics" },
  { id: "ds-f-6", name: "Statistics for Data Science II", credits: 4, level: "Foundation", category: "Statistics" },
  { id: "ds-f-7", name: "English II", credits: 4, level: "Foundation", category: "English" },
  { id: "ds-f-8", name: "Introduction to Python Programming", credits: 4, level: "Foundation", category: "Programming" },
];

export const DS_DIPLOMA_SUBJECTS: Subject[] = [
  // Diploma in Programming
  { id: "ds-dp-1", name: "Database Management Systems", credits: 4, level: "Diploma", category: "Programming" },
  { id: "ds-dp-2", name: "Programming Data Structures and Algorithms using Python", credits: 4, level: "Diploma", category: "Programming" },
  { id: "ds-dp-3", name: "Modern Application Development I", credits: 4, level: "Diploma", category: "Programming" },
  { id: "ds-dp-4", name: "Modern Application Development II", credits: 4, level: "Diploma", category: "Programming" },
  { id: "ds-dp-5", name: "Programming Concepts using Java", credits: 4, level: "Diploma", category: "Programming" },
  { id: "ds-dp-6", name: "System Commands", credits: 3, level: "Diploma", category: "Programming" },

  // Diploma in Data Science
  { id: "ds-dd-1", name: "Machine Learning Foundations", credits: 4, level: "Diploma", category: "Data Science" },
  { id: "ds-dd-2", name: "Machine Learning Techniques", credits: 4, level: "Diploma", category: "Data Science" },
  { id: "ds-dd-3", name: "Machine Learning Practice", credits: 4, level: "Diploma", category: "Data Science" },
  { id: "ds-dd-4", name: "Business Data Management", credits: 4, level: "Diploma", category: "Data Science" },
  { id: "ds-dd-5", name: "Business Analytics", credits: 4, level: "Diploma", category: "Data Science" },
  { id: "ds-dd-6", name: "Tools in Data Science", credits: 4, level: "Diploma", category: "Data Science" },
];

export const DS_DEGREE_SUBJECTS: Subject[] = [
  { id: "ds-deg-1", name: "Software Engineering", credits: 4, level: "Degree", category: "Core" },
  { id: "ds-deg-2", name: "Software Testing", credits: 4, level: "Degree", category: "Core" },
  { id: "ds-deg-3", name: "Deep Learning", credits: 4, level: "Degree", category: "Core" },
  { id: "ds-deg-4", name: "Artificial Intelligence: Search Methods for Problem Solving", credits: 4, level: "Degree", category: "Core" },
  { id: "ds-deg-5", name: "Natural Language Processing", credits: 4, level: "Degree", category: "Elective" },
  { id: "ds-deg-6", name: "Computer Vision", credits: 4, level: "Degree", category: "Elective" },
  { id: "ds-deg-7", name: "Big Data Architecture", credits: 4, level: "Degree", category: "Elective" },
  { id: "ds-deg-8", name: "Data Visualization Design", credits: 4, level: "Degree", category: "Elective" },
  { id: "ds-deg-9", name: "Reinforcement Learning", credits: 4, level: "Degree", category: "Elective" },
  { id: "ds-deg-10", name: "Speech Technology", credits: 4, level: "Degree", category: "Elective" },
  { id: "ds-deg-11", name: "Strategies for Professional Growth", credits: 3, level: "Degree", category: "Core" },
  { id: "ds-deg-12", name: "Industry 4.0", credits: 3, level: "Degree", category: "Elective" },
  { id: "ds-deg-13", name: "Capstone Project", credits: 4, level: "Degree", category: "Project" },
];

export const DS_ALL_SUBJECTS: Subject[] = [
  ...DS_FOUNDATION_SUBJECTS,
  ...DS_DIPLOMA_SUBJECTS,
  ...DS_DEGREE_SUBJECTS,
];

// ============================================================
// BS in Electronic Systems - Subject Data
// ============================================================

export const ES_FOUNDATION_SUBJECTS: Subject[] = [
  { id: "es-f-1", name: "Mathematics for Data Science I", credits: 4, level: "Foundation", category: "Mathematics" },
  { id: "es-f-2", name: "Statistics for Data Science I", credits: 4, level: "Foundation", category: "Statistics" },
  { id: "es-f-3", name: "Computational Thinking", credits: 4, level: "Foundation", category: "Programming" },
  { id: "es-f-4", name: "English I", credits: 4, level: "Foundation", category: "English" },
  { id: "es-f-5", name: "Mathematics for Data Science II", credits: 4, level: "Foundation", category: "Mathematics" },
  { id: "es-f-6", name: "Statistics for Data Science II", credits: 4, level: "Foundation", category: "Statistics" },
  { id: "es-f-7", name: "English II", credits: 4, level: "Foundation", category: "English" },
  { id: "es-f-8", name: "Introduction to Python Programming", credits: 4, level: "Foundation", category: "Programming" },
];

export const ES_DIPLOMA_SUBJECTS: Subject[] = [
  { id: "es-dp-1", name: "Electronic Circuits Analysis", credits: 4, level: "Diploma", category: "Electronics" },
  { id: "es-dp-2", name: "Signals and Systems", credits: 4, level: "Diploma", category: "Electronics" },
  { id: "es-dp-3", name: "Introduction to Embedded Systems Design", credits: 4, level: "Diploma", category: "Electronics" },
  { id: "es-dp-4", name: "Digital Systems Design", credits: 4, level: "Diploma", category: "Electronics" },
  { id: "es-dp-5", name: "Analog Electronics", credits: 4, level: "Diploma", category: "Electronics" },
  { id: "es-dp-6", name: "Digital Communication Systems", credits: 4, level: "Diploma", category: "Electronics" },
  { id: "es-dp-7", name: "Introduction to Internet of Things", credits: 4, level: "Diploma", category: "Electronics" },
  { id: "es-dp-8", name: "Linear Algebra and Applications", credits: 4, level: "Diploma", category: "Mathematics" },
  { id: "es-dp-9", name: "Electromagnetic Field Theory", credits: 4, level: "Diploma", category: "Electronics" },
];

export const ES_DEGREE_SUBJECTS: Subject[] = [
  { id: "es-deg-1", name: "Control Systems", credits: 4, level: "Degree", category: "Core" },
  { id: "es-deg-2", name: "VLSI Design", credits: 4, level: "Degree", category: "Core" },
  { id: "es-deg-3", name: "Microprocessors and Microcontrollers", credits: 4, level: "Degree", category: "Core" },
  { id: "es-deg-4", name: "Digital Signal Processing", credits: 4, level: "Degree", category: "Core" },
  { id: "es-deg-5", name: "Wireless Communication", credits: 4, level: "Degree", category: "Elective" },
  { id: "es-deg-6", name: "Antenna Theory and Design", credits: 4, level: "Degree", category: "Elective" },
  { id: "es-deg-7", name: "RF Circuit Design", credits: 4, level: "Degree", category: "Elective" },
  { id: "es-deg-8", name: "Power Electronics", credits: 4, level: "Degree", category: "Elective" },
  { id: "es-deg-9", name: "Robotics", credits: 4, level: "Degree", category: "Elective" },
  { id: "es-deg-10", name: "Capstone Project", credits: 4, level: "Degree", category: "Project" },
];

export const ES_ALL_SUBJECTS: Subject[] = [
  ...ES_FOUNDATION_SUBJECTS,
  ...ES_DIPLOMA_SUBJECTS,
  ...ES_DEGREE_SUBJECTS,
];

// Helper to get subjects by domain
export function getSubjectsByDomain(domain: "ds" | "es"): Subject[] {
  return domain === "ds" ? DS_ALL_SUBJECTS : ES_ALL_SUBJECTS;
}

export function getSubjectsByDomainAndLevel(
  domain: "ds" | "es",
  level: string
): Subject[] {
  const subjects = getSubjectsByDomain(domain);
  return subjects.filter((s) => s.level === level);
}
