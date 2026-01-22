function RunTheApplication() {
    function select(element) {
        return document.querySelector(element);
    }
    function SelectAll(elements) {
        return document.querySelectorAll(elements);
    }

    let TasksData = {};
    const Todo = select('#todo');
    const Progress = select('#progress');
    const done = select('#done');
    const columns = [Todo, Progress, done];
    let dragging = false;
    let currentTask = null;
    let Adding = false;
    let draggedElement = null;
    
    const AddButton = select('#addNewTask')
    function updateButtonText() {
        if (window.innerWidth <= 600) {
            AddButton.innerHTML = 'Add new task';
        }
        else {
            AddButton.innerHTML = `Add new task <span>Ctrl+c</span>`;
        }
    }
    updateButtonText();
    window.addEventListener('resize', updateButtonText);
    function addTasks(title, desc, columnName) {
        let div = document.createElement('div');
        div.classList.add('task');
        div.setAttribute('draggable', 'true');

        div.innerHTML = ` <h1>${title}</h1>
                        <p>${desc} </p>
                        <div class="EDbutton">
                         <button class='Edit'>Edit</button>
                         <button class='delete'>Delete</button>
                        </div>`

        columnName.appendChild(div);
        div.addEventListener('drag', () => {
            draggedElement = div;
        })

        const deleteButton = div.querySelector('.delete');
        deleteButton.addEventListener('click', () => {
            let Confirm = confirm('Are you sure to delete!!');
            if (!Confirm) {
                return
            }

            div.remove();
            updateTasksCount();
        });

        const EditButton = div.querySelector('.Edit');
        EditButton.addEventListener('click', () => {
            Adding = false;

            currentTask = div;
            select('.modal').classList.toggle('active');
            select('#taskTitle').value = title;
            select('#taskDescription').value = desc;
            select('#addTask').textContent = 'update';
        })

        return div
    }

    function updateTasksCount() {
        columns.forEach(col => {
            let Tasks = col.querySelectorAll('.task');
            let count = col.querySelector('.right');
            count.innerHTML = Tasks.length;
            TasksData[col.id] = Array.from(Tasks).map(t => {

                return {
                    Title: t.querySelector('h1').innerHTML,
                    desc: t.querySelector('p').innerHTML
                }
            })
            localStorage.setItem('Tasks', JSON.stringify(TasksData));

        })
    }
    function EditTask() {
        if (!currentTask) return;

        const TitleValue = select('#taskTitle').value;
        const DescValue = select('#taskDescription').value;

        currentTask.querySelector('h1').textContent = TitleValue;
        currentTask.querySelector('p').textContent = DescValue;

        // reset state
        currentTask = null;

        select('#addTask').textContent = 'Add';
        select('#taskTitle').value = '';
        select('#taskDescription').value = '';
        Modal.classList.remove('active');

        updateTasksCount();
    }

    if (localStorage.getItem('Tasks')) {
        let data = JSON.parse(localStorage.getItem('Tasks'));
        for (const colum in data) {
            const column = select(`#${colum}`);

            data[colum].forEach(taskk => {
                addTasks(taskk.Title, taskk.desc, column);
            })
        }

        updateTasksCount();
    }


    const tasks = SelectAll('.task');

    tasks.forEach(tas => {
        tas.addEventListener('drag', (e) => {
            draggedElement = tas;
        });
    })

    function DragEffectInColumn(column) {
        column.addEventListener('dragenter', (e) => {
            e.preventDefault();
            if (!dragging) {
                column.classList.add('hover-over');
                dragging = true;
            }
        });
        column.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (dragging) {
                column.classList.remove('hover-over');
                dragging = false;
            }
        });

        column.addEventListener('dragover', (e) => {
            e.preventDefault();
        })

        column.addEventListener('drop', (e) => {
            e.preventDefault();


            column.appendChild(draggedElement);
            column.classList.remove('hover-over');
            updateTasksCount();

        })
    }

    DragEffectInColumn(Todo)
    DragEffectInColumn(Progress)
    DragEffectInColumn(done)

    /* Modal related logic  */

    const Modal = select('.modal');
    const addButton = select('#addNewTask');
    const bg = select('.bg');
    function addTaskModal() {
        Adding = true;
        Modal.classList.toggle('active');
        select('#addTask').textContent = 'Add task';
    }
    addButton.addEventListener('click', addTaskModal);

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            addTaskModal();
        }
    })

    bg.addEventListener('click', () => {
        Modal.classList.remove('active');
        select('#taskTitle').value = '';
        select('#taskDescription').value = '';
    })

    // add task button event

    const AddTask = select('#addTask');

    AddTask.addEventListener('click', () => {
        const TitleValue = select('#taskTitle').value;
        const DescValue = select('#taskDescription').value;
        if (Adding === true) {
            if (TitleValue === '' || DescValue === '') {
                alert('fill all the information first!!!')
                return
            }

            addTasks(TitleValue, DescValue, Todo);


            updateTasksCount();
            Modal.classList.remove('active');
            select('#taskTitle').value = "";
            select('#taskDescription').value = "";
        }

        if (!Adding) {
            if (TitleValue === '' || DescValue === '') {
                alert('fill all the information first!!!')
                return
            }
            EditTask(TitleValue, DescValue, Todo)
        }
    })
    
}


RunTheApplication();