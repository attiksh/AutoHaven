import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Pages
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CarListingPage from "@/pages/car-listing-page";
import CarDetailPage from "@/pages/car-detail-page";
import FinanceGuide from "@/pages/finance-guide";
import ProfilePage from "@/pages/profile-page";
import MessagesPage from "@/pages/messages-page";
import NotFound from "@/pages/not-found";

// Layout components
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/cars" component={CarListingPage} />
          <Route path="/cars/:id" component={CarDetailPage} />
          <Route path="/finance-guide" component={FinanceGuide} /> {/* New Route */}
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/messages" component={MessagesPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
