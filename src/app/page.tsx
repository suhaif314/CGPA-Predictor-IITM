"use client";

import { useMemo } from "react";
import { Plus, RotateCcw, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainSelector } from "@/components/domain-selector";
import { CGPADisplay } from "@/components/cgpa-display";
import { SubjectEntryRow } from "@/components/subject-entry-row";
import { GradeChart } from "@/components/grade-chart";
import { LevelBreakdown } from "@/components/level-breakdown";
import { useStore } from "@/lib/store";
import { calculateCGPA } from "@/lib/grading";
import { getSubjectsByDomainAndLevel } from "@/lib/subjects";
import { useState } from "react";

export default function CurrentCGPAPage() {
  const {
    domain,
    completedEntries,
    setDomain,
    addCompleted,
    removeCompleted,
    updateCompleted,
    resetCompleted,
  } = useStore();

  const [activeLevel, setActiveLevel] = useState("Foundation");
  const levels = ["Foundation", "Diploma", "Degree"];

  const validEntries = useMemo(
    () => completedEntries.filter((e) => e.subjectId && e.subjectId !== "" && e.credits > 0),
    [completedEntries]
  );

  const cgpa = useMemo(() => calculateCGPA(validEntries), [validEntries]);
  const totalCredits = useMemo(
    () => validEntries.reduce((sum, e) => sum + e.credits, 0),
    [validEntries]
  );

  const usedSubjectIds = useMemo(
    () => new Set(completedEntries.map((e) => e.subjectId).filter(Boolean)),
    [completedEntries]
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          Current CGPA Calculator
        </h1>
        <p className="text-muted-foreground mt-2">
          Add your completed subjects and grades to calculate your current CGPA.
          Your data is saved automatically and shared across all tabs.
        </p>
      </div>

      {/* Domain Selector */}
      <div className="mb-6">
        <DomainSelector value={domain} onChange={setDomain} />
      </div>

      {/* CGPA Display */}
      <div className="mb-6">
        <CGPADisplay
          cgpa={cgpa}
          totalCredits={totalCredits}
          totalSubjects={validEntries.length}
          label="Current CGPA"
        />
      </div>

      {/* Grade Chart + Level Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <GradeChart entries={completedEntries} />
        <LevelBreakdown entries={completedEntries} domain={domain} />
      </div>

      {/* Subject Entries */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Completed Subjects</CardTitle>
              <CardDescription>
                Select subjects and assign your grades
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetCompleted}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeLevel}
            onValueChange={setActiveLevel}
            className="mb-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              {levels.map((level) => (
                <TabsTrigger key={level} value={level}>
                  {level}
                </TabsTrigger>
              ))}
            </TabsList>

            {levels.map((level) => (
              <TabsContent key={level} value={level} className="mt-4">
                {/* Column headers (desktop) */}
                <div className="hidden sm:grid grid-cols-[1fr_80px_120px_40px] gap-2 px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div>Subject</div>
                  <div className="text-center">Credits</div>
                  <div>Grade</div>
                  <div></div>
                </div>

                <div className="space-y-2">
                  {completedEntries
                    .filter((e) => {
                      if (!e.subjectId || e.subjectId === "") {
                        return level === activeLevel;
                      }
                      const subjects = getSubjectsByDomainAndLevel(domain, level);
                      return subjects.some((s) => s.id === e.subjectId);
                    })
                    .map((entry) => (
                      <SubjectEntryRow
                        key={entry.id}
                        entry={entry}
                        subjects={getSubjectsByDomainAndLevel(domain, level)}
                        usedSubjectIds={usedSubjectIds}
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
    </div>
  );
}
