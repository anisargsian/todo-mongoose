const url = "http://localhost:4000/api/";

let todos = [];
const body = document.querySelector("body");

const toJson = res => res.json();

const saveData = data => {
    todos = data;
    return data;
};

const renderAddTodoInput = () => {
    return `
        <div>
            <input type="text" id="newTodo" />
            <button type="button" id="addBtn" onclick="addTodoHandler()">Add</button>
        </div>
    `
}

const renderUpdateTodoInput = () => {
    return `
        <div>
            <input type="text" id="updateTodo" />
            <button type="button" id="updateBtn" onclick="updateTodoHandler()">Update</button>
        </div>
`
}

const renderTodoList = data => {
    return `
        ${data.length <= 0 
            ? `<h1>No todos added!</h1>`
            : data.map(todo => 
                `<li id="${todo._id}">
                    ${todo.message}
                    <button onclick="getTodoToUpdate('${todo._id}')">Edit</button>
                    <button onclick="deleteTodoHandler('${todo._id}')">Delete</button>
                </li>`
            ).join(" ")
        }
    `
}

const renderUI = todolist => {
    return `
        ${renderAddTodoInput()}
        ${renderUpdateTodoInput()}
        ${renderTodoList(todolist)}
    `
};

const getTodosHandler = () => {
    fetch(url)
        .then(res => res.json())
        .then(data => saveData(data))
        .then(() => {body.innerHTML = renderUI(todos)});
};

const addTodoHandler = () => {
    const message = document.getElementById("newTodo").value;
    if (!message) {
        alert("Invalid Inputs!");
    } else {
        fetch(url, {
            method: "POST",
            body: JSON.stringify({ text: message }),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        }).then(getTodosHandler());
    }
};

const deleteTodoHandler = id => {
    return fetch(url +"delete/" + id, {
        method: "DELETE"
    }).then(getTodosHandler());
};

const updateTodoHandler = () => {
    const textField = document.getElementById("updateTodo");
    const updatedText = textField.value;
    const id = textField.name;
    return updatedText 
                ? fetch(url +"update/" + id, {
                    method: "POST",
                    body: JSON.stringify({text: updatedText}),
                    headers: new Headers ({
                        "Content-Type": "application/json"
                    })
                }).then(getTodosHandler())
                : alert("Invalid Text!");
};

const getTodoToUpdate = id => {
    const input = document.getElementById("updateTodo");
    todos.map(todo => {
        if (todo._id === id ) {
            input.value = todo.message;
            input.name = todo._id;
        } 
    })
};

getTodosHandler();