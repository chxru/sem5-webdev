-- @block create stats schema
create schema if not exists stats;

-- @block create beds table
create table if not exists stats.beds(
  id integer primary key,
  pid integer references patients.info(id),
  bid integer references patients.bedtickets(id)
);