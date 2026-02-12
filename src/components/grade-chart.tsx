"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubjectEntry, Grade, GRADE_POINTS } from "@/lib/grading";

interface GradeChartProps {
  entries: SubjectEntry[];
}

const GRADE_COLORS: Record<Grade, string> = {
  S: "bg-emerald-500",
  A: "bg-green-500",
  B: "bg-blue-500",
  C: "bg-sky-500",
  D: "bg-yellow-500",
  E: "bg-orange-500",
  U: "bg-red-500",
};

const GRADE_ORDER: Grade[] = ["S", "A", "B", "C", "D", "E", "U"];

export function GradeChart({ entries }: GradeChartProps) {
  const validEntries = useMemo(
    () => entries.filter((e) => e.subjectId && e.subjectId !== "" && e.credits > 0),
    [entries]
  );

  const distribution = useMemo(() => {
    const counts: Record<Grade, number> = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, U: 0 };
    for (const e of validEntries) {
      if (e.grade in counts) {
        counts[e.grade]++;
      }
    }
    return counts;
  }, [validEntries]);

  const maxCount = useMemo(
    () => Math.max(1, ...Object.values(distribution)),
    [distribution]
  );

  const totalSubjects = validEntries.length;

  if (totalSubjects === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Grade Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {GRADE_ORDER.map((grade) => {
            const count = distribution[grade];
            const pct = totalSubjects > 0 ? (count / totalSubjects) * 100 : 0;
            const barWidth = (count / maxCount) * 100;

            return (
              <div key={grade} className="flex items-center gap-3">
                {/* Grade label */}
                <div className="w-6 text-sm font-bold text-center shrink-0">
                  {grade}
                </div>
                {/* Bar */}
                <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${GRADE_COLORS[grade]}`}
                    style={{ width: `${barWidth}%`, minWidth: count > 0 ? "24px" : "0px" }}
                  />
                </div>
                {/* Count & percentage */}
                <div className="w-16 text-right text-xs text-muted-foreground shrink-0">
                  {count > 0 ? (
                    <>
                      <span className="font-semibold text-foreground">{count}</span>
                      {" "}
                      <span>({pct.toFixed(0)}%)</span>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary row */}
        <div className="mt-4 pt-3 border-t flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Total: <span className="font-semibold text-foreground">{totalSubjects}</span> subjects
          </span>
          <span>
            Points: <span className="font-semibold text-foreground">{GRADE_POINTS[validEntries[0]?.grade] !== undefined ? GRADE_ORDER.filter((g) => distribution[g] > 0).join(", ") : "—"}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
