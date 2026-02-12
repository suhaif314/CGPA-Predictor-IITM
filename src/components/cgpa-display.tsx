"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award } from "lucide-react";

interface CGPADisplayProps {
  cgpa: number;
  totalCredits: number;
  totalSubjects: number;
  label?: string;
}

function getGradeColor(cgpa: number, hasSubjects: boolean): string {
  if (!hasSubjects) return "text-muted-foreground";
  if (cgpa >= 9) return "text-emerald-600 dark:text-emerald-400";
  if (cgpa >= 8) return "text-green-600 dark:text-green-400";
  if (cgpa >= 7) return "text-blue-600 dark:text-blue-400";
  if (cgpa >= 6) return "text-yellow-600 dark:text-yellow-400";
  if (cgpa >= 5) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getGradeLabel(cgpa: number, hasSubjects: boolean): { text: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  if (!hasSubjects) return { text: "No Data", variant: "secondary" };
  if (cgpa >= 9) return { text: "Outstanding", variant: "default" };
  if (cgpa >= 8) return { text: "Excellent", variant: "default" };
  if (cgpa >= 7) return { text: "Very Good", variant: "secondary" };
  if (cgpa >= 6) return { text: "Good", variant: "secondary" };
  if (cgpa >= 5) return { text: "Average", variant: "outline" };
  return { text: "Needs Improvement", variant: "destructive" };
}

function getProgressColor(cgpa: number): string {
  if (cgpa >= 9) return "bg-emerald-500";
  if (cgpa >= 8) return "bg-green-500";
  if (cgpa >= 7) return "bg-blue-500";
  if (cgpa >= 6) return "bg-yellow-500";
  if (cgpa >= 5) return "bg-orange-500";
  return "bg-red-500";
}

export function CGPADisplay({
  cgpa,
  totalCredits,
  totalSubjects,
  label = "Your CGPA",
}: CGPADisplayProps) {
  const hasSubjects = totalSubjects > 0;
  const gradeInfo = getGradeLabel(cgpa, hasSubjects);
  const progressPct = hasSubjects ? (cgpa / 10) * 100 : 0;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden relative animate-scale-in">
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center justify-center gap-1.5">
            <Award className="h-3.5 w-3.5" />
            {label}
          </p>
          <div
            className={`text-5xl font-bold tracking-tight cgpa-glow ${getGradeColor(cgpa, hasSubjects)}`}
          >
            {hasSubjects ? cgpa.toFixed(2) : "—"}
          </div>
          <Badge variant={gradeInfo.variant} className="mt-2 text-xs">
            {gradeInfo.text}
          </Badge>

          {/* Progress bar */}
          {hasSubjects && (
            <div className="mt-4 w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColor(cgpa)}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          )}

          <div className="mt-3 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="font-semibold text-foreground">{totalSubjects}</span>{" "}
              Subjects
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{totalCredits}</span>{" "}
              Credits
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
