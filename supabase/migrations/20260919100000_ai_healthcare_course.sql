-- "Introduction to AI For Medical Healthcare Practitioners" — full course
-- content as supplied, with PART 0.2's corrections applied while seeding
-- (not as a separate pass after): every clinical accuracy percentage and
-- every third-party AI-tool price is replaced with the brief's own
-- prescribed non-numeric language, or removed outright where no safe
-- replacement applies (a price is just gone, not reworded — it goes stale
-- regardless of wording).

insert into courses (slug, title, tagline, description, format_label, certification_label, disclaimer_key, is_published, sort_order) values (
  'ai-for-healthcare',
  'Introduction to AI For Medical Healthcare Practitioners',
  'Master Artificial Intelligence in Healthcare — From Fundamentals to Real-World Applications',
  'The most comprehensive AI course designed specifically for medical doctors and healthcare professionals. Artificial Intelligence is transforming medicine — from diagnosing diseases to discovering drugs to predicting patient outcomes. This course takes you from "What is AI?" to confidently using AI tools in your medical work, whether you''re a clinician, researcher, administrator, or educator.',
  'Complete online course (lifetime access)',
  'Certificate of Completion included',
  'education_only',
  true,
  1
);

with c as (select id from courses where slug = 'ai-for-healthcare'),
m1 as (
  insert into course_modules (course_id, module_number, title, key_takeaway, sort_order)
  select id, 1, 'AI Fundamentals for Healthcare Professionals', 'Understanding fundamentals without math or coding.', 1 from c returning id
)
insert into course_lessons (module_id, lesson_number, title, topics, sort_order)
select m1.id, '1.1', 'What is Artificial Intelligence?', array[
  'Definition of AI', 'Brief history of AI (1950s to present)', 'Why AI matters in healthcare now',
  'Common AI myths vs reality', 'AI vs human intelligence (differences and similarities)'
], 1 from m1
union all
select m1.id, '1.2', 'How Does AI Actually Work?', array[
  'The basic concept: learning from data', 'Algorithm basics explained simply', 'Training vs testing vs deployment',
  'Supervised vs unsupervised learning', 'Neural networks demystified', 'Why AI needs data to learn'
], 2 from m1
union all
select m1.id, '1.3', 'Types of AI', array[
  'Narrow AI (what we have today)', 'General AI (what''s theoretical)', 'Super AI (science fiction)',
  'Current state: all AI is narrow', 'Why this matters for healthcare'
], 3 from m1
union all
select m1.id, '1.4', 'AI vs Machine Learning vs Deep Learning vs Generative AI', array[
  'Clear definitions', 'How they differ', 'Relationship between them', 'Real examples in healthcare'
], 4 from m1
union all
select m1.id, '1.5', 'Why Healthcare Needs AI', array[
  'Healthcare challenges AI addresses', 'Volume of data in healthcare', 'Complexity of medical problems',
  'Cost considerations', 'Supporting improved patient outcomes'
], 5 from m1;

