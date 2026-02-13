const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(process.cwd(), 'pharmacy.db');
const db = new Database(dbPath);

console.log('Initializing database at', dbPath);

// Create Tables
const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('customer', 'pharmacy-owner')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pharmacies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    lat REAL,
    lng REAL,
    phone TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pharmacy_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    is_available BOOLEAN DEFAULT 1,
    FOREIGN KEY(pharmacy_id) REFERENCES pharmacies(id)
  );
`;

db.exec(schema);

// Seed Data
const seed = async () => {
    const userCount = db.prepare('SELECT count(*) as count FROM users').get();
    if (userCount.count > 0) {
        console.log('Database already seeded.');
        return;
    }

    console.log('Seeding data...');
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Pharmacy Owner
    const insertUser = db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)');
    const ownerResult = insertUser.run('owner@pharmacy.com', password, 'pharmacy-owner');
    const ownerId = ownerResult.lastInsertRowid;

    // 2. Create Pharmacy Profile
    const insertPharmacy = db.prepare('INSERT INTO pharmacies (user_id, name, address, lat, lng, phone) VALUES (?, ?, ?, ?, ?, ?)');
    const pharmacyResult = insertPharmacy.run(ownerId, 'City Pharmacy', '123 Main St', 24.7136, 46.6753, '0501234567');
    const pharmacyId = pharmacyResult.lastInsertRowid;

    // 3. Add Medicines
    const insertMedicine = db.prepare('INSERT INTO medicines (pharmacy_id, name, description, price, is_available) VALUES (?, ?, ?, ?, ?)');
    insertMedicine.run(pharmacyId, 'Panadol', 'Pain reliever', 15.50, 1);
    insertMedicine.run(pharmacyId, 'Aspirin', 'Blood thinner', 20.00, 1);
    insertMedicine.run(pharmacyId, 'Vitamin C', 'Immunity booster', 35.00, 0);

    // 4. Create Customer User
    insertUser.run('customer@gmail.com', password, 'customer');

    console.log('Seeding complete!');
};

seed();
