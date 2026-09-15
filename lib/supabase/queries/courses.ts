import { createPublicClient } from "../public";
import { DatabaseQueryError, NotFoundError } from "../errors";
import type { Tables } from "../database.types";

export type CourseLesson = Pick<Tables<"course_lessons">, "id" | "lesson_number" | "title" | "topics" | "sort_order">;

export type CourseModule = Pick<
  Tables<"course_modules">,
  "id" | "module_number" | "title" | "key_takeaway" | "sort_order"
> & {
  lessons: CourseLesson[];
};

export type CourseDetail = Tables<"courses"> & {
  disclaimerBody: string | null;
  modules: CourseModule[];
};

interface RawCourseDetail extends Tables<"courses"> {
  disclaimer: Pick<Tables<"compliance_disclaimers">, "body"> | null;
  modules: (Pick<Tables<"course_modules">, "id" | "module_number" | "title" | "key_takeaway" | "sort_order"> & {
    lessons: Pick<Tables<"course_lessons">, "id" | "lesson_number" | "title" | "topics" | "sort_order">[];
  })[];
}

export async function getCourseBySlug(slug: string): Promise<CourseDetail> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("courses")
    .select<string, RawCourseDetail>(
      `
      *,
      disclaimer:compliance_disclaimers(body),
      modules:course_modules(
        id, module_number, title, key_takeaway, sort_order,
        lessons:course_lessons(id, lesson_number, title, topics, sort_order)
      )
      `,
    )
    .eq("slug", slug)
    .order("sort_order", { referencedTable: "modules", ascending: true })
    .order("sort_order", { referencedTable: "modules.lessons", ascending: true })
    .maybeSingle();

  if (error) {
    throw new DatabaseQueryError(`Failed to load course "${slug}".`, { table: "courses", originalError: error });
  }

  if (!data) {
    throw new NotFoundError(`Course "${slug}" was not found or is not published.`);
  }

  const { disclaimer, ...course } = data;

  return {
    ...course,
    disclaimerBody: disclaimer?.body ?? null,
  };
}
