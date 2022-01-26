// Time
const dateNumber = document.getElementById('dateNumber')
const dateText = document.getElementById('dateText')
const dateMonth = document.getElementById('dateMonth')
const dateYear = document.getElementById('dateYear')

const setDate = () => {
    const date = new Date();
    dateNumber.textContent = date.toLocaleString('es', {day: 'numeric'})
    dateText.textContent = date.toLocaleString('es', {weekday: 'long'})
    dateMonth.textContent = date.toLocaleString('es', {month: 'short'})
    dateYear.textContent = date.toLocaleString('es', {year: 'numeric'})
}

setDate()

// Tasks
const formulario = document.getElementById('formulario')
const input = document.getElementById('input')
const listaTarea = document.getElementById('lista-tareas')
const template = document.getElementById('template').content
const fragment = document.createDocumentFragment()

let tareas = {}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    showTasks()
})

formulario.addEventListener('submit', (e) => {
    e.preventDefault()
    setTask(e)
})

listaTarea.addEventListener('click', (e) => {
    btnAccion(e)
})

const setTask = () => {
    if (input.value.trim() === '') {
        return
    }  

    const tarea = {
        id: Date.now(),
        text: input.value,
        status: false
    }

    tareas[tarea.id] = tarea
    formulario.reset()
    input.focus()
    
    showTasks()  
}

const showTasks = () => {

    localStorage.setItem('tareas', JSON.stringify(tareas))

    if (Object.values(tareas).length === 0) {
        listaTarea.innerHTML = `
            <div class="alert alert-dark text-center">
                Felicidades, no hay tareas por realizar 😁
            </div>`
        return
    } else {
        listaTarea.innerHTML = ''
        Object.values(tareas).forEach((tarea) => {
            const clone = template.cloneNode(true)
            clone.querySelector("p").textContent = tarea.text
            if (tarea.status) {
                clone
                    .querySelector(".alert")
                    .classList.replace("alert-warning", "alert-primary")
                clone
                    .querySelector(".fas")
                    .classList.replace("fa-check-circle", "fa-undo-alt")
                clone.querySelector('p').style.textDecoration = "line-through"
            }
            clone.querySelectorAll(".fas")[0].dataset.id = tarea.id
            clone.querySelectorAll(".fas")[1].dataset.id = tarea.id
            fragment.appendChild(clone)
        })
        listaTarea.appendChild(fragment)
    }
}

const btnAccion = (e) => {
    if (e.target.classList.contains("fa-check-circle")) {
        tareas[e.target.dataset.id].status = true
        showTasks()
    }

    if(e.target.classList.contains("fa-undo-alt")) {
        tareas[e.target.dataset.id].status = false
        showTasks()
    }

    if (e.target.classList.contains("fa-minus-circle")) {
        delete tareas[e.target.dataset.id]
        showTasks()
    } 

    e.stopPropagation()
}
