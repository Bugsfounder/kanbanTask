import { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import "./App.css";
import DroppableContainer from "./components/DroppableContainer";
import DraggableTask from "./components/DraggableTask";

type TaskStatus = "todo" | "inprogress" | "done";

interface Task {
  id: number;
  text: string;
  status: TaskStatus;
}

function App() {
  const [taskText, setTaskText] = useState<string>("");
  const [taskType, setTaskType] = useState<TaskStatus>("todo");
  const [tasks, setTasks] = useState<Task[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { distance: 8 }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function addTask(): void {
    if (!taskText.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      status: taskType,
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskText("");
    setTaskType("todo");
  }

  function deleteTask(id: number): void {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    const activeTask = tasks.find((task) => task.id === activeId);
    const overTask = tasks.find((task) => task.id === overId);

    // Dropped on column (todo / inprogress / done)
    if (!overTask && activeTask) {
      const newStatus = over.id as TaskStatus;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeId ? { ...task, status: newStatus } : task,
        ),
      );
      return;
    }

    if (!activeTask || !overTask) return;

    // Reorder within same column
    if (activeTask.status === overTask.status) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      setTasks((prev) => arrayMove(prev, activeIndex, overIndex));
    } else {
      // Move to different column
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeId ? { ...task, status: overTask.status } : task,
        ),
      );
    }
  }

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div className="container">
      <h1 style={{ margin: "20px 0px" }}>Kanban Task Board</h1>

      <div className="addTaskInputContainer">
        <div className="enterTask">
          <input
            type="text"
            className="inputTask"
            placeholder="Enter task"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
        </div>

        <div className="type">
          <select
            name="taskType"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as TaskStatus)}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <button onClick={addTask}>Add</button>
      </div>

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
  );
}

export default App;
