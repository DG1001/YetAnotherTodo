import React, { useState, useEffect, useRef } from 'react';
import TodoItem from './TodoItem';

interface SubTodo {
  id: string;
  text: string;
  completed: boolean;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  subTodos: SubTodo[];
}

type FilterType = 'all' | 'active' | 'completed';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        // Defensive: ensure subTodos is always an array
        const parsed: any[] = JSON.parse(savedTodos);
        return parsed.map(todo => ({
          ...todo,
          subTodos: Array.isArray(todo.subTodos) ? todo.subTodos : [],
        }));
      } catch {
        return [];
      }
    }
    return [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const newId = Date.now().toString();
      setTodos([
        ...todos,
        { id: newId, text: newTodo.trim(), completed: false, subTodos: [] }
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  // Sub-todo handlers
  const addSubTodo = (todoId: string, text: string) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === todoId
          ? {
              ...todo,
              subTodos: [
                ...(Array.isArray(todo.subTodos) ? todo.subTodos : []),
                { id: Date.now().toString() + Math.random(), text, completed: false }
              ]
            }
          : todo
      )
    );
  };

  const toggleSubTodo = (todoId: string, subId: string) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === todoId
          ? {
              ...todo,
              subTodos: (Array.isArray(todo.subTodos) ? todo.subTodos : []).map(sub =>
                sub.id === subId ? { ...sub, completed: !sub.completed } : sub
              )
            }
          : todo
      )
    );
  };

  const deleteSubTodo = (todoId: string, subId: string) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === todoId
          ? {
              ...todo,
              subTodos: (Array.isArray(todo.subTodos) ? todo.subTodos : []).filter(sub => sub.id !== subId)
            }
          : todo
      )
    );
  };

  const editSubTodo = (todoId: string, subId: string, newText: string) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === todoId
          ? {
              ...todo,
              subTodos: (Array.isArray(todo.subTodos) ? todo.subTodos : []).map(sub =>
                sub.id === subId ? { ...sub, text: newText } : sub
              )
            }
          : todo
      )
    );
  };

  const reorderSubTodos = (todoId: string, from: number, to: number) => {
    setTodos(todos =>
      todos.map(todo => {
        if (todo.id !== todoId) return todo;
        const updated = Array.isArray(todo.subTodos) ? [...todo.subTodos] : [];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        return { ...todo, subTodos: updated };
      })
    );
  };

  // Reorder main todos
  const reorderTodos = (from: number, to: number) => {
    setTodos(todos => {
      const updated = [...todos];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  // Drag and drop handlers for main todos
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
      reorderTodos(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const activeCount = todos.filter(todo => !todo.completed).length;

  // JSON Export/Import
  const handleExport = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = JSON.parse(text);
        if (!Array.isArray(imported)) throw new Error('Invalid format: not an array');
        // Defensive: ensure subTodos is always an array
        const safeTodos = imported.map((todo: any) => ({
          ...todo,
          subTodos: Array.isArray(todo.subTodos) ? todo.subTodos : [],
        }));
        setTodos(safeTodos);
      } catch (err: any) {
        setImportError('Invalid JSON file. Please select a valid exported todos file.');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported if needed
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Todo List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors text-sm"
        >
          Export JSON
        </button>
        <button
          onClick={handleImportClick}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors text-sm"
        >
          Import JSON
        </button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>
      {importError && (
        <div className="mb-4 text-red-600 text-sm">{importError}</div>
      )}
      <ul className="mb-4">
        {filteredTodos.map((todo, idx) => {
          const todoIdx = todos.findIndex(t => t.id === todo.id);
          // Defensive: always pass an array for subTodos
          const safeSubTodos = Array.isArray(todo.subTodos) ? todo.subTodos : [];
          return (
            <div
              key={todo.id}
              draggable
              onDragStart={() => handleDragStart(todoIdx)}
              onDragEnter={() => handleDragEnter(todoIdx)}
              onDragEnd={handleDragEnd}
              onDragOver={e => e.preventDefault()}
            >
              <TodoItem
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                subTodos={safeSubTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
                onSubAdd={addSubTodo}
                onSubToggle={toggleSubTodo}
                onSubDelete={deleteSubTodo}
                onSubEdit={editSubTodo}
                onSubReorder={reorderSubTodos}
                draggableProps={{
                  tabIndex: -1,
                  style: { cursor: 'grab' },
                }}
                dragHandleProps={{
                  tabIndex: -1,
                  style: { cursor: 'grab' },
                }}
                onMoveUp={() => {
                  if (todoIdx > 0) reorderTodos(todoIdx, todoIdx - 1);
                }}
                onMoveDown={() => {
                  if (todoIdx < todos.length - 1) reorderTodos(todoIdx, todoIdx + 1);
                }}
                isFirst={todoIdx === 0}
                isLast={todoIdx === todos.length - 1}
              />
            </div>
          );
        })}
      </ul>
      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <span>{activeCount} {activeCount === 1 ? 'item' : 'items'} left</span>
        {todos.some(todo => todo.completed) && (
          <button
            onClick={clearCompleted}
            className="text-red-500 hover:text-red-700"
          >
            Clear completed
          </button>
        )}
      </div>
      <div className="flex justify-center space-x-4 border-t pt-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded-full ${
            filter === 'active'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-full ${
            filter === 'completed'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

export default TodoList;
