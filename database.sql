-- CREATE DATABASE "weekend_todo-app";

CREATE TABLE "todolist" (
  "id" SERIAL PRIMARY KEY,
  "task_title" VARCHAR(20) NOT NULL,
  "task_detail" VARCHAR(100) NOT NULL,
   "completed" BOOLEAN NOT NULL
);

INSERT INTO todolist ("task_title", "task_detail", "completed") 
VALUES ('Finish project', 'Add all the things', 'FALSE');

INSERT INTO todolist ("task_title", "task_detail", "completed") 
VALUES ('Holiday Preparations', 'Buy a tree. Put up lights. Find decorations from garage', 'TRUE');

INSERT INTO todolist ("task_title", "task_detail", "completed") 
VALUES ('Clean the house', 'Clean the garage. Vacuum. Empty the garbages. Fold clothes', 'TRUE');
