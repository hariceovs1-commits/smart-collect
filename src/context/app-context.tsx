"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Case, Dca, TimetableEntry } from '@/lib/types';
import { cases as initialCases, dcas as initialDcas, timetable as initialTimetable } from '@/lib/data';
import { useRouter } from 'next/navigation';

type LoggedInUser = (Dca & { role: 'DCA' }) | { id: 'admin'; role: 'Admin' };

interface AppContextType {
  cases: Case[];
  dcas: Dca[];
  timetable: TimetableEntry[];
  loggedInUser: LoggedInUser | null;
  isLoading: boolean;
  addCase: (newCase: Case) => void;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  addDca: (newDca: Dca) => void;
  updateTimetableEntry: (entryId: string, updates: Partial<TimetableEntry>) => void;
  setLoggedInUser: (user: LoggedInUser | null) => void;
  login: (username: string, password?: string) => 'admin' | 'dca' | 'not-found' | 'invalid';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [dcas, setDcas] = useState<Dca[]>(initialDcas);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setLoggedInUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password?: string) => {
    if (username === 'admin@admin.com' && password === 'admin@123') {
      const adminUser = { id: 'admin', role: 'Admin' as const };
      setLoggedInUser(adminUser);
      localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
      return 'admin';
    }
    
    const dca = dcas.find(d => d.username === username);
    if (dca) {
      const dcaUser = { ...dca, role: 'DCA' as const };
      setLoggedInUser(dcaUser);
      localStorage.setItem('loggedInUser', JSON.stringify(dcaUser));
      return 'dca';
    }

    if (username === 'admin@admin.com') return 'invalid';

    return 'not-found';
  };
  
  const handleSetLoggedInUser = (user: LoggedInUser | null) => {
    setLoggedInUser(user);
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('loggedInUser');
      router.push('/login');
    }
  }

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

  const addDca = (newDca: Dca) => {
    setDcas(prevDcas => [...prevDcas, newDca]);
  };

  const updateTimetableEntry = (entryId: string, updates: Partial<TimetableEntry>) => {
    setTimetable(prevTimetable =>
      prevTimetable.map(entry =>
        entry.id === entryId ? { ...entry, ...updates } : entry
      )
    );
  };
  
  const value = {
    cases,
    dcas,
    timetable,
    loggedInUser,
    isLoading,
    addCase,
    updateCase,
    addDca,
    updateTimetableEntry,
    setLoggedInUser: handleSetLoggedInUser,
    login,
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
