import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GuitarPickCursor } from "./components/GuitarPickCursor";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import WizardApp from "./pages/WizardApp";
import Profile from "./pages/Profile";
import LandingFender from "./pages/LandingFender";
import { useAuth } from "@/_core/hooks/useAuth";

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/" component={LandingFender} />
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      {isAuthenticated && <Route path="/app" component={WizardApp} />}
      {isAuthenticated && <Route path="/profile" component={Profile} />}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <GuitarPickCursor />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
