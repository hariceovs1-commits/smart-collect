"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Case, Dca, TimetableEntry } from '@/lib/types';
import { cases as initialCases, dcas as initialDcas, timetable as initialTimetable } from '@/lib/data';

interface AppContextType {
  cases: Case[];
  dcas: Dca[];
  timetable: TimetableEntry[];
  addCase: (newCase: Case) => void;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  // Add more functions for updating state as needed
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [dcas, setDcas] = useState<Dca[]>(initialDcas);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable);

  const addCase = (newCase: Case) => {
    setCases(prevCases => [...prevCases, newCase]);
  };

  const updateCase = (caseId: string, updates: Partial<Case>) => {
    setCases(prevCases => 
      prevCases.map(c => 
        c.id === caseId ? { ...c, ...updates } : c
      )
    );
  };
  
  const value = {
    cases,
    dcas,
    timetable,
    addCase,
    updateCase,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

    