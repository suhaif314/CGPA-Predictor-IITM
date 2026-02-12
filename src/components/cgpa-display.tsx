"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CGPADisplayProps {
  cgpa: number;
  totalCredits: number;
  totalSubjects: number;
  label?: string;
}

function getGradeColor(cgpa: number): string {
  if (cgpa >= 9) return "text-emerald-600";
  if (cgpa >= 8) return "text-green-600";
  if (cgpa >= 7) return "text-blue-600";
  if (cgpa >= 6) return "text-yellow-600";
  if (cgpa >= 5) return "text-orange-600";
  return "text-red-600";
}

function getGradeLabel(cgpa: number): string {
  if (cgpa >= 9) return "Outstanding";
  if (cgpa >= 8) return "Excellent";
  if (cgpa >= 7) return "Very Good";
  if (cgpa >= 6) return "Good";
  if (cgpa >= 5) return "Average";
  if (cgpa > 0) return "Below Average";
  return "N/A";
}

export function CGPADisplay({
  cgpa,
  totalCredits,
  totalSubjects,
  label = "Your CGPA",
}: CGPADisplayProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {label}
          </p>
          <div
            className={`text-5xl font-bold tracking-tight ${getGradeColor(cgpa)}`}
          >
            {cgpa > 0 ? cgpa.toFixed(2) : "—"}
          </div>
          <Badge
            variant="secondary"
            className="mt-2 text-xs"
          >
            {getGradeLabel(cgpa)}
          </Badge>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">{totalSubjects}</span>{" "}
              Subjects
            </div>
            <div>
              <span className="font-semibold text-foreground">{totalCredits}</span>{" "}
              Credits
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
