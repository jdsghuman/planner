$(document).ready(readyNow);

function readyNow() {
  // Load Add tasks button
  loadAddTask();
  // Get tasks from the DB
  getTasks();
  // Setup click listeners
  setupClickListeners();
}

// Use [] to save network request to DB - (e.g. used for the 'Cancel' button in Add new task)
let responses = [];

function appendToDom(response, reverse) {
  // Loop through DB - filter INCOMPLETE tasks to be on top
  if (reverse === 'reverse') {
    // Reverse array to show newest added/updated tasks above
    response.reverse().filter(t => t.completed == false).forEach(task => {
      // Send filtered response to task card component
      taskCard(task);
    });
  } else {
    // Use for 'responses' array -- saved as reversed
    response.filter(t => t.completed == false).forEach(task => {
      // Send filtered response to task card component
      taskCard(task);
    });
  }

  // Loop through DB - filter COMPLETED tasks
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

// Component for Task card - With DB data (add spans for data traversing consistency)
function taskCard(task) {
  // If task complete - add checked box, else unchecked box
  let square = task.completed ? `<span><i class="far fa-check-square"></i></span>` : `<span><i class="far fa-square"></i></span>`;
  // If task complete - change styles (strike-through, light colored text)
  let title = task.completed ? `<span><h5 class="card-title card-title--completed">${task.task_title}</h5></span>` : `<span><h5 class="card-title card-title--incomplete">${task.task_title}</h5></span>`;
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
    responses = response;
    appendToDom(response, "reverse");
  }).catch(function (err) {
    // Alert user if error from GET
    if (err) alert('Error! Tasks not uploading.');
  });
}

function getTaskDataCompleted(that) {
  // Get data-complete of task
  return that.parent().parent().data('complete');
}

function getTaskDataId(that) {
  // Get data-id of task
  return that.parent().parent().data('id');
}

function handleCancelClick() {
  resetUI();
  // Get tasks (cached responses array)
  appendToDom(responses);   // Does not use getTasks method, saves extra network request to DB 
}

function handleCompleteClick(e) {
  e.preventDefault();
  // Call UPDATE route - Use getTaskDataId to get data-id
  taskUpdateComplete(getTaskDataId($(this)), getTaskDataCompleted($(this)));
}

function handleDeleteClick(e) {
  e.preventDefault();
  // Prompt user to confirm delete
  let deleteConfirm = confirm("Are you sure you want to delete this task?");
  // If user confirms delete
  if (deleteConfirm === true) {
    // Call DELETE route - Use getTaskDataId to get data-id
    taskDelete(getTaskDataId($(this)));
  }
}

function handleSaveClick() {
  // Check if inputs are empty
  if (validateTaskInputs() === true) {
    // Create a new Class object
    let newTask = new Task($('.task__title').val(), $('.task__detail').val());
    // Call POST route and send newTask variable to DB
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
    // Clear input values
    clearInputValues();
    // Reset Modal and UI
    resetUI();
    // Get tasks from DB
    getTasks();
    // Alert user if task added to DB
    if (response === 'Created') alert('New task added!');
  }).catch(function (err) {
    // Alert user if error
    if (err) alert('Error! Task not saved.');
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
  $('#card__container').on('click', '.card-title--completed', handleCompleteClick);
  $('#card__container').on('click', '.card-title--incomplete', handleCompleteClick);
}

class Task {
  constructor(taskTitle, taskDetail) {
    this.taskTitle = taskTitle;
    this.taskDetail = taskDetail;
  }
}

function taskDelete(taskId) {
  $.ajax({
    method: 'DELETE',
    url: `/tasks/${taskId}`
  }).then(function (response) {
    // Reset Modal and UI
    resetUI();
    // Update dom
    getTasks();
    // Alert user if task deleted successfully 
    alert('Task deleted!');
  }).catch(function (err) {
    // Alert user if error
    if (err) alert('Error! Task not deleted.');
  });
}

function taskUpdateComplete(taskId, taskCompleted) {
  // Set '!complete' as reversed data
  let tComplete = !taskCompleted;
  const updateTask = { completed: tComplete }
  $.ajax({
    method: 'PUT',
    url: `/tasks/${taskId}`,
    data: updateTask
  }).then(function (response) {
    // Reset Modal and UI
    resetUI();
    // Update dom
    getTasks();
    // Alert user if task updated successfully
    alert('Task updated!');
  }).catch(function (err) {
    // Alert user if error
    if (err) alert('Error! Task not updated.');
  });
}

function validateTaskInputs() {
  // Input validation styling for Bootstrap (red/green borders)
  let $title = $('.task__title');
  let $detail = $('.task__detail');
  if ($title.val() === '') {
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

  // Validate input values - User cannot send empty values
  if (($title.val() !== '' && $detail.val() !== '') &&
    ($title.val().trim() !== '' && $detail.val().trim() !== '')) {
    return true;
  } else {
    alert('Error! Please provide a response for Task Title & Detail below.');
  }
}