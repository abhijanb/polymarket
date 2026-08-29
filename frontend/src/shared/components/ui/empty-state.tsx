import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

export type EmptyStateProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  footnote?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title = "Welcome to Polymarket",
  description = "Auth-only mode — please log in or create an account.",
  actions,
  footnote,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("max-w-[480px] mx-auto pt-16 text-center space-y-6", className)}>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description ? <p className="text-sm text-zinc-400 mt-2">{description}</p> : null}
      </div>
      {actions ?? (
        <div className="flex justify-center gap-3">
          <Link to="/login">
            <Button size="lg">Log in</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">
              Sign up
            </Button>
          </Link>
        </div>
      )}
      {footnote ?? (
        <p className="text-xs text-zinc-600">
          Backend: <code className="bg-zinc-900 px-1.5 py-0.5 rounded">VITE_API_URL</code> →{" "}
          <code className="bg-zinc-900 px-1.5 py-0.5 rounded">/api/me</code> via RTK Query
        </p>
      )}
    </div>
  );
}

// Convenience alias preserving the original welcome-block semantics.
// Keeps `frontend/src/features/auth/pages/AuthLanding.tsx:12-24` extract discoverable.
export function WelcomeCTA(props: EmptyStateProps) {
  return <EmptyState {...props} />;
}
