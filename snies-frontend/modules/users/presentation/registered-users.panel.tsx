"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Search, UserPlus, Users } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CreateUserContainer } from "./create-user.container"
import { listUsersPaged } from "@/modules/roles/api/roles.api"
import type { PagedUsersResponse } from "@/modules/roles/api/roles.api"

function roleBadgeClass(role: string) {
  const r = (role ?? "").toLowerCase()
  if (r === "root") return "bg-primary text-primary-foreground"
  if (r.includes("director")) return "bg-blue-100 text-blue-700"
  if (r.includes("admin")) return "bg-purple-100 text-purple-700"
  return "bg-emerald-100 text-emerald-700"
}

export default function RegisteredUsersPanel() {
  const [openCreateUser, setOpenCreateUser] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersData, setUsersData] = useState<PagedUsersResponse | null>(null)

  const totalPages = usersData ? Math.max(1, Math.ceil(usersData.count / usersData.page_size)) : 1

  const loadUsers = useCallback(async () => {
    setUsersLoading(true)
    try {
      const res = await listUsersPaged(page, pageSize)
      setUsersData(res)
    } catch (e) {
      setUsersData(null)
      toast.error("No se pudieron cargar usuarios", { description: e instanceof Error ? e.message : "Error" })
    } finally {
      setUsersLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const list = usersData?.results ?? []
    if (!q) return list
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.role ?? "").toLowerCase().includes(q),
    )
  }, [usersData, searchQuery])

  return (
    <>
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
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Usuarios</h1>
                      <p className="text-sm text-muted-foreground">Listado y creación de usuarios.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-xs text-primary">
                      Solo root
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="hidden lg:block" />
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-border bg-card shadow-sm h-full">
                  <CardContent className="p-5 min-h-[92px] flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/12 ring-1 ring-primary/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{usersLoading ? "—" : usersData?.count ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Usuarios registrados</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-sm lg:col-span-2 h-full">
                  <CardContent className="p-5 min-h-[92px] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="relative w-full md:max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar por nombre, email o rol…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>
                    <Button
                      className="bg-primary hover:bg-primary/90 gap-2 w-full md:w-auto"
                      onClick={() => setOpenCreateUser(true)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Crear usuario
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border bg-card shadow-sm">
                <CardContent className="p-4 md:p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{usersLoading ? "Cargando…" : usersData ? `${usersData.count} total` : "Sin datos"}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={usersLoading || page <= 1}>
                        Anterior
                      </Button>
                      <span className="px-2">Página {page} de {totalPages}</span>
                      <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={usersLoading || page >= totalPages}>
                        Siguiente
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border overflow-hidden bg-card">
                    <Table>
                      <TableHeader className="bg-muted/25">
                        <TableRow>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rol</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usersLoading ? (
                          <TableRow>
                            <TableCell colSpan={3} className="p-6 text-sm text-muted-foreground">
                              Cargando usuarios…
                            </TableCell>
                          </TableRow>
                        ) : !usersData ? (
                          <TableRow>
                            <TableCell colSpan={3} className="p-6 text-sm text-muted-foreground">
                              No se pudo cargar la información.
                              <div className="mt-3">
                                <Button variant="outline" size="sm" onClick={() => loadUsers()}>
                                  Reintentar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="p-6 text-sm text-muted-foreground">
                              Sin resultados.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell>
                                <div className="flex items-center gap-3 min-w-0">
                                  <Avatar className="h-9 w-9">
                                    <AvatarFallback className="text-xs">
                                      {u.name
                                        .split(" ")
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((x) => x[0])
                                        .join("")
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0">
                                    <div className="font-semibold truncate">{u.name}</div>
                                    <div className="text-xs text-muted-foreground">#{u.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{u.email}</TableCell>
                              <TableCell>
                                <Badge className={`capitalize border border-border ${roleBadgeClass(u.role)}`}>
                                  {u.role}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <CreateUserContainer
        open={openCreateUser}
        onClose={() => {
          setOpenCreateUser(false)
          loadUsers()
        }}
      />
    </>
  )
}

