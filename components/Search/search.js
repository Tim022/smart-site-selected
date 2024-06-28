import React, { useEffect, useState } from 'react';
import styles from '@/pages/polygontest/styles.module.css'
import { SearchIcon, CloseIcon } from '@/components/Icons/icons'

export const SearchControl = ({ onSubmit }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchBoxClassName, setSearchBoxClassName] = useState(styles.searchAreaClose);
  const handlesearchBoxOpen = () => {
    // console.log('Custom control clicked!');
    setSearchOpen(true);
    setSearchBoxClassName(styles.searchAreaExpand)
  };

  const handlesearchBoxClose = () => {
    // console.log('Custom control clicked!');
    setSearchOpen(false);
    setSearchBoxClassName(styles.searchAreaClose)
  };

  const [searchMethodClassName, setSearchMethodClassName] = useState(styles.searchMethodSwitch1);
  const handlesearchMethod1 = () => {
    setSearchMethodClassName(styles.searchMethodSwitch1)
  };

  const handlesearchMethod2 = () => {
    setSearchMethodClassName(styles.searchMethodSwitch2)
  };

  return (
    <div className={`${styles.searchArea} ${searchBoxClassName}`}>
      {searchOpen ?
        <div style={{ backgroundColor: '#454B52', borderRadius: '6px' }}>
          <div style={{ padding: '24px' }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={styles.searchBeginText} >搜尋地區</span>
              <button onClick={handlesearchBoxClose} style={{ display: 'flex' }}><CloseIcon color='#6CD9C7' /></button>
            </div>
            <hr style={{ borderColor: '#565C66', margin: '16px 0px' }}></hr>
            <div>
              <span style={{ fontFamily: "Noto Sans CJK TC", fontSize: "16px", fontWeight: "400", color: '#FFF', marginBottom: '8px' }}>位置資訊</span>
              <div style={{ borderRadius: '100px', height: '38px', backgroundColor: '#676D73', display: 'flex', alignItems: 'center' }}>
                <div className={`${styles.searchMethodSelectedBackground} ${searchMethodClassName}`}>
                </div>
                <button onClick={handlesearchMethod1} style={{ width: '174px', height: '32px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>自行輸入</button>
                <button onClick={handlesearchMethod2} style={{ width: '174px', height: '32px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>地圖上釘選</button>
              </div>
            </div>
          </div>
        </div> :
        <button
          className={styles.searchBeginButton}
          onClick={handlesearchBoxOpen}
        >
          <SearchIcon size='16' color='#FFF' />
          搜尋地區
        </button>
      }
    </div >

  );
};

export default function None() {
  return (<></>)
};
