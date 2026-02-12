"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubjectEntry, GRADE_POINTS, calculateCGPA } from "@/lib/grading";
import { getSubjectsByDomainAndLevel, type Subject } from "@/lib/subjects";
import type { DegreeDomain } from "@/lib/grading";

interface LevelBreakdownProps {
  entries: SubjectEntry[];
  domain: DegreeDomain;
}

interface LevelStats {
  level: string;
  entries: SubjectEntry[];
  cgpa: number;
  credits: number;
  count: number;
  totalAvailable: number;
}

export function LevelBreakdown({ entries, domain }: LevelBreakdownProps) {
  const validEntries = useMemo(
    () => entries.filter((e) => e.subjectId && e.subjectId !== "" && e.credits > 0),
    [entries]
  );

  const levelStats: LevelStats[] = useMemo(() => {
    const levels = ["Foundation", "Diploma", "Degree"];

    return levels.map((level) => {
      const allSubjects = getSubjectsByDomainAndLevel(domain, level);
      const levelEntries = validEntries.filter((e) =>
        allSubjects.some((s: Subject) => s.id === e.subjectId)
      );
      const cgpa = calculateCGPA(levelEntries);
      const credits = levelEntries.reduce((s, e) => s + e.credits, 0);

      return {
        level,
        entries: levelEntries,
        cgpa,
        credits,
        count: levelEntries.length,
        totalAvailable: allSubjects.length,
      };
    });
  }, [validEntries, domain]);

  const hasAny = levelStats.some((ls) => ls.count > 0);

  if (!hasAny) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Level-wise Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {levelStats.map((ls) => (
            <div
              key={ls.level}
              className={`rounded-lg border p-4 text-center transition-colors ${
                ls.count > 0
                  ? "bg-primary/5 border-primary/20"
                  : "bg-muted/30 border-border/50"
              }`}
            >
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {ls.level}
              </div>
              <div
                className={`text-2xl font-bold ${
                  ls.count > 0 ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {ls.count > 0 ? ls.cgpa.toFixed(2) : "—"}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {ls.count}/{ls.totalAvailable} subjects
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {ls.credits} credits
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
