import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/faq";

export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="max-w-3xl">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`faq-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
