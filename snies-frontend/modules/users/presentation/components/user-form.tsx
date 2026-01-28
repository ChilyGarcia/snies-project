"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { CreateUserInput } from "../../hooks/types/create-user-input";
interface UserFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserInput) => Promise<void>;
}
export function UserForm({ open, onClose, onSubmit }: UserFormProps) {
    const [newUser, setNewUser] = useState<CreateUserInput>({
        name: "",
        email: "",
        password: "",
    });
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit(newUser);
            setNewUser({ name: "", email: "", password: "" });
            onClose();
        }
        catch (error) {
            console.error(error);
            alert("Error creando el usuario");
        }
    };
    if (!open)
        return null;
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Crear Nuevo Usuario</CardTitle>
              <CardDescription className="mt-1">
                Complete los campos del formulario
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4"/>
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleCreateUser}>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Nombre completo" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="bg-muted/50" required/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="correo@ejemplo.com" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="bg-muted/50" required/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="********" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="bg-muted/50" required/>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 border-t pt-6 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-[#9c0f06] hover:bg-[#e30513]">
              Crear Usuario
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>);
}
