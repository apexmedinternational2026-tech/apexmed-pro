import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramForEditAdmin } from "@/lib/supabase/queries/admin/programs";
import { listDisclaimersAdmin } from "@/lib/supabase/queries/admin/disclaimers";
import { NotFoundError } from "@/lib/supabase/errors";
import { ProgramForm } from "@/components/admin/program/program-form";
import { ModulesEditor } from "@/components/admin/program/modules-editor";
import { LabelListEditor } from "@/components/admin/program/label-list-editor";
import { JourneyStepsEditor } from "@/components/admin/program/journey-steps-editor";
import {
  createAudienceAction,
  updateAudienceAction,
  deleteAudienceAction,
  reorderAudiencesAction,
} from "@/lib/actions/admin/programs";

export const metadata: Metadata = {
  title: "Edit Program — ApexMed Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface ProgramEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProgramEditPage({ params }: ProgramEditPageProps) {
  const { id } = await params;

  let program;
  try {
    program = await getProgramForEditAdmin(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const disclaimers = await listDisclaimersAdmin();

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <div>
        <p className="text-caption font-semibold uppercase tracking-wide text-slate-500">{program.family.name}</p>
        <h1 className="font-display text-display-lg text-ink-900">{program.name}</h1>
      </div>

      <section className="rounded-xl border border-navy-800/10 bg-white p-6">
        <h2 className="mb-4 font-display text-display-sm text-ink-900">Details</h2>
        <ProgramForm program={program} disclaimers={disclaimers} />
      </section>

      <section className="rounded-xl border border-navy-800/10 bg-white p-6">
        <h2 className="mb-1 font-display text-display-sm text-ink-900">Modules</h2>
        <p className="mb-4 text-body-sm text-slate-500">
          Drag to reorder. Click a module to manage its checklist items.
        </p>
        <ModulesEditor programId={program.id} programSlug={program.slug} modules={program.modules} />
      </section>

      <section className="rounded-xl border border-navy-800/10 bg-white p-6">
        <h2 className="mb-1 font-display text-display-sm text-ink-900">Audiences</h2>
        <p className="mb-4 text-body-sm text-slate-500">Who this Card is for — shown on the public program page.</p>
        <LabelListEditor
          items={program.audiences.map((audience) => ({ id: audience.id, label: audience.label }))}
          parentId={program.id}
          parentIdField="program_id"
          programSlug={program.slug}
          addLabel="New audience"
          emptyLabel="No audiences yet."
          createAction={createAudienceAction}
          updateAction={updateAudienceAction}
          deleteAction={deleteAudienceAction}
          reorderAction={reorderAudiencesAction}
        />
      </section>

      <section className="rounded-xl border border-navy-800/10 bg-white p-6">
        <h2 className="mb-1 font-display text-display-sm text-ink-900">Journey steps</h2>
        <p className="mb-4 text-body-sm text-slate-500">
          The enrollment-to-outcome path shown on the public program page.
        </p>
        <JourneyStepsEditor programId={program.id} programSlug={program.slug} steps={program.journeySteps} />
      </section>
    </div>
  );
}
