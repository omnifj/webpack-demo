import React from 'react';
import ProfileRevealCard from './components/ProfileRevealCard';
import useCopyWatermark from './hooks/useCopyWatermark';
import useScreenshotWatermark from './hooks/useScreenshotWatermark';

const CHINESE_TEXT = '我叫 omnifj，是一名前端工程师';
const ENGLISH_TEXT = "I'm omnifj, a front-end engineer";

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
  useCopyWatermark({
    text: '—— 来自 omnifj/webpack-demo',
    enabled: true,
    separator: '\n\n',
  });

  useScreenshotWatermark({
    text: 'omnifj',
    subText: 'webpack-demo',
    enabled: true,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.08)',
    rotate: -30,
  });

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <ProfileRevealCard
        baseText={CHINESE_TEXT}
        overlayText={ENGLISH_TEXT}
        baseTheme={baseTheme}
        overlayTheme={overlayTheme}
        hintToOverlay="双击圆圈内切换为英文反向效果"
        hintToBase="双击圆圈内切换为中文效果"
      />
      <p style={{ marginTop: 40, lineHeight: 1.8, color: '#333' }}>
        这是一段用于测试复制水印的示例文本。选中这段文字并使用 Ctrl+C（或右键复制），
        剪贴板中的内容会自动在末尾追加水印信息。你也可以尝试切换卡片语言，
        复制不同状态下的文本，观察水印是否正常生效。
      </p>
    </div>
  );
}
