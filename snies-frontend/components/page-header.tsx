"use client";
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
interface PageHeaderProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    actionLabel?: string;
    actionIcon?: ReactNode;
    onActionClick?: () => void;
    showSearch?: boolean;
    showAction?: boolean;
}
export function PageHeader({ title, subtitle, icon, searchValue = "", onSearchChange, searchPlaceholder = "Buscar...", actionLabel, actionIcon, onActionClick, showSearch = false, showAction = false, }: PageHeaderProps) {
    return (
      <div className="w-full">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-32 left-1/2 h-128 w-lg -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-120 w-120 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#111_1px,transparent_1px)] bg-size-[18px_18px]" />
          </div>

          <div className="container mx-auto px-4 md:px-8 lg:px-20 py-6 md:py-10 space-y-4">
            <div className="rounded-3xl border border-border bg-card p-4 md:p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 ring-1 ring-primary/15 shadow-xs flex items-center justify-center">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      {title}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {subtitle}
                    </p>
                  </div>
                </div>

                {(showSearch || showAction) ? (
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    {showSearch ? (
                      <div className="relative w-full sm:w-[320px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder={searchPlaceholder}
                          value={searchValue}
                          onChange={(e) => onSearchChange?.(e.target.value)}
                          className="pl-10 bg-background rounded-full"
                        />
                      </div>
                    ) : null}

                    {showAction ? (
                      <Button onClick={onActionClick} className="bg-primary hover:bg-primary/90 w-full sm:w-auto gap-2">
                        {actionIcon}
                        {actionLabel}
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
