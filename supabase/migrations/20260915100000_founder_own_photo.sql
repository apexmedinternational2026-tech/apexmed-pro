-- Dr. Saqib Muhammad's own real photo is now available — replaces the
-- temporary stand-in from 20260914100000_founder_photo_shared.sql (which
-- reused the Co-Founder's photo under his name). No longer sharing one
-- photo between two named mentors.
update mentors
set photo_url = 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-saqib-muhammad.jpg'
where slug = 'dr-saqib-muhammad';
