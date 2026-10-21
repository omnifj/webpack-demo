import './style.css';

import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function CounterApp() {
  const [count, setCount] = useState(0);

  return (
    <main className="task-card">
      <p className="task-eyebrow">Task 1</p>
      <h1>计数器演示</h1>
      <p className="task-desc">
        这是一个通过 <code>--path=task1</code> 单独构建的 React 示例。
      </p>

      <div className="counter-value">{count}</div>

      <div className="counter-actions">
        <button type="button" onClick={() => setCount((value) => value - 1)}>
          减一
        </button>
        <button type="button" className="ghost" onClick={() => setCount(0)}>
          重置
        </button>
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          加一
        </button>
      </div>
    </main>
  );
}

const root = document.getElementById('app');
if (root) {
  createRoot(root).render(<CounterApp />);
}
