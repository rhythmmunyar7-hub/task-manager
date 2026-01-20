import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskProvider } from "@/context/TaskContext";
import TaskLayout from "@/pages/tasks/TaskLayout";
import TodayView from "@/pages/tasks/TodayView";
import InboxView from "@/pages/tasks/InboxView";
import AllTasksView from "@/pages/tasks/AllTasksView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TaskProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to tasks */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            
            {/* Task Manager Routes */}
            <Route path="/tasks" element={<TaskLayout />}>
              <Route index element={<TodayView />} />
              <Route path="inbox" element={<InboxView />} />
              <Route path="all" element={<AllTasksView />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
