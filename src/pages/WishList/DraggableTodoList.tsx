import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { TiArrowUnsorted } from "@react-icons/all-files/ti/TiArrowUnsorted";

import { Todo } from "src/types/challenge";

interface DraggableTodoListProps {
  todoList: Todo[];
  setTodoList: (list: Todo[]) => void;
}

interface SortableItemProps {
  todo: Todo;
  handleTitleChange: (id: number | string, newTitle: string) => void;
}

const SortableItem = ({ todo, handleTitleChange }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.todoId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between cursor-move hover:bg-blue-50 p-2 rounded-md"
    >
      <input
        type="text"
        value={todo.todoTitle}
        onChange={(e) => handleTitleChange(todo.todoId, e.target.value)}
        placeholder="할일 제목"
        className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-solid border-1 border-gray-3 rounded-md px-16 py-12 w-full"
      />
      <TiArrowUnsorted className="ml-4 text-blue-600 text-2xl flex-shrink-0 text-blue-6" />
    </li>
  );
};

const DraggableTodoList = ({
  todoList,
  setTodoList,
}: DraggableTodoListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = todoList.findIndex((todo) => todo.todoId === active.id);
      const newIndex = todoList.findIndex((todo) => todo.todoId === over.id);
      const newList = arrayMove(todoList, oldIndex, newIndex).map(
        (todo, index) => ({
          ...todo,
          todoOrder: index + 1,
        })
      );
      setTodoList(newList);
    }
  };

  const handleTitleChange = (id: number | string, newTitle: string) => {
    const updatedList = todoList.map((todo) =>
      todo.todoId === id ? { ...todo, todoTitle: newTitle } : todo
    );
    setTodoList(updatedList);
  };

  return (
    <div className="flex flex-col mb-20">
      <div className="flex justify-between items-center mb-5">
        <label className="text-gray-6 text-16">할일</label>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={todoList.map((todo) => todo.todoId)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-4">
            {todoList.map((todo) => (
              <SortableItem
                key={todo.todoId}
                todo={todo}
                handleTitleChange={handleTitleChange}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DraggableTodoList;
