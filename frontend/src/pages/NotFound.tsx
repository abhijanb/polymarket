import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
export function NotFound() {
  return (
    <div className="text-center py-20 space-y-4">
      <h1 className="text-4xl font-black">404</h1>
      <p className="text-zinc-400">Page not found</p>
      <Link to="/"><Button>Go home</Button></Link>
    </div>
  );
}
