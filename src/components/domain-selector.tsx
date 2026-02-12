"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DegreeDomain } from "@/lib/grading";

interface DomainSelectorProps {
  value: DegreeDomain;
  onChange: (value: DegreeDomain) => void;
}

export function DomainSelector({ value, onChange }: DomainSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <Label className="text-sm font-medium whitespace-nowrap">Degree Program:</Label>
      <Select value={value} onValueChange={(v) => onChange(v as DegreeDomain)}>
        <SelectTrigger className="w-full sm:w-[320px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ds">BS in Data Science and Applications</SelectItem>
          <SelectItem value="es">BS in Electronic Systems</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
