-- Dr. Saqib Muhammad (Founder & Chief Mentor) doesn't have his own photo
-- yet — per explicit confirmation, the Co-Founder's photo is reused here
-- as a temporary stand-in on both his home-page Founder Section and his
-- mentor page, to be replaced once his real photo is provided.
update mentors
set photo_url = 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-nadir-akhtar.png'
where slug = 'dr-saqib-muhammad';
