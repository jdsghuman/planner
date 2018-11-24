$(document).ready(readyNow);

function readyNow() {
  // Load Add tasks button
  loadAddTask();
  // Load tasks from the DB
  getTasks();
  $('#card__container').on('click', '.fa-plus-circle', createTask);
  $('#card__container').on('click', '#btn--cancel', handleCancelClick);
  $('#card__container').on('click', '#btn--save', handleSaveClick);
}

let showAddTaskCard = false;

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
      <input class="form-control" type="text" maxlength="50" placeholder="Task title">
      <textarea class="form-control" class="card-text" maxlength="200" type="text" placeholder="Task Detail"></textarea>
      <a href="#" id="btn--cancel" class="btn btn-danger">Cancel</a>
      <a href="#" id="btn--save" class="btn btn-success">Save Task</a>
    </div>
  </div>`;

function appendToDom(response) {
  // Loop through DB - filter incomplete tasks to be on top
  response.reverse().filter(t => t.completed == false).forEach(task => {
    // Display task card component
    taskCard(task);
  })
  // Loop through DB - filter completed tasks
  response.filter(t => t.completed == true).forEach(task => {
    // Display task card component
    taskCard(task);
  })
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
  getTasks();
}

function handleSaveClick() {
  console.log('save clicked');
}

function loadAddTask() {
  $('#card__container').prepend(addTaskCard);
}

function taskCard(task) {
  // If task complete -- add checked box, else unchecked box
  let square = task.completed ? `<i class="far fa-check-square"></i>` : `<i class="far fa-square"></i>`;
  // If task complete -- change styles
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