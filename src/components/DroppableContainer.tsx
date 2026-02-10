import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

type TaskStatus = "todo" | "inprogress" | "done";

interface DroppableContainerProps {
  id: TaskStatus;
  title: string;
  children: ReactNode;
}

export default function DroppableContainer({
  id,
  title,
  children,
}: DroppableContainerProps) {
  const { setNodeRef } = useDroppable({ id });

  const containerClass: Record<TaskStatus, string> = {
    todo: "todoContainer",
    inprogress: "inProgressContainer",
    done: "doneContainer",
  };

  return (
    <div ref={setNodeRef} className={containerClass[id]}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
