"use client";
import { LoginForm } from "@/modules/auth/presentation/login-form";
import { LoginService } from "@/modules/auth/hooks/services/login.service";
import { AuthApi } from "@/modules/auth/api/auth.api";
import { motion, useReducedMotion } from "framer-motion";
export default function LoginPage() {
    const loginService = new LoginService(new AuthApi());
    const reduceMotion = useReducedMotion();
    const handleLogin = async (data: {
        email: string;
        password: string;
    }) => {
        try {
            await loginService.execute(data.email, data.password);
            window.location.href = "/dashboard";
        }
        catch (error) {
            console.error("Error de login:", error);
            alert(error instanceof Error ? error.message : "Credenciales incorrectas");
        }
    };
    return (<div className="min-h-screen flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 bg-linear-to-b from-white via-red-50 to-white">
          
          <div className="pointer-events-none fixed inset-0">
            <motion.div initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-red-200/40 blur-3xl"/>
            <motion.div initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }} className="absolute -bottom-40 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-gray-200/50 blur-3xl"/>
            <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#111_1px,transparent_1px)] [background-size:18px_18px]"/>
          </div>

          <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }} className="relative w-full">
            <LoginForm onSubmit={handleLogin}/>
          </motion.div>
        </div>);
}
