import { useState } from "react";
import "./App.css";

function App() {
  const [taskText, setTaskText] = useState("");
  const [taskType, setTaskType] = useState("todo");
  const [tasks, setTasks] = useState([]);

  function addTask() {
    if (taskText.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      status: taskType,
    };

    setTasks([...tasks, newTask]);
    setTaskText("");
    setTaskType("todo");
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function moveTask(id, newStatus) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task,
      ),
    );
  }

  function renderTasks(status) {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div key={task.id} className="taskCard">
          <p>{task.text}</p>

          <div className="taskActions">
            {status !== "todo" && (
              <button onClick={() => moveTask(task.id, "todo")}>To Do</button>
            )}

            {status !== "inprogress" && (
              <button onClick={() => moveTask(task.id, "inprogress")}>
                In Progress
              </button>
            )}

            {status !== "done" && (
              <button onClick={() => moveTask(task.id, "done")}>Done</button>
            )}

            <button onClick={() => deleteTask(task.id)}>X</button>
          </div>
        </div>
      ));
  }

  return (
    <>
      <div className="container">
        <h1 style={{ margin: "20px 0px" }}>Kanban Task Board</h1>

        {/* Input section */}
        <div className="addTaskInputContainer">
          <div className="enterTask">
            <input
              type="text"
              className="inputTask"
              placeholder="Enter task"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
            />
          </div>

          <div className="type">
            <select
              name="taskType"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <button onClick={addTask}>Add</button>
        </div>

        {/* Board */}
        <div className="taskTypeContainer">
          <div className="todoContainer">{renderTasks("todo")}</div>

          <div className="inProgressContainer">{renderTasks("inprogress")}</div>

          <div className="doneContainer">{renderTasks("done")}</div>
        </div>
      </div>
    </>
  );
}

export default App;
