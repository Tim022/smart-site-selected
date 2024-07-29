import { OverlayView, OverlayViewF } from '@react-google-maps/api';
import styles from './styles.module.css'

export const PolygonLabel = ({ position, text }) => {
  const overlayStyle = {
    fontSize: '14px',
    color: '#FFFFFF',
    width: '100px'
  };

  return (
    <OverlayViewF
      position={position}
      mapPaneName={OverlayView.OVERLAY_LAYER}
    >
      <div className={styles.townLabel}>
        {text}
      </div>
    </OverlayViewF>
  );
};

export default function None() {
  return (<></>)
};
