-- supabase/seed.sql
INSERT INTO wards (id, ward, ordinance_goal) VALUES
     (1, 'First Ward', 100),
     (2, 'Second Ward', 50);

INSERT INTO ordinance_history (id, ward_id, date, quantity) VALUES
    (1, 1, NOW() - INTERVAL '1 day', 5),
    (2, 1, NOW(), 10),
    (3, 2, NOW(), 3);