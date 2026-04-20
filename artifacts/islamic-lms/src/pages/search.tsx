import { useListUsers } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Search, Users, UserCheck, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Spinner } from "@/components/ui/spinner";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const { data: users, isLoading } = useListUsers({ search: query || undefined });

  const results = useMemo(() => {
    if (!users || !query.trim()) return users || [];
    const q = query.toLowerCase().trim();
    return users.filter(u =>
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.federationCode?.toLowerCase().includes(q) ||
      u.cnicNumber?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  }, [users, query]);

  const students = results.filter(u => u.role === "male_student" || u.role === "female_student");
  const teachers = results.filter(u => u.role === "teacher" || u.role === "female_teacher" || u.role === "qari");
  const admins = results.filter(u => u.role === "admin");

  const statusColor: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    trial: "bg-yellow-100 text-yellow-700",
    pending: "bg-blue-100 text-blue-700",
    suspended: "bg-red-100 text-red-700",
    verified: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Global Search</h2>
        <p className="text-muted-foreground">Search by name, email, CNIC, Federation Code, or phone number.</p>
      </div>

      {/* Search Bar */}
      <Card className="border-primary/10">
        <CardContent className="pt-6 pb-4">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              className="pl-12 h-12 text-base"
              placeholder="Search by name, CNIC, Federation Code, phone, or email..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          {query && (
            <p className="text-sm text-muted-foreground mt-3">
              {isLoading ? "Searching..." : `${results.length} result${results.length !== 1 ? "s" : ""} found`}
            </p>
          )}
        </CardContent>
      </Card>

      {isLoading && query && (
        <div className="flex justify-center p-8"><Spinner className="w-8 h-8 text-primary" /></div>
      )}

      {!query && (
        <Card className="border-primary/10">
          <CardContent className="py-16 text-center text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Start typing to search</p>
            <p className="text-sm mt-1">Find students, teachers, and admins instantly</p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["WIF-2025-B001", "ahmad@", "42101-", "+92"].map(hint => (
                <button
                  key={hint}
                  onClick={() => setQuery(hint)}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs hover:bg-primary/20 transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {query && !isLoading && results.length === 0 && (
        <Card className="border-primary/10">
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="font-medium">No results for "{query}"</p>
            <p className="text-sm mt-1">Try searching by a different name, CNIC, or federation code.</p>
          </CardContent>
        </Card>
      )}

      {/* Students */}
      {students.length > 0 && (
        <ResultSection title="Students" icon={Users} count={students.length}>
          {students.map(u => (
            <ResultCard
              key={u.id}
              user={u}
              statusColor={statusColor}
              linkHref={`/students/${u.id}`}
              linkLabel="View Profile"
              query={query}
            />
          ))}
        </ResultSection>
      )}

      {/* Teachers */}
      {teachers.length > 0 && (
        <ResultSection title="Teachers" icon={UserCheck} count={teachers.length}>
          {teachers.map(u => (
            <ResultCard
              key={u.id}
              user={u}
              statusColor={statusColor}
              linkHref={`/teachers`}
              linkLabel="Teachers"
              query={query}
            />
          ))}
        </ResultSection>
      )}

      {/* Admins */}
      {admins.length > 0 && (
        <ResultSection title="Admins" icon={UserCheck} count={admins.length}>
          {admins.map(u => (
            <ResultCard
              key={u.id}
              user={u}
              statusColor={statusColor}
              linkHref={`/admin/users`}
              linkLabel="User Management"
              query={query}
            />
          ))}
        </ResultSection>
      )}
    </div>
  );
}

function ResultSection({ title, icon: Icon, count, children }: { title: string; icon: any; count: number; children: React.ReactNode }) {
  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {title}
          <Badge variant="secondary" className="ml-1 text-xs">{count}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">{children}</div>
      </CardContent>
    </Card>
  );
}

function ResultCard({ user, statusColor, linkHref, linkLabel, query }: {
  user: any;
  statusColor: Record<string, string>;
  linkHref: string;
  linkLabel: string;
  query: string;
}) {
  const highlight = (text: string) => {
    if (!query || !text) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${user.gender === "female" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
          {user.fullName?.[0] || "?"}
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{highlight(user.fullName)}</p>
          <p className="text-xs text-muted-foreground">{highlight(user.email)}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {user.federationCode && (
              <span className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                {highlight(user.federationCode)}
              </span>
            )}
            {user.cnicNumber && (
              <span className="text-xs text-muted-foreground">CNIC: {highlight(user.cnicNumber)}</span>
            )}
            {user.phone && (
              <span className="text-xs text-muted-foreground">{highlight(user.phone)}</span>
            )}
            {user.level && <span className="text-xs text-muted-foreground">Level {user.level}</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[user.status] || "bg-gray-100 text-gray-700"}`}>
          {user.status}
        </span>
        <Link href={linkHref}>
          <Button size="sm" variant="ghost" className="h-7 text-xs text-primary gap-1">
            <ExternalLink className="w-3 h-3" />
            {linkLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
