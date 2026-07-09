import { useEffect } from 'react';

export interface UseScreenshotWatermarkOptions {
  /** 主水印文字 */
  text?: string;
  /** 副水印文字（例如用户名或时间戳） */
  subText?: string;
  /** 是否启用 */
  enabled?: boolean;
  /** 字体大小，单位 px */
  fontSize?: number;
  /** 文字颜色，建议使用带透明度的 rgba */
  color?: string;
  /** 旋转角度，单位 deg */
  rotate?: number;
  /** 水平间距，单位 px */
  gapX?: number;
  /** 垂直间距，单位 px */
  gapY?: number;
  /** 层叠顺序 */
  zIndex?: number;
  /** 整体透明度 */
  opacity?: number;
}

const drawWatermark = (
  options: Required<UseScreenshotWatermarkOptions>
): string => {
  const { text, subText, fontSize, color, rotate, gapX, gapY } = options;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.font = `bold ${fontSize}px sans-serif`;
  const mainWidth = ctx.measureText(text).width;
  const subWidth = subText ? ctx.measureText(subText).width : 0;

  const width = Math.max(
    gapX,
    mainWidth + fontSize * 2,
    subWidth + fontSize * 2
  );
  const height = Math.max(gapY, fontSize * (subText ? 4 : 2));

  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.translate(-width / 2, -height / 2);

  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const mainY = subText ? height / 2 - fontSize * 0.3 : height / 2;
  ctx.fillText(text, width / 2, mainY);

  if (subText) {
    ctx.font = `${fontSize * 0.7}px sans-serif`;
    ctx.fillText(subText, width / 2, height / 2 + fontSize * 0.8);
  }

  ctx.restore();

  return canvas.toDataURL('image/png');
};

/**
 * 为页面添加截图水印覆盖层。
 * 通过固定定位的 canvas 图案覆盖整个视口，截图时会随内容一起被捕获，起到标识来源的作用。
 */
export default function useScreenshotWatermark(
  options: UseScreenshotWatermarkOptions = {}
) {
  const {
    text = 'Watermark',
    subText = '',
    enabled = true,
    fontSize = 14,
    color = 'rgba(0, 0, 0, 0.08)',
    rotate = -30,
    gapX = 240,
    gapY = 180,
    zIndex = 9999,
    opacity = 1,
  } = options;

  useEffect(() => {
    if (!enabled || !text) return;

    const overlay = document.createElement('div');
    overlay.dataset.watermark = 'screenshot';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.overflow = 'hidden';
    overlay.style.zIndex = String(zIndex);
    overlay.style.opacity = String(opacity);
    overlay.style.backgroundRepeat = 'repeat';

    const update = () => {
      const fullOptions = {
        text,
        subText,
        enabled,
        fontSize,
        color,
        rotate,
        gapX,
        gapY,
        zIndex,
        opacity,
      } as Required<UseScreenshotWatermarkOptions>;

      const dataUrl = drawWatermark(fullOptions);
      if (!dataUrl) return;

      overlay.style.backgroundImage = `url(${dataUrl})`;
      overlay.style.backgroundSize = `${gapX}px ${gapY}px`;
    };

    update();
    document.body.appendChild(overlay);

    const handleResize = () => update();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      overlay.remove();
    };
  }, [
    enabled,
    text,
    subText,
    fontSize,
    color,
    rotate,
    gapX,
    gapY,
    zIndex,
    opacity,
  ]);
}
