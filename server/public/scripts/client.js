$(document).ready(readyNow);

function readyNow() {
  loadAddTask();
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

// Task component
let taskComponent = `
  <div class="card" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
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
  // Loop through database
  response.forEach(task => {
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
  </div>`)
  });
}

function createTask() {
  let modalAdd = $('.modalAdd');
  console.log('add button clicked');
  $('#card__container').empty();
  // Show New Task Card
  $('#card__container').prepend(newTaskInput);
  modalAdd.addClass('modalAdd--is-visible');

}

function getTasks() {
  console.log('getting tasks...');

  //////// WIP /////////////////
  // $('#card__container').append(taskComponent);
  // $('#card__container').append(taskComponent);

  $.ajax({
    method: 'GET',
    url: '/tasks'
  }).then(function(response) {
    console.log('back from GET', response);
    appendToDom(response);
  }).catch(function(err) {
    console.log('error from GET', err);
  })

}

function handleCancelClick() {
  let modalAdd = $('.modalAdd');
  console.log('cancel clicked');
  $('#card__container').empty();
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