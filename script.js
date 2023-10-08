// script.js

// Task Data
let tasks = [];

// Task Columns
const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("inprogress-list");
const doneList = document.getElementById("done-list");
const delayedList = document.getElementById("delayed-list");

// Modal
const modal = document.getElementById("modal");
const closeModalBtn = document.querySelector(".close");

// Task Form
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const taskCategoryInput = document.getElementById("task-category");
const taskDueDateInput = document.getElementById("task-due-date");
const taskTimeInput = document.getElementById("task-time");
const taskAssigneeInput = document.getElementById("task-assignee");
const taskAttachmentInput = document.getElementById("task-attachment");

// Add Task Button
const addTaskBtn = document.getElementById("add-task-btn");

// Generate Unique Task ID
const generateTaskId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Add Task
const addTask = (title, description, category, dueDate, timeToFinish, assignee, attachment) => {
  const task = {
    id: generateTaskId(),
    title,
    description,
    category,
    dueDate,
    timeToFinish,
    assignee,
    attachment,
    completed: false,
    delayed: false
  };

  tasks.push(task);
  renderTasks();
};

// Form Submit Event
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const category = taskCategoryInput.value;
  const dueDate = taskDueDateInput.value;
  const timeToFinish = taskTimeInput.value;
  const assignee = taskAssigneeInput.value.trim();
  const attachment = taskAttachmentInput.value;

  if (title !== "") {
    addTask(title, description, category, dueDate, timeToFinish, assignee, attachment);
    clearTaskForm();
    closeModalBtn.click();
  }
});

// Close Modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Open Modal
addTaskBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Render Tasks
const renderTasks = () => {
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";
  delayedList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = createTaskItem(task);

    if (task.completed) {
      doneList.appendChild(taskItem);
    } else if (task.delayed) {
      delayedList.appendChild(taskItem);
    } else {
      todoList.appendChild(taskItem);
    }
  });

  makeTasksDraggable();
};

// Create Task Item
const createTaskItem = (task) => {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task");
  taskItem.id = task.id;
  taskItem.draggable = true;

  const taskHeader = document.createElement("div");
  taskHeader.classList.add("task-header");
  taskHeader.innerHTML = `
    <h3>${task.title}</h3>
    <div class="task-actions">
      <button class="edit-task-btn" onclick="editTask('${task.id}')"><i class="fas fa-edit"></i></button>
      <button class="delete-task-btn" onclick="deleteTask('${task.id}')"><i class="fas fa-trash"></i></button>
    </div>
  `;

  const taskDetails = document.createElement("div");
  taskDetails.classList.add("task-details");
  taskDetails.innerHTML = `
    <span class="task-category ${task.category}">${task.category}</span>
    <span class="task-assignee"><i class="fas fa-user"></i> ${task.assignee}</span>
    <span class="task-due-date"><i class="far fa-calendar-alt"></i> ${task.dueDate}</span>
    <span class="task-time-to-finish"><i class="far fa-clock"></i> ${task.timeToFinish}</span>
  `;

  taskItem.appendChild(taskHeader);
  taskItem.appendChild(taskDetails);

  return taskItem;
};

// Edit Task
const editTask = (taskId) => {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskCategoryInput.value = task.category;
  taskDueDateInput.value = task.dueDate;
  taskTimeInput.value = task.timeToFinish;
  taskAssigneeInput.value = task.assignee;

  modal.style.display = "block";

  // Update Task on Form Submit
  taskForm.removeEventListener("submit", handleSubmit);
  const handleSubmit = (e) => {
    e.preventDefault();

    task.title = taskTitleInput.value.trim();
    task.description = taskDescriptionInput.value.trim();
    task.category = taskCategoryInput.value;
    task.dueDate = taskDueDateInput.value;
    task.timeToFinish = taskTimeInput.value;
    task.assignee = taskAssigneeInput.value.trim();

    renderTasks();
    clearTaskForm();
    closeModalBtn.click();
  };
  taskForm.addEventListener("submit", handleSubmit);
};

// Delete Task
const deleteTask = (taskId) => {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
};

// Clear Task Form
const clearTaskForm = () => {
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
  taskCategoryInput.value = "personal";
  taskDueDateInput.value = "";
  taskTimeInput.value = "";
  taskAssigneeInput.value = "";
  taskAttachmentInput.value = "";
};

// Make Tasks Draggable
const makeTasksDraggable = () => {
  const tasks = document.querySelectorAll(".task");

  tasks.forEach((task) => {
    task.addEventListener("dragstart", handleDragStart);
    task.addEventListener("dragend", handleDragEnd);
  });
};

// Drag Start Event
const handleDragStart = (e) => {
  e.dataTransfer.setData("text/plain", e.target.id);
  e.target.classList.add("dragging");
};

// Drag End Event
const handleDragEnd = (e) => {
  e.target.classList.remove("dragging");
};

// Drag Over Event
const handleDragOver = (e) => {
  e.preventDefault();
  const column = e.target.closest(".task-column");
  column.classList.add("dragging-over");
};

// Drag Leave Event
const handleDragLeave = (e) => {
  const column = e.target.closest(".task-column");
  column.classList.remove("dragging-over");
};

// Drop Event
const handleDrop = (e) => {
  e.preventDefault();
  const taskId = e.dataTransfer.getData("text/plain");
  const task = document.getElementById(taskId);

  const column = e.target.closest(".task-column");
  const columnId = column.id;

  if (columnId === "done-column") {
    task.classList.add("completed");
    tasks.find((t) => t.id === taskId).completed = true;
  } else if (columnId === "delayed-column") {
    task.classList.add("delayed");
    tasks.find((t) => t.id === taskId).delayed = true;
  } else {
    task.classList.remove("completed", "delayed");
    tasks.find((t) => t.id === taskId).completed = false;
    tasks.find((t) => t.id === taskId).delayed = false;
  }

  column.classList.remove("dragging-over");
  column.querySelector(".task-list").appendChild(task);
};

// Add Event Listeners for Drag and Drop
const taskColumns = document.querySelectorAll(".task-column");

taskColumns.forEach((column) => {
  column.addEventListener("dragover", handleDragOver);
  column.addEventListener("dragleave", handleDragLeave);
  column.addEventListener("drop", handleDrop);
});

// Initial Render
renderTasks();