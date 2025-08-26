CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar(255),
	"role" varchar(50) DEFAULT 'user',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
