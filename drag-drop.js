function initializeDragAndDrop() {
    const draggables = document.querySelectorAll('.task');
    const container = document.querySelector('#task-list');

    draggables.forEach((draggable) => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            saveNewOrder(); // Сохранение нового порядка задач
        });
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(dragging);
        } else {
            container.insertBefore(dragging, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [
        ...container.querySelectorAll('.task:not(.dragging)'),
    ];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

function saveNewOrder() {
    const selectedDate = document.getElementById('date-picker').value;
    const tasksContainer = document.querySelector('#task-list');
    const newOrder = [];
    tasksContainer.querySelectorAll('.task').forEach((taskElement) => {
        const index = taskElement.querySelector('input[type="checkbox"]').id.split('-')[1];
        const selectedTask = tasks[selectedDate][index];
        newOrder.push(selectedTask);
    });

    tasks[selectedDate] = newOrder;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
