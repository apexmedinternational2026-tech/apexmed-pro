"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { CourseModule } from "@/lib/supabase/queries/courses";

/**
 * Client Component wrapping Radix's Accordion, but the module/lesson data
 * itself is passed in already-fetched from the (Server Component) page —
 * this file owns only the collapse/expand interactivity. Radix keeps
 * AccordionContent's children in the rendered DOM even while collapsed
 * (CSS-collapsed, not unmounted) — the same pattern MobileNav already
 * relies on — so every lesson's topic list is present in the server-
 * rendered HTML regardless of open/closed state. That matters here
 * specifically: this curriculum list is the page's entire SEO value, and
 * conditionally rendering it only when expanded would make it invisible
 * to a crawler that doesn't execute JS.
 */
export function CourseCurriculum({ modules }: { modules: CourseModule[] }) {
  return (
    <Accordion type="single" collapsible className="flex flex-col">
      {modules.map((module) => (
        <AccordionItem key={module.id} value={module.id}>
          <AccordionTrigger>
            <span className="flex items-baseline gap-3 text-left">
              <span className="text-body-sm font-semibold" style={{ color: "var(--accent-text)" }}>
                {String(module.module_number).padStart(2, "0")}
              </span>
              <span>{module.title}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-5 pl-9">
              {module.key_takeaway && (
                <p className="text-body-sm font-medium text-slate-500">Key takeaway: {module.key_takeaway}</p>
              )}
              {module.lessons.map((lesson) => (
                <div key={lesson.id}>
                  <h4 className="text-body-md font-semibold text-ink-900">
                    {lesson.lesson_number && (
                      <span style={{ color: "var(--accent-text)" }}>{lesson.lesson_number} </span>
                    )}
                    {lesson.title}
                  </h4>
                  {lesson.topics.length > 0 && (
                    <ul className="mt-1.5 flex flex-col gap-1">
                      {lesson.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2 text-body-sm text-slate-500">
                          <span className="mt-2 h-1 w-1 flex-none rounded-full bg-slate-400" aria-hidden="true" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
