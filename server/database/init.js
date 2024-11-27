import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const client = createClient({
  url: 'file:database.sqlite',
});

export async function initializeDatabase() {
  try {
    // Create users table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'director', 'profesor')) NOT NULL,
        phone_number TEXT,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create settings table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        institution_name TEXT NOT NULL,
        setup_completed BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if setup is completed
    const settings = await client.execute('SELECT setup_completed FROM settings LIMIT 1');
    return {
      setupRequired: !settings.rows.length || !settings.rows[0].setup_completed
    };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function completeSetup(setupData) {
  const { institutionName, adminName, email, password } = setupData;

  try {
    await client.transaction(async (tx) => {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin user
      await tx.execute(`
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, 'admin')
      `, [adminName, email, hashedPassword]);

      // Update settings
      await tx.execute(`
        INSERT INTO settings (institution_name, setup_completed)
        VALUES (?, TRUE)
      `, [institutionName]);
    });

    return true;
  } catch (error) {
    console.error('Setup completion error:', error);
    throw error;
  }
}

export function getClient() {
  return client;
}