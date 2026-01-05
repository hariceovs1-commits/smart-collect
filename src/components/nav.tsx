"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  Wallet,
} from "lucide-react";
import { Icons } from "./icons";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  // These are now tabs, so we don't need separate nav items
  // { href: '/admin/cases', label: 'Cases', icon: Briefcase },
  // { href: '/admin/dcas', label: 'DCAs', icon: Users },
  // { href: '/admin/timetable', label: 'Timetable', icon: Calendar },
];

const dcaNavItems = [
  { href: "/dca", label: "Dashboard", icon: LayoutDashboard },
  // These are now tabs
  // { href: '/dca/cases', label: 'My Cases', icon: Wallet },
  // { href: '/dca/timetable', label: 'My Timetable', icon: Calendar },
];

export function Nav() {
  const pathname = usePathname();
  const isDca = pathname.startsWith("/dca");

  const navItems = isDca ? dcaNavItems : adminNavItems;

  return (
    <nav className="flex-1 flex flex-col gap-4 px-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          asChild
          variant={pathname === item.href ? "default" : "ghost"}
          className="justify-start"
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
