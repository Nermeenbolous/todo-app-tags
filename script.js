let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentTagFilter = 'all';

const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const tagInput = document.getElementById('tag-input');
const taskList = document.getElementById('task-list');
const activeCount = document.getElementById('active-count');
const errorMsg = document.getElementById('error-msg');

// --- Core Functions ---

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    render();
}

function render() {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        const matchesStatus = 
            currentFilter === 'all' ? true :
            currentFilter === 'active' ? !task.done : task.done;
        
        const matchesTag = 
            currentTagFilter === 'all' ? true : task.tag === currentTagFilter;
            
        return matchesStatus && matchesTag;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.done ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-info">
                <input type="checkbox" ${task.done ? 'checked' : ''} onclick="toggleTask(${task.id})">
                <span>${task.text}</span>
                ${task.tag ? `<span class="tag-badge">${task.tag}</span>` : ''}
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
        `;
        taskList.appendChild(li);
    });

    const activeTotal = tasks.filter(t => !t.done).length;
    activeCount.innerText = `${activeTotal} active task${activeTotal !== 1 ? 's' : ''}`;
}

// --- Event Handlers ---

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    const tag = tagInput.value;

    if (!text) {
        errorMsg.classList.remove('hidden');
        return;
    }

    errorMsg.classList.add('hidden');
    const newTask = { id: Date.now(), text, tag, done: false };
    tasks.push(newTask);
    
    taskInput.value = '';
    tagInput.value = '';
    saveAndRender();
});

window.toggleTask = (id) => {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveAndRender();
};

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
};

// --- Filter Listeners ---

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        render();
    });
});

document.getElementById('tag-filter').addEventListener('change', (e) => {
    currentTagFilter = e.target.value;
    render();
});

// Initial Render
render();
