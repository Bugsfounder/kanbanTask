import { useDroppable } from "@dnd-kit/core";

export default function DroppableContainer({ id, title, children }) {
    const { setNodeRef } = useDroppable({ id });

    const containerClass = {
        todo: "todoContainer",
        inprogress: "inProgressContainer",
        done: "doneContainer",
    }[id];

    return (
        <div ref={setNodeRef} className={containerClass}>
            <h2>{title}</h2>
            {children}
        </div>
    );
}
