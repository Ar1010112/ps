"use client";
import { useState } from "react";
import { ReportForm } from "./ReportForm";
import { ReportSubmitted } from "./ReportFormCompleted";
import type { ReportData } from "@/types";

export function ReportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<Partial<ReportData>>({});

  const handleStepComplete = (data: ReportData) => {
    setReportData(prev => ({ ...prev, ...data }));
    if (currentStep === 4) return;
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div className="rounded-2xl bg-zinc-900 p-8">
      {currentStep === 1 && <ReportForm onComplete={handleStepComplete} />}
      {currentStep === 2 && reportData && (
        <ReportSubmitted 
          data={reportData as ReportData} 
          onComplete={handleStepComplete} 
        />
      )}
    </div>
  );
}