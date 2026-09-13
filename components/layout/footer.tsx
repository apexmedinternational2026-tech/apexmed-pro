import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/supabase/queries/site-settings";
import { PROFILE_ASSESSMENT_HREF } from "@/lib/navigation";
import type { Json } from "@/lib/supabase/database.types";
import type { NavLink } from "@/lib/navigation";

function asString(value: Json | undefined): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

const PROGRAM_LINKS: NavLink[] = [
  { label: "ApexMed Research Card", href: "/programs/apexmed-research-card" },
  { label: "Master Meta-Analysis Card", href: "/programs/master-meta-analysis-card" },
  { label: "CDC Specialist Card", href: "/programs/cdc-specialist-card" },
  { label: "All Programs", href: "/programs" },
];

const GERMANY_LINKS: NavLink[] = [
  { label: "Blue Card", href: "/programs/blue-card" },
  { label: "Green Card", href: "/programs/green-card" },
  { label: "Gold Card", href: "/programs/gold-card" },
  { label: "Medical Pathway", href: "/germany" },
  { label: "Approbation", href: "/germany/approbation" },
];

const COMPANY_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Our Mentors", href: "/mentors" },
  { label: "All Services", href: "/services" },
  { label: "Master's Admissions", href: "/masters" },
  { label: "Blog", href: "/blog" },
  { label: "Webinars", href: "/webinars" },
  { label: "Testimonials", href: "/testimonials" },
];

/**
 * Server Component. site_settings is fetched here (not passed from a
 * client, not fetched client-side) — the contact details and social links
 * a visitor sees always reflect the database, never a stale client bundle.
 */
export async function Footer() {
  const settings = await getSiteSettings();

  const email = asString(settings.contact_email);
  const whatsapp = asString(settings.contact_whatsapp_number);

  const socials = (
    [
      { label: "Facebook", href: asString(settings.social_facebook_url) },
      { label: "Instagram", href: asString(settings.social_instagram_url) },
      { label: "LinkedIn", href: asString(settings.social_linkedin_url) },
      { label: "YouTube", href: asString(settings.social_youtube_url) },
    ] satisfies { label: string; href: string | null }[]
  ).filter((social): social is { label: string; href: string } => social.href !== null);

  return (
    <footer className="border-t border-navy-800/60 bg-navy-950 text-paper-50">
      <Container className="pt-16">
        <Link
          href="/"
          className="group flex w-fit items-center gap-2.5 font-display text-display-md font-bold text-paper-50"
        >
          <Image
            src="/images/logo-icon.png"
            alt=""
            width={36}
            height={30}
            className="h-8 w-auto transition-transform duration-200 group-hover:scale-110"
          />
          <span className="transition-colors group-hover:text-gold-300">ApexMed</span>{" "}
          <span className="text-gold-400 transition-colors group-hover:text-gold-300">International</span>
        </Link>
      </Container>

      <Container className="grid grid-cols-2 gap-x-8 gap-y-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <FooterColumn title="Programs" links={PROGRAM_LINKS} />
        <FooterColumn title="Germany" links={GERMANY_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />

        <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
          <h3 className="text-body-sm font-semibold uppercase tracking-wide text-gold-400">Contact</h3>
          <ul className="flex flex-col gap-2 text-body-sm text-paper-50/80">
            {email && (
              <li>
                <a href={`mailto:${email}`} className="transition-colors hover:text-paper-50">
                  {email}
                </a>
              </li>
            )}
            {whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-paper-50"
                >
                  {whatsapp} (WhatsApp)
                </a>
              </li>
            )}
          </ul>

          {socials.length > 0 && (
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-body-sm text-paper-50/70 transition-colors hover:text-gold-400"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <Link
            href={PROFILE_ASSESSMENT_HREF}
            className="mt-1 inline-flex w-fit items-center rounded-md bg-gold-500 px-4 py-2 text-body-sm font-medium text-navy-950 transition-colors hover:bg-gold-400"
          >
            Book a Free Profile Assessment
          </Link>
        </div>
      </Container>

      <div className="border-t border-navy-800/60">
        <Container className="flex flex-col gap-3 py-6 text-caption text-paper-50/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl">
            ApexMed International provides educational mentorship and guidance. We do not guarantee admission, visa
            issuance, employment, residency placement, medical licensing (Approbation), or publication outcomes.
          </p>
          <div className="flex items-center gap-4">
            <p>&copy; {new Date().getFullYear()} ApexMed International. All rights reserved.</p>
            <Link href="/admin/login" className="text-paper-50/50 transition-colors hover:text-paper-50/80">
              Staff Login
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-body-sm font-semibold uppercase tracking-wide text-gold-400">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-body-sm text-paper-50/80 transition-colors hover:text-paper-50">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
