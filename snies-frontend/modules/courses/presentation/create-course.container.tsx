"use client";
import { CourseApi } from "@/modules/courses/api/course.api";
import { CreateCourseUseCase } from "@/modules/courses/hooks/use-cases/create-course.usecase";
import { CreateCourseInput } from "@/modules/courses/hooks/types/create-course-input";
import { CourseForm } from "../presentation/course-form";
import { toast } from "sonner";
import { ApiValidationError, formatValidationDetails } from "@/shared/api/api-errors";
interface Props {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}
export function CreateCourseContainer({ open, onClose, onCreated }: Props) {
    const courseRepo = new CourseApi();
    const createCourseUseCase = new CreateCourseUseCase(courseRepo);
    const handleSubmit = async (data: CreateCourseInput) => {
        try {
            await createCourseUseCase.execute(data);
            toast.success("Curso creado", { description: `${data.name} (${data.code})` });
            onCreated?.();
        }
        catch (err) {
            if (err instanceof ApiValidationError) {
                toast.error(err.message || "Error de validación", {
                    description: (<div className="whitespace-pre-line">
              {formatValidationDetails(err.details)}
            </div>),
                });
            }
            else {
                toast.error("No se pudo crear el curso", {
                    description: err instanceof Error ? err.message : "Error inesperado",
                });
            }
            throw err;
        }
    };
    return (<CourseForm open={open} onClose={onClose} onSubmit={handleSubmit}/>);
}
