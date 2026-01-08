
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/app-context";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { login } = useAppContext();
  const [adminUsername, setAdminUsername] = useState("admin.com");
  const [adminPassword, setAdminPassword] = useState("admin@123");
  const [dcaUsername, setDcaUsername] = useState("");
  const [dcaPassword, setDcaPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const defaultTab = searchParams.get('role') || 'admin';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const result = login(adminUsername, adminPassword);
      if (result === 'admin') {
        toast({ title: "Login Successful", description: "Redirecting to admin dashboard..." });
        router.push("/admin");
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: "Invalid username or password." });
        setIsLoading(false);
      }
    }, 500);
  };

  const handleDcaLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const result = login(dcaUsername, dcaPassword);
      if (result === 'dca') {
        toast({ title: "Login Successful", description: "Redirecting to DCA dashboard..." });
        router.push("/dca");
      } else if (result === 'invalid') {
        toast({ variant: "destructive", title: "Login Failed", description: "Invalid password." });
        setIsLoading(false);
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: "DCA username not found." });
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-6 text-center">
            <h1 className="text-2xl font-bold font-headline text-primary">
                Smart Collect
            </h1>
            <p className="text-sm text-muted-foreground">AI-Powered Debt Collection Management</p>
        </div>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="dca">DCA</TabsTrigger>
          </TabsList>
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Enter your admin credentials to access the dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username">Username</Label>
                      <Input
                        id="admin-username"
                        placeholder="Username"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        required
                        placeholder="admin@123"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="dca">
            <Card>
              <CardHeader>
                <CardTitle>DCA Login</CardTitle>
                <CardDescription>
                  Enter your DCA username and password to access your cases.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDcaLogin}>
                   <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dca-username">DCA Username</Label>
                      <Input
                        id="dca-username"
                        placeholder="e.g., johndoe"
                        required
                        value={dcaUsername}
                        onChange={(e) => setDcaUsername(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dca-password">Password</Label>
                      <Input
                        id="dca-password"
                        type="password"
                        required
                        value={dcaPassword}
                        onChange={(e) => setDcaPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
