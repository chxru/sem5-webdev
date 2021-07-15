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
-- @block create trigger to update user.data on change
create trigger onUpdate before
update on users.data for each row execute procedure update_timestamp();