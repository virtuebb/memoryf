import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { getOverlayStyles } from '../styles/overlayStyles';

// Non-blocking PiP-like overlay using a Portal
const ModalOverlay = ({ title = 'Chat', children, theme, onClose }) => {
  const styles = getOverlayStyles(theme);
  const overlayRef = useRef(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [size, setSize] = useState({ width: 360, height: 560 });
  const [collapsed, setCollapsed] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 360, height: 560 });
  const minSize = { width: 360, height: 560 }; // current default is the minimum

  useEffect(() => {
    // Initialize near top-right once
    setPos({ left: Math.max(window.innerWidth - 420, 20), top: 80 });
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging) return;
      const nextLeft = e.clientX - dragOffset.current.x;
      const nextTop = e.clientY - dragOffset.current.y;
      // keep within viewport bounds
      const maxLeft = window.innerWidth - 60; // allow some overflow margin
      const maxTop = window.innerHeight - 60;
      setPos({
        left: Math.min(Math.max(0, nextLeft), maxLeft),
        top: Math.min(Math.max(0, nextTop), maxTop),
      });
    };
    const onMouseUp = () => setDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!resizing) return;
      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;
      const nextWidth = Math.max(minSize.width, resizeStart.current.width + deltaX);
      const nextHeight = Math.max(minSize.height, resizeStart.current.height + deltaY);
      setSize({ width: nextWidth, height: nextHeight });
    };
    const onMouseUp = () => setResizing(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [resizing]);

  const onHeaderMouseDown = (e) => {
    if (!overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragging(true);
  };

  const node = (
    <div
      ref={overlayRef}
      style={{
        ...styles.container,
        left: pos.left,
        top: pos.top,
        pointerEvents: 'auto',
        width: size.width,
        height: collapsed ? 60 : size.height,
      }}
    >
      <div
        style={styles.header}
        onMouseDown={onHeaderMouseDown}
      >
        <span style={styles.title}>{title}</span>
        <div style={styles.controls}>
          <button style={styles.controlBtn} title={collapsed ? 'Expand' : 'Minimize'} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '▢' : '—'}
          </button>
          <button style={styles.controlBtn} title="Close" onClick={onClose}>✕</button>
        </div>
      </div>
      {!collapsed && <div style={styles.body}>{children}</div>}
      {!collapsed && (
        <div
          style={styles.resizeHandle}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            resizeStart.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height };
            setResizing(true);
          }}
        />
      )}
    </div>
  );

  // Render to body so it sits over the page without blocking background
  return ReactDOM.createPortal(node, document.body);
};

export default ModalOverlay;
