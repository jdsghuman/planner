$(document).ready(readyNow);

function readyNow() {
  // Load Add tasks button
  loadAddTask();
  // Get tasks from the DB
  getTasks();
  // Setup click listeners
  setupClickListeners();
}

// Use [] to save network request to DB - (Cancel button)
let responses = [];

function appendToDom(response, reverse) {
  // Loop through DB - filter incomplete tasks to be on top
  if(reverse === 'reverse') {
    response.reverse().filter(t => t.completed == false).forEach(task => {
      // Send filtered response to task card component
      taskCard(task);
    });
  } else {
    response.filter(t => t.completed == false).forEach(task => {
      // Send filtered response to task card component
      taskCard(task);
    });
  }
  
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

////////////// COMPONENTS ////////////////////////////

// Add button component - (with + icon)
let addTaskCard = `
<div class="card" style="width: 18rem;">
  <div class="card-body card-body--add">
    <i class="fas fa-plus-circle"></i>
    <p class="task__add-text">Add Task</p>
  </div>
</div>`;

// New Task input component - Input fields
let newTaskInput = `
  <div class="card" style="width: 18rem; z-index: 155;">
    <div class="card-body">
      <h5 class="card-title">Add New Task</h5>
      <input class="form-control task__title" type="text" maxlength="20" placeholder="Task title">
      <textarea class="form-control task__detail" class="card-text" maxlength="100" type="text" placeholder="Task Detail"></textarea>
      <div class="card__task-container--new">
        <a href="#" id="btn--cancel" class="btn btn-danger">Cancel</a>
        <a href="#" id="btn--save" class="btn btn-success">Save Task</a>
      </div>
    </div>
  </div>`;

// Component for Task card - With DB data
function taskCard(task) {
  // If task complete - add checked box, else unchecked box
  let square = task.completed ? `<span><i class="far fa-check-square"></i></span>` : `<span><i class="far fa-square"></i></span>`;
  // If task complete - change styles (strike-through, light colored text)
  let title = task.completed ? `<h5 class="card-title card-title--completed">${task.task_title}</h5>` : `<h5 class="card-title">${task.task_title}</h5>`;
  // If task complete - disable 'Complete' button
  let buttonComplete = task.completed ? `<a href="#" class="btn btn-info disabled btn--complete">Complete</a>` : `<a href="#" class="btn btn-info btn--complete">Complete</a>`;
  // If task complete - apply background-color 
  let cardDiv = task.completed ? `<div class="card" style="width: 18rem; background-color: #e9ecef;">` : `<div class="card" style="width: 18rem;">`;
 
  // Append task to the container
  $('#card__container').append(`
    ${cardDiv}
    <div class="card-body" data-id=${task.id} data-complete=${task.completed}>
      ${square}
      ${title}
      <p class="card-text">${task.task_detail}</p>
      <div class="card__task-container">
        <a href="#" class="btn btn-danger btn--delete">Delete</a>
        ${buttonComplete}
      </div>
    </div>
  </div>`);
}

function getTasks() {
  $.ajax({
    method: 'GET',
    url: '/tasks'
  }).then(function (response) {
    console.log('back from GET', response);
    responses = response;
    appendToDom(response, "reverse");
  }).catch(function (err) {
    console.log('error from GET', err);
  });
}

function getTaskId(that) {
  // Get dataId of Card
  return that.parent().parent().data('id'); 
}

function getTaskCompleted(that) {
  return that.parent().parent().data('complete');
}

function handleCancelClick() {
  resetUI();
  // Get tasks
  appendToDom(responses);   // Does not use getTasks method, saves extra network request to DB 
}

function handleCompleteClick(e) {
  e.preventDefault();
  // Call UPDATE route - Use getTaskId to get dataId
  taskUpdateComplete(getTaskId($(this)), getTaskCompleted($(this)));
}

function handleDeleteClick(e) {
  e.preventDefault(e);
  // Prompt user to confirm delete
  let deleteConfirm = confirm("Are you sure you want to delete this task?");
  // If user confirms delete
  if(deleteConfirm === true) {
    // Call DELETE route - Use getTaskId to get dataId
    taskDelete(getTaskId($(this)));
  }
}

function handleSaveClick() {
  // Check if inputs are empty
  if (validateTaskInputs() === true) {
    // Create a new Class object
    let newTask = new Task($('.task__title').val(), $('.task__detail').val());
    // Call POST route and send task to DB
    saveNewTask(newTask);
  }
}

function loadAddTask() {
  $('#card__container').prepend(addTaskCard);
}

function resetUI() {
  let modalAdd = $('.modalAdd');
  $('#card__container').empty();
  // Remove modal styling
  modalAdd.removeClass('modalAdd--is-visible');
  // Show Add Task button
  $('#card__container').prepend(addTaskCard);
}

function saveNewTask(newTaskObject) {
  $.ajax({
    method: 'POST',
    url: '/tasks',
    data: newTaskObject
  }).then(function (response) {
    console.log('response from POST', response);
    // Clear input values
    clearInputValues();
    // Reset Modal and UI
    resetUI();
    // Get tasks from DB
    getTasks();
    if(response === 'Created') alert('New task added!');
  }).catch(function (err) {
    console.log('error in POST', err);
    if(err) alert('Error! Task not saved.');
    // Remove 'New Task' component
    handleCancelClick();
  });
}

function setupClickListeners() {
  $('#card__container').on('click', '.fa-plus-circle', createTask);
  $('#card__container').on('click', '#btn--cancel', handleCancelClick);
  $('#card__container').on('click', '#btn--save', handleSaveClick);
  $('#card__container').on('click', '.btn--delete', handleDeleteClick);
  $('#card__container').on('click', '.btn--complete', handleCompleteClick);
  $('#card__container').on('click', '.fa-square', handleCompleteClick);
  $('#card__container').on('click', '.fa-check-square', handleCompleteClick);
}

class Task {
  constructor(taskTitle, taskDetail) {
    this.taskTitle = taskTitle;
    this.taskDetail = taskDetail;
  }
}

function taskDelete(taskId) {
  console.log('task data: ', taskId);
  $.ajax({
    method: 'DELETE',
    url: `/tasks/${taskId}`
  }).then(function(response) {
    // Reset Modal and UI
    resetUI();
    // Update dom
    getTasks();
    alert('Task deleted!');
  });
}

function taskUpdateComplete(taskId, taskCompleted) {
  let tComplete = !taskCompleted;
  const updateTask = {completed: tComplete}
  $.ajax({
    method: 'PUT',
    url: `/tasks/${taskId}`,
    data: updateTask
  }).then(function(response) {
    // Reset Modal and UI
    resetUI();
    // Update dom
    getTasks();
    alert('Task updated!');
  }).catch(function(err) {
    console.log('error updating Complete task: ', err);
  });
}

function validateTaskInputs() {
  // Input validation styling
  let $title = $('.task__title');
  let $detail = $('.task__detail');
  if($title.val() === '') {
    $title.addClass('is-invalid');
  } else {
    $title.removeClass('is-invalid');
    $title.addClass('is-valid');
  }
  
  if ($detail.val() === '') {
    $detail.addClass('is-invalid');
  } else {
    $detail.removeClass('is-invalid');
    $detail.addClass('is-valid');
  }

  // Validate input values
  if($title.val() !== '' && $detail.val() !== '') {
    return true;
  }
}