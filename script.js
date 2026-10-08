let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let title = document.getElementById("title");
let priority = document.getElementById("priority");
let date = document.getElementById("date");
let addBtn = document.getElementById("addBtn");
let taskTable = document.getElementById("tasks");
let total = document.getElementById("total");
let completed = document.getElementById("completed");
let pending = document.getElementById("pending");
let search = document.getElementById("search");
let editId = null;

showTasks();
addBtn.onclick = function () {
  if (title.value.trim() == "") {
    alert("Please Enter Task Title");
    return;
  }
  if (editId == null) {
    let task = {
      id: Date.now(),
      title: title.value,
      priority: priority.value,
      date: date.value,
      completed: false,
    };
    tasks.push(task);
  } else {
    let index = tasks.findIndex((task) => task.id == editId);
    tasks[index].title = title.value;
    tasks[index].priority = priority.value;
    tasks[index].date = date.value;
    editId = null;
    addBtn.innerHTML = "Add Task";
  }
  saveData();
  clearInputs();
  showTasks();
};
function showTasks(list = tasks) {
  taskTable.innerHTML = "";
  list.forEach(function (task) {
    taskTable.innerHTML += `        <tr class="${task.completed ? "completed-row" : ""}">            <td>${task.title}</td>            <td>${task.priority}</td>            <td>${task.date}</td>            <td>${task.completed ? "Completed" : "Pending"}</td>            <td>                <button class="complete" onclick="completeTask(${task.id})">✓</button>                <button class="edit" onclick="editTask(${task.id})">Edit</button>                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>            </td>        </tr>`;
  });
  updateCounter();
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    let index = tasks.findIndex((task) => task.id == id);
    if (index != -1) tasks.splice(index, 1);
    saveData();
    showTasks();
  }  
}

function editTask(id) {
  let task = tasks.find((task) => task.id == id);
  if (!task) return;
  title.value = task.title;
  priority.value = task.priority;
  date.value = task.date;
  editId = id;
  addBtn.innerHTML = "Update Task";
}


function completeTask(id) {
  let task = tasks.find((task) => task.id == id);
  if (!task) return;
  task.completed = !task.completed;
  saveData();
  showTasks();
}
function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function clearInputs() {
  title.value = "";
  priority.value = "High";
  date.value = "";
}

function updateCounter() {
  total.innerHTML = tasks.length;
  let completedCount = tasks.filter((task) => task.completed).length;
  completed.innerHTML = completedCount;
  pending.innerHTML = tasks.length - completedCount;
}
search.addEventListener("keyup", function () {
  let value = search.value.toLowerCase().trim();
  let filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(value),
  );
  showTasks(filteredTasks);
});
let filters = document.querySelectorAll(".filter");
filters.forEach(function (button) {
  button.addEventListener("click", function () {
    let type = this.dataset.filter;
    if (type === "all") showTasks(tasks);
    else if (type === "completed")
      showTasks(tasks.filter((task) => task.completed));
    else if (type === "pending")
      showTasks(tasks.filter((task) => !task.completed));
  });
});
window.onload = function () {
  showTasks();
};