CREATE schema if not exists users;
CREATE TABLE if not exists users.data(
  id integer primary key generated always AS identity,
  email varchar(255) unique not null,
  fname varchar(255) not null,
  lname varchar(255) not null,
  created_at timestamp not null,
  created_by integer references users.data(id)
);