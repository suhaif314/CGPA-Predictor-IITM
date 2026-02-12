"use client";

import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>IIT Madras BS Degree — CGPA Predictor</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Built for{" "}
            <span className="font-semibold text-primary">Namdapha House</span>{" "}
            Tech Challenge
          </div>
        </div>
      </div>
    </footer>
  );
}
