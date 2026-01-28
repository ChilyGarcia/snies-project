# 🎓 SNIES Frontend

Frontend de la plataforma **SNIES** desarrollado con **Next.js**, **React**, **TypeScript** y **TailwindCSS**.  
Este proyecto consume la API del backend para autenticación, gestión de cursos y visualización de datos.

---

## 🚀 Tecnologías

- ⚛️ Next.js (App Router)
- ⚛️ React + TypeScript
- 🎨 TailwindCSS + shadcn/ui
- 🔐 Autenticación con JWT / Cookies

---

## 📦 Requisitos

- Node.js >= 18
- pnpm (recomendado) o npm
- Backend SNIES corriendo

---

## ⚙️ Instalación

```bash
git clone https://github.com/Valen1509/snies-frontend.git
cd snies-frontend
pnpm install
pnpm run dev
```

## 🔧 Variables de entorno

Este frontend necesita la URL base del backend en `NEXT_PUBLIC_API_URL`.

- **Ejemplo**: copia `env.local.example` a `.env.local` y ajusta el host/puerto de tu backend.

### Windows (PowerShell)

```powershell
Copy-Item env.local.example .env.local
```

### Windows (CMD)

```bat
copy env.local.example .env.local
```

Luego **reinicia** el servidor de desarrollo:```bash
pnpm run dev
