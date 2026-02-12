"use client";

import { useMemo, useState } from "react";
import { Plus, RotateCcw, TrendingUp, ArrowRight, Info, BookOpen, Clock, Sparkles } from "lucide-react";
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
  calculateCGPA,
  calculateCombinedCGPA,
} from "@/lib/grading";
import { getSubjectsByDomainAndLevel } from "@/lib/subjects";

export default function PredictPage() {
  const {
    domain,
    completedEntries,
    ongoingEntries,
    setDomain,
    addCompleted,
    removeCompleted,
    updateCompleted,
    resetCompleted,
    addOngoing,
    removeOngoing,
    updateOngoing,
    resetOngoing,
  } = useStore();
  const [completedLevel, setCompletedLevel] = useState("Foundation");
  const [ongoingLevel, setOngoingLevel] = useState("Foundation");

  const levels = ["Foundation", "Diploma", "Degree"];

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

  const allUsedSubjectIds = useMemo(
    () =>
      new Set(
        [...completedEntries, ...ongoingEntries]
          .map((e) => e.subjectId)
          .filter(Boolean)
      ),
    [completedEntries, ongoingEntries]
  );



  const cgpaDiff =
    validCompleted.length > 0 && validOngoing.length > 0
      ? predictedCGPA - currentCGPA
      : 0;

  return (
    <div className="animate-fade-in">
      {/* Hero Header */}
      <div className="hero-gradient border-b">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 animate-scale-in">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div className="animate-slide-up">
              <h1 className="text-3xl font-bold tracking-tight">CGPA Prediction</h1>
              <p className="text-muted-foreground mt-1.5 max-w-lg">
                Your completed subjects are synced from the Current CGPA tab. Add
                ongoing subjects with expected grades to predict your updated CGPA.
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

        {/* Sync info */}
        {validCompleted.length > 0 && (
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 animate-slide-up stagger-1">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>
              <span className="font-semibold text-foreground">{validCompleted.length}</span> completed
              subjects ({currentCredits} credits) synced from Current CGPA tab.
            </span>
          </div>
        )}

        {/* CGPA Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-slide-up stagger-2">
          <CGPADisplay
            cgpa={currentCGPA}
            totalCredits={currentCredits}
            totalSubjects={validCompleted.length}
            label="Current CGPA"
          />
          <div className="hidden md:flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              {validOngoing.length > 0 && validCompleted.length > 0 && cgpaDiff !== 0 && (
                <Badge
                  variant={cgpaDiff >= 0 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {cgpaDiff >= 0 ? "+" : ""}
                  {cgpaDiff.toFixed(2)}
                </Badge>
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

        {/* Mobile diff badge */}
        {cgpaDiff !== 0 && (
          <div className="md:hidden mb-6 text-center">
            <Badge
              variant={cgpaDiff >= 0 ? "default" : "destructive"}
              className="text-sm px-4 py-1"
            >
              {cgpaDiff >= 0 ? "↑" : "↓"} {Math.abs(cgpaDiff).toFixed(2)} CGPA change
            </Badge>
          </div>
        )}

        {/* Completed Subjects */}
        <Card className="mb-6 animate-slide-up stagger-3">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Completed Subjects
                </CardTitle>
                <CardDescription>
                  Synced from Current CGPA tab — changes here are reflected everywhere
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={resetCompleted}>
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
              {levels.map((level) => {
                const entries = completedEntries.filter((e) => {
                  if (!e.subjectId || e.subjectId === "") return level === completedLevel;
                  const subjects = getSubjectsByDomainAndLevel(domain, level);
                  return subjects.some((s) => s.id === e.subjectId);
                });
                return (
                  <TabsContent key={level} value={level} className="mt-4">
                    {entries.length > 0 && (
                      <div className="hidden sm:grid grid-cols-[1fr_80px_120px_40px] gap-2 px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <div>Subject</div>
                        <div className="text-center">Credits</div>
                        <div>Grade</div>
                        <div></div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {entries.map((entry) => (
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
                    {entries.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <Sparkles className="h-6 w-6 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No subjects at this level yet</p>
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

        <Separator className="my-6" />

        {/* Ongoing Subjects */}
        <Card className="mb-6 animate-slide-up stagger-4 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Ongoing Subjects
                  <Badge variant="secondary" className="text-[10px]">Expected Grades</Badge>
                </CardTitle>
                <CardDescription>
                  Add subjects you&apos;re currently taking and assign expected grades
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={resetOngoing}>
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
              {levels.map((level) => {
                const entries = ongoingEntries.filter((e) => {
                  if (!e.subjectId || e.subjectId === "") return level === ongoingLevel;
                  const subjects = getSubjectsByDomainAndLevel(domain, level);
                  return subjects.some((s) => s.id === e.subjectId);
                });
                return (
                  <TabsContent key={level} value={level} className="mt-4">
                    {entries.length > 0 && (
                      <div className="hidden sm:grid grid-cols-[1fr_80px_120px_40px] gap-2 px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <div>Subject</div>
                        <div className="text-center">Credits</div>
                        <div>Grade</div>
                        <div></div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {entries.map((entry) => (
                        <SubjectEntryRow
                          key={entry.id}
                          entry={entry}
                          subjects={getSubjectsByDomainAndLevel(domain, level)}
                          usedSubjectIds={allUsedSubjectIds}
                          onUpdate={updateOngoing}
                          onRemove={removeOngoing}
                        />
                      ))}
                    </div>
                    {entries.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <Sparkles className="h-6 w-6 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No ongoing subjects at this level</p>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addOngoing}
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

        {/* Analytics */}
        {(validCompleted.length > 0 || validOngoing.length > 0) && (
          <>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GradeChart entries={[...completedEntries, ...ongoingEntries]} />
              <LevelBreakdown entries={[...completedEntries, ...ongoingEntries]} domain={domain} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