with c as (select id from courses where slug = 'ai-for-healthcare'),
m2 as (
  insert into course_modules (course_id, module_number, title, key_takeaway, sort_order)
  select id, 2, 'Machine Learning in Healthcare', 'Understanding which ML tool for which healthcare problem.', 2 from c returning id
)
insert into course_lessons (module_id, lesson_number, title, topics, sort_order)
select m2.id, '2.1', 'Machine Learning Basics', array[
  'What machine learning is', 'How it differs from traditional programming', 'Learning from examples',
  'Patterns in data', 'Making predictions'
], 1 from m2
union all
select m2.id, '2.2', 'Supervised Learning', array[
  'Learning from labeled data', 'Classification (disease/no disease)', 'Regression (predicting values)',
  'Real healthcare examples', 'When to use supervised learning'
], 2 from m2
union all
select m2.id, '2.3', 'Unsupervised Learning', array[
  'Finding patterns without labels', 'Clustering (grouping similar patients)', 'Dimensionality reduction',
  'Healthcare applications', 'Example: patient segmentation'
], 3 from m2
union all
select m2.id, '2.4', 'Key ML Algorithms Explained', array[
  'Decision trees', 'Random forests', 'Support vector machines', 'Naive Bayes', 'K-means clustering',
  'When to use each, with real medical examples'
], 4 from m2
union all
select m2.id, '2.5', 'Machine Learning in Medical Diagnosis', array[
  'Predicting diseases from patient data', 'Identifying high-risk patients', 'Prognosis prediction',
  'Treatment response prediction', 'Real-world case studies'
], 5 from m2
union all
select m2.id, '2.6', 'ML in Drug Discovery', array[
  'Predicting drug effectiveness', 'Chemical compound analysis', 'Accelerating research timelines',
  'Examples from pharmaceutical research'
], 6 from m2
union all
select m2.id, '2.7', 'Evaluating ML Models', array[
  'Accuracy, sensitivity, specificity', 'Confusion matrices', 'ROC curves (simplified)',
  'Why accuracy isn''t everything', 'Clinical relevance vs statistical significance'
], 7 from m2;

with c as (select id from courses where slug = 'ai-for-healthcare'),
m3 as (
  insert into course_modules (course_id, module_number, title, key_takeaway, sort_order)
  select id, 3, 'Deep Learning & Neural Networks', 'Understanding deep learning''s power for complex medical problems.', 3 from c returning id
)
insert into course_lessons (module_id, lesson_number, title, topics, sort_order)
select m3.id, '3.1', 'Neural Networks Explained Simply', array[
  'Inspired by the brain', 'Neurons and connections', 'Layers (input, hidden, output)',
  'How learning happens', 'Backpropagation (simplified)'
], 1 from m3
union all
select m3.id, '3.2', 'Deep Learning Basics', array[
  'What makes learning "deep"', 'Many layers = deep learning', 'Why depth matters',
  'Computing power requirements', 'Healthcare applications'
], 2 from m3
union all
select m3.id, '3.3', 'Convolutional Neural Networks (CNNs)', array[
  'Designed for images', 'Medical imaging applications', 'X-ray, CT, and MRI analysis', 'How CNNs "see" images'
], 3 from m3
union all
select m3.id, '3.4', 'Recurrent Neural Networks (RNNs)', array[
  'Designed for sequences', 'Time-series data', 'Electronic health records',
  'Predicting patient deterioration', 'Clinical applications'
], 4 from m3
union all
select m3.id, '3.5', 'Transformers & Attention Mechanisms', array[
  'A revolutionary architecture', 'Powers ChatGPT and Claude', 'Processing language',
  'Healthcare applications', 'Clinical notes analysis'
], 5 from m3
union all
select m3.id, '3.6', 'Deep Learning in Medical Imaging', array[
  'Radiology AI', 'Pathology AI', 'Retinal imaging', 'Clinical implementation challenges'
], 6 from m3
union all
select m3.id, '3.7', 'Deep Learning in Research', array[
  'Accelerating discovery', 'Finding patterns humans miss', 'Predicting protein structures',
  'Drug design', 'Gene expression analysis'
], 7 from m3;

