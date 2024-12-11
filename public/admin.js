document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("config-form");
    const todoContainer = document.getElementById("todo-container");
    const addTodoButton = document.getElementById("add-todo");

    // Add a new to-do item dynamically
    addTodoButton.addEventListener("click", () => {
        const todoDiv = document.createElement("div");
        todoDiv.className = "todo-item";
        todoDiv.innerHTML = `
            <input type="text" class="todo-text" placeholder="Task description" required>
            <input type="datetime-local" class="todo-deadline" required>
            <button type="button" class="remove-todo">Remove</button>
        `;
        todoContainer.appendChild(todoDiv);

        // Remove the to-do item
        todoDiv.querySelector(".remove-todo").addEventListener("click", () => {
            todoDiv.remove();
        });
    });

    // Handle form submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const bay = form["bay-select"].value - 1;
        const projectName = form["project-name"].value;
        const responsiblePerson = form["responsible-person"].value;
        const projectDeadline = form["project-deadline"].value;

        const todos = [];
        document.querySelectorAll(".todo-item").forEach((item) => {
            const text = item.querySelector(".todo-text").value;
            const deadline = item.querySelector(".todo-deadline").value;
            todos.push({ text, deadline });
        });

        // Fetch current data
        const response = await fetch("/data");
        const data = await response.json();

        // Update selected bay
        data.quadrants[bay] = {
            projectName,
            assignedPerson: responsiblePerson,
            timer: projectDeadline,
            tasks: todos
        };

        // Save updated data
        await fetch("/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        alert("Configuration saved!");
        form.reset();
        todoContainer.innerHTML = ""; // Clear to-do list items
    });
});
