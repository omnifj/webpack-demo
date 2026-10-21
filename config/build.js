const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const taskRoot = path.resolve(rootDir, 'src', 'task');
const args = process.argv.slice(2);

function getTaskArg() {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--path') {
      return args[index + 1] || '';
    }

    if (arg.startsWith('--path=')) {
      return arg.slice('--path='.length);
    }
  }

  return '';
}

const task = getTaskArg();

const availableTasks = fs
  .readdirSync(taskRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

if (task && !availableTasks.includes(task)) {
  console.error(`未知任务 "${task}"，可选任务：${availableTasks.join('、')}`);
  process.exit(1);
}

const webpackCli = require.resolve('webpack-cli/bin/cli.js');
const result = spawnSync(
  process.execPath,
  [webpackCli, '--config', path.resolve(__dirname, 'webpack.prod.js')],
  {
    cwd: rootDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      BUILD_TASK: task,
    },
  }
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status || 1);
}

if (task) {
  const homeSource = path.resolve(rootDir, 'public', 'home.html');
  const homeTarget = path.resolve(rootDir, 'dist', 'home.html');

  fs.mkdirSync(path.dirname(homeTarget), { recursive: true });
  fs.copyFileSync(homeSource, homeTarget);
}

const target = task ? `（${task}）` : '';
console.log(`\n构建完成${target}，首页文件：dist/home.html`);
