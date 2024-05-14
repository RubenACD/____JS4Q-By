
// Navigation handling
var jokeTimer;
const nav = {
    pages: [],
    show: new Event('show'),
    init: function(){
        getTodos();
        console.log("Init");
        document.querySelectorAll('.nav-link').forEach((link)=>{
            link.addEventListener('click', nav.tgt);
        })
    },
    tgt: function(ev){
        console.log("Tgt");
        clearInterval(jokeTimer);
        ev.preventDefault();
        let curPage = ev.target.getAttribute('data-target');
        document.querySelector('.active').classList.remove('active'); 
        document.getElementById(curPage).classList.add('active');
        switch(curPage){
            case "weather-article":
                getWeather();
                break;
            case "jokes-article":
                loadJokes();
                jokeTimer = setInterval(loadJokes, 30000);
                console.log("JokeTimer in switch: " + jokeTimer);
                break;
        }
    }    
}

// Selectors
const todoArticle = document.querySelector('.todo-article');
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector(".filter-todo");

const wKey = '88d9a36b3ef542a0b78141319242504'; // Weather API Key
const weatherTable = document.querySelector('.weather-table');

console.log("Listeners");
// Event Listeners
//document.addEventListener("DOMContentLoaded", getTodos);
document.addEventListener("DOMContentLoaded", nav.init);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener("click", filterTodo); 

// Functions

function addTodo(event){
    console.log("addTodo");
// Prevent form from submitting
    event.preventDefault();
// Create Todo DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
// Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);
// Save ToDo to loal storage
    saveLocalTodos(todoInput.value);
// Checkmark button
    const completedButton = document.createElement('button')    ;
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
// Trash button
    const trashButton = document.createElement('button')    ;
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
// Append to UL    
    todoList.appendChild(todoDiv); 
// Clear Input value
    todoInput.value = "";    
}

function deleteCheck (e){
    console.log("deleteCheck");
    const item = e.target;
    if (item.classList) {
// Delete item
        if (item.classList[0] === "trash-btn") {
            const todo = item.parentElement;
            // Animation
            todo.classList.add('fall');
            removeLocalTodos(todo);
            todo.addEventListener("transitionend", function(){
                todo.remove();
            })
        }

// Checkmark item
        if (item.classList[0] === "complete-btn") {
            const todo = item.parentElement;
            const todoData = todo.firstChild.innerText;
            let todoStatus = 1;
            if (todo.classList[1] === "completed"){
                todoStatus = 0;
            }
            todo.classList.toggle("completed");
            updateLocalTodos(todoData, todoStatus);
        }
    }
}

// Filter
function filterTodo(e){
    console.log("filterTodo");
    const todos = todoList.childNodes;
    todos.forEach(function(todo){
        switch(e.target.value){
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if(todo.classList.contains('completed')){
                    todo.style.display = 'flex';
                }else{
                    todo.style.display ='none';
                }
                break;
            case "uncompleted":
                if(!todo.classList.contains('completed')){
                    todo.style.display = 'flex';
                }else{
                    todo.style.display ='none';
                }
                break;
        }
    })
}

function updateLocalTodos(todo, state){
    console.log("updateLocalTodos");
    let todos;
    let todosStates;
    // Check - Available recs
    if(localStorage.getItem('todos') === null){
        todos = [];
        todosStates = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
        todosStates = JSON.parse(localStorage.getItem('todosStates'));
    }
    let todosIndex = todos.indexOf(todo);
    todos[todosIndex] = todo;
    todosStates[todosIndex] = state;
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('todosStates', JSON.stringify(todosStates));
}

function saveLocalTodos(todo){
    console.log("saveLocalTodos");
    let todos;
    let todosStates;
    // Check - Available recs
    if (localStorage.getItem('todos') === null || localStorage.getItem('todosStates') === null) {
        console.log("No recs");
          todos = [];
          todosStates = [];
    } else {
        try{
            todos = JSON.parse(localStorage.getItem('todos'));
        }catch (err){
            console.log("todos parse error: "+err);
        }
        try{
            todosStates = JSON.parse(localStorage.getItem('todosStates'));
        }catch(err) {
          console.log("todosStates parse error: "+err);
        }    
    }
    todos.push(todo);
    todosStates.push(0);
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('todosStates', JSON.stringify(todosStates));
}

