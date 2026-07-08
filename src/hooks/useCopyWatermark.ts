import { useEffect, useCallback } from 'react';

export interface UseCopyWatermarkOptions {
  /** 自动追加的水印文本 */
  text?: string;
  /** 是否启用监听 */
  enabled?: boolean;
  /** 是否忽略输入框/可编辑元素（避免干扰用户正常复制输入内容） */
  ignoreInputs?: boolean;
  /** 原文与水印之间的分隔符 */
  separator?: string;
}

const isEditableElement = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  );
};

/**
 * 为页面复制操作自动追加水印。
 * 监听 document 的 copy 事件，当用户复制页面文本时，在剪贴板内容末尾追加水印。
 */
export default function useCopyWatermark(options: UseCopyWatermarkOptions = {}) {
  const { text = '', enabled = true, ignoreInputs = true, separator = '\n\n' } = options;

  const handleCopy = useCallback(
    (event: ClipboardEvent) => {
      const selection = window.getSelection()?.toString() ?? '';
      if (!selection) return;
      if (!text) return;
      if (ignoreInputs && isEditableElement(event.target)) return;

      const payload = `${selection}${separator}${text}`;

      event.preventDefault();
      event.clipboardData?.setData('text/plain', payload);
    },
    [text, ignoreInputs, separator]
  );

  useEffect(() => {
    if (!enabled || !text) return;

    document.addEventListener('copy', handleCopy, true);
    return () => document.removeEventListener('copy', handleCopy, true);
  }, [enabled, text, handleCopy]);
}
