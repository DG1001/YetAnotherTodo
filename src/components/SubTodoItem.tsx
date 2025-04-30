import React, { useState } from 'react';
import { Check, X, Edit, GripVertical } from 'lucide-react';

interface SubTodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  draggableProps: any;
  dragHandleProps: any;
}

const SubTodoItem: React.FC<SubTodoItemProps> = ({
  id,
  text,
  completed,
  onToggle,
  onDelete,
  onEdit,
  draggableProps,
  dragHandleProps,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(id, editText);
      setIsEditing(false);
    }
  };

  return (
    <li
      className="flex items-center justify-between p-2 mb-1 bg-gray-50 rounded hover:bg-gray-100 transition"
      {...draggableProps}
    >
      <div className="flex items-center flex-1">
        <button
          onClick={() => onToggle(id)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 ${
            completed
              ? 'bg-green-400 border-green-400'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          aria-label={completed ? "Unmark as complete" : "Mark as complete"}
        >
          {completed && <Check className="w-3 h-3 text-white" />}
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
          <span className={`flex-1 text-sm ${completed ? 'line-through text-gray-400' : ''}`}>
            {text}
          </span>
        )}
      </div>
      <div className="flex items-center ml-2">
        <button
          {...dragHandleProps}
          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <button
          onClick={handleEdit}
          className="p-1 text-blue-400 hover:text-blue-700 rounded-full hover:bg-blue-50"
          aria-label="Edit sub-todo"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1 text-red-400 hover:text-red-700 rounded-full hover:bg-red-50 ml-1"
          aria-label="Delete sub-todo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
};

export default SubTodoItem;