function getTodos(){
    console.log("getTodos");
    let todos;
    let todosStates;
    // Check - Available recs
    if (localStorage.getItem('todos') === null || localStorage.getItem('todosStates') === null) {
        console.log("No recs");
          todos = [];
          todosStates = [];
    } else {
        try{
            todos = JSON.parse(localStorage.getItem('todos'));
        }catch (err){
            console.log("todos parse error: "+err);
        }
        try{
            todosStates = JSON.parse(localStorage.getItem('todosStates'));
        }catch(err) {
          console.log("todosStates parse error: "+err);
        }    
    }
    if (!Array.isArray(todos) || !Array.isArray(todosStates)){
        console.log("Wrong data - no array(s) present");
    }else{
        todos.forEach(function(todo) {
            // Create Todo DIV
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");
            let todosIndex = todos.indexOf(todo);
            if (todosStates[todosIndex] === 1) {
                todoDiv.classList.add("completed");
            }
            // Create LI
            const newTodo = document.createElement("li");
            newTodo.innerText = todo;
            newTodo.classList.add('todo-item');
            todoDiv.appendChild(newTodo);
            // Checkmark button
            const completedButton = document.createElement('button')    ;
            completedButton.innerHTML = '<i class="fas fa-check"></i>';
            completedButton.classList.add("complete-btn");
            todoDiv.appendChild(completedButton);
            // Trash button
            const trashButton = document.createElement('button')    ;
            trashButton.innerHTML = '<i class="fas fa-trash"></i>';
            trashButton.classList.add("trash-btn");
            todoDiv.appendChild(trashButton);
            // Append to UL    
            todoList.appendChild(todoDiv);
    });
    }
}

function removeLocalTodos(todo){
    console.log("removeLocalTodos");
    let todos;
    let todosStates;
    // Check - Available recs
    if (localStorage.getItem('todos') === null) {
        todos = [];
        todosStates = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
        todosStates = JSON.parse(localStorage.getItem('todosStates'));
    }    
    const todoData = todo.children[0].innerText;
    const todoIndex = todos.indexOf(todoData);
    todos.splice(todoIndex, 1);
    todosStates.splice(todoIndex, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("todosStates", JSON.stringify(todosStates));
}

// Navigation bar handling
/* Open by setting the width of the side navigation to 250px */
function openNav() {
    console.log("openNav");
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Hide by setting the width of the side navigation to 0 */
  function closeNav() {
    console.log("closeNav");
    document.getElementById("mySidenav").style.width = "0";
  }


/* Load WeatherAPI for NYC */
function getWeather () {
    console.log("getWeather");
    // Call the API
    const fetchWeather = fetch("https://api.weatherapi.com/v1/current.json?key="+wKey+"&q=New York&aqi=no",);
    fetchWeather
    .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((wApi) => {

// Remove any data present
        while (weatherTable.firstChild){
            weatherTable.removeChild(weatherTable.firstChild);
        }
// Add rows with selected data
        addWeather('Local time:',wApi.location.localtime);
        addWeather('Last updated:',wApi.current.last_updated);
        addWeather('Feels like:',wApi.current.feelslike_c+"°C");
        addWeather('Humidity:',wApi.current.humidity+"%");
        addWeather('Wind direction:',wApi.current.wind_dir);
      })
      .catch((error) => {
        console.error(`Could not get weather: ${error}`);
      });
}

function addWeather(header, data) {
     // Create row
     const weatherRow = document.createElement("tr");
     weatherRow.classList.add('weather-line');
     // Create cells
     const weatherHead = document.createElement("td");
     weatherHead.innerText = header;
     weatherHead.classList.add('weather-head');
     weatherRow.appendChild(weatherHead);
     const weatherData = document.createElement("td");
     weatherData.innerText = data;
     weatherData.classList.add('weather-data');
     weatherRow.appendChild(weatherData);
     // Append to UL    
     weatherTable.appendChild(weatherRow);
}

/* Load Jokes API */
function loadJokes () {
    console.log("loadJokes");
    // Call the API
    const fetchJoke = fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit",);
    fetchJoke
    .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((jApi) => {
        console.log(jApi);
// Fill data    
        document.getElementById("category").innerHTML=jApi.category;
        if (jApi.type === "single"){
            document.getElementById("setup").innerHTML="";
            document.getElementById("pun").innerHTML=jApi.joke.replace(/\n/g, '<br>');
        }else{
            document.getElementById("setup").innerHTML=jApi.setup.replace(/\n/g, '<br>');
            document.getElementById("pun").innerHTML=jApi.delivery.replace(/\n/g, '<br>');
        }    
              })
      .catch((error) => {
        console.error(`Could not get jokes: ${error}`);
      });
}