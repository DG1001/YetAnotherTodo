import React, { useState, useRef } from 'react';
import { Check, X, Edit, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import SubTodoList from './SubTodoList';

interface SubTodo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  subTodos: SubTodo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onSubAdd: (todoId: string, text: string) => void;
  onSubToggle: (todoId: string, subId: string) => void;
  onSubDelete: (todoId: string, subId: string) => void;
  onSubEdit: (todoId: string, subId: string, newText: string) => void;
  onSubReorder: (todoId: string, from: number, to: number) => void;
  draggableProps: any;
  dragHandleProps: any;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  completed,
  subTodos,
  onToggle,
  onDelete,
  onEdit,
  onSubAdd,
  onSubToggle,
  onSubDelete,
  onSubEdit,
  onSubReorder,
  draggableProps,
  dragHandleProps,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [showSubs, setShowSubs] = useState(true);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(id, editText);
      setIsEditing(false);
    }
  };

  return (
    <li
      className="flex flex-col bg-white rounded shadow-sm hover:shadow-md transition-shadow mb-2"
      {...draggableProps}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center flex-1">
          <button
            onClick={() => onToggle(id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
              completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            aria-label={completed ? "Unmark as complete" : "Mark as complete"}
          >
            {completed && <Check className="w-4 h-4 text-white" />}
          </button>
          <button
            onClick={() => setShowSubs(s => !s)}
            className="mr-2 text-gray-400 hover:text-gray-700"
            aria-label={showSubs ? "Hide sub-tasks" : "Show sub-tasks"}
          >
            {showSubs ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              className="flex-1 p-1 border-b border-gray-300 focus:border-blue-500 outline-none"
              autoFocus
              onBlur={handleSave}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          ) : (
            <span className={`flex-1 ${completed ? 'line-through text-gray-500' : ''}`}>
              {text}
            </span>
          )}
        </div>
        <div className="flex ml-3 items-center">
          <button
            {...dragHandleProps}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-grab"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className={`p-1 ${isFirst ? 'text-gray-200' : 'text-gray-400 hover:text-gray-700'} rounded-full`}
            aria-label="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className={`p-1 ${isLast ? 'text-gray-200' : 'text-gray-400 hover:text-gray-700'} rounded-full`}
            aria-label="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={handleEdit}
            className="p-1 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-50"
            aria-label="Edit todo"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 ml-2"
            aria-label="Delete todo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      {showSubs && (
        <SubTodoList
          subTodos={subTodos}
          onAdd={text => onSubAdd(id, text)}
          onToggle={subId => onSubToggle(id, subId)}
          onDelete={subId => onSubDelete(id, subId)}
          onEdit={(subId, newText) => onSubEdit(id, subId, newText)}
          onReorder={(from, to) => onSubReorder(id, from, to)}
        />
      )}
    </li>
  );
};

export default TodoItem;
