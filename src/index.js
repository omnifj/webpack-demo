import './style.css';

console.log('Hello Webpack');



import hot from './assets/火焰.png';

const img = document.createElement('img');
img.src = hot;
document.body.appendChild(img);


const sayHello = (name) => {
  console.log(`Hello, ${name}`);
};

sayHello('Webpack + Babel');