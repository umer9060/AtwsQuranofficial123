import { useListHadiths } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

export default function Hadiths() {
  const [search, setSearch] = useState("");
  
  const { data: hadiths, isLoading } = useListHadiths({ 
    search: search || undefined
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sahih': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'hasan': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      case 'daif': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Hadith Library</h2>
          <p className="text-muted-foreground">Browse authenticated hadiths for study.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <CardTitle>Collection</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Search hadiths..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner className="text-primary w-8 h-8" /></div>
          ) : !hadiths || hadiths.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No hadiths found.</div>
          ) : (
            <div className="space-y-6">
              {hadiths.map((hadith) => (
                <Card key={hadith.id} className="shadow-sm border-primary/10">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className={getStatusColor(hadith.status)} variant="outline">
                        {hadith.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{hadith.source}</span>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xl md:text-2xl text-right font-serif leading-loose" dir="rtl">
                        {hadith.arabicText}
                      </p>
                      {hadith.englishTranslation && (
                        <p className="text-muted-foreground leading-relaxed">
                          "{hadith.englishTranslation}"
                        </p>
                      )}
                      {hadith.urduTranslation && (
                        <p className="text-muted-foreground leading-relaxed text-right font-serif" dir="rtl">
                          "{hadith.urduTranslation}"
                        </p>
                      )}
                      <div className="text-sm text-muted-foreground pt-2 border-t border-primary/10">
                        Narrated by: {hadith.narrator || "Unknown"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}