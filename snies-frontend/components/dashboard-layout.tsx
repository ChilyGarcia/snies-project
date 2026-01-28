"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Home, Workflow, BarChart3, Settings, Users, User as UserIcon, LogOut, Settings as SettingsIcon, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { LogoutService } from "@/modules/auth/hooks/services/logout.service";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, useReducedMotion } from "framer-motion";
import { usePermissions } from "@/modules/auth/presentation/permissions-provider";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { EmptyState } from "@/components/empty-state";
import { useNotifications } from "@/modules/notifications/hooks/use-notifications";
import { cn } from "@/lib/utils";
const navigation = [
    { name: "Inicio", href: "/dashboard", icon: Home },
    { name: "Bienestar", href: "/wellbeing", icon: BarChart3 },
    { name: "Cursos", href: "/courses", icon: Workflow },
    { name: "Usuarios", href: "/users", icon: Users },
    { name: "Ajustes", href: "/settings", icon: Settings },
    { name: "Auditorías", href: "/audit", icon: Shield },
];
interface DashboardLayoutProps {
    children: React.ReactNode;
}
export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const reduceMotion = useReducedMotion();
    const { can, hasRole, loading: permsLoading, error: permsError, refresh: refreshPerms } = usePermissions();
    const avatarUrl = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=80";
    const [notificationsOpen, setNotificationsOpen] = React.useState(false);
    const {
        notifications,
        hasUnread,
        unreadCount,
        loadingList: notifLoading,
        error: notifError,
        filter: notifFilter,
        setFilter: setNotifFilter,
        refreshList: refreshNotifList,
        refreshUnreadCount,
        loadMore,
        markRead,
        markAllRead,
        data: notifData,
    } = useNotifications({ pageSize: 20 });

    React.useEffect(() => {
        if (!notificationsOpen) return;
        // refrescar al abrir
        void refreshUnreadCount();
        void refreshNotifList({ silent: true, resetPage: true });
    }, [notificationsOpen, refreshNotifList, refreshUnreadCount]);

    const totalNotifPages = Math.max(1, Math.ceil(((notifData?.count ?? 0) / (notifData?.page_size ?? 20))));
    const canLoadMore = (notifData?.page ?? 1) < totalNotifPages;

    const formatTime = (iso: string | undefined) => {
        if (!iso) return "";
        try {
            return new Date(iso).toLocaleString("es-CO");
        }
        catch {
            return iso;
        }
    };

    const getNotifTitle = (n: any) => n?.title ?? n?.message ?? "Notificación";
    const getNotifDesc = (n: any) => {
        const d = n?.message ?? "";
        if (n?.title && d && n.title !== d) return d;
        return "";
    };
    const currentNav = navigation.find((n) => n.href === pathname);
    const CurrentIcon = currentNav?.icon;
    const currentLabel = currentNav?.name ?? (pathname === "/" ? "Inicio" : pathname.replace("/", ""));
    const handleSignOut = async () => {
        const logoutService = new LogoutService();
        await logoutService.execute();
        router.replace("/login");
    };
    if (permsLoading) {
        return (<FullscreenLoader title="Cargando permisos" subtitle="Estamos preparando tu dashboard…"/>);
    }
    if (permsError) {
        return (<div className="min-h-screen bg-background text-foreground p-6">
        <EmptyState title="No se pudieron cargar los permisos" description={permsError}/>
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => refreshPerms()}>
            Reintentar
          </Button>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b border-border bg-white/90 dark:bg-background/80 px-4 sm:px-6 flex items-center justify-between backdrop-blur supports-backdrop-filter:bg-white/70 supports-backdrop-filter:dark:bg-background/60">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white ring-1 ring-border shadow-xs flex items-center justify-center overflow-hidden">
              <img src="/logo-fesc.png" alt="FESC" className="h-6 w-6 object-contain"/>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">SNIES</div>
              <div className="text-xs text-muted-foreground">Dashboard</div>
            </div>
          </div>
        </div>

        
        <div className="hidden md:flex flex-1 items-center justify-center px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground shadow-xs">
            {CurrentIcon ? <CurrentIcon className="h-4 w-4"/> : null}
            <span className="hidden lg:inline">Estás en</span>
            <span className="text-foreground font-medium">{currentLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
            <Input placeholder="Busca algo..." className="pl-10 w-80 bg-muted/40 border-border focus:bg-background rounded-full"/>
          </div>
          <ThemeToggle />
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-9 w-9 rounded-full border-border bg-background/60 backdrop-blur hover:bg-muted/40 hover:text-foreground">
                <Bell className="h-4 w-4"/>
                {hasUnread ? (<span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background"/>) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-2" onOpenAutoFocus={(e) => e.preventDefault()} onCloseAutoFocus={(e) => e.preventDefault()}>
              <div className="px-2 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Notificaciones</div>
                    <div className="text-xs text-muted-foreground">
                      {hasUnread ? `Tienes ${unreadCount} sin leer` : "Estás al día"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="h-8 rounded-full border border-border bg-background px-2 text-xs text-foreground"
                      value={notifFilter}
                      onChange={(e) => setNotifFilter(e.target.value as any)}
                    >
                      <option value="all">Todas</option>
                      <option value="unread">No leídas</option>
                      <option value="read">Leídas</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={async () => {
                        try {
                          const updated = await markAllRead();
                          void refreshUnreadCount();
                          void refreshNotifList({ silent: true, resetPage: true });
                          if (updated > 0) {
                            // opcional
                          }
                        } catch (e) {
                          // eslint-disable-next-line no-console
                          console.error(e);
                        }
                      }}
                      disabled={!hasUnread}
                    >
                      Marcar todo como leído
                    </Button>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {notifError ? (
                  <div className="p-3 text-sm text-muted-foreground">No se pudieron cargar notificaciones.</div>
                ) : notifLoading ? (
                  <div className="p-3 text-sm text-muted-foreground">Cargando…</div>
                ) : notifications.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No hay notificaciones.</div>
                ) : (
                  notifications.map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className="gap-3 py-2.5"
                      onSelect={(e) => {
                        e.preventDefault();
                        setNotificationsOpen(true);
                        if (!n.is_read) {
                          void markRead(n.id).catch(() => {});
                        }
                      }}
                    >
                      <span className={cn("mt-0.5 h-2 w-2 rounded-full", n.is_read ? "bg-muted-foreground/30" : "bg-primary")} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className={cn("text-sm leading-5 truncate", n.is_read ? "font-medium" : "font-semibold")}>
                            {getNotifTitle(n)}
                          </div>
                          <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatTime(n.created_at)}
                          </div>
                        </div>
                        {getNotifDesc(n) ? (
                          <div className="text-xs text-muted-foreground leading-5 line-clamp-2">{getNotifDesc(n)}</div>
                        ) : null}
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="p-1">
                <Button
                  variant="ghost"
                  className="w-full justify-center h-9 text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setNotificationsOpen(true);
                    if (canLoadMore) void loadMore();
                  }}
                  disabled={!canLoadMore || notifLoading}
                >
                  {canLoadMore ? "Cargar más" : "No hay más"}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-border bg-background/60 backdrop-blur hover:bg-muted/40 hover:text-foreground">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={avatarUrl}/>
                  <AvatarFallback className="text-xs">AE</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-2">
              <DropdownMenuLabel className="p-0">
                <div className="flex items-center gap-3 rounded-md px-2 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl}/>
                    <AvatarFallback className="text-sm">AE</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-5 truncate">Alex Evans</div>
                    <div className="text-xs text-muted-foreground truncate">alex.evans@fesc.edu</div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-2" onSelect={(e) => e.preventDefault()}>
                  <UserIcon className="h-4 w-4"/>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onSelect={(e) => {
            e.preventDefault();
            router.push("/settings");
        }}>
                  <SettingsIcon className="h-4 w-4"/>
                  Ajustes
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" className="gap-2" onSelect={(e) => {
            e.preventDefault();
            handleSignOut();
        }}>
                <LogOut className="h-4 w-4"/>
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r border-border bg-white dark:bg-background h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4">
            <div className="px-2 pb-3">
              <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Navegación
              </div>
            </div>

            <motion.nav initial="hidden" animate="show" variants={{
            hidden: {},
            show: {
                transition: {
                    staggerChildren: 0.04,
                    delayChildren: 0.02,
                },
            },
        }} className="relative space-y-1">
              {navigation
            .filter((item) => {
            if (permsLoading) {
                if (item.href === "/courses" || item.href === "/wellbeing")
                    return true;
                if (item.href === "/users" || item.href === "/settings")
                    return false;
                return true;
            }
            if (item.href === "/users" || item.href === "/settings")
                return hasRole("root");
            if (item.href === "/courses")
                return can("courses", "view");
            if (item.href === "/wellbeing")
                return can("wellbeing", "view");
            if (item.href === "/audit")
                return can("audit", "view");
            return true;
        })
            .map((item) => {
            const isActive = pathname === item.href;
            const isDisabledWhileLoading = permsLoading && (item.href === "/courses" || item.href === "/wellbeing");
            return (<motion.div key={item.name} variants={{
                    hidden: { opacity: 0, y: reduceMotion ? 0 : 6 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
                }}>
                    <Link href={item.href} aria-disabled={isDisabledWhileLoading} className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring/50 ${isDisabledWhileLoading ? "pointer-events-none opacity-60" : ""}`}>
                      
                      {isActive ? (<motion.span layoutId="sidebar-active" className="absolute inset-0 rounded-xl bg-primary/10" transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}/>) : null}

                      
                      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 ring-1 ring-border/60 transition-colors group-hover:bg-muted/60">
                        <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"} group-hover:text-foreground`}/>
                      </span>

                      <span className={`relative flex-1 ${isActive ? "text-primary" : "text-muted-foreground"} group-hover:text-foreground`}>
                        {item.name}
                      </span>

                      
                      {isActive ? (<motion.span initial={false} animate={{ opacity: 1, scale: 1 }} className="relative h-2 w-2 rounded-full bg-primary"/>) : (<span className="relative h-2 w-2 rounded-full bg-transparent"/>)}

                      
                      <motion.span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"/>
                    </Link>
                  </motion.div>);
        })}
            </motion.nav>

            <div className="mt-4 border-t border-border/60 pt-4 px-2">
              <div className="text-xs text-muted-foreground">
                Versión <span className="font-medium">0.1</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-muted/20">{children}</main>
      </div>
    </div>);
}
