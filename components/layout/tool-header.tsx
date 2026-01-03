import { LucideIcon, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  category?: string;
  className?: string;
}

export function ToolHeader({
  title,
  description,
  icon: Icon,
  category,
  className,
}: ToolHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm",
        // Mobile: more padding to avoid hamburger menu, better touch spacing
        "px-4 py-4 pl-14",
        // Tablet and up: standard padding
        "sm:px-5 sm:py-4 md:px-6 md:py-5 md:pl-6",
        className
      )}
      role="banner"
    >
      {/* Breadcrumb */}
      <nav className="mb-2 sm:mb-3" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <li>
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1"
              aria-label="Go to home"
            >
              <Home className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </li>
          <li>
            <span className="text-foreground font-medium" aria-current="page">
              {title}
            </span>
          </li>
        </ol>
      </nav>

      {/* Title and Description */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div 
          className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-1.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate" id="tool-title">
              {title}
            </h1>
            {category && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs flex-shrink-0">
                {category}
              </Badge>
            )}
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed" id="tool-description">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}

