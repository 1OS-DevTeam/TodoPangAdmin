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
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { MdErrorOutline } from "@react-icons/all-files/md/MdErrorOutline";
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
  handleDeleteTodo: (id: number | string) => void;
}

const SortableItem = ({
  todo,
  handleTitleChange,
  handleDeleteTodo,
}: SortableItemProps) => {
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
      className="flex items-center justify-between hover:bg-blue-50 p-2 rounded-md"
    >
      <button
        {...listeners}
        className="mr-8 cursor-move touch-none"
        aria-label="항목 순서 변경"
      >
        <TiArrowUnsorted className="text-blue-6 text-2xl flex-shrink-0" />
      </button>
      <input
        type="text"
        value={todo.todoTitle}
        onChange={(e) => handleTitleChange(todo.todoId, e.target.value)}
        placeholder="할일 제목"
        className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-solid border-1 border-gray-3 rounded-md px-16 py-12 w-full"
      />
      <button
        onClick={() => handleDeleteTodo(todo.todoId)}
        className="bg-gray-1 text-gray-6 whitespace-nowrap py-14 text-14 px-16 rounded-4 ml-10"
      >
        삭제
      </button>
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

  const handleAddTodo = () => {
    const newTodo: Todo = {
      todoId: Date.now(),
      todoTitle: "",
      todoOrder: todoList.length + 1,
      lastUpdatedAt: "",
      lastUpdatedBy: "",
    };
    setTodoList([...todoList, newTodo]);
  };

  const handleDeleteTodo = (idToDelete: number | string) => {
    const newList = todoList.filter((todo) => todo.todoId !== idToDelete);
    const reorderedList = newList.map((todo, index) => ({
      ...todo,
      todoOrder: index + 1,
    }));
    setTodoList(reorderedList);
  };

  return (
    <div className="flex flex-col mb-20">
      <div className="flex justify-between items-center mb-12">
        <label className="text-gray-6 text-16">할일</label>
        <button
          className="cursor-pointer flex items-center align-middle"
          onClick={handleAddTodo}
        >
          <span className="mr-2 text-14 tracking-tight font-medium text-blue-6">
            할일 추가
          </span>
          <FiPlus className="text-blue-6 text-16" />
        </button>
      </div>
      {!!todoList?.length ? (
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
                  handleDeleteTodo={handleDeleteTodo}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="flex text-center justify-center align-middle">
          <MdErrorOutline className="text-20 text-gray-4 mr-5" />
          <p className="text-14 text-gray-5">할일을 추가해주세요.</p>
        </div>
      )}
    </div>
  );
};

export default DraggableTodoList;
