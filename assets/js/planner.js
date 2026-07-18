"use strict";

// Academic planner state and storage
(() => {
    const storageKey = "cos106AcademicTasks";
    const allowedPriorities = ["Low", "Medium", "High"];
    let tasks = [];

    const taskForm = document.querySelector("#task-form");
    const titleInput = document.querySelector("#task-title");
    const courseInput = document.querySelector("#task-course");
    const dueDateInput = document.querySelector("#task-due-date");
    const priorityInput = document.querySelector("#task-priority");
    const formMessage = document.querySelector("#task-form-message");
    const taskList = document.querySelector("#task-list");
    const emptyState = document.querySelector("#empty-state");
    const totalTasks = document.querySelector("#total-tasks");
    const completedTasks = document.querySelector("#completed-tasks");
    const remainingTasks = document.querySelector("#remaining-tasks");

    if (
        !taskForm ||
        !titleInput ||
        !courseInput ||
        !dueDateInput ||
        !priorityInput ||
        !formMessage ||
        !taskList ||
        !emptyState ||
        !totalTasks ||
        !completedTasks ||
        !remainingTasks
    ) {
        return;
    }

    function loadTasks() {
        try {
            const storedTasks = JSON.parse(localStorage.getItem(storageKey));

            if (!Array.isArray(storedTasks)) {
                return [];
            }

            return storedTasks
                .filter((task) => task && typeof task === "object")
                .map((task) => ({
                    id: Number(task.id) || Date.now(),
                    title: String(task.title || "").trim(),
                    course: String(task.course || "").trim(),
                    dueDate: String(task.dueDate || "").trim(),
                    priority: allowedPriorities.includes(task.priority) ? task.priority : "Low",
                    completed: Boolean(task.completed),
                }))
                .filter((task) => task.title && task.course && task.dueDate);
        } catch (error) {
            localStorage.removeItem(storageKey);
            return [];
        }
    }

    function saveTasks() {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
    }

    function setFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.classList.toggle("is-error", type === "error");
        formMessage.classList.toggle("is-success", type === "success");
    }

    function setInvalidField(field, isInvalid) {
        field.setAttribute("aria-invalid", String(isInvalid));
    }

    function getTodayDateValue() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function validateTaskForm() {
        const title = titleInput.value.trim();
        const course = courseInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;
        const today = getTodayDateValue();

        setInvalidField(titleInput, !title);
        setInvalidField(courseInput, !course);
        setInvalidField(dueDateInput, !dueDate);
        setInvalidField(priorityInput, !priority);

        if (!title || !course || !dueDate || !priority) {
            return {
                isValid: false,
                message: "Please complete all task fields before adding a task.",
            };
        }

        if (title.length < 3) {
            setInvalidField(titleInput, true);
            return {
                isValid: false,
                message: "Task title must be at least 3 characters.",
            };
        }

        if (course.length < 3) {
            setInvalidField(courseInput, true);
            return {
                isValid: false,
                message: "Course or subject must be at least 3 characters.",
            };
        }

        if (dueDate < today) {
            setInvalidField(dueDateInput, true);
            return {
                isValid: false,
                message: "Due date cannot be earlier than today.",
            };
        }

        if (!allowedPriorities.includes(priority)) {
            setInvalidField(priorityInput, true);
            return {
                isValid: false,
                message: "Please choose a valid priority.",
            };
        }

        return {
            isValid: true,
            task: {
                id: Date.now(),
                title,
                course,
                dueDate,
                priority,
                completed: false,
            },
        };
    }

    function formatDueDate(dateValue) {
        const dueDate = new Date(`${dateValue}T00:00:00`);

        if (Number.isNaN(dueDate.getTime())) {
            return "Date unavailable";
        }

        return dueDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function getDueDateTime(dateValue) {
        const dueDate = new Date(`${dateValue}T00:00:00`);
        return Number.isNaN(dueDate.getTime()) ? Number.MAX_SAFE_INTEGER : dueDate.getTime();
    }

    function getSortedTasks() {
        return [...tasks].sort((firstTask, secondTask) => {
            if (firstTask.completed !== secondTask.completed) {
                return Number(firstTask.completed) - Number(secondTask.completed);
            }

            return getDueDateTime(firstTask.dueDate) - getDueDateTime(secondTask.dueDate);
        });
    }

    function createTextElement(tagName, className, text) {
        const element = document.createElement(tagName);
        element.className = className;
        element.textContent = text;
        return element;
    }

    function createTaskElement(task) {
        const item = document.createElement("li");
        item.className = "task-item";
        item.dataset.taskId = String(task.id);

        if (task.completed) {
            item.classList.add("is-completed");
        }

        const taskContent = document.createElement("div");
        taskContent.className = "task-content";

        const title = createTextElement("h3", "task-title", task.title);

        const meta = document.createElement("div");
        meta.className = "task-meta";

        const course = createTextElement("span", "task-course", task.course);
        const dueDate = document.createElement("time");
        dueDate.dateTime = task.dueDate;
        dueDate.textContent = `Due ${formatDueDate(task.dueDate)}`;

        const badges = document.createElement("div");
        badges.className = "task-badges";
        const priority = createTextElement("span", "priority-label", `${task.priority} Priority`);
        const state = createTextElement("span", "task-state", task.completed ? "Completed" : "Pending");

        meta.append(course, dueDate);
        badges.append(priority, state);
        taskContent.append(title, meta, badges);

        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";

        const toggleButton = document.createElement("button");
        toggleButton.className = "task-action complete-action";
        toggleButton.type = "button";
        toggleButton.dataset.action = "toggle";
        toggleButton.textContent = task.completed ? "Undo" : "Mark Complete";
        toggleButton.setAttribute(
            "aria-label",
            task.completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`
        );

        const deleteButton = document.createElement("button");
        deleteButton.className = "task-action delete-action";
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${task.title}`);

        taskActions.append(toggleButton, deleteButton);
        item.append(taskContent, taskActions);

        return item;
    }

    function updateTaskSummary() {
        const completedCount = tasks.filter((task) => task.completed).length;

        totalTasks.textContent = String(tasks.length);
        completedTasks.textContent = String(completedCount);
        remainingTasks.textContent = String(tasks.length - completedCount);
    }

    function renderTasks() {
        taskList.innerHTML = "";

        emptyState.classList.toggle("is-hidden", tasks.length > 0);

        getSortedTasks().forEach((task) => {
            taskList.append(createTaskElement(task));
        });

        updateTaskSummary();
    }

    function addTask(event) {
        event.preventDefault();

        const result = validateTaskForm();

        if (!result.isValid) {
            setFormMessage(result.message, "error");
            return;
        }

        tasks.push(result.task);
        saveTasks();
        renderTasks();

        taskForm.reset();
        [titleInput, courseInput, dueDateInput, priorityInput].forEach((field) => {
            setInvalidField(field, false);
        });
        setFormMessage("Task added.", "success");
        titleInput.focus();
    }

    function toggleTask(taskId) {
        tasks = tasks.map((task) => (
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
        saveTasks();
        renderTasks();
    }

    function deleteTask(taskId) {
        tasks = tasks.filter((task) => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    // Task list actions
    taskList.addEventListener("click", (event) => {
        const actionButton = event.target.closest("button[data-action]");

        if (!actionButton) {
            return;
        }

        const taskItem = actionButton.closest(".task-item");
        const taskId = Number(taskItem?.dataset.taskId);

        if (!taskId) {
            return;
        }

        if (actionButton.dataset.action === "toggle") {
            toggleTask(taskId);
        }

        if (actionButton.dataset.action === "delete") {
            deleteTask(taskId);
        }
    });

    taskForm.addEventListener("submit", addTask);

    dueDateInput.min = getTodayDateValue();
    tasks = loadTasks();
    renderTasks();
})();
