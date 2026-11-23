import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Error 404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
          404 Page Not Found
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5 mr-2" aria-hidden="true" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
