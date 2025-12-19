import { useConvexAuth } from "convex/react";
import { SignIn } from "./components/SignIn";
import { Dashboard } from "./components/Dashboard";

function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-holly border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return <Dashboard />;
}

export default App;
