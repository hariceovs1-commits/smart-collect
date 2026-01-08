import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2">
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
            <div className="mt-8 flex justify-center">
               <Button asChild size="lg">
                <Link href="/login">
                  Login to Get Started
                  <LogIn className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Smart Collect. All Rights Reserved.
      </footer>
    </div>
  );
}
