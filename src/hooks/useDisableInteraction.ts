import { useEffect, useCallback } from 'react';

export interface UseDisableInteractionOptions {
  /** 是否禁用右键菜单，默认 true */
  disableContextMenu?: boolean;
  /** 是否禁用拖拽，默认 true */
  disableDrag?: boolean;
  /** 是否禁用文本选择，默认 true */
  disableSelect?: boolean;
  /** 是否启用，默认 true */
  enabled?: boolean;
  /** 允许交互的元素 CSS 选择器（例如测试区域） */
  allowSelector?: string;
}

const isAllowed = (target: EventTarget | null, selector: string): boolean => {
  if (!selector || !(target instanceof Element)) return false;
  return target.closest(selector) !== null;
};

const buildSelectStyle = (allowSelector: string): string => {
  const base = `html, body { user-select: none !important; -webkit-user-select: none !important; }`;
  if (!allowSelector) return base;
  return `${base}\n${allowSelector} { user-select: text !important; -webkit-user-select: text !important; }`;
};

/**
 * 禁用页面右键菜单、拖拽和文本选择。
 * 文本选择通过注入全局 CSS 实现，移动端也能生效；
 * 右键和拖拽通过事件监听拦截；
 * 可通过 allowSelector 指定白名单元素，使其保持正常交互。
 */
export default function useDisableInteraction(
  options: UseDisableInteractionOptions = {}
) {
  const {
    disableContextMenu = true,
    disableDrag = true,
    disableSelect = true,
    enabled = true,
    allowSelector = '',
  } = options;

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      if (isAllowed(event.target, allowSelector)) return;
      event.preventDefault();
    },
    [allowSelector]
  );

  const handleDragStart = useCallback(
    (event: DragEvent) => {
      if (isAllowed(event.target, allowSelector)) return;
      event.preventDefault();
    },
    [allowSelector]
  );

  useEffect(() => {
    if (!enabled) return;

    const capture = true;
    const cleanups: (() => void)[] = [];

    if (disableContextMenu) {
      document.addEventListener('contextmenu', handleContextMenu, capture);
      cleanups.push(() =>
        document.removeEventListener('contextmenu', handleContextMenu, capture)
      );
    }

    if (disableDrag) {
      document.addEventListener('dragstart', handleDragStart, capture);
      cleanups.push(() =>
        document.removeEventListener('dragstart', handleDragStart, capture)
      );
    }

    let style: HTMLStyleElement | null = null;
    if (disableSelect) {
      style = document.createElement('style');
      style.textContent = buildSelectStyle(allowSelector);
      document.head.appendChild(style);
      cleanups.push(() => style?.remove());
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [
    enabled,
    disableContextMenu,
    disableDrag,
    disableSelect,
    allowSelector,
    handleContextMenu,
    handleDragStart,
  ]);
}
