-- CREATE DATABASE "weekend-todo-app";

CREATE TABLE "todolist" (
  "id" SERIAL PRIMARY KEY,
  "task_title" VARCHAR(20) NOT NULL,
  "task_detail" VARCHAR(100) NOT NULL,
   "completed" BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO todolist ("task_title", "task_detail", "completed") 
VALUES ('Finish project', 'Add all the things', 'FALSE');

INSERT INTO todolist ("task_title", "task_detail", "completed") 
VALUES ('Holiday Preparations', 'Buy a tree. Put up lights. Find decorations from garage', 'TRUE');

INSERT INTO todolist ("task_title", "task_detail", "completed") 
VALUES ('Clean the house', 'Clean the garage. Vacuum. Empty the garbages. Fold clothes', 'TRUE');

INSERT INTO todolist ("task_title", "task_detail", "completed") 
VALUES ('Cook', 'Cook all the things', 'TRUE');

INSERT INTO todolist ("task_title", "task_detail", "completed") 
VALUES ('Build Shelf', 'Get shelf measurements. Get material from Home Depot (boards, legs, nails, brackets)', 'FALSE');

INSERT INTO todolist ("task_title", "task_detail", "completed") 
VALUES ('Clean car', 'Vaccuum the inside. Wash the outside. Wax', 'FALSE');
