create table towns(
 id serial not null primary key,
 town text not null,
 reg_code text not null
 );

 create table reg_plates(
 id serial not null primary key,
 reg_number text not null,
 town_id int,
 foreign key (town_id) references towns(id)
 );
