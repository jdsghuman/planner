CREATE DATABASE "weekend-to-do-app";

CREATE TABLE "todolist" (
	"id" SERIAL PRIMARY KEY,
  "item" VARCHAR(300) NOT NULL,
	 "completed" BOOLEAN NOT NULL,
);