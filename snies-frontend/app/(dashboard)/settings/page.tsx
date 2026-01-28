"use client";
import { useEffect, useMemo, useState } from "react";
import { PermissionGuard } from "@/modules/auth/presentation/permission-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { assignRoleToUser, createRole, getRolePermissions, listRoles, listUsersPaged, updateRolePermissions, } from "@/modules/roles/api/roles.api";
import type { Role, RolePermissionRowApi } from "@/modules/roles/types/role";
import { Settings } from "lucide-react";
const MODULES: Array<RolePermissionRowApi["module"]> = ["courses", "wellbeing"];
function emptyPermissions(): RolePermissionRowApi[] {
    return MODULES.map((m) => ({
        module: m,
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false,
    }));
}
export default function SettingsPage() {
    return (<PermissionGuard requireRoot>
      <div className="w-full">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute -bottom-40 right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#111_1px,transparent_1px)] [background-size:18px_18px]" />
          </div>

          <div className="container mx-auto px-4 md:px-8 lg:px-20 py-6 md:py-10 space-y-8">
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-border bg-card p-4 md:p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-primary/10 ring-1 ring-primary/15 shadow-xs flex items-center justify-center">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        Administración
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Gestión de roles, permisos y asignaciones de usuarios.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-xs text-primary">
                      Solo root
                    </span>
                  </div>
                </div>
              </div>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr] items-start">
              <Card className="border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Panel</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    Gestiona la configuración desde las pestañas.
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                    <div className="text-xs font-semibold text-foreground">Consejo</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Selecciona un rol para editar permisos. Los cambios reemplazan la configuración del rol.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-sm">
                <CardContent className="p-4 md:p-5">
                  <AdminTabs />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </div>
      </div>
    </PermissionGuard>);
}
function AdminTabs() {
    return (<Tabs defaultValue="roles" className="space-y-6">
      <TabsList className="w-full sm:w-fit">
        <TabsTrigger value="roles">Roles & permisos</TabsTrigger>
        <TabsTrigger value="users">Usuarios</TabsTrigger>
      </TabsList>
      <TabsContent value="roles" className="space-y-6">
        <RolesPanel />
      </TabsContent>
      <TabsContent value="users" className="space-y-6">
        <UsersPanel />
      </TabsContent>
    </Tabs>);
}
function RolesPanel() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [permissions, setPermissions] = useState<RolePermissionRowApi[]>(emptyPermissions());
    const [saving, setSaving] = useState(false);
    const selectedRole = useMemo(() => roles.find((r) => r.id === selectedRoleId) ?? null, [roles, selectedRoleId]);
    async function reloadRoles() {
        setLoading(true);
        try {
            const list = await listRoles();
            setRoles(list);
            if (!selectedRoleId && list.length)
                setSelectedRoleId(list[0].id);
        }
        catch (e) {
            toast.error("No se pudieron cargar roles", { description: e instanceof Error ? e.message : "Error" });
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        reloadRoles();
    }, []);
    useEffect(() => {
        async function loadPerms() {
            if (!selectedRoleId)
                return;
            try {
                const rows = await getRolePermissions(selectedRoleId);
                const map = new Map(rows.map((r) => [r.module, r]));
                setPermissions(MODULES.map((m) => map.get(m) ?? { module: m, can_view: false, can_create: false, can_edit: false, can_delete: false }));
            }
            catch (e) {
                toast.error("No se pudieron cargar permisos", { description: e instanceof Error ? e.message : "Error" });
            }
        }
        loadPerms();
    }, [selectedRoleId]);
    const toggle = (module: RolePermissionRowApi["module"], key: keyof Omit<RolePermissionRowApi, "module">) => {
        setPermissions((prev) => prev.map((row) => (row.module === module ? { ...row, [key]: !row[key] } : row)));
    };
    const save = async () => {
        if (!selectedRoleId)
            return;
        setSaving(true);
        try {
            await updateRolePermissions(selectedRoleId, permissions);
            toast.success("Permisos actualizados", { description: selectedRole ? selectedRole.name : undefined });
        }
        catch (e) {
            toast.error("No se pudieron guardar permisos", { description: e instanceof Error ? e.message : "Error" });
        }
        finally {
            setSaving(false);
        }
    };
    return (<div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Roles</CardTitle>
          <CreateRoleDialog onCreated={reloadRoles}/>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (<div className="text-sm text-muted-foreground">Cargando...</div>) : roles.length === 0 ? (<div className="text-sm text-muted-foreground">No hay roles</div>) : (<div className="space-y-2">
              {roles.map((r) => {
                const active = r.id === selectedRoleId;
                return (<button key={r.id} onClick={() => setSelectedRoleId(r.id)} className={`w-full text-left rounded-xl border px-3 py-3 transition ${active ? "border-primary/40 bg-primary/10" : "border-border hover:bg-muted/40"}`}>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.description}</div>
                  </button>);
            })}
            </div>)}
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <CardTitle>Permisos {selectedRole ? `— ${selectedRole.name}` : ""}</CardTitle>
            <div className="text-xs text-muted-foreground">Configura qué puede hacer este rol por módulo.</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <Table>
              <TableHeader className="bg-muted/25">
                <TableRow>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Ver</TableHead>
                  <TableHead>Crear</TableHead>
                  <TableHead>Editar</TableHead>
                  <TableHead>Eliminar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((row) => (<TableRow key={row.module}>
                    <TableCell className="font-medium capitalize">{row.module}</TableCell>
                    <TableCell>
                      <Checkbox checked={row.can_view} onCheckedChange={() => toggle(row.module, "can_view")}/>
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={row.can_create} onCheckedChange={() => toggle(row.module, "can_create")}/>
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={row.can_edit} onCheckedChange={() => toggle(row.module, "can_edit")}/>
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={row.can_delete} onCheckedChange={() => toggle(row.module, "can_delete")}/>
                    </TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Los cambios reemplazan la configuración del rol.
            </div>
            <Button onClick={save} disabled={!selectedRoleId || saving} className="bg-primary hover:bg-primary/90">
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);
}
function CreateRoleDialog({ onCreated }: {
    onCreated: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const submit = async () => {
        setSaving(true);
        try {
            await createRole({ name, description });
            toast.success("Rol creado");
            setOpen(false);
            setName("");
            setDescription("");
            onCreated();
        }
        catch (e) {
            toast.error("No se pudo crear el rol", { description: e instanceof Error ? e.message : "Error" });
        }
        finally {
            setSaving(false);
        }
    };
    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Crear rol
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear rol</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="oficina_gestion"/>
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Oficina de gestión"/>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={saving || !name.trim()}>
            {saving ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
function UsersPanel() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Awaited<ReturnType<typeof listUsersPaged>> | null>(null);
    async function load() {
        setLoading(true);
        try {
            const [rolesList, users] = await Promise.all([listRoles(), listUsersPaged(page, pageSize)]);
            setRoles(rolesList);
            setData(users);
        }
        catch (e) {
            toast.error("No se pudieron cargar usuarios", { description: e instanceof Error ? e.message : "Error" });
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
    }, [page]);
    const totalPages = data ? Math.max(1, Math.ceil(data.count / data.page_size)) : 1;
    const assign = async (userId: number, roleId: number) => {
        try {
            await assignRoleToUser(userId, roleId);
            toast.success("Rol asignado");
            await load();
        }
        catch (e) {
            toast.error("No se pudo asignar rol", { description: e instanceof Error ? e.message : "Error" });
        }
    };
    return (<Card className="border-border shadow-sm bg-card">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <CardTitle>Usuarios</CardTitle>
          <div className="text-xs text-muted-foreground">Listado paginado (solo root) y asignación de roles.</div>
        </div>
        <div className="text-sm text-muted-foreground">{data ? `${data.count} total` : ""}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (<div className="text-sm text-muted-foreground">Cargando...</div>) : !data ? (<div className="text-sm text-muted-foreground">Sin datos</div>) : (<>
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <Table>
                <TableHeader className="bg-muted/25">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead className="text-right">Asignar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.results.map((u) => (<TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="capitalize">{u.role}</TableCell>
                      <TableCell className="text-right">
                        <Select onValueChange={(v) => assign(u.id, Number(v))}>
                          <SelectTrigger className="w-56 ml-auto bg-background">
                            <SelectValue placeholder="Cambiar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((r) => (<SelectItem key={r.id} value={String(r.id)}>
                                {r.name}
                              </SelectItem>))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Página {page} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  Siguiente
                </Button>
              </div>
            </div>
          </>)}
      </CardContent>
    </Card>);
}
