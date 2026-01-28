import { CourseRepository } from "../ports/course-repository";
import { CreateCourseInput } from "../types/create-course-input";
export class CreateCourseUseCase {
    constructor(private readonly repo: CourseRepository) { }
    execute(input: CreateCourseInput) {
        return this.repo.create(input);
    }
}
