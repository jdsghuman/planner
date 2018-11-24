$(document).ready(readyNow);

function readyNow() {
  // Load Add tasks button
  loadAddTask();
  // Load tasks from the DB
  getTasks();
  // Setup click listeners
  setupClickListeners();
}

let showAddTaskCard = false;
// Use this variable to save request to DB - (Cancel button, etc)
let responses = [];

// Add button component
let addTaskCard = `
<div class="card" style="width: 18rem;">
  <div class="card-body card-body--add">
    <i class="fas fa-plus-circle"></i>
    <p class="task__add-text">Add Task</p>
  </div>
</div>`;

  // New Task input component
  let newTaskInput = `
  <div class="card" style="width: 18rem; z-index: 155;">
    <div class="card-body">
      <h5 class="card-title">Add New Task</h5>
      <input class="form-control task__title" type="text" maxlength="50" placeholder="Task title">
      <textarea class="form-control task__detail" class="card-text" maxlength="200" type="text" placeholder="Task Detail"></textarea>
      <a href="#" id="btn--cancel" class="btn btn-danger">Cancel</a>
      <a href="#" id="btn--save" class="btn btn-success">Save Task</a>
    </div>
  </div>`;

function appendToDom(response) {
  // Loop through DB - filter incomplete tasks to be on top
  response.reverse().filter(t => t.completed == false).forEach(task => {
    // Send filtered response to task card component
    taskCard(task);
  })
  // Loop through DB - filter completed tasks
  response.filter(t => t.completed == true).forEach(task => {
    // Send filtered response to task card component
    taskCard(task);
  })
}

function clearInputValues() {
  $('.task__title').val('');
  $('.task__detail').val('');
}

function createTask() {
  let modalAdd = $('.modalAdd');
  $('#card__container').empty();
  // Show New Task Card
  $('#card__container').prepend(newTaskInput);
  // Show modal styling
  modalAdd.addClass('modalAdd--is-visible');
}

function getTasks() {
  $.ajax({
    method: 'GET',
    url: '/tasks'
  }).then(function(response) {
    console.log('back from GET', response);
    responses = response;
    appendToDom(response);
  }).catch(function(err) {
    console.log('error from GET', err);
  });
}

function handleCancelClick() {
  let modalAdd = $('.modalAdd');
  $('#card__container').empty();
  // Remove modal styling
  modalAdd.removeClass('modalAdd--is-visible');
  // Show Add Task button
  $('#card__container').prepend(addTaskCard);
  // Get tasks
  appendToDom(responses);   // Does not use getTasks method, saves extra network request to DB 
}

function handleSaveClick() {
  // If inputs are not empty
  if(validateTaskInputs) {
    let newTask = new Task($('.task__title').val(), $('.task__detail').val());
    saveNewTask(newTask);
  }
}

function loadAddTask() {
  $('#card__container').prepend(addTaskCard);
}

function saveNewTask(newTaskObject) {
  $.ajax({
    method: 'POST',
    url: '/tasks',
    data: newTaskObject
  }).then(function(response) {
    console.log('response from POST');
    // Clear input values
    clearInputValues();
    // Get tasks from DB
    getTasks(); 
  }).catch(function(err) {
    console.log('error in POST', err);
  });
}

function setupClickListeners() {
  $('#card__container').on('click', '.fa-plus-circle', createTask);
  $('#card__container').on('click', '#btn--cancel', handleCancelClick);
  $('#card__container').on('click', '#btn--save', handleSaveClick);
}

class Task {
  constructor(taskTitle, taskDetail) {
    this.taskTitle = taskTitle;
    this.taskDetail = taskDetail;
  }
}

function taskCard(task) {
  // If task complete -- add checked box, else unchecked box
  let square = task.completed ? `<i class="far fa-check-square"></i>` : `<i class="far fa-square"></i>`;
  // If task complete -- change styles (strike-through, light colored text)
  let title = task.completed ? `<h5 class="card-title card-title--completed">${task.task_title}</h5>` : `<h5 class="card-title">${task.task_title}</h5>`;
  // Append task to the container
  $('#card__container').append(
  `<div class="card" style="width: 18rem;">
  <div class="card-body">
    ${square}
    ${title}
    <p class="card-text">${task.task_detail}</p>
    <a href="#" class="btn btn-danger">Delete</a>
    <a href="#" class="btn btn-success">Complete</a>
  </div>
</div>`);
}

function validateTaskInputs() {
  let $title = $('.task__title').val();
  let $detail = $('.task__detail').val();
  if($title === '' || $detail === '') {
    return false;
  } else {
    return true;
  }
}