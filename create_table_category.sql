create table category (
	id serial not null primary key,
	name varchar(60) not null unique,
	created_date timestamp not null default current_timestamp,
	updated_date timestamp not null default current_timestamp
);