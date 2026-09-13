import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About ApexMed International",
  description:
    "The story and mission behind ApexMed International — research training, publication mentorship, German language pathways, and Master's admissions support for doctors and medical students.",
  alternates: { canonical: absoluteUrl("/about") },
};

const BREADCRUMB_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

const WHAT_WE_DO = [
  "Practical research training from methodology to publication",
  "Medical writing and publication guidance",
  "FCPS and PMDC research support",
  "German language and medical licensing pathway guidance",
  "Germany Master's admissions support",
];

export default function AboutPage() {
  return (
    <>
      <Section theme="navy" padding="lg" noise className="pt-32">
        <Container className="flex flex-col gap-4">
          <Breadcrumbs items={BREADCRUMB_ITEMS} tone="dark" />
          <p className="text-eyebrow uppercase text-gold-400">About ApexMed International</p>
          <h1 className="max-w-2xl font-display text-display-xl text-paper-50">
            Built by mentors who&apos;ve made this journey themselves.
          </h1>
        </Container>
      </Section>

      <Section theme="light" padding="lg">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-4">
            <p className="text-eyebrow uppercase text-gold-500">Our Story</p>
            <h2 className="font-display text-display-lg text-ink-900">
              A research journey that started in first-year medical school.
            </h2>
            <p className="text-body-md text-ink-900">
              ApexMed International was founded by Dr. Saqib Muhammad, MBBS from Kabir Medical College Peshawar,
              affiliated with Gandhara University. His research journey began during the first year of medical
              school and developed into a strong academic and research career, including publications in national
              and international PubMed-indexed journals, meta-analyses, and original research using CDC-based
              datasets.
            </p>
            <p className="text-body-md text-ink-900">
              ApexMed was created to make practical research education, publication guidance, mentorship, and
              international education and career pathways more accessible to medical students, doctors,
              researchers, and healthcare professionals worldwide.
            </p>
            <Link
              href="/mentors"
              className="mt-1 w-fit font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-2 hover:decoration-navy-900"
            >
              Meet our mentors →
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 rounded-2xl border border-navy-800/10 bg-white p-7">
              <div>
                <h3 className="font-display text-display-sm text-ink-900">Mission</h3>
                <p className="mt-2 text-body-sm text-slate-500">
                  To transform medical careers through quality education, research mentorship, publication support,
                  and international pathway guidance.
                </p>
              </div>
              <div>
                <h3 className="font-display text-display-sm text-ink-900">Vision</h3>
                <p className="mt-2 text-body-sm text-slate-500">
                  A world where every doctor has access to world-class medical education, research training,
                  publication opportunities, and international career guidance.
                </p>
              </div>
            </div>
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
              <Image
                src="/images/logo-full.jpg"
                alt="ApexMed International logo"
                fill
                sizes="360px"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="white" padding="lg">
        <Container>
          <p className="text-eyebrow uppercase text-gold-500">What We Do</p>
          <h2 className="mt-2 max-w-2xl font-display text-display-lg text-ink-900">
            Everything a career-building doctor needs, in one place.
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WHAT_WE_DO.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-navy-800/10 bg-paper-50 p-5 text-body-md text-ink-900"
              >
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold-500" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
