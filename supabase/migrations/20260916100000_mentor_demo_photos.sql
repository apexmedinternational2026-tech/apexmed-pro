-- Demo/placeholder portraits for the mentors still without a real photo —
-- randomuser.me (free, no-copyright placeholder photos), not actual photos
-- of these real-named mentors. Added per explicit confirmation after
-- flagging that trade-off: replace each with the mentor's real photo as it
-- becomes available.
update mentors set photo_url = 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-shanza-gul.jpg' where slug = 'dr-shanza-gul';
update mentors set photo_url = 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-faiza-kiran.jpg' where slug = 'dr-faiza-kiran';
update mentors set photo_url = 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-haris-khan.jpg' where slug = 'dr-haris-khan';
update mentors set photo_url = 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-muratza.jpg' where slug = 'dr-muratza';
update mentors set photo_url = 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-alia.jpg' where slug = 'dr-alia';
update mentors set photo_url = 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-waheed-alam.jpg' where slug = 'dr-waheed-alam';

-- dr-ahmar-shamim also got a demo photo (live DB only — this row was
-- added via the admin panel after this project's seed.sql was written, so
-- it doesn't exist there to update).
update mentors set photo_url = 'https://qorpimkeqevgokygftfa.supabase.co/storage/v1/object/public/media/mentor-photos/dr-ahmar-shamim.jpg' where slug = 'dr-ahmar-shamim';
