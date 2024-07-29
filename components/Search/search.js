import React, { useEffect, useState } from 'react'
import styles from '@/pages/smart-site-selected/styles.module.css'
import { SearchIcon, CloseIcon, InfoCircleIcon, ChevronLeftIcon } from '@/components/Icons/icons'
import { Button, Select, Form, Input, InputNumber, Tabs } from 'antd/lib'

export const AddressSearch = ({ onSubmit }) => {
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

  const [resultTypeClassName, setResultTypeClassName] = useState(styles.resultTypeSwitch1);
  const handleresultType1 = () => {
    setResultTypeClassName(styles.resultTypeSwitch1)
  };

  const handleresultType2 = () => {
    setResultTypeClassName(styles.resultTypeSwitch2)
  };

  const handleresultType3 = () => {
    setResultTypeClassName(styles.resultTypeSwitch3)
  };

  const [activetab, setActivetab] = useState("1");

  const handleSubmit = (value) => {
    setActivetab("2");
    setSearchBoxClassName(styles.searchAreaExpandResult)
    // console.log(value)
    onSubmit(value); // 將表單的值提交給父組件或其他處理函數
  };

  const backtoTabs1 = () => {
    setActivetab("1");
    setSearchBoxClassName(styles.searchAreaExpand)
  };
  const items = [
    {
      key: '1',
      label: '搜尋地區',
      children: (
        <div style={{ backgroundColor: '#454B52', borderRadius: '6px' }} >
          <div style={{ padding: '24px' }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={styles.searchBeginText} >搜尋地區</span>
              <button onClick={handlesearchBoxClose} style={{ display: 'flex', alignItems: 'center' }}><CloseIcon color='#6CD9C7' /></button>
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
            {searchMethodClassName == styles.searchMethodSwitch1 ?
              <div>
                <div style={{ margin: '16px 0px' }}>
                  <Select
                    style={{ width: '109.33px', height: '40px' }}
                    placeholder="選擇縣市"
                  />
                  <Select
                    style={{ width: '109.33px', height: '40px', margin: '0px 12px' }}
                    placeholder="選擇地區"
                  />
                  <Select
                    style={{ width: '109.33px', height: '40px' }}
                    placeholder="選擇村里"
                  />
                </div>
                <Form onFinish={handleSubmit} className={styles.addressSearchForm}>
                  <Form.Item
                    name='addressfullname'
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '請輸入地址'
                  //   },
                  // ]}
                  >
                    <Input
                      placeholder='輸入地址'
                      size="large"
                      style={{ width: '352px' }}
                    />
                  </Form.Item>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontFamily: "Noto Sans TC", fontSize: "16px", fontWeight: "400", color: "#FFF" }}>車格數</span>
                    <InfoCircleIcon color='#FFF' size='16' innerStyle={{ paddingBottom: '2px', marginLeft: '4px' }} />
                  </div>
                  <Form.Item
                    name='carslots'
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '請輸入車格數'
                  //   },
                  // ]}
                  >
                    <InputNumber
                      placeholder='輸入車格數'
                      size="large"
                      style={{ width: '352px' }}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button >重設</Button>
                    <Button style={{ marginLeft: '16px' }} type="primary" htmlType="submit">搜尋</Button>
                  </div>
                </Form>
              </div> : null}
          </div>
        </div>),
    },
    {
      key: '2',
      label: '搜尋結果',
      children: (
        <div style={{ backgroundColor: '#454B52', borderRadius: '6px' }}>
          <div style={{ padding: '24px' }}>
            <div style={{ display: "flex", alignItems: 'center' }}>
              <button onClick={backtoTabs1} style={{ display: 'flex', marginRight: '8px' }}><ChevronLeftIcon color='#FFF' size='20' /></button>
              <span className={styles.searchResultText} >搜尋結果</span>
              <button onClick={handlesearchBoxClose} style={{ display: 'flex', alignItems: 'center' }}><CloseIcon color='#6CD9C7' /></button>
            </div>
            <hr style={{ borderColor: '#565C66', margin: '16px 0px' }}></hr>
            <div>
              <div style={{ borderRadius: '100px', height: '38px', backgroundColor: '#676D73', display: 'flex', alignItems: 'center' }}>
                <div className={`${styles.resultTypeSelectedBackground} ${resultTypeClassName}`}>
                </div>
                <button onClick={handleresultType1} style={{ width: '116px', height: '34px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>需求圖層數據</button>
                <button onClick={handleresultType2} style={{ width: '116px', height: '34px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>供給圖層數據</button>
                <button onClick={handleresultType3} style={{ width: '116px', height: '34px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>站點評分</button>
              </div>
            </div>
            {resultTypeClassName == styles.resultTypeSwitch1 ?
              <div>
                人口統計
              </div> : null}

            {resultTypeClassName == styles.resultTypeSwitch2 ?
              <div>
                CPO統計
              </div> : null}

            {resultTypeClassName == styles.resultTypeSwitch3 ?
              <div>
                <span style={{ fontFamily: "Noto Sans TC", fontSize: "20px", fontWeight: "700", color: "#FFF", marginTop: "23px", display: "block" }}>
                  評估範圍：方圓3公里
                </span>
                <div style={{ margin: '16px 24px 24px 24px', borderRadius: '6px', backgroundColor: '#2B2F33', boxShadow: '0px 0px 5px 0px #00000033', padding: '0px 28px' }}>
                  <div style={{ height: '52px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: "Noto Sans TC", fontSize: "16px", fontWeight: "700", color: "#FFF" }}>站點評分表</span>
                  </div>
                  <hr style={{ borderColor: '#565C66' }}></hr>
                  <div>圖表</div>
                </div>
              </div> : null}
          </div>
        </div>),
    }
  ];

  return (
    <div className={`${styles.searchArea} ${searchBoxClassName}`}>
      {searchOpen ?
        <Tabs
          activeKey={activetab}
          defaultActiveKey='1'
          items={items}
          className={styles.addressSearchTabs}
          animated={true}
        />
        :
        <button
          className={`${styles.searchBeginButton} ${styles.alignCenterV} ${styles.alignCenterH}`}
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
