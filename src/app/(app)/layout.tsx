import Link from "next/link";
import { Nav } from "@/components/nav";
import { UserNav } from "@/components/user-nav";
import { Icons } from "@/components/icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

// This is a server component, but we'll check the path in the Nav component
// to decide which links to show. This is a simplification for the demo.
import { headers } from "next/headers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-next-pathname") || "";
  const isDca = pathname.startsWith("/dca");

  const user = isDca
    ? {
        name: "DCA User",
        email: "dca@smartcollect.com",
        role: "DCA" as const,
      }
    : {
        name: "Admin User",
        email: "admin@smartcollect.com",
        role: "Admin" as const,
      };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Icons.Logo className="h-6 w-6 text-primary" />
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
                  <Icons.Logo className="h-6 w-6 text-primary" />
                  <span className="font-headline text-lg">Smart Collect</span>
                </Link>
              </div>
              <Nav />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add breadcrumbs or search here */}
          </div>
          <UserNav user={user} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-secondary/20">
          {children}
        </main>
      </div>
    </div>
  );
}
