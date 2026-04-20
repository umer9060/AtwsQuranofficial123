import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LogOut, Home, Users, BookOpen, Book, BookText, Video,
  MessageSquare, Shield, CreditCard, UserCheck, Search,
  ChevronDown, ChevronRight, GraduationCap, Menu, X, Library
} from "lucide-react";
import { Button } from "./ui/button";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
  children?: { name: string; href: string; icon: any }[];
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [adminOpen, setAdminOpen] = useState(
    location.startsWith("/admin") || location === "/admin/payments" || location === "/admin/verification"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const publicPaths = ["/", "/login", "/register", "/library", "/scholars"];
  if (!user || publicPaths.includes(location)) {
    return <>{children}</>;
  }

  const isAdmin = user.role === "admin";

  const navItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Students", href: "/students", icon: Users },
    { name: "Teachers", href: "/teachers", icon: GraduationCap },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Lessons", href: "/lessons", icon: Book },
    { name: "Hadith Library", href: "/hadiths", icon: BookText },
    { name: "Live Classes", href: "/classes", icon: Video },
    { name: "Q&A", href: "/qna", icon: MessageSquare },
    { name: "Search", href: "/search", icon: Search },
    { name: "Dars-e-Nizami Library", href: "/library", icon: Library },
  ];

  const adminItems = [
    { name: "User Management", href: "/admin/users", icon: Shield },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Verification", href: "/admin/verification", icon: UserCheck },
  ];

  const isActive = (href: string) => location === href;
  const isAdminActive = adminItems.some(a => location === a.href);

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-sidebar-border/50">
        <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-primary leading-tight">AtwsQuranofficial</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)}>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
              isActive(item.href)
                ? "bg-primary text-primary-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}>
              <item.icon className="w-4 h-4 shrink-0" />
              {item.name}
            </div>
          </Link>
        ))}

        {isAdmin && (
          <div className="mt-4">
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
              Admin
            </div>
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                isAdminActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 shrink-0" />
                <span>Admin Tools</span>
              </div>
              {adminOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {adminOpen && (
              <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-primary/20 pl-3">
                {adminItems.map(item => (
                  <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)}>
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}>
                      <item.icon className="w-4 h-4 shrink-0" />
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-sidebar-border/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {user.fullName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Log out" className="w-7 h-7 shrink-0">
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex-col hidden md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border flex flex-col md:hidden transform transition-transform duration-200 ease-in-out ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setMobileOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/20 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 p-4 border-b border-border bg-background sticky top-0 z-30">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-primary">AtwsQuranofficial</span>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
