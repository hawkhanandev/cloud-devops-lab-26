-- Run this file once to set up your database table
-- Usage: psql -U <your_user> -d expenses_tracker -f db/init.sql

CREATE TABLE IF NOT EXISTS expenses (
  id        SERIAL PRIMARY KEY,
  title     VARCHAR(100)    NOT NULL,
  amount    DECIMAL(10, 2)  NOT NULL,
  category  VARCHAR(50)     NOT NULL DEFAULT 'General',
  date      DATE            NOT NULL DEFAULT CURRENT_DATE,
  note      TEXT
);

-- Seed some sample data so you can test right away
INSERT INTO expenses (title, amount, category, date, note) VALUES
  ('Lunch at cafeteria',  5.50,  'Food',      CURRENT_DATE,       'Rice and curry'),
  ('Bus fare',            1.25,  'Transport', CURRENT_DATE,       'To university'),
  ('Notebook',            3.00,  'Stationery',CURRENT_DATE - 1,  '200 pages'),
  ('Netflix',            15.00,  'Entertainment', CURRENT_DATE - 2, 'Monthly sub'),
  ('Groceries',          22.80,  'Food',      CURRENT_DATE - 3,  'Weekly shop');
