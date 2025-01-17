// Загрузка данных из localStorage
const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
const historyList = document.getElementById('history-list');
const backButton = document.getElementById('back-to-todo');

// Сбор выполненных и удалённых задач
function getTaskHistory() {
    const completedTasks = [];
    const deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];

    for (const [date, taskList] of Object.entries(tasks)) {
        taskList.forEach((task) => {
            if (task.status === 'done') {
                completedTasks.push({ ...task, date });
            }
        });
    }

    return { completedTasks, deletedTasks };
}

// Рендер истории задач
function renderHistory() {
    const { completedTasks, deletedTasks } = getTaskHistory();
    historyList.innerHTML = `
        <h2>Выполненные задачи</h2>
        ${completedTasks.length > 0 ? completedTasks.map((task) => `
            <div class="task">
                <span>${task.date}: ${task.text} (${task.time})</span>
            </div>
        `).join('') : '<p>Нет выполненных задач</p>'}

        <h2>Удалённые задачи</h2>
        ${deletedTasks.length > 0 ? deletedTasks.map((task, index) => `
            <div class="task">
                <span>${task.date}: ${task.text} (${task.time})</span>
                <button class="restore-btn" data-index="${index}" title="Восстановить">
                    <i class="fas fa-undo-alt"></i>
                </button>
                <button class="delete-forever-btn" data-index="${index}" title="Удалить">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('') : '<p>Нет удалённых задач</p>'}
    `;

    // Добавление событий для восстановления задач
    document.querySelectorAll('.restore-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('.restore-btn').dataset.index;
            restoreTask(index);
        });
    });

    // Добавление событий для удаления задач навсегда
    document.querySelectorAll('.delete-forever-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('.delete-forever-btn').dataset.index;
            deleteTaskForever(index);
        });
    });
}

// Восстановление задачи
function restoreTask(index) {
    const deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
    const taskToRestore = deletedTasks.splice(index, 1)[0];

    if (taskToRestore) {
        const { date, ...rest } = taskToRestore;
        if (!tasks[date]) tasks[date] = [];
        tasks[date].push(rest);

        // Сохранение изменений
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
        renderHistory();
    }
}

// Удаление задачи навсегда
function deleteTaskForever(index) {
    const deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
    deletedTasks.splice(index, 1); // Удаляем задачу из массива

    // Сохранение изменений в localStorage
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));

    // Перерендер списка задач
    renderHistory();
}

// Кнопка "Назад"
backButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Инициализация
renderHistory();
