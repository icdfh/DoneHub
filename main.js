// Загрузка задач из localStorage
const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
const datePicker = document.getElementById('date-picker');
const timePicker = document.getElementById('time-picker');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const themeButton = document.getElementById('toggle-theme');
const statsButton = document.getElementById('view-stats');
const calendarButton = document.getElementById('calendar-view');
const calendarModal = document.getElementById('calendar-modal');
const closeCalendarButton = document.getElementById('close-calendar');
const calendarContainer = document.getElementById('calendar');

const today = new Date().toISOString().split('T')[0];
datePicker.value = today;

// Сохранение задач
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Рендер задач
function renderTasks() {
    const selectedDate = datePicker.value;
    const dailyTasks = tasks[selectedDate] || [];
    taskList.innerHTML = '';
    dailyTasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <div class="task-details">
                <div class="custom-checkbox">
                    <input type="checkbox" id="task-${index}" ${task.status === 'done' ? 'checked' : ''}>
                    <label for="task-${index}"></label>
                </div>
                <span>${task.text}</span>
                <span>${task.time}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" data-index="${index}" title="Редактировать"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-index="${index}" title="Удалить"><i class="fas fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}

// Добавление задачи
document.getElementById('add-task').addEventListener('click', () => {
    const text = taskInput.value.trim();
    const time = timePicker.value;
    const selectedDate = datePicker.value;

    if (!text) {
        alert('Введите текст задачи!');
        return;
    }

    if (!tasks[selectedDate]) tasks[selectedDate] = [];
    tasks[selectedDate].push({ text, time, status: 'in progress' });
    saveTasks();
    taskInput.value = '';
    renderTasks();
});

// Изменение статуса задачи
taskList.addEventListener('change', (e) => {
    const index = e.target.closest('input[type="checkbox"]').id.split('-')[1];
    const selectedDate = datePicker.value;
    tasks[selectedDate][index].status = e.target.checked ? 'done' : 'in progress';
    saveTasks();
    renderTasks();
});

// Удаление задачи с сохранением в "Корзину"
taskList.addEventListener('click', (e) => {
    if (e.target.closest('.delete-btn')) {
        const index = e.target.closest('.delete-btn').dataset.index;
        const selectedDate = datePicker.value;

        // Сохранение задачи в "Корзину"
        const deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
        const taskToDelete = tasks[selectedDate].splice(index, 1)[0];
        deletedTasks.push({ ...taskToDelete, date: selectedDate });

        // Сохранение изменений в localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));

        renderTasks();
    }
});

// Редактирование задачи
taskList.addEventListener('click', (e) => {
    if (e.target.closest('.edit-btn')) {
        const index = e.target.closest('.edit-btn').dataset.index;
        const selectedDate = datePicker.value;
        const newText = prompt('Редактировать задачу:', tasks[selectedDate][index].text);
        const newTime = prompt('Редактировать время:', tasks[selectedDate][index].time);

        if (newText !== null && newTime !== null) {
            tasks[selectedDate][index].text = newText.trim();
            tasks[selectedDate][index].time = newTime;
            saveTasks();
            renderTasks();
        }
    }
});

// Открытие истории задач
statsButton.addEventListener('click', () => {
    window.location.href = 'stats.html';
});

// Открытие календаря задач
calendarButton.addEventListener('click', () => {
    calendarModal.classList.remove('hidden');
    renderCalendar();
});

// Закрытие календаря задач
closeCalendarButton.addEventListener('click', () => {
    calendarModal.classList.add('hidden');
});

// Рендер календаря
function renderCalendar() {
    calendarContainer.innerHTML = '';
    const dates = Object.keys(tasks);
    for (let i = 1; i <= 31; i++) {
        const day = i.toString().padStart(2, '0');
        const date = `${today.split('-')[0]}-${today.split('-')[1]}-${day}`;
        const dayTasks = tasks[date] || [];
        const isCompleted = dayTasks.every((task) => task.status === 'done');

        const calendarDay = document.createElement('div');
        calendarDay.textContent = i;
        calendarDay.classList.add(isCompleted ? 'completed' : 'incomplete');
        calendarContainer.appendChild(calendarDay);
    }
}

// Смена темы
themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeButton.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Инициализация
renderTasks();