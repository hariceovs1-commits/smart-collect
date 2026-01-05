"use client";

import { useState } from "react";
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
  Briefcase,
  Calendar,
  BrainCircuit,
  TrendingUp,
  UserCheck,
  Loader2,
  AlertTriangle,
  Mail,
  Phone,
  MessageSquare,
  PlusCircle,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { Case, Dca, TimetableEntry } from "@/lib/types";
import { prioritizeCases } from "@/ai/flows/prioritize-cases";
import { analyzeDcaPerformance } from "@/ai/flows/analyze-dca-performance";
import { useToast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { useAppContext } from "@/context/app-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type PriorityResult = {
  priorityScore: number;
  priorityReason: string;
};

type DcaAnalysisResult = {
  analysisSummary: string;
  recommendedAssignments: string;
};

const newCaseSchema = z.object({
  debtorName: z.string().min(1, "Debtor name is required"),
  dueAmount: z.coerce.number().min(1, "Due amount must be positive"),
  dueDate: z.string().min(1, "Due date is required"),
  pastHistory: z.string().min(1, "Past history is required"),
  hasOverdueHistory: z.boolean(),
});

type NewCaseForm = z.infer<typeof newCaseSchema>;

const newDcaSchema = z.object({
  name: z.string().min(1, "DCA name is required"),
  username: z.string().min(1, "Username is required"),
});

type NewDcaForm = z.infer<typeof newDcaSchema>;

