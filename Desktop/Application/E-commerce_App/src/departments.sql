-- 1. Create departments table
CREATE TABLE
    IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    );

-- 2. Insert unique department names from products
INSERT
    OR IGNORE INTO departments (name)
SELECT DISTINCT
    department
FROM
    products
WHERE
    department IS NOT NULL;

-- 3. Add department_id to products table and update with correct foreign key
ALTER TABLE products
ADD COLUMN department_id INTEGER;

UPDATE products
SET
    department_id = (
        SELECT
            id
        FROM
            departments
        WHERE
            departments.name = products.department
    );

-- 4. (Optional) Remove old department column if desired (SQLite does not support DROP COLUMN directly)
-- You may need to recreate the table if you want to drop the old column.
-- 5. Add foreign key constraint (requires table recreation in SQLite)
-- This is a reference for best practice:
-- FOREIGN KEY (department_id) REFERENCES departments(id)