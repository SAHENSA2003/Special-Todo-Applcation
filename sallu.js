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
    const DeleteIcon=`<svg height='15px' width='15px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffff"><path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z"></path></svg>`;
    const EditIcon=`<svg height='15px' width='15px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffff"><path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path></svg>`;

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
    
    function ClearInputValues() {
        select('#taskTitle').value = '';
        select('#taskDescription').value = '';
    }

    function focusOnTitle(){
        select('#taskTitle').focus();
    }
    function addTasks(title, desc, columnName) {
        let div = document.createElement('div');
        div.classList.add('task');
        div.setAttribute('draggable', 'true');

        div.innerHTML = ` <h1>${title}</h1>
                        <p>${desc} </p>
                        <div class="EDbutton">
                         <button title='Edit' class='Edit'>${EditIcon}</button>
                         <button title='Delete' class='delete'>${DeleteIcon}</button>
                        </div>`

        columnName.appendChild(div);
        div.addEventListener('drag', () => {
            draggedElement = div;
        })



        const deleteButton = div.querySelector('.delete');
        deleteButton.addEventListener('click', () => {
            let Confirm = confirm(`Are you sure to delete (${div.querySelector('h1').textContent}) !!`);
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

            const currentTitle = div.querySelector('h1').textContent;
            const currentDescription = div.querySelector('p').textContent;
            select('.modal').classList.toggle('active');
            select('#taskTitle').value = currentTitle;
            select('#taskDescription').value = currentDescription;
            focusOnTitle();
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
        focusOnTitle();
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
        ClearInputValues();
    })

    // add task button event

    const AddTask = select('#addTask');

    AddTask.addEventListener('click', () => {
        const TitleValue = select('#taskTitle').value;
        const DescValue = select('#taskDescription').value;
        if (Adding === true) {
            if (TitleValue === '' || DescValue === '') {
                alert('fill all the information first!!!');
                focusOnTitle();
                return
            }

            addTasks(TitleValue, DescValue, Todo);

            updateTasksCount();
            Modal.classList.remove('active');
            ClearInputValues();
        }

        if (!Adding) {
            if (TitleValue === '' || DescValue === '') {
                alert('fill all the information first!!!')
                focusOnTitle();
                return
            }
            EditTask();
            ClearInputValues();
        }
    })

}


RunTheApplication();