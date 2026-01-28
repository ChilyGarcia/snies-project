import { CourseRepository } from "../hooks/ports/course-repository";
import { CreateCourseInput } from "../hooks/types/create-course-input";
import { Course } from "../types/course";
import { requireApiUrl } from "@/shared/config/api";
import { ApiValidationError } from "@/shared/api/api-errors";
import { getToken } from "@/shared/utils/storage";
export class CourseApi implements CourseRepository {
    async list(): Promise<Course[]> {
        const token = getToken();
        if (!token)
            throw new Error("No hay token de autenticación");
        const res = await fetch(`${requireApiUrl()}/api/courses/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status === 401)
            throw new Error("No autenticado");
        if (!res.ok) {
            let msg = "No se pudieron cargar cursos";
            try {
                const err = await res.json();
                msg = err.detail || err.message || msg;
            }
            catch {
            }
            throw new Error(msg);
        }
        return await res.json();
    }
    async create(input: CreateCourseInput): Promise<Course> {
        const token = getToken();
        if (!token)
            throw new Error("No hay token de autenticación");
        const res = await fetch(`${requireApiUrl()}/api/courses/create/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(input),
        });
        if (!res.ok) {
            let msg = "Error creando curso";
            try {
                const err = await res.json();
                if (err?.error && typeof err.error === "object") {
                    throw new ApiValidationError(err.message || "Validation Error", err.error, res.status);
                }
                msg = err.detail || err.message || msg;
            }
            catch (e) {
                if (e instanceof ApiValidationError)
                    throw e;
            }
            throw new Error(msg);
        }
        return await res.json();
    }
}
