# ProfileRevealCard

可复用的个人简介揭示卡片组件。鼠标移入时显示跟随光标的圆形光圈，光圈内展示第二层文字；双击时从点击处展开扩散过渡，平滑切换到反向状态。

## 安装

将 `ProfileRevealCard` 目录复制到你的项目组件目录中，确保引入了 `styles.css`。

## 使用示例

```tsx
import React from 'react';
import ProfileRevealCard from './components/ProfileRevealCard';

const baseTheme = {
  background: '#ffffff',
  color: '#222222',
  overlay: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const overlayTheme = {
  background: '#fff7ed',
  color: '#9a3412',
  overlay: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
};

export default function App() {
  return (
    <ProfileRevealCard
      baseText="我叫 omnifj，是一名前端工程师"
      overlayText="I'm omnifj, a front-end engineer"
      baseTheme={baseTheme}
      overlayTheme={overlayTheme}
      hintToOverlay="双击圆圈内切换为英文反向效果"
      hintToBase="双击圆圈内切换为中文效果"
      duration={600}
    />
  );
}
```

## Props

| 属性            | 类型                     | 必填 | 默认值           | 说明                       |
| --------------- | ------------------------ | ---- | ---------------- | -------------------------- |
| `baseText`      | `string`                 | 是   | -                | 默认状态下显示的主文字     |
| `overlayText`   | `string`                 | 是   | -                | 默认状态下光圈内显示的文字 |
| `baseTheme`     | `ProfileRevealCardTheme` | 否   | 白底紫蓝渐变     | 默认状态主题色             |
| `overlayTheme`  | `ProfileRevealCardTheme` | 否   | 暖橙底青绿渐变   | 切换后状态主题色           |
| `hintToOverlay` | `string`                 | 否   | `双击圆圈内切换` | 默认状态提示语             |
| `hintToBase`    | `string`                 | 否   | `双击圆圈内返回` | 切换后状态提示语           |
| `duration`      | `number`                 | 否   | `600`            | 扩散过渡动画时长（ms）     |
| `className`     | `string`                 | 否   | `''`             | 自定义根节点类名           |
| `style`         | `React.CSSProperties`    | 否   | -                | 自定义根节点样式           |

## Theme 类型

```ts
interface ProfileRevealCardTheme {
  background: string; // 底图背景色
  color: string; // 底图文字颜色
  overlay: string; // 光圈渐变背景，如 linear-gradient(...)
}
```

## 交互说明

1. 鼠标移入卡片：隐藏默认光标，显示跟随鼠标的圆形光圈，圆圈内展示 `overlayText`。
2. 双击圆圈内：立即切换主文字，同时从点击处展开扩散过渡层，600ms 后移除过渡层。
3. 再次双击：回到初始状态，展开方向始终为当前双击位置。

## 注意事项

- 组件内部使用 CSS 自定义属性（CSS Variables）动态切换主题色，确保过渡层与实际层颜色完全一致。
- 组件尺寸固定为 `480px × 240px`，可通过传入 `style` 或 `className` 覆盖。
- 扩散动画使用 `clip-path` 实现，需要现代浏览器支持。
