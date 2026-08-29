import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useAppSelector } from "@/shared/store/hooks";
import { useMeQuery } from "@/features/auth/api/authApi";

export function App() {
  const token = useAppSelector((s) => s.auth.token);
  const initialized = useAppSelector((s) => s.auth.initialized);

  // Trigger RTK Query fetch for current user if token exists
  useMeQuery(undefined, { skip: !token });

  if (!initialized) {
    return (
      <div className="min-h-screen bg-black grid place-items-center text-zinc-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white animate-pulse" />
          <span className="text-sm">Loading polymarket...</span>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
