/*
SET UP SQL SCRIPT:
  - All tables necessary for storage in a Postgres Database
*/


CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT false,
  port INT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  provider_id VARCHAR(255) NOT NULL,
  provider_type VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  token_type VARCHAR(255),
  scope TEXT,
  id_token TEXT,
  session_state TEXT
);

CREATE TABLE verification_tokens (
  identifier VARCHAR(255) PRIMARY KEY,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE auth_sessions (
  id SERIAL PRIMARY KEY,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  session_token TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id)
);