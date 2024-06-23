'use strict';
const todoControl = document.querySelector('.todo-control'); // форма ввода новой задачи
const todoInput = document.querySelector('.header-input'); // input формы ввода новой задачи
const todoPlus = document.querySelector('.todo-control button'); // кнопка "+"
const todoList = document.querySelector('.todo-list'); // список для вывода незавершённых задач на экран
const todoCompleted = document.querySelector('.todo-completed'); // список для вывода выполненных задач на экран
let date = new Date(); // текущее время

const elemUpdate = (elem) => (elem.disabled ? elem.classList.add('disabled') : elem.classList.remove('disabled'));
todoPlus.disabled = true;
elemUpdate(todoPlus);

const todoItemHTML = function (item) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.innerHTML = `<span class="text-todo" id="${item.id}">${item.text}</span><div class="todo-buttons"><button class="todo-remove"></button><button class="todo-complete"></button></div>`;
    item.done ? todoCompleted.append(li) : todoList.append(li);
    li.querySelector('.todo-remove').addEventListener('click', (event) => {
        const key = 'todo' + item.id;
        localStorage.removeItem(key);
        event.target.closest('li').remove();
    }); // удаление данной задачи из хранилища
    li.querySelector('.todo-complete').addEventListener('click', (event) => {
        const key = 'todo' + item.id;
        const movingTodo = JSON.parse(localStorage.getItem(key));
        movingTodo.done = !movingTodo.done;
        localStorage.setItem(key, JSON.stringify(movingTodo))
        event.target.closest('li').remove();
        todoItemHTML(movingTodo);
    }); // перемещение задачи из одного списка в другой
}; // вывод задачи в html код

const renderOnStart = () => {
    if (localStorage.length !== 0) {
        for (let key in localStorage) {
            if ('todo' === key.substring(0, 4)) {
                todoItemHTML(JSON.parse(localStorage[key]))
            };
        };
    };
};

todoControl.addEventListener('submit', (event) => {
    event.preventDefault();
    if (todoInput.value) {
        date = new Date();
        const newTodo = {
            id: date.getTime(),
            text: todoInput.value,
            done: false,
        };
        localStorage.setItem('todo' + newTodo.id, JSON.stringify(newTodo));
        console.log(localStorage);
        todoInput.value = '';
        todoItemHTML(newTodo);
        todoPlus.disabled = true;
        elemUpdate(todoPlus);
    }
}); // навешивание действия на кнопку "+" формы новой задачи

todoInput.addEventListener('input', function () {
    todoPlus.disabled = (todoInput.value === '');
    elemUpdate(todoPlus);
});

renderOnStart(); // вывести все задачи при запуске
