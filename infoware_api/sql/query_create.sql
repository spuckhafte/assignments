use infoware;

create table User (
	id int primary key unique,
	name varchar(64),
    job varchar(64),
    country varchar(4),
    phone varchar(10),
    email varchar(255),
    address varchar(255),
    city varchar(64),
    state varchar(64)
);

create table PEm (
	id int,
	pname varchar(64),
    pcountry varchar(4),
    pphone varchar(10),
    prelation varchar(64),
    foreign key (id) references User(id)
);

create table SEm (
	id int,
	sname varchar(64),
    scountry varchar(4),
    sphone varchar(10),
    srelation varchar(64),
    foreign key (id) references User(id)
);