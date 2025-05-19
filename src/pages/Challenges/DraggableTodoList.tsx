import { useState } from "react";
import { TiArrowUnsorted } from "@react-icons/all-files/ti/TiArrowUnsorted";
import { Todo } from "src/types/challenge";

interface DraggableTodoListProps {
  todoList: Todo[];
  setTodoList: (list: Todo[]) => void;
}

const DraggableTodoList = ({
  todoList,
  setTodoList,
}: DraggableTodoListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (index !== hoveredIndex) {
      setHoveredIndex(index);
    }
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedList = [...todoList];
    const [movedItem] = updatedList.splice(draggedIndex, 1);
    updatedList.splice(index, 0, movedItem);

    const reOrderedList = updatedList.map((item, idx) => ({
      ...item,
      todoOrder: idx + 1,
    }));

    setTodoList(reOrderedList);
    setDraggedIndex(null);
    setHoveredIndex(null);
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
        {/* <button
          className="cursor-pointer flex items-center"
          onClick={(e) => {
            e.preventDefault();
            handleAddTodo(); 
          }}
        >
          <span className="mr-2 text-13 tracking-tight text-blue-6 font-semibold">
            추가하기
          </span>
        </button> */}
      </div>
      <ul className="space-y-4">
        {todoList.map((todo, index) => {
          return (
            <li
              key={todo.todoId}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => {
                e.preventDefault();
                handleDragEnter(index);
              }}
              onDragEnter={() => handleDragEnter(index)}
              onDragLeave={() => {
                if (hoveredIndex === index) setHoveredIndex(null);
              }}
              onDrop={() => handleDrop(index)}
              className={`flex items-center justify-between cursor-move hover:bg-blue-50 p-2 rounded-md ${index === draggedIndex ? "opacity-50 bg-slate-200" : ""}`}
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
        })}
      </ul>
    </div>
  );
};

export default DraggableTodoList;
