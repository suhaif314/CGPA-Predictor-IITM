"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Grade, GRADE_OPTIONS, SubjectEntry } from "@/lib/grading";
import { Subject } from "@/lib/subjects";

interface SubjectEntryRowProps {
  entry: SubjectEntry;
  subjects: Subject[];
  usedSubjectIds: Set<string>;
  onUpdate: (id: string, field: keyof SubjectEntry, value: string | number) => void;
  onRemove: (id: string) => void;
  allowCustom?: boolean;
}

export function SubjectEntryRow({
  entry,
  subjects,
  usedSubjectIds,
  onUpdate,
  onRemove,
  allowCustom = false,
}: SubjectEntryRowProps) {
  const availableSubjects = subjects.filter(
    (s) => s.id === entry.subjectId || !usedSubjectIds.has(s.id)
  );

  const handleSubjectChange = (subjectId: string) => {
    if (subjectId === "__custom__") {
      onUpdate(entry.id, "subjectId", "__custom__");
      onUpdate(entry.id, "subjectName", "");
      onUpdate(entry.id, "credits", 4);
    } else {
      const subject = subjects.find((s) => s.id === subjectId);
      if (subject) {
        onUpdate(entry.id, "subjectId", subject.id);
        onUpdate(entry.id, "subjectName", subject.name);
        onUpdate(entry.id, "credits", subject.credits);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px_120px_40px] gap-2 items-start sm:items-center p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors">
      {/* Subject selection */}
      <div className="space-y-1">
        {entry.subjectId === "__custom__" ? (
          <Input
            placeholder="Enter subject name"
            value={entry.subjectName}
            onChange={(e) => onUpdate(entry.id, "subjectName", e.target.value)}
            className="text-sm"
          />
        ) : (
          <Select
            value={entry.subjectId || undefined}
            onValueChange={handleSubjectChange}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <span>{s.name}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    ({s.credits} cr)
                  </span>
                </SelectItem>
              ))}
              {allowCustom && (
                <SelectItem value="__custom__">
                  <span className="text-primary">+ Custom Subject</span>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Credits */}
      <div>
        <Input
          type="number"
          min={1}
          max={12}
          value={entry.credits}
          onChange={(e) => {
            const parsed = parseInt(e.target.value);
            if (isNaN(parsed) || parsed < 1) {
              onUpdate(entry.id, "credits", 1);
            } else if (parsed > 12) {
              onUpdate(entry.id, "credits", 12);
            } else {
              onUpdate(entry.id, "credits", parsed);
            }
          }}
          className="text-sm text-center"
          disabled={entry.subjectId !== "__custom__"}
        />
      </div>

      {/* Grade */}
      <div>
        <Select
          value={entry.grade}
          onValueChange={(v) => onUpdate(entry.id, "grade", v as Grade)}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            {GRADE_OPTIONS.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Remove */}
      <div className="flex justify-end sm:justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(entry.id)}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
