let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentTagFilter = 'all';

const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const tagInput = document.getElementById('tag-input');
const list = document.getElementById('todo-list');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    
    // Validation: Show error if blank [cite: 11-13]
    if (!text) {
        document.getElementById('error-msg').style.display = 'block';
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        tag: tagInput.value || 'none',
        done: false
    };

    tasks.push(newTask);
    saveAndRender();
    form.reset(); // Clear form [cite: 23]
    document.getElementById('error-msg').style.display = 'none';
});

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); [cite: 27]
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
        li.className = task.done ? 'completed' : '';
        li.innerHTML = `
            <span><strong>[${task.tag}]</strong> ${task.text}</span>
            <div class="actions">
                <button onclick="toggleTask(${task.id})">${task.done ? 'Undo' : 'Done'}</button>
                <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });

    const activeCount = tasks.filter(t => !t.done).length; [cite: 48]
    document.getElementById('counter').innerText = `${activeCount} active tasks`;
}

window.toggleTask = (id) => {
    tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t); [cite: 53]
    saveAndRender();
};

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id); [cite: 57]
    saveAndRender();
};

window.setFilter = (f) => { currentFilter = f; render(); };
window.setTagFilter = (t) => { currentTagFilter = t; render(); };

render();
