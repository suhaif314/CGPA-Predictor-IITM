"use client";

import { GraduationCap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <div className="p-1 rounded bg-primary/10">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <span>IIT Madras BS Degree — CGPA Predictor</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for{" "}
            <a
              href="https://namdapha.iitmbs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              Namdapha House
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
