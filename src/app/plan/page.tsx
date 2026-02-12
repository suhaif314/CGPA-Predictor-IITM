"use client";

import { useState, useMemo } from "react";
import { Plus, RotateCcw, Target, Lightbulb, Info } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { DomainSelector } from "@/components/domain-selector";
import { CGPADisplay } from "@/components/cgpa-display";
import { SubjectEntryRow } from "@/components/subject-entry-row";
import { GradeChart } from "@/components/grade-chart";
import { LevelBreakdown } from "@/components/level-breakdown";
import { useStore } from "@/lib/store";
import {
  SubjectEntry,
  Grade,
  GRADE_POINTS,
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

export default function PlanPage() {
  const {
    domain,
    completedEntries,
    setDomain,
    addCompleted,
    removeCompleted,
    updateCompleted,
    resetCompleted,
  } = useStore();

  const [futureEntries, setFutureEntries] = useState<SubjectEntry[]>([
    createEmptyEntry(),
  ]);
  const [completedLevel, setCompletedLevel] = useState("Foundation");
  const [futureLevel, setFutureLevel] = useState("Diploma");

  const levels = ["Foundation", "Diploma", "Degree"];

  const validCompleted = useMemo(
    () =>
      completedEntries.filter(
        (e) => e.subjectId && e.subjectId !== "" && e.credits > 0
      ),
    [completedEntries]
  );
  const validFuture = useMemo(
    () =>
      futureEntries.filter(
        (e) =>
          (e.subjectId && e.subjectId !== "" && e.credits > 0) ||
          (e.subjectId === "__custom__" && e.subjectName && e.credits > 0)
      ),
    [futureEntries]
  );

  const currentCGPA = useMemo(
    () => calculateCGPA(validCompleted),
    [validCompleted]
  );
  const plannedCGPA = useMemo(
    () => calculateCombinedCGPA(validCompleted, validFuture),
    [validCompleted, validFuture]
  );

  const currentCredits = useMemo(
    () => validCompleted.reduce((s, e) => s + e.credits, 0),
    [validCompleted]
  );
  const futureCredits = useMemo(
    () => validFuture.reduce((s, e) => s + e.credits, 0),
    [validFuture]
  );

  const allUsedSubjectIds = useMemo(
    () =>
      new Set(
        [...completedEntries, ...futureEntries]
          .map((e) => e.subjectId)
          .filter((id) => id && id !== "__custom__")
      ),
    [completedEntries, futureEntries]
  );

  // Target CGPA analysis
  const targetAnalysis = useMemo(() => {
    if (validCompleted.length === 0) return null;
    if (validFuture.length === 0 || futureCredits === 0) return null;

    const targets = [7.0, 7.5, 8.0, 8.5, 9.0, 9.5];
    const results: {
      target: number;
      possible: boolean;
      minGrade: string;
      creditsNeeded: number;
    }[] = [];

    const totalCurrent = validCompleted.reduce(
      (s, e) => s + e.credits * GRADE_POINTS[e.grade],
      0
    );

    for (const target of targets) {
      const neededGP =
        (target * (currentCredits + futureCredits) - totalCurrent) /
        futureCredits;

      let minGrade = "Not possible";
      let possible = false;

      if (neededGP <= 0) {
        possible = true;
        minGrade = "Any grade";
      } else if (neededGP <= 10) {
        possible = true;
        const gradeAscending: Grade[] = ["E", "D", "C", "B", "A", "S"];
        minGrade = "S (10)";
        for (const g of gradeAscending) {
          if (GRADE_POINTS[g] >= neededGP) {
            minGrade = `${g} (${GRADE_POINTS[g]})`;
            break;
          }
        }
      }

      results.push({
        target,
        possible,
        minGrade,
        creditsNeeded: futureCredits,
      });
    }

    return results;
  }, [validCompleted, validFuture, currentCredits, futureCredits]);

  // Future handlers (local state)
  const futureHandlers = {
    add: () => setFutureEntries((prev) => [...prev, createEmptyEntry()]),
    remove: (id: string) =>
      setFutureEntries((prev) => {
        const filtered = prev.filter((e) => e.id !== id);
        return filtered.length > 0 ? filtered : [createEmptyEntry()];
      }),
    update: (id: string, field: keyof SubjectEntry, value: string | number) =>
      setFutureEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
      ),
    reset: () => setFutureEntries([createEmptyEntry()]),
  };

  const handleDomainChange = (newDomain: typeof domain) => {
    setDomain(newDomain);
    setFutureEntries([createEmptyEntry()]);
  };

  const cgpaDiff =
    validCompleted.length > 0 && validFuture.length > 0
      ? plannedCGPA - currentCGPA
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          Future CGPA Planning
        </h1>
        <p className="text-muted-foreground mt-2">
          Your completed subjects are synced automatically. Add hypothetical
          future subjects with expected grades to see how your CGPA will change.
        </p>
      </div>

      {/* Domain Selector */}
      <div className="mb-6">
        <DomainSelector value={domain} onChange={handleDomainChange} />
      </div>

      {/* Sync info */}
      {validCompleted.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <span>
            <span className="font-semibold text-foreground">{validCompleted.length}</span> completed
            subjects ({currentCredits} credits) synced from Current CGPA tab.
          </span>
        </div>
      )}

      {/* CGPA Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CGPADisplay
          cgpa={currentCGPA}
          totalCredits={currentCredits}
          totalSubjects={validCompleted.length}
          label="Current CGPA"
        />
        <CGPADisplay
          cgpa={
            validCompleted.length > 0 || validFuture.length > 0
              ? plannedCGPA
              : 0
          }
          totalCredits={currentCredits + futureCredits}
          totalSubjects={validCompleted.length + validFuture.length}
          label="Planned CGPA"
        />
      </div>

      {cgpaDiff !== 0 && (
        <div className="mb-6 text-center">
          <Badge
            variant={cgpaDiff >= 0 ? "default" : "destructive"}
            className="text-sm px-4 py-1"
          >
            {cgpaDiff >= 0 ? "↑" : "↓"} {Math.abs(cgpaDiff).toFixed(2)} CGPA
            change
          </Badge>
        </div>
      )}

      {/* Completed Subjects (shared) */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Completed Subjects</CardTitle>
              <CardDescription>
                Synced from Current CGPA tab — changes here are reflected everywhere
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetCompleted}
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
                      const subjects = getSubjectsByDomainAndLevel(domain, level);
                      return subjects.some((s) => s.id === e.subjectId);
                    })
                    .map((entry) => (
                      <SubjectEntryRow
                        key={entry.id}
                        entry={entry}
                        subjects={getSubjectsByDomainAndLevel(domain, level)}
                        usedSubjectIds={allUsedSubjectIds}
                        onUpdate={updateCompleted}
                        onRemove={removeCompleted}
                      />
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCompleted}
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

      {/* Future Subjects */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                Future / Hypothetical Subjects
              </CardTitle>
              <CardDescription>
                Add subjects you plan to take and set expected grades. You can
                also add custom subjects.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={futureHandlers.reset}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={futureLevel} onValueChange={setFutureLevel}>
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
                  {futureEntries
                    .filter((e) => {
                      if (e.subjectId === "__custom__") return level === futureLevel;
                      if (!e.subjectId || e.subjectId === "")
                        return level === futureLevel;
                      const subjects = getSubjectsByDomainAndLevel(domain, level);
                      return subjects.some((s) => s.id === e.subjectId);
                    })
                    .map((entry) => (
                      <SubjectEntryRow
                        key={entry.id}
                        entry={entry}
                        subjects={getSubjectsByDomainAndLevel(domain, level)}
                        usedSubjectIds={allUsedSubjectIds}
                        onUpdate={futureHandlers.update}
                        onRemove={futureHandlers.remove}
                        allowCustom
                      />
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={futureHandlers.add}
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

      {/* Target Analysis */}
      {targetAnalysis && targetAnalysis.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Target CGPA Analysis
            </CardTitle>
            <CardDescription>
              What average grade you need in your future subjects to reach these
              CGPA targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {targetAnalysis.map((t) => (
                <div
                  key={t.target}
                  className={`p-3 rounded-lg border text-center ${
                    t.possible
                      ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
                      : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
                  }`}
                >
                  <div className="text-lg font-bold">
                    {t.target.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t.possible ? (
                      <span className="text-green-700 dark:text-green-400">
                        Need avg ≥ {t.minGrade}
                      </span>
                    ) : (
                      <span className="text-red-700 dark:text-red-400">
                        Not achievable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics */}
      {(validCompleted.length > 0 || validFuture.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GradeChart entries={[...completedEntries, ...futureEntries]} />
          <LevelBreakdown entries={[...completedEntries, ...futureEntries]} domain={domain} />
        </div>
      )}
    </div>
  );
}
