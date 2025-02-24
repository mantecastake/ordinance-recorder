-- supabase/migrations/202502230001_init.sql
CREATE TABLE wards (
    id INT PRIMARY KEY,
    ward TEXT NOT NULL,
    ordinance_goal INT,
    CONSTRAINT ordinance_goal_non_negative CHECK (ordinance_goal >= 0)
);

CREATE TABLE ordinance_history (
    id INT PRIMARY KEY,
    ward_id INT REFERENCES wards(id),
    date TIMESTAMP NOT NULL default NOW(),
    quantity INT,
    CONSTRAINT quantity_positive CHECK (quantity > 0)
);

CREATE VIEW ward_ordinances AS
    SELECT w.id, w.ward, w.ordinance_goal, COALESCE(SUM(oh.quantity)) AS ordinances_performed
    FROM wards w
    LEFT JOIN ordinance_history oh ON w.id = oh.ward_id
    GROUP BY w.id;