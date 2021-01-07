const firebaseConfig = {
    apiKey: "AIzaSyCO_SkvdJx75eOm3i14pCc1H-BXkkW0nsg",
    authDomain: "happy-new-year-e4dec.firebaseapp.com",
    databaseURL: "https://happy-new-year-e4dec-default-rtdb.firebaseio.com",
    projectId: "happy-new-year-e4dec",
    storageBucket: "happy-new-year-e4dec.appspot.com",
    messagingSenderId: "723749908791",
    appId: "1:723749908791:web:f014745d65df6203206ab2"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
$(document).ready(function() {
    $( function() {
    $( "#tabs" ).tabs();
    });

    let alreadyAddedWorkers = [];

    const renderWorkers = () => {
        alreadyAddedWorkers = [];
         $('.workers-container').html('')
        database.ref('workers').on('value',(snap)=> {
            for (let i = 1; i < snap.val().length; i++) {
                if (snap.val()[i]) {
                    if (!alreadyAddedWorkers.some(w => w.name == snap.val()[i].name)) {
                        $('.workers-container').append(
                            `<div nth=${i} class='box'>
                                    <p class='title'>${snap.val()[i].name}</p>
                                    <button class='tasks-button button is-primary'>Tasks</button>
                                    <button class='projects-button button is-success'>Projects</button>
                                    <button class='add-worker-project-btn button is-warning has-text-white'>Append Project</button>
                                    <button class='worker-delete-button button is-danger'>Delete</button>
                            </div>`
                        )
                        $('div[nth=' + i + '] button.tasks-button').click(function() {
                        if (snap.val()[i].tasks) {
                                Swal.fire({
                                    title: 'Tasks',
                                    html: (snap.val()[i].tasks.
                                    map(t => t.length ? 
                                        (moment().format() < moment().format(t.deadline) ?
                                        `<div class='box has-background-danger'><h1 class='subtitle has-text-white'>${t}</h1></div>`
                                        :
                                        `<div class='box'><h1 class='subtitle'>${t}</h1></div>`)
                                        : 
                                        '').
                                        join("")),
                                    height: 'auto'
                                })
                            }
                            else {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'No Tasks'
                                })                        
                            }
                        })
                        $('div[nth=' + i + '] button.projects-button').click(function() {
                            if (snap.val()[i].projects) {
                                Swal.fire({
                                    title: 'Projects',
                                    html: `
                                    ${(snap.val()[i].projects.map(t => t.length ? `
                                        <div class='box'>
                                        <h1 class='subtitle'>${t}</h1></div>
                                    ` : '').join(""))}`,
                                    height: 'auto'
                                })                        
                            }
                            else {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'No Projects'
                                })
                            }

                        })
                        alreadyAddedWorkers.push(snap.val()[i]) 
                    }
                    else {

                    }
                }
                else {
                    alreadyAddedWorkers.push('')
                }
            }
        });
    };

    renderWorkers();

    let alreadyAddedProjects = [];

    const renderProjects =() => {
        alreadyAddedProjects = [];
         $('.projects-container').html('')
        database.ref('projects').on('value',(snap)=> {
            for (let i = 1; i < snap.val().length; i++) {
                if (snap.val()[i]) {
                    if (!alreadyAddedProjects.some(w => w.header == snap.val()[i].header && w.deadline == snap.val()[i].deadline)) {
                        if (moment().format('YYYY-MM-DD') > moment().format(snap.val()[i].deadline)) {
                            $('.projects-container').append(
                                `<div nth=${i} class='box has-background-danger has-text-white'>
                                        <p>${snap.val()[i].header}</p>
                                        <p>${snap.val()[i].deadline}</p>
                                        <button class="delete-project-btn delete"></button>
                                    </div>`
                            )
                        }
                        else {
                            $('.projects-container').append(
                                `<div nth=${i} class='box'>
                                        <p>${snap.val()[i].header}</p>
                                        <p>${snap.val()[i].deadline}</p>
                                        <button class="delete-project-btn delete"></button>
                                    </div>`
                            )
                        }

                        alreadyAddedProjects.push(snap.val()[i]) 
                    }
                    else {

                    }
                }
                else {
                    alreadyAddedProjects.push('')
                }
            }
        });
    };

    renderProjects();

    let alreadyAddedTasks = [];

    const renderTasks = () => {
        alreadyAddedTasks = [];
         $('.tasks-container').html('')
        database.ref('tasks').on('value',(snap)=> {
            //console.log(snap.val()[2])
            if (snap.val()) {
                
                for (let i = 1; i < snap.val().length ; i++) {
                    if (snap.val()[i]) {
                        if (!alreadyAddedTasks.some(w => w.header == snap.val()[i].header && w.worker == snap.val()[i].worker)) {
                            if (moment().format('YYYY-MM-DD') > moment().format(snap.val()[i].deadline)) {
                                $('.tasks-container').append(
                                    `<div nth=${i} class='box has-background-danger has-text-white'>
                                            <p>${snap.val()[i].header}</p>
                                            <p>${snap.val()[i].deadline}</p>
                                            <p>Maker: ${snap.val()[i].worker}</p>
                                            <button class="delete-task-btn delete"></button>
                                    </div>`
                                )
                                alreadyAddedTasks.push(snap.val()[i])
                            }
                            else {
                                $('.tasks-container').append(
                                    `<div nth=${i} class='box'>
                                            <p>${snap.val()[i].header}</p>
                                            <p>${snap.val()[i].deadline}</p>
                                            <p>Maker: ${snap.val()[i].worker}</p>
                                            <button class="delete-task-btn delete"></button>
                                    </div>`
                                )
                                alreadyAddedTasks.push(snap.val()[i])
                            }
                        }
                        else {

                        }
                    }
                    else {
                        alreadyAddedTasks.push('')
                    }
                }        
            }
            console.log(alreadyAddedTasks)
        });  
    };

    renderTasks();

    $('.add-worker-btn').click(async () => {
        const name = await Swal.fire({
            title: 'Enter Worker Name',
            input: 'text',
            inputLabel: 'Worker Name',
            inputPlaceholder: 'Enter Worker Name'
        })
        if (name.isConfirmed && name.value) {
            database.ref(
                'workers/' + (
                    parseInt(
                        $('.workers-container').children().last().attr('nth') ? 
                            $('.workers-container').children().last().attr('nth') : 0) + 1)
                        )
                    .set({name: name.value}
            ) 
        }   
    });

    $('.add-project-btn').click(async () => {
        const value = await Swal.fire({
            title: 'New Project',
            html:
            '<input placeholder="Project Header" id="project-input1" class="swal2-input">' +
            '<input id="project-input2" type="date" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
            return [
                document.getElementById('project-input1').value,
                document.getElementById('project-input2').value
            ]
            }
        });
        if (value.isConfirmed && value.value) {
            database.ref(
                'projects/' + (
                    parseInt(
                        $('.projects-container').children().last().attr('nth') ? 
                            $('.projects-container').children().last().attr('nth') : 0) + 1)
                        )
                    .set({header: value.value[0], deadline: value.value[1]}
            )
        }   
    });

    $('.add-task-btn').click(async () => {
        const value = await Swal.fire({
            title: 'New Task',
            html:
            `<input placeholder="Task Header" id="task-input1" class="swal2-input">` +
            `<input id="task-input2" type="date" class="swal2-input">` +
            `<select id="task-input3" type="date" class="swal2-select">
                ${alreadyAddedWorkers.map(worker => `<option>${worker.name}</option>`)}
            </select>`,
            focusConfirm: false,
            preConfirm: () => {
            return [
                document.getElementById('task-input1').value,
                document.getElementById('task-input2').value,
                worker = $('#task-input3').val()
            ]
            }
        });
        if (value.isConfirmed && value.value) {
            database.ref(
                'tasks/' + (
                    parseInt(
                        $('.tasks-container').children().last().attr('nth') ? 
                            $('.tasks-container').children().last().attr('nth') : 0) + 1)
                        )
                    .set({header: value.value[0], deadline: value.value[1], worker: value.value[2]}
            )
            let kozel = alreadyAddedWorkers.findIndex(e => e.name === value.value[2] ) + 1
            let lastTaskIndex = alreadyAddedWorkers[kozel - 1].tasks ? parseInt(Object.keys(
                alreadyAddedWorkers[kozel - 1].tasks.reverse())[0]) + 1 : 0;
            console.log(kozel)
            console.log(lastTaskIndex)
            database.ref(
                ('workers/' + kozel + '/tasks/' + (parseInt(lastTaskIndex) + 1))).set(value.value[0])
                alreadyAddedWorkers = [];
                database.ref('workers').on('value',(snap)=> {
                    for (let i = 1; i < snap.val().length; i++) {
                        if (snap.val()[i]) {
                            alreadyAddedWorkers.push(snap.val()[i]) 
                        }
                        else {
                            alreadyAddedWorkers.push('')
                        }
                    }
                });
        }
    });

    $(document).on('click', 'button[class^="add-worker-project-btn"]', async function() {
        console.log(alreadyAddedWorkers)
        const value = await Swal.fire({
            title: 'New Worker Project',
            html:
            `<select id="wp-input" class="swal2-select">
                ${alreadyAddedProjects.map(p => p ? (
                    (
                        alreadyAddedWorkers[
                            parseInt($(this).parents()[0].getAttribute('nth')) - 1
                        ].projects ?
                        alreadyAddedWorkers[
                        parseInt($(this).parents()[0].getAttribute('nth')) - 1
                    ].projects.some(e => e === p) : false)
                     ? 
                    null
                     : 
                    `<option>${p.header}</option>` )
                     : 
                    null)}
            </select>`,
            focusConfirm: false,
            preConfirm: () => {
            return  $('#wp-input').val()
            }
        });
        if (value.isConfirmed && value.value) {
            let kozel = parseInt($(this).parents()[0].getAttribute('nth'))
            let lastProjectIndex = alreadyAddedWorkers[kozel - 1].projects ? parseInt(Object.keys(
                alreadyAddedWorkers[kozel - 1].projects.reverse())[0]) + 1 : 0;
            if (alreadyAddedWorkers[kozel - 1].projects && alreadyAddedWorkers[kozel - 1].projects.some(e => e === value.value)) {
                Swal.fire({
                    title: 'Worker already has this Project',
                    icon: 'error'
                })
            }
            else {
                database.ref(
                    ('workers/' + kozel + '/projects/' + (parseInt(lastProjectIndex) + 1))).set(value.value)
                    alreadyAddedWorkers = [];
                    database.ref('workers').on('value',(snap)=> {
                        for (let i = 1; i < snap.val().length; i++) {
                            if (snap.val()[i]) {
                                alreadyAddedWorkers.push(snap.val()[i]) 
                            }
                            else {
                                alreadyAddedWorkers.push('')
                            }
                        }
                })                
            };
        }
    });
    //delete-task-btn
    $(document).on('click', 'button[class^="delete-task-btn"]', function() {
        const taskIndex = $(this).parents()[0].getAttribute('nth');
        const workerName = $(this).context.previousElementSibling.innerHTML.slice(7);
        
        const workerIndex = alreadyAddedWorkers.
            findIndex(
                w => w.tasks ? w.tasks.some(t => t === alreadyAddedTasks[parseInt(taskIndex) - 1].header) : null
            )
        ;
        
        const workerTaskIndex = alreadyAddedWorkers[workerIndex].tasks
            .findIndex(
                e => e === alreadyAddedTasks[taskIndex - 1].header
            )
        ;
        console.log(`workers/${parseInt(workerIndex) + 1}/tasks/${workerTaskIndex}`);
        database.ref(`workers/${parseInt(workerIndex) + 1}/tasks/${workerTaskIndex}`).remove();
        database.ref(`tasks/${taskIndex}`).remove();
        renderTasks();
    });

    $(document).on('click', 'button[class^="worker-delete-button"]', function() {
        const workerIndex = parseInt($(this).parents()[0].getAttribute('nth'));
        console.log(workerIndex);
        database.ref(`workers/${workerIndex}`).remove();
        let tasks = [];
        alreadyAddedWorkers[workerIndex - 1].tasks.
            map(w => alreadyAddedTasks
                .some(t => t.header === w && 
                    t.worker === alreadyAddedWorkers[workerIndex - 1].name ? 
                        tasks.push(t) : null));
        console.log(tasks);
        let taskIndexes = [];
        if (tasks.length) {
            taskIndexes = tasks
                .map(t => alreadyAddedTasks
                    .findIndex(
                        aT => aT 
                            ? 
                            (aT.header === t.header 
                                && aT.worker === t.worker 
                                ? aT 
                                    : null)
                            : null
                    )
                );
        }
        if (taskIndexes.length) {
            taskIndexes.map(i => database.ref(`tasks/${i + 1}`).remove());
        }
    });

    $(document).on('click', 'button[class^="delete-project-btn"]', function() {
        const projectIndex = parseInt($(this).parents()[0].getAttribute('nth'));
        database.ref(`projects/${projectIndex}`).remove()
        let workerProjectIndex = [];
        alreadyAddedWorkers
        .map(w => {
            w
            ?
                w.projects ? w.projects.
                    map(p => p === alreadyAddedProjects[projectIndex - 1].header
                    ?
                        workerProjectIndex.push(
                            {
                                [alreadyAddedWorkers.findIndex(wk => wk.name === w.name) + 1]
                                : 
                                w.projects.findIndex(pr => pr === p)})
                    :
                        null
                    ) : null 
            : 
                null
        });
        if (workerProjectIndex.length) {
            const projectWorkerIndexKey = parseInt(Object.keys(workerProjectIndex[0])[0])
            const projectWorkerIndexValue = parseInt(Object.values(workerProjectIndex[0])[0])
            database.ref(`workers/${projectWorkerIndexKey}/projects/${projectWorkerIndexValue}`).remove()
        };
        renderProjects();
        renderWorkers();
    })
})