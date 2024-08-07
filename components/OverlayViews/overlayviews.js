import React, { useRef, useEffect } from 'react'

export const PolygonLabel = ({ position, text, map }) => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const initializeOverlay = () => {
    if (map && containerRef.current && !overlayRef.current) {
      const overlay = new google.maps.OverlayView();
      overlayRef.current = overlay;

      overlay.onAdd = () => {
        const panes = overlay.getPanes();
        panes.overlayLayer.appendChild(containerRef.current);
      };

      overlay.draw = () => {
        const projection = overlay.getProjection();
        const positionInPixels = projection.fromLatLngToDivPixel(new google.maps.LatLng(position.lat, position.lng));
        const div = containerRef.current;
        div.style.left = `${positionInPixels.x}px`;
        div.style.top = `${positionInPixels.y}px`;
      };

      overlay.onRemove = () => {
        if (containerRef.current) {
          containerRef.current.parentNode.removeChild(containerRef.current);
        }
      };

      overlay.setMap(map);
    }
  };
  if (map) {
    initializeOverlay();
  }
  return (
    <div ref={containerRef} style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
      {text}
    </div>
  );
};

export default function None() {
  return (<></>)
};
