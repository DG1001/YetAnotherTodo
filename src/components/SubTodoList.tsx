import React, { useState, useRef } from 'react';
import SubTodoItem from './SubTodoItem';

interface SubTodo {
  id: string;
  text: string;
  completed: boolean;
}

interface SubTodoListProps {
  subTodos?: SubTodo[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onReorder: (from: number, to: number) => void;
}

const SubTodoList: React.FC<SubTodoListProps> = ({
  subTodos,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
}) => {
  // Defensive: always use an array
  const safeSubTodos = Array.isArray(subTodos) ? subTodos : [];

  const [newSub, setNewSub] = useState('');
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleAdd = () => {
    if (newSub.trim()) {
      onAdd(newSub.trim());
      setNewSub('');
    }
  };

  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
  };

  const handleDragEnter = (idx: number) => {
    dragOverItem.current = idx;
  };

  const handleDragEnd = () => {
    if (
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      onReorder(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="ml-8 mb-2">
      <ul>
        {safeSubTodos.map((sub, idx) => (
          <div
            key={sub.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragEnter={() => handleDragEnter(idx)}
            onDragEnd={handleDragEnd}
            onDragOver={e => e.preventDefault()}
          >
            <SubTodoItem
              id={sub.id}
              text={sub.text}
              completed={sub.completed}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              draggableProps={{
                tabIndex: -1,
                style: { cursor: 'grab' },
              }}
              dragHandleProps={{
                tabIndex: -1,
                style: { cursor: 'grab' },
              }}
            />
          </div>
        ))}
      </ul>
      <div className="flex mt-2">
        <input
          type="text"
          value={newSub}
          onChange={e => setNewSub(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add sub-task..."
          className="flex-1 p-1 border border-gray-200 rounded-l text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-400 text-white px-2 py-1 rounded-r text-xs hover:bg-blue-500"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default SubTodoList;