with c as (select id from courses where slug = 'ai-for-healthcare'),
m4 as (
  insert into course_modules (course_id, module_number, title, key_takeaway, sort_order)
  select id, 4, 'Large Language Models & Generative AI', 'Mastering ChatGPT and Claude for medical work.', 4 from c returning id
)
insert into course_lessons (module_id, lesson_number, title, topics, sort_order)
select m4.id, '4.1', 'What are Large Language Models (LLMs)?', array[
  'Definition and characteristics', 'How they learn language', 'Scale (billions of parameters)',
  'Training data (internet-scale)', 'Capabilities and limitations'
], 1 from m4
union all
select m4.id, '4.2', 'Transformer Architecture (The Tech Behind ChatGPT)', array[
  'Self-attention mechanism', 'Parallel processing', 'Why transformers are powerful', 'Scaling laws'
], 2 from m4
union all
select m4.id, '4.3', 'How LLMs Generate Text', array[
  'Predicting the next token/word', 'Probability distributions', 'Temperature and randomness',
  'Sampling strategies', 'Why outputs vary'
], 3 from m4
union all
select m4.id, '4.4', 'ChatGPT (OpenAI)', array[
  'What ChatGPT is', 'Training process', 'Capability differences across model versions',
  -- Pricing removed per PART 0.2 — a stale third-party price on a live
  -- site "looks careless"; the brief's own words, applied here too.
  'Capabilities and limitations in medicine', 'How to use it effectively'
], 4 from m4
union all
select m4.id, '4.5', 'Claude (Anthropic)', array[
  'Who built Claude', 'How Claude differs from ChatGPT', 'Strengths (reasoning, long documents)',
  'Medical applications', 'How to use it effectively'
], 5 from m4
union all
select m4.id, '4.6', 'Other Important AI Models', array[
  'Google Gemini', 'Llama (Meta)', 'Mistral (open-source)', 'Specialized medical models',
  'Which to use for different tasks'
], 6 from m4
union all
select m4.id, '4.7', 'Generative AI Capabilities', array[
  'Text generation', 'Image generation', 'Code generation', 'Summarization', 'Translation',
  'Question answering', 'Content creation'
], 7 from m4
union all
select m4.id, '4.8', 'Generative AI in Healthcare', array[
  'Clinical note generation', 'Literature summarization', 'Research article writing',
  'Hypothesis generation', 'Teaching and patient education materials', 'Administrative documentation'
], 8 from m4
union all
select m4.id, '4.9', 'Prompt Engineering for Healthcare', array[
  'How to ask AI the right questions', 'Specificity matters', 'Context setting',
  'Examples and few-shot learning', 'Chain-of-thought prompting', 'Getting better results'
], 9 from m4
union all
select m4.id, '4.10', 'Limitations & Hallucinations', array[
  'What hallucinations are', 'When LLMs make things up', 'Medical misinformation risk',
  'How to verify AI outputs', 'When not to trust AI', 'Safety considerations'
], 10 from m4;

with c as (select id from courses where slug = 'ai-for-healthcare'),
m5 as (
  insert into course_modules (course_id, module_number, title, key_takeaway, sort_order)
  select id, 5, 'Practical AI Tools for Healthcare Professionals', 'Practical, immediately applicable AI tools for your work.', 5 from c returning id
)
insert into course_lessons (module_id, lesson_number, title, topics, sort_order)
select m5.id, '5.1', 'ChatGPT for Medical Professionals', array[
  'Clinical: differential diagnosis assistance, patient education materials, clinical note writing',
  'Research: literature summarization, hypothesis generation, manuscript writing help',
  'Administrative: email drafting, report writing, documentation',
  'A practical demo of real healthcare queries and their limitations'
], 1 from m5
union all
select m5.id, '5.2', 'Claude for Medical Research', array[
  'Why Claude for research: longer context window, careful reasoning, strong synthesis',
  'Research-specific uses: analyzing whole papers, comparing studies, identifying literature gaps',
  'Advantages over other tools for serious, long-document research work'
], 2 from m5
union all
select m5.id, '5.3', 'Google Gemini for Healthcare', array[
  'Similar capabilities to ChatGPT, with Google Workspace integration',
  'Image analysis and multimodal (text, image, video) capabilities',
  'Medical applications: document processing, research assistance', 'When to choose Gemini vs other tools'
], 3 from m5
union all
select m5.id, '5.4', 'Specialized Medical AI Tools', array[
  'Medical literature: PubMed AI search, summarization, citation tools',
  'Clinical diagnosis: symptom checkers, differential diagnosis aids, risk calculators',
  'Imaging: radiology, pathology, dermatology, ECG analysis tools',
  'Drug discovery: protein structure prediction, candidate screening',
  'EHR: AI-powered documentation and clinical decision support'
], 4 from m5
union all
select m5.id, '5.5', 'Coding with AI (GitHub Copilot, Claude Code)', array[
  'For data analysis: Python code, statistical automation, visualization',
  'For web development: research dashboards, clinical decision support tools',
  'For research: bioinformatics, genomic analysis, clinical trial data analysis'
], 5 from m5
union all
select m5.id, '5.6', 'AI for Medical Education', array[
  'Creating study materials: practice questions, flashcards, summaries',
  'Personalized learning: adapting to student level, identifying weak areas',
  'Interactive learning: simulations, case discussions, board-style questions'
], 6 from m5
union all
select m5.id, '5.7', 'Real-World Examples & Use Cases', array[
  'A researcher using AI to structure and write a first manuscript',
  'A clinician using AI for literature review and patient education materials',
  'A data scientist using AI to explore data and draft analysis code',
  'An administrator using AI to streamline documentation and reporting'
], 7 from m5;

