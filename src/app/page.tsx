import Link from "next/link";
import { ArrowRight, ShieldCheck, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2">
          <Icons.Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            Smart Collect
          </h1>
        </div>
      </header>
      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold font-headline tracking-tight sm:text-5xl md:text-6xl">
              AI-Powered Debt Collection
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Streamline case management, prioritize collections, and analyze
              performance with intelligent automation.
            </p>
          </div>

          <div className="mt-12 max-w-lg mx-auto grid gap-8 md:grid-cols-2 md:max-w-2xl">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mx-auto">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-center mt-4">
                  Admin Portal
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Manage DCAs, assign cases, and view performance analytics.
                </p>
                <Button asChild className="w-full">
                  <Link href="/admin">
                    Enter as Admin <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent text-accent-foreground mx-auto">
                  <Briefcase className="h-6 w-6" />
                </div>
                <CardTitle className="text-center mt-4">
                  DCA Portal
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Access assigned cases, get AI suggestions, and update case
                  status.
                </p>
                <Button asChild className="w-full" variant="accent">
                  <Link href="/dca">
                    Enter as DCA <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Smart Collect. All Rights Reserved.
      </footer>
    </div>
  );
}
