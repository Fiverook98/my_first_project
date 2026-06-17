--Creazione delle tabelle
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  birthdate DATE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  tags TEXT[],
  author VARCHAR(50) NOT NULL,
  cover_image VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reply_count INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Inserimento di un utente amministratore
INSERT INTO users (username, password, role, birthdate)
VALUES (
  'admin',
  'admin123@@',
  'admin',
  '1990-01-01'
)
ON CONFLICT (username) DO NOTHING;

-- Inserimento di alcuni post di esempio (solo se non esistono già)
INSERT INTO posts (title, content, author, user_id, tags)
SELECT 
  'Benvenuto nel Mini Blog',
  'Questo è il primo post del nostro mini blog creato con Angular e Node.js!',
  'admin',
  u.id,
  ARRAY['welcome', 'blog', 'angular']
FROM users u 
WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO posts (title, content, author, user_id, tags)
SELECT 
  'Tutorial Docker',
  'Come configurare un ambiente di sviluppo con Docker e PostgreSQL...',
  'admin',
  u.id,
  ARRAY['docker', 'tutorial', 'devops']
FROM users u 
WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;