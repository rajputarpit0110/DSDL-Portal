const initializeSchema = async (db) => {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        enrollment_number TEXT,
        branch TEXT,
        year INTEGER,
        role TEXT NOT NULL DEFAULT 'member',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS domains (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT,
        image_url TEXT,
        lead_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS member_profiles (
        user_id INTEGER PRIMARY KEY,
        profile_photo TEXT,
        phone TEXT,
        branch TEXT,
        year INTEGER,
        domain_id INTEGER,
        skills TEXT,
        bio TEXT,
        github TEXT,
        linkedin TEXT,
        joining_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        visibility TEXT DEFAULT 'public',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        date DATETIME,
        start_time TEXT,
        end_time TEXT,
        venue TEXT,
        online_link TEXT,
        organizer_id INTEGER,
        registration_deadline DATETIME,
        max_participants INTEGER,
        registration_required BOOLEAN DEFAULT 0,
        status TEXT DEFAULT 'draft',
        banner_image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS event_registrations (
        event_id INTEGER,
        user_id INTEGER,
        status TEXT DEFAULT 'REGISTERED',
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (event_id, user_id),
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        type TEXT DEFAULT 'NEWS',
        priority TEXT DEFAULT 'NORMAL',
        author_id INTEGER,
        status TEXT DEFAULT 'draft',
        published_at DATETIME,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        domain_id INTEGER,
        lead_id INTEGER,
        team_members TEXT,
        status TEXT DEFAULT 'PROPOSED',
        github_url TEXT,
        live_url TEXT,
        tags TEXT,
        banner_image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL,
        FOREIGN KEY (lead_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        domain_id INTEGER,
        leader_id INTEGER,
        status TEXT DEFAULT 'active',
        max_members INTEGER DEFAULT 10,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL,
        FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS team_memberships (
        team_id INTEGER,
        user_id INTEGER,
        role TEXT DEFAULT 'MEMBER',
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (team_id, user_id),
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS team_join_requests (
        team_id INTEGER,
        user_id INTEGER,
        status TEXT DEFAULT 'PENDING',
        message TEXT,
        requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (team_id, user_id),
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables initialized.');
  } catch (error) {
    console.error('Error initializing schema:', error);
    throw error;
  }
};

module.exports = { initializeSchema };