with c as (select id from courses where slug = 'ai-for-healthcare'),
m6 as (
  insert into course_modules (course_id, module_number, title, key_takeaway, sort_order)
  select id, 6, 'AI in Medical Research', 'AI as a research accelerator and method, not a replacement.', 6 from c returning id
)
insert into course_lessons (module_id, lesson_number, title, topics, sort_order)
select m6.id, '6.1', 'AI Accelerating Research', array[
  'Literature review: reading widely, identifying key findings and contradictions',
  'Hypothesis generation from published research and novel connections',
  'Study design: methodology and sample-size guidance',
  'Data analysis: pattern discovery, statistical tests, visualization',
  'Manuscript writing and publication support'
], 1 from m6
union all
select m6.id, '6.2', 'AI in Drug Discovery', array[
  'How AI can speed up target identification and lead compound screening',
  'Supporting clinical trial design and patient identification',
  'Notable examples: AI-assisted drug candidates entering trials, protein structure prediction tools'
], 2 from m6
union all
select m6.id, '6.3', 'AI in Clinical Trials', array[
  'Patient recruitment: identifying eligible patients, predicting adherence',
  'Adaptive trials: adjusting design in real time based on interim results',
  'Outcome prediction: identifying likely responders vs non-responders',
  'Adverse event detection through pattern recognition'
], 3 from m6
union all
select m6.id, '6.4', 'AI for Data Analysis in Research', array[
  'Pattern discovery across many more variables than manual review allows',
  'Predictive modeling and automatic validation', 'Feature importance to focus research'
], 4 from m6
union all
select m6.id, '6.5', 'Natural Language Processing (NLP) in Research', array[
  'Clinical notes analysis: extracting structured data and lab values',
  'Literature mining: extracting facts and relationships across papers',
  'Social media / real-world evidence: patient experience and safety signals'
], 5 from m6
union all
select m6.id, '6.6', 'Medical Imaging AI for Research', array[
  'Quantifying features assessed subjectively today', 'Tracking progression over time',
  'Radiomics and precision medicine applications', 'Digital pathology: whole slide image analysis'
], 6 from m6
union all
select m6.id, '6.7', 'Challenges & Limitations', array[
  'Data quality: biased or missing data leads to biased or incomplete results',
  'Interpretability: understanding why an AI reached a given output',
  'Validation: generalizing from in-house data to external populations',
  'Ethics, bias, and regulatory considerations'
], 7 from m6;

