import type { Dca, Case, TimetableEntry } from './types';

export const dcas: Dca[] = [
  { id: 'dca-1', name: 'John Doe', avatarUrl: 'https://picsum.photos/seed/101/100/100', caseCount: 5, recoveryRate: 0.85, caseHistory: 'Handled 20 cases in the last quarter with a high success rate on debts under $1000. Prefers email communication.' },
  { id: 'dca-2', name: 'Jane Smith', avatarUrl: 'https://picsum.photos/seed/102/100/100', caseCount: 8, recoveryRate: 0.72, caseHistory: 'Specializes in large overdue accounts. Has a lower recovery rate but handles high-value debts. Most effective with phone calls.' },
  { id: 'dca-3', name: 'Mike Johnson', avatarUrl: 'https://picsum.photos/seed/103/100/100', caseCount: 3, recoveryRate: 0.91, caseHistory: 'New agent with an excellent track record on recent cases. Very responsive via messaging and email.' },
  { id: 'dca-4', name: 'Sarah Williams', avatarUrl: 'https://picsum.photos/seed/104/100/100', caseCount: 12, recoveryRate: 0.65, caseHistory: 'Experienced agent handling a high volume of cases. Recovery rate is average but consistent across different types of debt.' },
];

export const cases: Case[] = [
  { id: 'case-001', debtorName: 'Alice Brown', dueAmount: 500, dueDate: '2024-06-15', status: 'In Progress', priorityScore: 85, assignedDcaId: 'dca-1', overdueAging: 45, pastHistory: 'One previous late payment, resolved after a single email reminder.', recoveryRate: 0.9, hasOverdueHistory: true, communicationHistory: 'Initial contact made via email, one reply received.' },
  { id: 'case-002', debtorName: 'Bob Green', dueAmount: 2500, dueDate: '2024-05-20', status: 'In Progress', priorityScore: 95, assignedDcaId: 'dca-2', overdueAging: 71, pastHistory: 'Multiple overdue accounts in the past. Tends to not respond to emails.', recoveryRate: 0.6, hasOverdueHistory: true, communicationHistory: 'Two emails sent, no reply. One phone call attempted, voicemail left.' },
  { id: 'case-003', debtorName: 'Charlie Black', dueAmount: 300, dueDate: '2024-07-01', status: 'Pending', priorityScore: 98, assignedDcaId: null, overdueAging: 29, pastHistory: 'No previous overdue history with our company.', recoveryRate: 0.95, hasOverdueHistory: false, communicationHistory: 'No contact made yet.' },
  { id: 'case-004', debtorName: 'Diana White', dueAmount: 1200, dueDate: '2024-04-10', status: 'Defaulted', priorityScore: 70, assignedDcaId: 'dca-4', overdueAging: 111, pastHistory: 'Long history of non-payment. Legal action was previously considered.', recoveryRate: 0.3, hasOverdueHistory: true, communicationHistory: 'Multiple attempts via all channels over 3 months, no response.' },
  { id: 'case-005', debtorName: 'Ethan Gray', dueAmount: 750, dueDate: '2024-06-30', status: 'Paid', priorityScore: null, assignedDcaId: 'dca-1', overdueAging: 0, pastHistory: 'Paid 5 days after initial contact.', recoveryRate: 1.0, hasOverdueHistory: true, communicationHistory: 'Paid after first email reminder.' },
  { id: 'case-006', debtorName: 'Fiona Purple', dueAmount: 150, dueDate: '2024-07-10', status: 'Pending', priorityScore: 99, assignedDcaId: null, overdueAging: 20, pastHistory: 'First time customer, no payment history.', recoveryRate: 0.98, hasOverdueHistory: false, communicationHistory: 'No contact made yet.' },
];

export const timetable: TimetableEntry[] = [
    { id: 'task-1', dcaId: 'dca-1', date: '2024-07-29', task: 'Follow up with Alice Brown (case-001)', time: '10:00 AM' },
    { id: 'task-2', dcaId: 'dca-2', date: '2024-07-29', task: 'Attempt phone contact with Bob Green (case-002)', time: '11:30 AM' },
    { id: 'task-3', dcaId: 'dca-1', date: '2024-07-29', task: 'Review new case assignments', time: '02:00 PM' },
    { id: 'task-4', dcaId: 'dca-2', date: '2024-07-30', task: 'Prepare report for high-value overdue accounts', time: '09:00 AM' },
    { id: 'task-5', dcaId: 'dca-3', date: '2024-07-30', task: 'Initial contact for new cases', time: '10:00 AM' },
];
