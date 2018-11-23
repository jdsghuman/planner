CREATE DATABASE "weekend_todo-app";

CREATE TABLE "todolist" (
	"id" SERIAL PRIMARY KEY,
  "task_title" VARCHAR(50) NOT NULL,
  "task_detail" VARCHAR(200) NOT NULL,
	 "completed" BOOLEAN NOT NULL,
);

INSERT INTO todolist ("task_title" "task_detail", "completed") 
VALUES ('Finish project', "Add all the things" 'FALSE');