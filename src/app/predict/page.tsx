"use client";

import { useState, useMemo } from "react";
import { Plus, RotateCcw, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DomainSelector } from "@/components/domain-selector";
import { CGPADisplay } from "@/components/cgpa-display";
import { SubjectEntryRow } from "@/components/subject-entry-row";
import {
  DegreeDomain,
  SubjectEntry,
  calculateCGPA,
  calculateCombinedCGPA,
  generateId,
} from "@/lib/grading";
import { getSubjectsByDomainAndLevel } from "@/lib/subjects";

function createEmptyEntry(): SubjectEntry {
  return {
    id: generateId(),
    subjectId: "",
    subjectName: "",
    credits: 4,
    grade: "S",
  };
}

export default function PredictPage() {
  const [domain, setDomain] = useState<DegreeDomain>("ds");
  const [completedEntries, setCompletedEntries] = useState<SubjectEntry[]>([
    createEmptyEntry(),
  ]);
  const [ongoingEntries, setOngoingEntries] = useState<SubjectEntry[]>([
    createEmptyEntry(),
  ]);
  const [completedLevel, setCompletedLevel] = useState("Foundation");
  const [ongoingLevel, setOngoingLevel] = useState("Foundation");

  const levels = ["Foundation", "Diploma", "Degree"];

  // Valid entries
  const validCompleted = useMemo(
    () =>
      completedEntries.filter(
        (e) => e.subjectId && e.subjectId !== "" && e.credits > 0
      ),
    [completedEntries]
  );
  const validOngoing = useMemo(
    () =>
      ongoingEntries.filter(
        (e) => e.subjectId && e.subjectId !== "" && e.credits > 0
      ),
    [ongoingEntries]
  );

  const currentCGPA = useMemo(
    () => calculateCGPA(validCompleted),
    [validCompleted]
  );
  const predictedCGPA = useMemo(
    () => calculateCombinedCGPA(validCompleted, validOngoing),
    [validCompleted, validOngoing]
  );

  const currentCredits = useMemo(
    () => validCompleted.reduce((s, e) => s + e.credits, 0),
    [validCompleted]
  );
  const ongoingCredits = useMemo(
    () => validOngoing.reduce((s, e) => s + e.credits, 0),
    [validOngoing]
  );

  // Track used subject IDs across both groups
  const allUsedSubjectIds = useMemo(
    () =>
      new Set(
        [...completedEntries, ...ongoingEntries]
          .map((e) => e.subjectId)
          .filter(Boolean)
      ),
    [completedEntries, ongoingEntries]
  );

  const createHandlers = (
    setEntries: React.Dispatch<React.SetStateAction<SubjectEntry[]>>
  ) => ({
    add: () => setEntries((prev) => [...prev, createEmptyEntry()]),
    remove: (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id)),
    update: (id: string, field: keyof SubjectEntry, value: string | number) =>
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      ),
    reset: () => setEntries([createEmptyEntry()]),
  });

  const completedHandlers = createHandlers(setCompletedEntries);
  const ongoingHandlers = createHandlers(setOngoingEntries);

  const handleDomainChange = (newDomain: DegreeDomain) => {
    setDomain(newDomain);
    setCompletedEntries([createEmptyEntry()]);
    setOngoingEntries([createEmptyEntry()]);
  };

  const cgpaDiff = predictedCGPA - currentCGPA;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          CGPA Prediction
        </h1>
        <p className="text-muted-foreground mt-2">
          Add completed subjects and your ongoing subjects with expected grades
          to predict your updated CGPA.
        </p>
      </div>

      {/* Domain Selector */}
      <div className="mb-6">
        <DomainSelector value={domain} onChange={handleDomainChange} />
      </div>

      {/* CGPA Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CGPADisplay
          cgpa={currentCGPA}
          totalCredits={currentCredits}
          totalSubjects={validCompleted.length}
          label="Current CGPA"
        />
        <div className="hidden md:flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="h-8 w-8 text-primary" />
            {validOngoing.length > 0 && validCompleted.length > 0 && (
              <span
                className={`text-sm font-semibold ${
                  cgpaDiff >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {cgpaDiff >= 0 ? "+" : ""}
                {cgpaDiff.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <CGPADisplay
          cgpa={
            validCompleted.length > 0 || validOngoing.length > 0
              ? predictedCGPA
              : 0
          }
          totalCredits={currentCredits + ongoingCredits}
          totalSubjects={validCompleted.length + validOngoing.length}
          label="Predicted CGPA"
        />
      </div>

      {/* Completed Subjects */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Completed Subjects</CardTitle>
              <CardDescription>
                Subjects you have already completed
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={completedHandlers.reset}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={completedLevel} onValueChange={setCompletedLevel}>
            <TabsList className="grid w-full grid-cols-3">
              {levels.map((level) => (
                <TabsTrigger key={level} value={level}>
                  {level}
                </TabsTrigger>
              ))}
            </TabsList>
            {levels.map((level) => (
              <TabsContent key={level} value={level} className="mt-4">
                <div className="hidden sm:grid grid-cols-[1fr_80px_120px_40px] gap-2 px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div>Subject</div>
                  <div className="text-center">Credits</div>
                  <div>Grade</div>
                  <div></div>
                </div>
                <div className="space-y-2">
                  {completedEntries
                    .filter((e) => {
                      if (!e.subjectId || e.subjectId === "")
                        return level === completedLevel;
                      const subjects = getSubjectsByDomainAndLevel(
                        domain,
                        level
                      );
                      return subjects.some((s) => s.id === e.subjectId);
                    })
                    .map((entry) => (
                      <SubjectEntryRow
                        key={entry.id}
                        entry={entry}
                        subjects={getSubjectsByDomainAndLevel(domain, level)}
                        usedSubjectIds={allUsedSubjectIds}
                        onUpdate={completedHandlers.update}
                        onRemove={completedHandlers.remove}
                      />
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={completedHandlers.add}
                  className="mt-4 w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Subject
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Ongoing Subjects */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                Ongoing Subjects (Expected Grades)
              </CardTitle>
              <CardDescription>
                Add subjects you&apos;re currently taking and assign expected grades
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={ongoingHandlers.reset}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={ongoingLevel} onValueChange={setOngoingLevel}>
            <TabsList className="grid w-full grid-cols-3">
              {levels.map((level) => (
                <TabsTrigger key={level} value={level}>
                  {level}
                </TabsTrigger>
              ))}
            </TabsList>
            {levels.map((level) => (
              <TabsContent key={level} value={level} className="mt-4">
                <div className="hidden sm:grid grid-cols-[1fr_80px_120px_40px] gap-2 px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div>Subject</div>
                  <div className="text-center">Credits</div>
                  <div>Grade</div>
                  <div></div>
                </div>
                <div className="space-y-2">
                  {ongoingEntries
                    .filter((e) => {
                      if (!e.subjectId || e.subjectId === "")
                        return level === ongoingLevel;
                      const subjects = getSubjectsByDomainAndLevel(
                        domain,
                        level
                      );
                      return subjects.some((s) => s.id === e.subjectId);
                    })
                    .map((entry) => (
                      <SubjectEntryRow
                        key={entry.id}
                        entry={entry}
                        subjects={getSubjectsByDomainAndLevel(domain, level)}
                        usedSubjectIds={allUsedSubjectIds}
                        onUpdate={ongoingHandlers.update}
                        onRemove={ongoingHandlers.remove}
                      />
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={ongoingHandlers.add}
                  className="mt-4 w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Subject
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
