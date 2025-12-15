/**
 * ModalOverlay.jsx - 작은 채팅창 컴포넌트 (PiP 모드)
 * 
 * 이 컴포넌트는 화면 위에 떠다니는 작은 채팅창이에요!
 * 
 * 핵심 기능:
 * 1. 화면 위에 떠다니면서 다른 화면을 가리지 않아요
 * 2. 창 위쪽을 드래그하면 원하는 곳으로 옮길 수 있어요
 * 3. 창 오른쪽 아래 모서리를 드래그하면 크기를 조절할 수 있어요
 * 4. 최소화 버튼(—)을 누르면 작게 접을 수 있어요
 * 5. 닫기 버튼(✕)을 누르면 창이 사라져요
 * 6. 화면 밖으로 나가지 않도록 자동으로 제한해요
 */
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { getOverlayStyles } from '../styles/overlayStyles';

const ModalOverlay = ({ title = 'Chat', children, theme, onClose }) => {
  const styles = getOverlayStyles(theme);
  const overlayRef = useRef(null);
  // 창의 위치를 저장하는 변수 (왼쪽, 위쪽 좌표)
  const [pos, setPos] = useState({ left: 0, top: 0 });
  // 지금 창을 드래그하고 있는지 확인하는 변수
  const [dragging, setDragging] = useState(false);
  // 지금 창 크기를 조절하고 있는지 확인하는 변수
  const [resizing, setResizing] = useState(false);
  // 창의 크기를 저장하는 변수 (너비, 높이)
  const [size, setSize] = useState({ width: 360, height: 560 });
  // 창이 접혀있는지 확인하는 변수
  const [collapsed, setCollapsed] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 360, height: 560 });
  // 창의 최소 크기 (이보다 작게 만들 수 없어요)
  const minSize = { width: 360, height: 560 };

  useEffect(() => {
    // 처음에 창을 화면 오른쪽 위 근처에 배치해요
    setPos({ left: Math.max(window.innerWidth - 420, 20), top: 80 });
  }, []);

  // 마우스를 움직일 때 창을 드래그하는 함수
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging) return;
      const nextLeft = e.clientX - dragOffset.current.x;
      const nextTop = e.clientY - dragOffset.current.y;
      // 창이 화면 밖으로 나가지 않도록 제한해요
      const maxLeft = window.innerWidth - 60; // 화면 오른쪽 끝
      const maxTop = window.innerHeight - 60; // 화면 아래쪽 끝
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

  // 마우스를 움직일 때 창 크기를 조절하는 함수
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!resizing) return;
      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;
      // 최소 크기보다 작아지지 않도록 해요
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

  // 창 헤더를 마우스로 눌렀을 때 드래그를 시작하는 함수
  const onHeaderMouseDown = (e) => {
    if (!overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    // 마우스 위치와 창 위치의 차이를 저장해요 (드래그할 때 필요해요)
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

  // 이 창을 화면 맨 위에 띄우기 위해 body에 직접 렌더링해요
  // 이렇게 하면 다른 화면을 가리지 않고 위에 떠다닐 수 있어요!
  return ReactDOM.createPortal(node, document.body);
};

export default ModalOverlay;
