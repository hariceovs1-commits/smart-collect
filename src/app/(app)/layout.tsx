
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Nav } from "@/components/nav";
import { UserNav } from "@/components/user-nav";
import { Icons } from "@/components/icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Loader2 } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import type { Dca } from "@/lib/types";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loggedInUser, dcas, isLoading, setLoggedInUser } = useAppContext();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isLoading && !loggedInUser) {
      router.push("/login");
    }
  }, [loggedInUser, isLoading, router, hydrated]);

  if (!hydrated || isLoading || !loggedInUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isDca = loggedInUser.role === "DCA";
  const user = isDca
    ? {
        name: (loggedInUser as Dca).name,
        email: `${(loggedInUser as Dca).username}@smartcollect.com`,
        role: "DCA" as const,
      }
    : {
        name: "Admin User",
        email: (loggedInUser as { id: string, name: string, role: 'Admin' }).id,
        role: "Admin" as const,
      };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="font-headline text-lg">Smart Collect</span>
            </Link>
          </div>
          <div className="flex-1 py-4">
            <Nav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 mb-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <span className="font-headline text-lg">Smart Collect</span>
                </Link>
              </div>
              <Nav />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add breadcrumbs or search here */}
          </div>
          <UserNav user={user} onLogout={() => setLoggedInUser(null)} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-secondary/20">
          {children}
        </main>
      </div>
    </div>
  );
}
