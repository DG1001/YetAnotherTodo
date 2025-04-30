# React Todo App with Sub-Items and JSON Export/Import

A modern, production-ready todo application built with React, TypeScript, and Tailwind CSS. Features include:
- Todo items with sub-items
- Drag-and-drop reordering
- JSON export/import functionality
- Local storage persistence
- Responsive, accessible UI
- Keyboard shortcuts (e.g., `Enter` to add, `Delete` to remove)
- Filter options (All/Active/Completed)

## 🚀 Features
- **Sub-items**: Add nested tasks under main todos
- **Drag-and-drop**: Reorder todos and sub-items
- **JSON Export/Import**: Save/load todos via JSON
- **Local Storage**: Auto-save todos between sessions
- **Responsive Design**: Works on all screen sizes

## 🛠️ Tech Stack
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Lucide React** for icons
- **Unsplash** for stock images (linked only)

## 📦 Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. (Optional) Preview the production build:
   ```bash
   npm run preview
   ```

## 📱 Usage
- **Add Todo**: Click "Add Todo" or press `Enter`
- **Edit Todo**: Double-click a todo item
- **Delete Todo**: Click the trash icon or press `Delete`
- **Filter Todos**: Use the filter dropdown (All/Active/Completed)
- **Clear Completed**: Click "Clear Completed" button
- **Export JSON**: Click "Export JSON" to save todos
- **Import JSON**: Click "Import JSON" and paste your saved data

## 📁 Project Structure
```
src/
├── components/              # React components
│   ├── TodoItem.tsx         # Single todo item
│   ├── TodoList.tsx         # List of todos
│   ├── SubTodoItem.tsx      # Sub-item under a todo
│   └── SubTodoList.tsx      # List of sub-items
├── App.tsx                  # Main application component
├── main.tsx                 # Entry point
├── index.css                # Global styles
└── vite-env.d.ts            # Vite type definitions
```

## 📝 Notes
- All data is stored in `localStorage` by default
- JSON export/import uses a simple text area interface
- No external APIs or databases required

## 📜 License
MIT License - see [LICENSE](LICENSE) file

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a pull request
