import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>React + Webpack + TypeScript</h1>
      <p>计数: {count}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        点击 +1
      </button>
    </div>
  );
}
