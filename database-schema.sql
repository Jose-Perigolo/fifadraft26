-- FIFA Draft 2026 Database Schema
-- Run this in Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  hasChangedPassword BOOLEAN DEFAULT false,
  isLoggedIn BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create drafts table
CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT 'FIFA Draft 2026',
  currentTurn INTEGER DEFAULT 0,
  round INTEGER DEFAULT 1,
  totalRounds INTEGER DEFAULT 16,
  isComplete BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create picks table
CREATE TABLE IF NOT EXISTS picks (
  id TEXT PRIMARY KEY,
  round INTEGER NOT NULL,
  pickOrder INTEGER NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  userId TEXT NOT NULL,
  draftId TEXT NOT NULL,
  playerId INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (draftId) REFERENCES drafts(id) ON DELETE CASCADE,
  UNIQUE(draftId, playerId)
);

-- Create formations table
CREATE TABLE IF NOT EXISTS formations (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  draftId TEXT NOT NULL,
  formation TEXT DEFAULT '4-4-2',
  positions JSONB NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (draftId) REFERENCES drafts(id) ON DELETE CASCADE,
  UNIQUE(userId, draftId)
);

-- Create draft participants relationship table
CREATE TABLE IF NOT EXISTS _DraftParticipants (
  A TEXT NOT NULL,
  B TEXT NOT NULL,
  FOREIGN KEY (A) REFERENCES drafts(id) ON DELETE CASCADE,
  FOREIGN KEY (B) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(A, B)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_picks_userId ON picks(userId);
CREATE INDEX IF NOT EXISTS idx_picks_draftId ON picks(draftId);
CREATE INDEX IF NOT EXISTS idx_formations_userId ON formations(userId);
CREATE INDEX IF NOT EXISTS idx_formations_draftId ON formations(draftId);
