import { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import "./App.css";
import DroppableContainer from "./components/DroppableContainer";
import DraggableTask from "./components/DraggableTask";

function App() {
  const [taskText, setTaskText] = useState("");
  const [taskType, setTaskType] = useState("todo");
  const [tasks, setTasks] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === parseInt(active.id));
    const overTaskId = parseInt(over.id);
    const overTask = tasks.find((task) => task.id === overTaskId);

    if (!activeTask || !overTask) {
      // Moving to a different container
      const newStatus = over.id;

      setTasks(
        tasks.map((task) =>
          task.id === parseInt(active.id)
            ? { ...task, status: newStatus }
            : task,
        ),
      );
      return;
    }

    // Reordering within same container
    if (activeTask.status === overTask.status) {
      const activeIndex = tasks.findIndex((t) => t.id === parseInt(active.id));
      const overIndex = tasks.findIndex((t) => t.id === overTaskId);

      setTasks(arrayMove(tasks, activeIndex, overIndex));
    } else {
      // Moving to different container
      setTasks(
        tasks.map((task) =>
          task.id === parseInt(active.id)
            ? { ...task, status: overTask.status }
            : task,
        ),
      );
    }
  }

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress");
  const doneTasks = tasks.filter((task) => task.status === "done");

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
              onKeyPress={(e) => e.key === "Enter" && addTask()}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="taskTypeContainer">
            <DroppableContainer id="todo" title="To Do">
              <SortableContext
                items={todoTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {todoTasks.map((task) => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                  />
                ))}
              </SortableContext>
            </DroppableContainer>

            <DroppableContainer id="inprogress" title="In Progress">
              <SortableContext
                items={inProgressTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {inProgressTasks.map((task) => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                  />
                ))}
              </SortableContext>
            </DroppableContainer>

            <DroppableContainer id="done" title="Done">
              <SortableContext
                items={doneTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {doneTasks.map((task) => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                  />
                ))}
              </SortableContext>
            </DroppableContainer>
          </div>
        </DndContext>
      </div>
    </>
  );
}

export default App;
