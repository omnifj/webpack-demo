import './style.css';

import { createRoot } from 'react-dom/client';
import App from './App';

import { add } from './math';
import hot from './assets/火焰.png';

console.log('Hello Webpack');

const result = add(1, 2);
console.log(result);

const img = document.createElement('img');
img.src = hot;
document.body.appendChild(img);

const sayHello = (name: string) => {
  console.log(`Hello, ${name}`);
};

sayHello('Webpack + Babel + React');

// Lint检查 npm run lint
const a = 1;
// eslint-disable-next-line no-unused-vars
const b = 2;

// eslint-disable-next-line no-unused-vars
const c = 3;

console.log(a);

// 代码格式化 format
// eslint-disable-next-line no-unused-vars
const foo = (a: number, b: number) => {
  console.log(a, b);
};

const root = document.getElementById('app');
if (root) {
  createRoot(root).render(<App />);
}
