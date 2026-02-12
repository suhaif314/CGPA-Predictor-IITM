"use client";

import { useState, useMemo } from "react";
import { Plus, RotateCcw, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainSelector } from "@/components/domain-selector";
import { CGPADisplay } from "@/components/cgpa-display";
import { SubjectEntryRow } from "@/components/subject-entry-row";
import {
  DegreeDomain,
  SubjectEntry,
  calculateCGPA,
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

export default function CurrentCGPAPage() {
  const [domain, setDomain] = useState<DegreeDomain>("ds");
  const [entries, setEntries] = useState<SubjectEntry[]>([createEmptyEntry()]);
  const [activeLevel, setActiveLevel] = useState("Foundation");

  const levels = ["Foundation", "Diploma", "Degree"];

  const validEntries = useMemo(
    () => entries.filter((e) => e.subjectId && e.subjectId !== "" && e.credits > 0),
    [entries]
  );

  const cgpa = useMemo(() => calculateCGPA(validEntries), [validEntries]);
  const totalCredits = useMemo(
    () => validEntries.reduce((sum, e) => sum + e.credits, 0),
    [validEntries]
  );

  const usedSubjectIds = useMemo(
    () => new Set(entries.map((e) => e.subjectId).filter(Boolean)),
    [entries]
  );

  const addEntry = () => {
    setEntries((prev) => [...prev, createEmptyEntry()]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      // Always keep at least one entry row
      return filtered.length > 0 ? filtered : [createEmptyEntry()];
    });
  };

  const updateEntry = (
    id: string,
    field: keyof SubjectEntry,
    value: string | number
  ) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const resetAll = () => {
    setEntries([createEmptyEntry()]);
  };

  const handleDomainChange = (newDomain: DegreeDomain) => {
    setDomain(newDomain);
    setEntries([createEmptyEntry()]);
  };

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
        </p>
      </div>

      {/* Domain Selector */}
      <div className="mb-6">
        <DomainSelector value={domain} onChange={handleDomainChange} />
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
              <Button variant="outline" size="sm" onClick={resetAll}>
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
                  {entries
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
                        onUpdate={updateEntry}
                        onRemove={removeEntry}
                      />
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addEntry}
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
