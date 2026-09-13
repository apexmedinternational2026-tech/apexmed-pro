-- Links the real Co-Founder photo the client provided (uploaded to the
-- `media` storage bucket at mentor-photos/dr-nadir-akhtar.png — see
-- MentorCard's photo_url ? <Image> : <initials avatar> fallback) to Dr.
-- Nadir Akhtar's mentor row. Confirmed this is the right mentor before
-- uploading: his bio in this row (BS Zoology Quaid-i-Azam, M.Phil at KIT
-- Baden-Württemberg) matches the client's brief word-for-word.

update mentors
set photo_url = 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-nadir-akhtar.png'
where slug = 'dr-nadir-akhtar';
