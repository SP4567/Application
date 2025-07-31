CREATE TABLE
    products (
        id INTEGER PRIMARY KEY,
        cost REAL,
        category TEXT,
        name TEXT,
        brand TEXT,
        retail_price REAL,
        department TEXT,
        sku TEXT UNIQUE,
        distribution_center_id INTEGER
    );