const timetableSchema = z.object({
  task: z.string().min(1, "Task description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  dcaId: z.string().min(1, "You must assign a DCA"),
});

type TimetableForm = z.infer<typeof timetableSchema>;


export default function AdminDashboard() {
  const { toast } = useToast();
  const { cases, dcas, timetable, addCase, updateCase, addDca, updateTimetableEntry, addTimetableEntry } = useAppContext();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedDca, setSelectedDca] = useState<Dca | null>(null);
  const [selectedTimetableEntry, setSelectedTimetableEntry] = useState<TimetableEntry | null>(null);

  const [priorityResult, setPriorityResult] = useState<PriorityResult | null>(
    null
  );
  const [dcaAnalysisResult, setDcaAnalysisResult] =
    useState<DcaAnalysisResult | null>(null);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assignedDca, setAssignedDca] = useState<string | null>(null);
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [isAddDcaOpen, setIsAddDcaOpen] = useState(false);
  const [isEditTimetableOpen, setIsEditTimetableOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);

  const newCaseForm = useForm<NewCaseForm>({
    resolver: zodResolver(newCaseSchema),
    defaultValues: {
      hasOverdueHistory: false,
    },
  });

  const newDcaForm = useForm<NewDcaForm>({
    resolver: zodResolver(newDcaSchema),
  });
  
  const timetableForm = useForm<TimetableForm>({
    resolver: zodResolver(timetableSchema),
  });

  const totalDue = cases.reduce((sum, c) => sum + c.dueAmount, 0);
  const overdueCases = cases.filter(
    (c) => c.status === "In Progress" || c.status === "Defaulted"
  ).length;

  const chartData = [
    { name: "Pending", value: cases.filter((c) => c.status === "Pending").length },
    { name: "In Progress", value: overdueCases },
    { name: "Paid", value: cases.filter((c) => c.status === "Paid").length },
    { name: "Defaulted", value: cases.filter((c) => c.status === "Defaulted").length },
  ];

  const handlePrioritize = async () => {
    if (!selectedCase) return;
    setIsPrioritizing(true);
    setPriorityResult(null);
    try {
      const result = await prioritizeCases({
        overdueAging: selectedCase.overdueAging,
        pastHistory: selectedCase.pastHistory,
        dueAmount: selectedCase.dueAmount,
        recoveryRate: selectedCase.recoveryRate,
        hasOverdueHistory: selectedCase.hasOverdueHistory,
      });
      setPriorityResult(result);
      // Update the case in context
      updateCase(selectedCase.id, { priorityScore: result.priorityScore });
    } catch (error) {
      console.error("Prioritization failed:", error);
      toast({
        variant: "destructive",
        title: "AI Prioritization Failed",
        description: "Could not get priority score. Please try again.",
      });
    } finally {
      setIsPrioritizing(false);
    }
  };

  const handleAnalyzeDca = async () => {
    if (!selectedDca) return;
    setIsAnalyzing(true);
    setDcaAnalysisResult(null);
    try {
      const result = await analyzeDcaPerformance({
        dcaId: selectedDca.id,
        caseHistory: selectedDca.caseHistory,
      });
      setDcaAnalysisResult(result);
    } catch (error) {
      console.error("DCA Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "Could not analyze DCA performance. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleAssignDCA = () => {
    if(selectedCase && assignedDca) {
      updateCase(selectedCase.id, { assignedDcaId: assignedDca });
      toast({
        title: "Case Assigned",
        description: `${selectedCase.debtorName}'s case has been assigned to ${dcas.find(d => d.id === assignedDca)?.name}.`,
      });
    }
  }

  const handleAddCase = (data: NewCaseForm) => {
    const newCase: Case = {
      id: `case-${Date.now()}`,
      status: 'Pending',
      priorityScore: null,
      assignedDcaId: null,
      overdueAging: 0, 
      recoveryRate: 0.8, 
      communicationHistory: 'No contact made yet.',
      ...data,
    };
    addCase(newCase);
    toast({
      title: "Case Created",
      description: `New case for ${data.debtorName} has been added.`,
    });
    newCaseForm.reset();
    setIsAddCaseOpen(false);
  }
  
  const handleAddDca = (data: NewDcaForm) => {
    const newDca: Dca = {
      id: `dca-${Date.now()}`,
      caseCount: 0,
      recoveryRate: 0,
      caseHistory: 'New agent.',
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
      ...data,
    };
    addDca(newDca);
    toast({
      title: "DCA Added",
      description: `New agent ${data.name} has been added.`,
    });
    newDcaForm.reset();
    setIsAddDcaOpen(false);
  }

  const handleEditTimetable = (data: TimetableForm) => {
    if (selectedTimetableEntry) {
      updateTimetableEntry(selectedTimetableEntry.id, data);
      toast({
        title: "Timetable Updated",
        description: "The task has been successfully updated.",
      });
      setIsEditTimetableOpen(false);
    }
  };

  const handleAddSchedule = (data: TimetableForm) => {
    const newEntry: TimetableEntry = {
      id: `task-${Date.now()}`,
      ...data
    };
    addTimetableEntry(newEntry);
    toast({
      title: "Task Scheduled",
      description: `New task "${data.task}" has been scheduled.`,
    });
    timetableForm.reset();
    setIsAddScheduleOpen(false);
  };

  const openEditTimetableDialog = (entry: TimetableEntry) => {
    setSelectedTimetableEntry(entry);
    timetableForm.reset({
      task: entry.task,
      date: entry.date,
      time: entry.time,
      dcaId: entry.dcaId,
    });
    setIsEditTimetableOpen(true);
  };


  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Admin Dashboard
        </h1>
        <Dialog open={isAddCaseOpen} onOpenChange={setIsAddCaseOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Case
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Case</DialogTitle>
              <DialogDescription>
                Fill in the details for the new debt collection case.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={newCaseForm.handleSubmit(handleAddCase)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="debtorName" className="text-right">Debtor Name</Label>
                  <Input id="debtorName" {...newCaseForm.register("debtorName")} className="col-span-3" />
                  {newCaseForm.formState.errors.debtorName && <p className="col-span-4 text-xs text-destructive text-right">{newCaseForm.formState.errors.debtorName.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueAmount" className="text-right">Amount</Label>
                  <Input id="dueAmount" type="number" {...newCaseForm.register("dueAmount")} className="col-span-3" />
                   {newCaseForm.formState.errors.dueAmount && <p className="col-span-4 text-xs text-destructive text-right">{newCaseForm.formState.errors.dueAmount.message}</p>}
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                  <Input id="dueDate" type="date" {...newCaseForm.register("dueDate")} className="col-span-3" />
                  {newCaseForm.formState.errors.dueDate && <p className="col-span-4 text-xs text-destructive text-right">{newCaseForm.formState.errors.dueDate.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pastHistory" className="text-right">History</Label>
                  <Textarea id="pastHistory" {...newCaseForm.register("pastHistory")} className="col-span-3" />
                  {newCaseForm.formState.errors.pastHistory && <p className="col-span-4 text-xs text-destructive text-right">{newCaseForm.formState.errors.pastHistory.message}</p>}
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hasOverdueHistory" className="text-right">Prev. Overdue</Label>
                  <Controller
                    name="hasOverdueHistory"
                    control={newCaseForm.control}
                    render={({ field }) => (
                      <input type="checkbox" checked={field.value} onChange={field.onChange} className="col-span-3" />
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create Case</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <TrendingUp className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="cases">
            <Briefcase className="mr-2 h-4 w-4" />
            Case Management
          </TabsTrigger>
          <TabsTrigger value="dcas">
            <Users className="mr-2 h-4 w-4" />
            DCA Management
          </TabsTrigger>
          <TabsTrigger value="timetable">
            <Calendar className="mr-2 h-4 w-4" />
            Timetable
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Due Amount
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalDue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all active cases
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overdue Cases
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{overdueCases}</div>
                <p className="text-xs text-muted-foreground">
                  Cases currently in progress or defaulted
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cases.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total cases in the system
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active DCAs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dcas.length}</div>
                <p className="text-xs text-muted-foreground">
                  Debt Collection Agents
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Case Status Overview</CardTitle>
                <CardDescription>
                  A summary of cases by their current status.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cases">
          <Card>
            <CardHeader>
              <CardTitle>All Cases</CardTitle>
              <CardDescription>
                Manage, assign, and prioritize debt collection cases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Debtor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned DCA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        {c.debtorName}
                      </TableCell>
                      <TableCell>${c.dueAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={c.status === 'Paid' ? 'secondary' : c.status === 'Defaulted' ? 'destructive' : 'outline'}>{c.status}</Badge>
                      </TableCell>
                      <TableCell>{c.priorityScore || "N/A"}</TableCell>
                      <TableCell>
                        {c.assignedDcaId
                          ? dcas.find((d) => d.id === c.assignedDcaId)?.name
                          : "Unassigned"}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => { setSelectedCase(c); setAssignedDca(c.assignedDcaId); }}>
                              Assign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Case: {selectedCase?.debtorName}</DialogTitle>
                              <DialogDescription>
                                Assign this case to a Debt Collection Agent.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Select onValueChange={setAssignedDca} defaultValue={assignedDca || undefined}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a DCA" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dcas.map((dca) => (
                                    <SelectItem key={dca.id} value={dca.id}>
                                      {dca.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={handleAssignDCA}>Assign Case</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCase(c);
                                setPriorityResult(null);
                              }}
                            >
                              <BrainCircuit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                AI Case Prioritization
                              </DialogTitle>
                              <DialogDescription>
                                Analyze case data to determine its priority score.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                               <p><strong>Debtor:</strong> {selectedCase?.debtorName}</p>
                               <p><strong>Amount:</strong> ${selectedCase?.dueAmount.toLocaleString()}</p>
                               <p><strong>Overdue:</strong> {selectedCase?.overdueAging} days</p>
                               <p><strong>Past History:</strong> {selectedCase?.hasOverdueHistory ? 'Yes' : 'No'}</p>
                            </div>
                            <Button onClick={handlePrioritize} disabled={isPrioritizing}>
                              {isPrioritizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Run AI Analysis
                            </Button>
                            {priorityResult && (
                              <Card className="mt-4 bg-secondary">
                                <CardHeader>
                                  <CardTitle>AI Analysis Result</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p><strong>Priority Score:</strong> {priorityResult.priorityScore}/100</p>
                                  <p className="mt-2"><strong>Reason:</strong> {priorityResult.priorityReason}</p>
                                </CardContent>
                              </Card>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dcas">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>DCA Management</CardTitle>
                <CardDescription>
                  Analyze performance of Debt Collection Agents.
                </CardDescription>
              </div>
               <Dialog open={isAddDcaOpen} onOpenChange={setIsAddDcaOpen}>
                  <DialogTrigger asChild>
                     <Button size="sm">
                        <PlusCircle className="mr-2" />
                        Add DCA
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New DCA</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new Debt Collection Agent.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={newDcaForm.handleSubmit(handleAddDca)}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input id="name" {...newDcaForm.register("name")} className="col-span-3" />
                          {newDcaForm.formState.errors.name && <p className="col-span-4 text-xs text-destructive text-right">{newDcaForm.formState.errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">Username</Label>
                          <Input id="username" {...newDcaForm.register("username")} className="col-span-3" />
                           {newDcaForm.formState.errors.username && <p className="col-span-4 text-xs text-destructive text-right">{newDcaForm.formState.errors.username.message}</p>}
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Add DCA</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Cases</TableHead>
                    <TableHead>Recovery Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dcas.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{d.username}</TableCell>
                      <TableCell>{cases.filter(c => c.assignedDcaId === d.id).length}</TableCell>
                      <TableCell>{(d.recoveryRate * 100).toFixed(0)}%</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                             <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDca(d);
                                setDcaAnalysisResult(null);
                              }}
                            >
                              <BrainCircuit className="h-4 w-4 mr-2" />
                              Analyze Performance
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                             <DialogHeader>
                              <DialogTitle>
                                AI Performance Analysis: {selectedDca?.name}
                              </DialogTitle>
                              <DialogDescription>
                                Analyze DCA performance based on their case history.
                              </DialogDescription>
                            </DialogHeader>
                            <Button onClick={handleAnalyzeDca} disabled={isAnalyzing}>
                              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Run AI Analysis
                            </Button>
                            {dcaAnalysisResult && (
                              <div className="mt-4 space-y-4 max-h-[50vh] overflow-y-auto">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Analysis Summary</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm text-muted-foreground">{dcaAnalysisResult.analysisSummary}</p>
                                  </CardContent>
                                </Card>
                                 <Card>
                                  <CardHeader>
                                    <CardTitle>Recommended Assignments</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm text-muted-foreground">{dcaAnalysisResult.recommendedAssignments}</p>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="timetable">
           <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Timetable</CardTitle>
                  <CardDescription>
                    Overview of scheduled tasks for all agents.
                  </CardDescription>
                </div>
                <Dialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <PlusCircle className="mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                      <DialogDescription>
                        Schedule a new task for a DCA.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={timetableForm.handleSubmit(handleAddSchedule)}>
                      <div className="grid gap-4 py-4">
                         <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="dcaId" className="text-right">Assign to</Label>
                          <Controller
                            name="dcaId"
                            control={timetableForm.control}
                            render={({ field }) => (
                               <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select a DCA" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dcas.map((dca) => (
                                    <SelectItem key={dca.id} value={dca.id}>
                                      {dca.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                           />
                           {timetableForm.formState.errors.dcaId && <p className="col-span-4 text-xs text-destructive text-right">{timetableForm.formState.errors.dcaId.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="task" className="text-right">Task</Label>
                          <Textarea id="task" {...timetableForm.register("task")} className="col-span-3" />
                           {timetableForm.formState.errors.task && <p className="col-span-4 text-xs text-destructive text-right">{timetableForm.formState.errors.task.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date" className="text-right">Date</Label>
                          <Input id="date" type="date" {...timetableForm.register("date")} className="col-span-3" />
                           {timetableForm.formState.errors.date && <p className="col-span-4 text-xs text-destructive text-right">{timetableForm.formState.errors.date.message}</p>}
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="time" className="text-right">Time</Label>
                          <Input id="time" type="time" {...timetableForm.register("time")} className="col-span-3" />
                           {timetableForm.formState.errors.time && <p className="col-span-4 text-xs text-destructive text-right">{timetableForm.formState.errors.time.message}</p>}
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Schedule Task</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...new Set(timetable.map(t => t.date))].sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).map(date => (
                    <div key={date}>
                      <h3 className="text-lg font-semibold font-headline mb-2">{format(new Date(date), 'EEEE, MMMM do')}</h3>
                      <div className="border-l-2 border-primary pl-4 space-y-2">
                        {timetable.filter(t => t.date === date).sort((a,b) => a.time.localeCompare(b.time)).map(task => (
                           <div key={task.id} className="p-3 rounded-md bg-secondary flex justify-between items-center">
                             <div className="flex-1">
                               <p className="font-medium">{task.task}</p>
                               <p className="text-sm text-muted-foreground">{dcas.find(d => d.id === task.dcaId)?.name}</p>
                             </div>
                              <div className="text-sm text-muted-foreground mr-4">{task.time}</div>
                              <Button variant="ghost" size="icon" onClick={() => openEditTimetableDialog(task)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                           </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
           </Card>
           <Dialog open={isEditTimetableOpen} onOpenChange={setIsEditTimetableOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Timetable Entry</DialogTitle>
                <DialogDescription>
                  Update the details for this scheduled task.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={timetableForm.handleSubmit(handleEditTimetable)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dcaId-edit" className="text-right">Assign to</Label>
                    <Controller
                        name="dcaId"
                        control={timetableForm.control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="dcaId-edit" className="col-span-3">
                                <SelectValue placeholder="Select a DCA" />
                            </SelectTrigger>
                            <SelectContent>
                                {dcas.map((dca) => (
                                <SelectItem key={dca.id} value={dca.id}>
                                    {dca.name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        )}
                        />
                    {timetableForm.formState.errors.dcaId && <p className="col-span-4 text-xs text-destructive text-right">{timetableForm.formState.errors.dcaId.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-edit" className="text-right">Task</Label>
                    <Textarea id="task-edit" {...timetableForm.register("task")} className="col-span-3" />
                    {timetableForm.formState.errors.task && <p className="col-span-4 text-xs text-destructive text-right">{timetableForm.formState.errors.task.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date-edit" className="text-right">Date</Label>
                    <Input id="date-edit" type="date" {...timetableForm.register("date")} className="col-span-3" />
                    {timetableForm.formState.errors.date && <p className="col-span-4 text-xs text-destructive text-right">{timetableForm.formState.errors.date.message}</p>}
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time-edit" className="text-right">Time</Label>
                    <Input id="time-edit" type="time" {...timetableForm.register("time")} className="col-span-3" />
                    {timetableForm.formState.errors.time && <p className="col-span-4 text-xs text-destructive text-right">{timetableForm.formState.errors.time.message}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
           </Dialog>
        </TabsContent>
      </Tabs>
    </>
  );
}