with c as (select id from courses where slug = 'ai-for-healthcare'),
m7 as (
  insert into course_modules (course_id, module_number, title, key_takeaway, sort_order)
  select id, 7, 'AI in Clinical Practice', 'AI as a clinical tool, not a replacement for clinical judgment.', 7 from c returning id
)
insert into course_lessons (module_id, lesson_number, title, topics, sort_order)
select m7.id, '7.1', 'Diagnosis Support', array[
  'How AI assists diagnosis: analyzing patient data against large case sets',
  'Augmenting, not replacing, physician judgment', 'Symptom checkers, differential diagnosis generators, risk scores'
], 1 from m7
union all
select m7.id, '7.2', 'Medical Imaging AI', array[
  -- Specific accuracy percentages removed per PART 0.2 — replaced with the
  -- brief's own prescribed non-numeric language rather than uncited figures.
  'AI models have demonstrated strong performance in retinal screening and chest imaging in published studies, with results varying by population, equipment and study design',
  'Detecting abnormalities and measuring structures precisely', 'Monitoring changes over time',
  'Clinical role: reducing interpretation time and prioritizing urgent cases, not replacing radiologists'
], 2 from m7
union all
select m7.id, '7.3', 'Patient Risk Prediction', array[
  'Predicting risk of heart attack, sepsis, hospital readmission, and disease progression',
  'Analyzing patient data to identify high-risk patients for early intervention',
  'Clinical use: intensive monitoring, early treatment, resource allocation'
], 3 from m7
union all
select m7.id, '7.4', 'Treatment Recommendation', array[
  'Personalized medicine based on genetic factors, disease characteristics, and history',
  'Example: analyzing tumor genetics to inform specific treatment options'
], 4 from m7
union all
select m7.id, '7.5', 'Clinical Decision Support', array[
  'Reminders about drug interactions and preventive measures', 'Alerts to abnormal results',
  'Recommending evidence-based treatments', 'Integration into EHR and ordering systems with real-time alerts'
], 5 from m7
union all
select m7.id, '7.6', 'Documentation Assistance', array[
  'Voice-to-note: the doctor talks, AI drafts a structured clinical note for review',
  'Aims to reduce charting burden and give more time with patients',
  'Commercial ambient-documentation tools are an active, fast-moving space'
], 6 from m7
union all
select m7.id, '7.7', 'Patient Monitoring', array[
  'Continuous monitoring via wearables and home devices', 'Predicting deterioration for early intervention',
  'AI-assisted telemedicine: symptom analysis and assessment guidance'
], 7 from m7;

with c as (select id from courses where slug = 'ai-for-healthcare'),
m8 as (
  insert into course_modules (course_id, module_number, title, key_takeaway, sort_order)
  select id, 8, 'AI Ethics, Bias & Challenges', 'Understanding AI''s real limitations before relying on it clinically.', 8 from c returning id
)
insert into course_lessons (module_id, lesson_number, title, topics, sort_order)
select m8.id, '8.1', 'AI Bias in Healthcare', array[
  'Types of bias: training data, algorithm, measurement, and selection bias',
  'Real documented examples of AI underperforming for underrepresented populations',
  'Consequences: worsened health disparities, undermined trust, unfair treatment',
  'Mitigations: diverse training data, testing across populations, diverse teams, ongoing evaluation'
], 1 from m8
union all
select m8.id, '8.2', 'Privacy & Data Security', array[
  'AI needs data to learn, and medical data is sensitive',
  'Approaches: federated learning, differential privacy, encryption, proper governance',
  'Regulatory context: HIPAA, GDPR, and a growing compliance landscape'
], 2 from m8
union all
select m8.id, '8.3', 'Interpretability & Explainability', array[
  'The "black box" problem in deep learning', 'Why doctors need to understand why, not just what',
  'Explainable AI approaches (SHAP, LIME, attention visualization)',
  'The trade-off between model power and interpretability'
], 3 from m8
union all
select m8.id, '8.4', 'Validation & Generalization', array[
  'Why a model trained at one hospital can fail at another',
  'Different patient populations, equipment, and disease prevalence',
  'The need for external, multi-center validation before deployment'
], 4 from m8
union all
select m8.id, '8.5', 'Accountability & Liability', array[
  'Open questions: who is responsible when an AI recommendation contributes to harm',
  'Legal and regulatory frameworks are still developing',
  'Why this remains an active, unresolved area of medical AI governance'
], 5 from m8;
