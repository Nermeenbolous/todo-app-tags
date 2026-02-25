let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentTagFilter = 'all';

const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const tagInput = document.getElementById('tag-input');
const list = document.getElementById('todo-list');

// Add Task
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!taskInput.value.trim()) {
    document.getElementById('error-msg').style.display = 'block';
    return;
  }
  
  const newTask = {
    id: Date.now(),
    text: taskInput.value,
    tag: tagInput.value || 'none',
    done: false
  };

  tasks.push(newTask);
  saveAndRender();
  form.reset();
  document.getElementById('error-msg').style.display = 'none';
});

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

function render() {
  list.innerHTML = '';
  
  const filtered = tasks.filter(t => {
    const statusMatch = currentFilter === 'all' || 
                       (currentFilter === 'active' && !t.done) || 
                       (currentFilter === 'completed' && t.done);
    const tagMatch = currentTagFilter === 'all' || t.tag === currentTagFilter;
    return statusMatch && tagMatch;
  });

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span style="${task.done ? 'text-decoration: line-through' : ''}">${task.text} [${task.tag}]</span>
      <button onclick="toggleTask(${task.id})">${task.done ? 'Undo' : 'Done'}</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    list.appendChild(li);
  });

  const activeCount = tasks.filter(t => !t.done).length;
  document.getElementById('counter').innerText = `${activeCount} active tasks`;
}

// Global functions for buttons
window.toggleTask = (id) => {
  tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
  saveAndRender();
};

window.deleteTask = (id) => {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
};

window.setFilter = (f) => { currentFilter = f; render(); };
window.setTagFilter = (t) => { currentTagFilter = t; render(); };

render(); // Initial load
