import './style.css';

import { useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';

const INITIAL_TODOS = [
  '学习 Webpack 多入口配置',
  '使用 --path 单独构建任务',
  '通过 home.html 预览演示页面',
];

function TodoApp() {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [value, setValue] = useState('');

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextTodo = value.trim();
    if (!nextTodo) {
      return;
    }

    setTodos((items) => [...items, nextTodo]);
    setValue('');
  };

  const removeTodo = (index: number) => {
    setTodos((items) => items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <main className="task-card">
      <p className="task-eyebrow">Task 2</p>
      <h1>待办清单演示</h1>
      <p className="task-desc">
        这是一个通过 <code>--path=task2</code> 单独构建的 React 示例。
      </p>

      <form className="todo-form" onSubmit={addTodo}>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="输入新的待办事项"
          aria-label="新的待办事项"
        />
        <button type="submit">添加</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={`${todo}-${index}`}>
            <span>{todo}</span>
            <button
              type="button"
              className="remove"
              onClick={() => removeTodo(index)}
              aria-label={`删除 ${todo}`}
            >
              删除
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="todo-empty">暂无待办事项</p>}
    </main>
  );
}

const root = document.getElementById('app');
if (root) {
  createRoot(root).render(<TodoApp />);
}
