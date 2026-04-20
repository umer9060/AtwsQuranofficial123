import { useListClasses } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

export default function LiveClasses() {
  const { data: classes, isLoading } = useListClasses();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-serif text-primary">Live Classes</h2>
          <p className="text-muted-foreground">Join scheduled live Zoom sessions.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center p-8"><Spinner className="w-8 h-8 text-primary" /></div>
        ) : !classes || classes.length === 0 ? (
          <div className="col-span-full text-center p-8 text-muted-foreground">No live classes scheduled.</div>
        ) : (
          classes.map((cls) => (
            <Card key={cls.id} className="shadow-sm border-primary/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={cls.status === "live" ? "default" : "secondary"}>
                    {cls.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {cls.gender}
                  </Badge>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  {cls.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(cls.scheduledAt), "PPP")}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(cls.scheduledAt), "p")} ({cls.durationMinutes} mins)</span>
                  </div>
                  
                  {cls.zoomLink && (
                    <Button className="w-full mt-4" asChild>
                      <a href={cls.zoomLink} target="_blank" rel="noopener noreferrer">
                        {cls.status === "live" ? "🔴 Join Live Now" : "Join Zoom Meeting"}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
