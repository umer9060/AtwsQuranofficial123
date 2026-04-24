import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/lib/auth";
import { Layout } from "@/components/layout";

// Pages
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Students from "@/pages/students";
import StudentDetail from "@/pages/student-detail";
import Teachers from "@/pages/teachers";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Lessons from "@/pages/lessons";
import Hadiths from "@/pages/hadiths";
import Classes from "@/pages/classes";
import QnaBoard from "@/pages/qna";
import AdminUsers from "@/pages/admin-users";
import Payments from "@/pages/payments";
import Verification from "@/pages/verification";
import GlobalSearch from "@/pages/search";
import DarseNizami from "@/pages/dars-e-nizami";
import Scholars from "@/pages/scholars";
import Reader from "@/pages/reader";
import ForgotPassword from "@/pages/forgot-password";
import PendingVerification from "@/pages/pending-verification";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public routes — no login required */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/library" component={DarseNizami} />
      <Route path="/scholars" component={Scholars} />
      <Route path="/reader" component={Reader} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/pending-verification" component={PendingVerification} />

      {/* Protected routes — require login */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/students" component={Students} />
      <Route path="/students/:id" component={StudentDetail} />
      <Route path="/teachers" component={Teachers} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/lessons" component={Lessons} />
      <Route path="/hadiths" component={Hadiths} />
      <Route path="/classes" component={Classes} />
      <Route path="/qna" component={QnaBoard} />
      <Route path="/search" component={GlobalSearch} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/payments" component={Payments} />
      <Route path="/admin/verification" component={Verification} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Layout>
              <Router />
            </Layout>
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
