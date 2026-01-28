"use client";
import { Inbox } from "lucide-react";
interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}
export function EmptyState({ title, description }: EmptyStateProps) {
    return (<div className="flex flex-col items-center justify-center min-h-[400px] px-4 py-16">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-muted/50 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <Inbox className="w-12 h-12 text-muted-foreground/60" strokeWidth={1.5}/>
          </div>
        </div>

        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary/20 animate-pulse"/>
        <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-primary/15 animate-pulse delay-300"/>
        <div className="absolute top-1/2 -right-6 w-2 h-2 rounded-full bg-primary/10 animate-pulse delay-700"/>
      </div>

      <div className="text-center max-w-sm">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          {description}
        </p>
      </div>
    </div>);
}
