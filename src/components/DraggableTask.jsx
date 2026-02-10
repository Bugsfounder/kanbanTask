import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function DraggableTask({ task, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="taskCard"
            {...attributes}
        >
            <div {...listeners} style={{
                width: " 100%"
            }}>
                <p>{task.text}</p>
            </div>
            <div className="taskActions">
                <button
                    onClick={() => onDelete(task.id)}
                    className="deleteBtn"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
