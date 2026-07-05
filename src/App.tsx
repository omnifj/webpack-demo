import React from 'react';
import ProfileRevealCard from './components/ProfileRevealCard';

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
  return (
    <ProfileRevealCard
      baseText={CHINESE_TEXT}
      overlayText={ENGLISH_TEXT}
      baseTheme={baseTheme}
      overlayTheme={overlayTheme}
      hintToOverlay="双击圆圈内切换为英文反向效果"
      hintToBase="双击圆圈内切换为中文效果"
    />
  );
}
