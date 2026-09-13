import type { FaqItem } from "./faq";

export interface GermanyDetailContent {
  slug: "fsp" | "kp" | "approbation" | "facharzt";
  title: string;
  eyebrow: string;
  summary: string;
  keyFacts: { label: string; value: string }[];
  sections: { heading: string; paragraphs: string[] }[];
  faqs: FaqItem[];
}

export const GERMANY_DETAIL_CONTENT: Record<GermanyDetailContent["slug"], GermanyDetailContent> = {
  fsp: {
    slug: "fsp",
    title: "FSP Preparation",
    eyebrow: "Medical Licensing Pathway",
    summary:
      "The Fachsprachprüfung (FSP) tests whether you can communicate with patients and colleagues in medical German — not your medical knowledge itself.",
    keyFacts: [
      { label: "Format", value: "Patient interview, case documentation, doctor-to-doctor discussion" },
      { label: "Typical Prep Time", value: "About 6 weeks, after reaching German B2" },
      { label: "Administered By", value: "Regional medical chambers (Ärztekammer)" },
    ],
    sections: [
      {
        heading: "What the FSP Actually Tests",
        paragraphs: [
          "The FSP has three parts: a simulated patient interview (Anamnese), written case documentation based on that interview, and a doctor-to-doctor discussion (Arztbrief) presenting your findings to an examiner playing a colleague.",
          "It's graded on communication, not clinical accuracy — examiners want to see that you can build rapport with a patient, ask the right follow-up questions in German, and document clearly enough that another doctor could act on your notes.",
        ],
      },
      {
        heading: "How ApexMed Prepares You",
        paragraphs: [
          "The Gold Card's FSP module runs mock patient interviews on a rotating set of common presentations, timed documentation drills, and doctor-to-doctor discussion simulations with a mentor playing the examiner role.",
          "You also work through a bank of frequently-tested case types, so exam day is closer to a rehearsed routine than a first encounter with the format.",
        ],
      },
      {
        heading: "Common Reasons Candidates Don't Pass",
        paragraphs: [
          "Most failures aren't about medical German vocabulary — they're structural: missing a key question in the patient interview, disorganized documentation, or losing composure in the doctor-to-doctor discussion under time pressure. Structured, repeated practice is what fixes all three.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need to pass the FSP before or after the Kenntnisprüfung (KP)?",
        answer:
          "It depends on your qualification recognition path. Many candidates take the FSP first, since it's required regardless of which recognition route applies, and it also builds the medical German you'll need for the KP.",
      },
      {
        question: "What level of German do I need before starting FSP prep?",
        answer:
          "B2 is the practical minimum — the FSP module assumes you can already hold a general conversation and follow instructions; the focus is on medical-context language specifically, not general fluency.",
      },
      {
        question: "How many times can I retake the FSP if I don't pass?",
        answer:
          "Retake rules vary by Ärztekammer (regional medical chamber). We help you understand your specific chamber's policy as part of the Gold Card's licensing guidance.",
      },
    ],
  },
  kp: {
    slug: "kp",
    title: "KP Guidance",
    eyebrow: "Medical Licensing Pathway",
    summary:
      "The Kenntnisprüfung (KP) is a clinical knowledge exam for doctors whose qualification isn't automatically recognized in Germany — a practical, case-based assessment across major specialties.",
    keyFacts: [
      { label: "Format", value: "Oral clinical exam covering internal medicine, surgery, and an elective subject" },
      { label: "Typical Prep Time", value: "About 8 weeks, alongside or after FSP preparation" },
      { label: "Administered By", value: "Regional medical chambers (Ärztekammer)" },
    ],
    sections: [
      {
        heading: "What the KP Actually Tests",
        paragraphs: [
          "Unlike the FSP, the KP tests real clinical knowledge and reasoning — diagnosis, differential diagnosis, and treatment planning — conducted as an oral exam with real or simulated patients, in German.",
          "Most candidates are examined across internal medicine, surgery, and one additional subject of their choosing, so preparation needs to cover both content depth and the ability to reason through cases out loud, in your second language.",
        ],
      },
      {
        heading: "How ApexMed Prepares You",
        paragraphs: [
          "The Gold Card's KP guidance combines clinical case simulation with structured documentation practice, so you're rehearsing the exact skill being tested — reasoning through a case and explaining your thinking clearly in German — rather than just reviewing textbook knowledge you already have.",
        ],
      },
      {
        heading: "Who Actually Needs the KP",
        paragraphs: [
          "Not every candidate needs it — whether you need the KP depends on how your existing medical qualification is evaluated against German training requirements. Some candidates need only the FSP; others need both. We help you understand which applies to your specific qualification during profile assessment.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is the KP harder than the FSP?",
        answer:
          "They test different things — the FSP tests communication, the KP tests clinical knowledge and reasoning under exam conditions in German. Most candidates who've been practicing medicine find the clinical content familiar; the German-language reasoning under pressure is usually the harder part to prepare for.",
      },
      {
        question: "Can I choose which subjects I'm examined on?",
        answer:
          "Internal medicine and surgery are typically fixed; the third subject is usually your choice, often aligned with your existing specialty or the specialty you intend to pursue in Germany.",
      },
      {
        question: "What happens if I don't pass the KP?",
        answer:
          "Retake policies and any required additional training vary by Bundesland and by how many attempts you've had. We walk through your specific chamber's rules as part of licensing guidance.",
      },
    ],
  },
  approbation: {
    slug: "approbation",
    title: "Approbation",
    eyebrow: "Medical Licensing Pathway",
    summary:
      "Approbation is the full, unrestricted German medical license — the legal authorization to practice medicine independently in Germany.",
    keyFacts: [
      { label: "Applied To", value: "The State Ministry of Health (or delegated authority) of your Bundesland" },
      { label: "Requires", value: "Document recognition, language certificates, and FSP and/or KP as applicable" },
      { label: "Processing Time", value: "Varies by Bundesland, often several months" },
    ],
    sections: [
      {
        heading: "What Approbation Actually Is",
        paragraphs: [
          "Approbation is distinct from a temporary work permit (Berufserlaubnis) — it's the permanent, unrestricted license to practice medicine in Germany, and the goal most candidates on the medical pathway are ultimately working toward.",
          "It's granted at the state (Bundesland) level, which means requirements, document formats, and processing times genuinely differ depending on where you apply — there is no single national process.",
        ],
      },
      {
        heading: "The Document Checklist",
        paragraphs: [
          "A typical application includes your medical degree certificate, transcript of records, proof of good standing from your home licensing authority, a police clearance certificate, medical fitness certificate, language certificates, and — where applicable — your FSP/KP results. Every document usually needs certified translation.",
        ],
      },
      {
        heading: "How ApexMed Helps",
        paragraphs: [
          "The Green and Gold Cards include Zeugnisbewertung (qualification recognition) guidance, help selecting a Bundesland based on your profile and processing-time trends, and a document checklist and timeline tailored to your specific situation.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does it matter which Bundesland I apply in?",
        answer:
          "Yes — requirements, document formats, and typical processing times vary by state. We help you weigh these factors against your own priorities (family, job market, processing speed) during pathway planning.",
      },
      {
        question: "Can I work while my Approbation application is being processed?",
        answer:
          "Often yes, under a temporary Berufserlaubnis, though rules vary by Bundesland and by your specific circumstances — this is something we walk through case by case.",
      },
      {
        question: "How long does the whole process take from application to decision?",
        answer:
          "It varies significantly by state and by how complete your initial application is — incomplete or improperly translated documents are the most common cause of delay, which is why document preparation guidance matters as much as the exams themselves.",
      },
    ],
  },
  facharzt: {
    slug: "facharzt",
    title: "Facharzt",
    eyebrow: "Medical Licensing Pathway",
    summary:
      "Facharzt is specialist training — the multi-year stage after Approbation that leads to recognition as a specialist, such as Facharzt für Innere Medizin.",
    keyFacts: [
      { label: "Duration", value: "4–6 years, depending on the specialty" },
      { label: "Where", value: "As an Assistenzarzt (resident) at a teaching hospital" },
      { label: "Outcome", value: "The Facharzt title, and eligibility for senior/consultant roles" },
    ],
    sections: [
      {
        heading: "What Facharzt Training Involves",
        paragraphs: [
          "After Approbation, most doctors in Germany work as an Assistenzarzt while completing structured specialist training (Weiterbildung) in a chosen field — internal medicine, surgery, anesthesiology, and so on — each with its own defined curriculum and minimum duration set by the regional medical chamber.",
          "Training is logged against a structured requirements catalogue (Logbuch), and completion is confirmed by an oral specialist examination at the end.",
        ],
      },
      {
        heading: "Choosing a Specialty and a Hospital",
        paragraphs: [
          "The right specialty and hospital depend on your existing experience, the training reputation and capacity of individual departments, and practical factors like location and language environment. This is a decision worth making deliberately rather than accepting the first offer.",
        ],
      },
      {
        heading: "How ApexMed Supports This Stage",
        paragraphs: [
          "Facharzt guidance focuses on specialty selection, positioning your CV and application for Assistenzarzt roles, and understanding what a given department's training program actually looks like in practice — continuing the mentorship relationship well past Approbation.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need Approbation before I can start Facharzt training?",
        answer:
          "Yes — Facharzt (specialist) training builds on Approbation; it's not a substitute for it, and you can't begin structured specialist training without the full license already in place.",
      },
      {
        question: "Can I switch specialties partway through training?",
        answer:
          "It's possible, though rules on how much prior training carries over vary by chamber and by how closely related the two specialties are. It's a conversation worth having early rather than after years of training in one direction.",
      },
      {
        question: "Does ApexMed help with the Facharzt exam itself?",
        answer:
          "Our guidance at this stage is focused on getting you into the right training position and understanding the process — the exam preparation itself happens within your hospital's structured training program.",
      },
    ],
  },
};
