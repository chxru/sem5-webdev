-- @block create schema
create schema if not exists users;

-- @block create users.data
create table if not exists users.data(
  id integer primary key generated always as identity,
  email varchar(255) unique not null,
  fname varchar(255) not null,
  lname varchar(255) not null,
  created_at TIMESTAMPTZ not null default now(),
  updated_at TIMESTAMPTZ not null default now(),
  created_by integer references users.data(id)
);

-- @block create users.schema
create table if not exists users.auth(
  id integer references users.data(id),
  username varchar(255) primary key,
  pwd varchar(255) not null
);

-- @block create user.tokens to store refresh tokens
create table if not exists users.tokens(
  id integer references users.data(id),
  -- TODO: check for performance adv when using varchar(n) vs text here
  token text not null,
  expires TIMESTAMP not null,
  blacklisted boolean not null default false
);

-- @block create complex index for user.tokens
create index if not exists id_token_idx on users.tokens (id, token);