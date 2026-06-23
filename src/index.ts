import './style.css';

console.log('Hello Webpack');




// Tree Shaking 注意 Webpack 内置的 JS 压缩器 验证打包后的代码是否包含未使用的函数
import { add } from './math';
const result = add(1, 2);
console.log(result);

import hot from './assets/火焰.png';

const img = document.createElement('img');
img.src = hot;
document.body.appendChild(img);


const sayHello = (name) => {
  console.log(`Hello, ${name}`);
};

sayHello('Webpack + Babel');

// Lint检查 npm run lint
const a = 1
const b = 2

// eslint-disable-next-line no-unused-vars
const c = 3

console.log(a)

// 代码格式化 format
const foo = (a,b)=>{console.log(a,b);};