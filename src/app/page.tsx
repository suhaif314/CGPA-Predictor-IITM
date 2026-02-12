"use client";

import { useMemo } from "react";
import { Plus, RotateCcw, Calculator, BookOpen, Sparkles } from "lucide-react";
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

  const levelEntryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const level of levels) {
      const subjects = getSubjectsByDomainAndLevel(domain, level);
      counts[level] = completedEntries.filter((e) =>
        subjects.some((s) => s.id === e.subjectId)
      ).length;
    }
    return counts;
  }, [completedEntries, domain]);

  return (
    <div className="animate-fade-in">
      {/* Hero Header */}
      <div className="hero-gradient border-b">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 animate-scale-in">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <div className="animate-slide-up">
              <h1 className="text-3xl font-bold tracking-tight">Current CGPA Calculator</h1>
              <p className="text-muted-foreground mt-1.5 max-w-lg">
                Add your completed subjects and grades to calculate your current CGPA.
                Data is saved automatically and shared across all tabs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Domain Selector */}
        <div className="mb-6">
          <DomainSelector value={domain} onChange={setDomain} />
        </div>

        {/* CGPA Display */}
        <div className="mb-6 animate-slide-up stagger-2">
          <CGPADisplay
            cgpa={cgpa}
            totalCredits={totalCredits}
            totalSubjects={validEntries.length}
            label="Current CGPA"
          />
        </div>

        {/* Grade Chart + Level Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-slide-up stagger-3">
          <GradeChart entries={completedEntries} />
          <LevelBreakdown entries={completedEntries} domain={domain} />
        </div>

        {/* Subject Entries */}
        <Card className="animate-slide-up stagger-4">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Completed Subjects
                </CardTitle>
                <CardDescription>
                  Select subjects and assign your grades
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={resetCompleted}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset All
              </Button>
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
                  <TabsTrigger key={level} value={level} className="gap-1.5">
                    {level}
                    {levelEntryCounts[level] > 0 && (
                      <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                        {levelEntryCounts[level]}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {levels.map((level) => {
                const levelEntries = completedEntries.filter((e) => {
                  if (!e.subjectId || e.subjectId === "") return level === activeLevel;
                  const subjects = getSubjectsByDomainAndLevel(domain, level);
                  return subjects.some((s) => s.id === e.subjectId);
                });

                return (
                  <TabsContent key={level} value={level} className="mt-4">
                    {/* Column headers (desktop) */}
                    {levelEntries.length > 0 && (
                      <div className="hidden sm:grid grid-cols-[1fr_80px_120px_40px] gap-2 px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <div>Subject</div>
                        <div className="text-center">Credits</div>
                        <div>Grade</div>
                        <div></div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {levelEntries.map((entry) => (
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

                    {/* Empty state */}
                    {levelEntries.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No {level.toLowerCase()} subjects added yet</p>
                        <p className="text-xs mt-1">Click the button below to add your first subject</p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addCompleted}
                      className="mt-4 w-full border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Subject
                    </Button>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
