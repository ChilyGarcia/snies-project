import { Course } from "../../types/course";
import { CreateCourseInput } from "../types/create-course-input";
export interface CourseRepository {
    list(): Promise<Course[]>;
    create(input: CreateCourseInput): Promise<Course>;
}
