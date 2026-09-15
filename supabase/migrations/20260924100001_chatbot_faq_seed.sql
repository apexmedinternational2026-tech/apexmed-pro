-- Starter knowledge base for the chatbot (Task 5) — wording mirrors each
-- service's own live summary/tagline (services table) rather than
-- introducing new claims, and avoids CLAUDE.md rule 9's guaranteed-outcome
-- language (admission/visa/licensing/publication) the same way the rest of
-- the site does, using "guidance"/"mentorship"/"preparation".

insert into chatbot_faqs (question, answer, keywords, category, is_starter, sort_order) values

('What services does ApexMed offer?',
 'ApexMed offers Research Services (original research, meta-analysis, CDC WONDER studies, medical writing), the German Medical Pathway (language, FSP, KP, Approbation guidance), the Germany Master''s Pathway, USMLE/PLAB/MRCP/AMC exam mentorship, an AI for Healthcare course, Mental Health Support, and the Green Earth climate initiative. You can browse all of them under the Services menu.',
 'services offer programs what do you do overview',
 'general', true, 1),

('How do I get started or apply?',
 'Each service page has an "Apply Now" button that opens a short application form, or you can use the Contact Us form to request a profile assessment. Our team reviews every submission and follows up directly.',
 'apply application start begin sign up register',
 'general', true, 2),

('How can I contact ApexMed directly?',
 'You can reach us by email at contact.apexmedinternational@gmail.com or on WhatsApp at +923165359859. There''s also a WhatsApp button on every page.',
 'contact email whatsapp phone number reach talk call',
 'general', true, 3),

('Tell me about the Research Services.',
 'ApexMed provides one-to-one mentorship through original research, meta-analysis, CDC WONDER database studies, and medical writing (manuscripts, case reports, narrative reviews). It''s built for doctors and medical students who want structured, mentored research experience.',
 'research meta-analysis meta analysis cdc wonder medical writing publication manuscript',
 'research', true, 4),

('Tell me about the German Medical Pathway.',
 'This is structured guidance through German language training, FSP and KP exam preparation, and the Approbation (German medical licensing) pathway for doctors relocating to Germany. Note: this is guidance and preparation support, not a guarantee of licensing or visa outcomes.',
 'germany german medical fsp kp approbation language pathway',
 'germany', true, 5),

('Tell me about the Germany Master''s Pathway.',
 'This pathway offers guidance through profile assessment, choosing a field of study, university applications, and visa preparation for a Master''s degree in Germany. It supports your application process; it does not guarantee university admission or visa approval.',
 'germany masters master degree university admission visa study',
 'germany', false, 6),

('What exam pathways do you support?',
 'ApexMed offers mentorship for USMLE (Step 1, Step 2 CK, Step 3), PLAB (PLAB 1, PLAB 2, GMC registration), MRCP (Part 1, Part 2 Written, PACES), and AMC (CAT MCQ, clinical/practical exams, AHPRA registration). Each pathway has its own page under Services with a full breakdown.',
 'usmle plab mrcp amc exam step licensing exams international',
 'exams', true, 7),

('What is the AI for Healthcare course?',
 'It''s a complete, self-paced course on artificial intelligence in healthcare — from AI fundamentals through real-world clinical applications — aimed at practising and future clinicians.',
 'ai artificial intelligence healthcare course clinicians machine learning',
 'education', false, 8),

('Do you offer mental health support?',
 'Yes — confidential, non-urgent counselling and peer support for healthcare professionals and students. This service is for non-urgent, day-to-day support. If you''re in crisis or need urgent help, please see the emergency resources listed on the Mental Health Support page rather than waiting for a chatbot reply.',
 'mental health counselling support stress wellbeing wellness crisis anxiety depression burnout',
 'support', false, 9),

('What is the Green Earth initiative?',
 'Green Earth is ApexMed''s climate and sustainability initiative — climate and health webinars, tree plantation drives, and sustainable healthcare advocacy that doctors and students can get involved with.',
 'green earth climate sustainability environment tree plantation',
 'general', false, 10),

('Is there a fee for your services?',
 'Fees vary by service. The best way to get accurate, current pricing for the specific program you''re interested in is to apply or contact our team directly — we''ll walk you through it.',
 'fee cost price how much payment charges',
 'general', false, 11),

('Do you guarantee admission, a visa, or a licensing outcome?',
 'No — ApexMed provides mentorship, guidance, and preparation support. We do not guarantee admission to any program or institution, visa issuance, employment, residency placement, medical licensing (Approbation), or publication. Outcomes depend on many factors outside our control.',
 'guarantee promise admission visa licensing approbation publication outcome',
 'general', false, 12),

('Who are ApexMed''s mentors?',
 'ApexMed is led by Dr. Nadir Akhtar (Founder & Research Lead) and Dr. Saqib Muhammad (Organizer), supported by a team of 20+ mentors across research, clinical practice, and the German pathways. You can see the full team on the About and Mentors pages.',
 'mentors team founder organizer who leads staff',
 'general', false, 13);
