"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
type Props = {
    onSubmit: (data: {
        email: string;
        password: string;
    }) => Promise<void>;
};
export function LoginForm({ onSubmit }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const reduceMotion = useReducedMotion();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await onSubmit({ email, password });
        }
        finally {
            setIsLoading(false);
        }
    };
    const stagger = {
        hidden: { opacity: 1 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.08,
            },
        },
    };
    const item = {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
    };
    return (<div className="mx-auto flex w-full max-w-5xl items-center justify-center">
      <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full overflow-hidden rounded-3xl border border-black/5 bg-white/70 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="grid md:grid-cols-2">
        
        <div className="bg-white p-8 sm:p-10 md:p-12">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
            <motion.div variants={item} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/10">
                  <img src="/logo-fesc.png" alt="FESC" className="h-7 w-7 object-contain"/>
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-gray-900">Repositorio de actividades  FESC</div>
                  <div className="text-xs text-gray-500">Portal de acceso</div>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Iniciar sesión</h1>
                <p className="text-sm text-gray-600">
                  Ingresa tus credenciales institucionales para acceder al sistema.
                </p>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={item} className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                  Email institucional
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input id="email" type="email" placeholder="nombre@institucion.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-10 bg-white" autoComplete="email" disabled={isLoading} required/>
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-10 bg-white" autoComplete="current-password" disabled={isLoading} required/>
                </div>
              </motion.div>

              <motion.div variants={item}>
                <Button type="submit" disabled={isLoading} aria-busy={isLoading} className={`w-full h-12 rounded-xl shadow-sm ${isLoading ? "bg-gray-400 hover:bg-gray-400 disabled:opacity-100" : "bg-primary hover:bg-primary/90"}`}>
                  {isLoading ? <Loader2 className="animate-spin"/> : null}
                  {isLoading ? "Cargando..." : "Login"}
                </Button>
              </motion.div>

              <motion.p variants={item} className="text-xs text-gray-500">
                Al continuar aceptas las políticas internas de uso del sistema.
              </motion.p>
            </form>
          </motion.div>
        </div>

        
        <motion.div initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }} className="relative hidden md:flex items-center justify-center bg-linear-to-br from-primary via-primary/90 to-primary/80 p-10">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full translate-x-20 translate-y-20"></div>
          </div>

          <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-center">
              <img src="/login.jpg" alt="Login illustration" className="w-full h-auto rounded-2xl shadow-lg ring-1 ring-white/15"/>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-full p-4 shadow-xl">
              <Lock className="w-6 h-6 text-primary"/>
            </div>

          </div>
        </motion.div>
        </div>
      </motion.div>
    </div>);
}
