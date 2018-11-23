CREATE DATABASE "weekend-to-do-app";

CREATE TABLE "todolist" (
	"id" SERIAL PRIMARY KEY,
  "task_title" VARCHAR(50) NOT NULL,
  "task_detail" VARCHAR(200) NOT NULL,
	 "completed" BOOLEAN NOT NULL,
);

INSERT INTO todolist ("item", "completed") 
VALUES ('Finish project', 'TRUE');