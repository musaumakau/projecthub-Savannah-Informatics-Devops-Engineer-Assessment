// Simple Task Management
let tasks = [];
let taskId = 1;

function addTask() {
    const input = document.getElementById('taskTitle');
    const title = input.value.trim();
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const task = {
        id: taskId++,
        title: title,
        completed: false,
        createdAt: new Date()
    };
    
    tasks.unshift(task);
    input.value = '';
    
    renderTasks();
    updateStats();
    saveTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
        saveTasks();
    }
}

function deleteTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task && confirm(`Delete "${task.title}"?`)) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateStats();
        saveTasks();
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No tasks yet. Add one above!</p>';
        return;
    }
    
    taskList.innerHTML = tasks.map(task => `
        <div style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.5rem; background: rgba(255,255,255,0.5); border-radius: 0.5rem; ${task.completed ? 'opacity: 0.7;' : ''}">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})" style="margin-right: 1rem;">
            <span style="flex: 1; ${task.completed ? 'text-decoration: line-through;' : ''}">${task.title}</span>
            <button onclick="deleteTask(${task.id})" style="background: #ef4444; color: white; border: none; padding: 0.5rem; border-radius: 0.25rem; cursor: pointer;">Delete</button>
        </div>
    `).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    document.getElementById('totalProjects').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
}

function saveTasks() {
    localStorage.setItem('projecthub_tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('projecthub_tasks');
    if (saved) {
        tasks = JSON.parse(saved);
        taskId = Math.max(...tasks.map(t => t.id), 0) + 1;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    renderTasks();
    updateStats();
    console.log('✅ ProjectHub loaded');
});

// Enter key to add task
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.id === 'taskTitle') {
        addTask();
    }
});