import React, { useState, useRef, useCallback, useEffect } from 'react';
import './styles.css';

export interface ProfileRevealCardTheme {
  /** 底图背景色 */
  background: string;
  /** 底图文字颜色 */
  color: string;
  /** 光圈渐变背景 */
  overlay: string;
}

export interface ProfileRevealCardProps {
  /** 默认状态显示的主文字 */
  baseText: string;
  /** 默认状态光圈内显示的文字 */
  overlayText: string;
  /** 默认状态主题色 */
  baseTheme?: ProfileRevealCardTheme;
  /** 切换后（overlayText 成为主文字）的主题色 */
  overlayTheme?: ProfileRevealCardTheme;
  /** 默认状态下提示语 */
  hintToOverlay?: string;
  /** 切换后状态下提示语 */
  hintToBase?: string;
  /** 扩散过渡动画时长，单位 ms */
  duration?: number;
  /** 自定义根节点类名 */
  className?: string;
  /** 自定义根节点样式 */
  style?: React.CSSProperties;
}

const defaultBaseTheme: ProfileRevealCardTheme = {
  background: '#ffffff',
  color: '#222222',
  overlay: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const defaultOverlayTheme: ProfileRevealCardTheme = {
  background: '#fff7ed',
  color: '#9a3412',
  overlay: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
};

export default function ProfileRevealCard({
  baseText,
  overlayText,
  baseTheme = defaultBaseTheme,
  overlayTheme = defaultOverlayTheme,
  hintToOverlay = '双击圆圈内切换',
  hintToBase = '双击圆圈内返回',
  duration = 600,
  className = '',
  style,
}: ProfileRevealCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 鼠标在卡片内的坐标
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 鼠标是否位于卡片内
  const [isInside, setIsInside] = useState(false);

  // 当前是否为切换状态：false 显示 baseText 为主文字，true 显示 overlayText 为主文字
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  // 双击切换时的扩散圆心坐标
  const [transition, setTransition] = useState<{ x: number; y: number } | null>(null);

  // 根据当前状态切换主文字与光圈文字
  const currentTheme = isOverlayActive ? overlayTheme : baseTheme;
  const currentBaseText = isOverlayActive ? overlayText : baseText;
  const currentOverlayText = isOverlayActive ? baseText : overlayText;

  // 跟踪鼠标位置，用于移动圆形光圈与光标环
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // 双击：立即切换主题，同时从点击处展开扩散过渡层
  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (transition || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setIsOverlayActive((prev) => !prev);
    setTransition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, [transition]);

  // 扩散动画结束后移除过渡层
  useEffect(() => {
    if (!transition) return;
    const timer = setTimeout(() => {
      setTransition(null);
    }, duration);
    return () => clearTimeout(timer);
  }, [transition, duration]);

  const cssVariables = {
    '--profile-base-bg': currentTheme.background,
    '--profile-base-color': currentTheme.color,
    '--profile-overlay-bg': currentTheme.overlay,
  };

  return (
    <div
      className={`profile-reveal-card ${className}`}
      ref={cardRef}
      style={{ ...cssVariables, ...style } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
      onDoubleClick={handleDoubleClick}
    >
      {/* 底层文字 */}
      <div className="profile-reveal-card__base">
        <p>{currentBaseText}</p>
      </div>

      {/* 上层文字：通过 clip-path 圆形蒙版显示 */}
      <div
        className={`profile-reveal-card__overlay ${isInside ? 'active' : ''}`}
        style={{
          '--x': `${mousePos.x}px`,
          '--y': `${mousePos.y}px`,
        } as React.CSSProperties}
      >
        <p>{currentOverlayText}</p>
      </div>

      {/* 跟随鼠标的圆形光标环 */}
      {isInside && (
        <div
          className="profile-reveal-card__cursor"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        />
      )}

      {/* 当前操作提示 */}
      <div className="profile-reveal-card__hint">
        {isOverlayActive ? hintToBase : hintToOverlay}
      </div>

      {/* 双击切换时的扩散过渡层 */}
      {transition && (
        <div
          className="profile-reveal-card__transition"
          style={{
            '--cx': `${transition.x}px`,
            '--cy': `${transition.y}px`,
          } as React.CSSProperties}
        >
          <div className="profile-reveal-card__transition-base">
            <p>{currentBaseText}</p>
          </div>
          <div
            className={`profile-reveal-card__transition-overlay ${isInside ? 'active' : ''}`}
            style={{
              '--x': `${mousePos.x}px`,
              '--y': `${mousePos.y}px`,
            } as React.CSSProperties}
          />
        </div>
      )}
    </div>
  );
}
