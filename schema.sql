DROP TABLE IF EXISTS voter;
CREATE TABLE IF NOT EXISTS voter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  nim CHAR(10) UNIQUE NOT NULL,
  jurusan TEXT NOT NULL,
  nama TEXT NOT NULL,
  token CHAR(6) NOT NULL,
  has_voted BOOLEAN DEFAULT 0
);

DROP TABLE IF EXISTS sessions;
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS candidates;
CREATE TABLE IF NOT EXISTS candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  nim CHAR(10) UNIQUE NOT NULL,
  major TEXT NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  programme TEXT NOT NULL,
  video_url TEXT,
  photo_url TEXT,
  is_verified BOOLEAN DEFAULT 0,
  dapil INTEGER,
  category TEXT DEFAULT 'individual'
);

DROP TABLE IF EXISTS tickets;
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  president_id INTEGER NOT NULL,
  vice_id INTEGER NOT NULL,
  name TEXT,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  programme TEXT NOT NULL,
  video_url TEXT,
  photo_url TEXT,
  is_verified BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (president_id) REFERENCES candidates(id),
  FOREIGN KEY (vice_id) REFERENCES candidates(id),
  UNIQUE (president_id, vice_id)
);