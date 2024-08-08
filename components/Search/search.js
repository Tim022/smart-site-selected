import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { SearchIcon, CloseIcon, InfoCircleIcon, ChevronLeftIcon } from '@/components/Icons/icons'
import { GaugeBasic, BarBasic } from '@/components/Charts/charts'
import { Button, Select, Form, Input, InputNumber, Tabs, Row, Col } from 'antd/lib'

export const AddressSearch = (
  {
    onSubmit,
    searchByClickArea,
    setSearchByClickArea,
    addressSearchString,
    searchResult,
    setSearchResult,
    setHighlightPolygon,
    setMapPinning,
    openNotification,
    closeNotification
  }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchBoxClassName, setSearchBoxClassName] = useState(styles.searchAreaClose);

  const [formAddress] = Form.useForm();
  const handlesearchBoxOpen = () => {
    // console.log('Custom control clicked!');
    setSearchOpen(true);
    setSearchBoxClassName(styles.searchAreaExpand)

    if (searchMethodClassName == styles.typeSwitch2) {
      openNotification()
      setMapPinning(true)
    }
  };

  const handlesearchBoxClose = () => {
    // console.log('Custom control clicked!');
    setSearchOpen(false);
    setSearchBoxClassName(styles.searchAreaClose)
    setSearchByClickArea(false)
    setHighlightPolygon([])
    setShowFormValidInfo(false)
    setShowFormValidInfo2(false)
    closeNotification()
    setMapPinning(false)
    setActivetab('1');

    formAddress.resetFields();
  };

  const [searchMethodClassName, setSearchMethodClassName] = useState(styles.typeSwitch1);
  const handlesearchMethod1 = () => {
    setSearchMethodClassName(styles.typeSwitch1)
    closeNotification()
    setMapPinning(false);
  };

  const handlesearchMethod2 = () => {
    setSearchMethodClassName(styles.typeSwitch2)
    openNotification()
    setMapPinning(true);
  };

  const handlesearchMethod3 = () => {
    setSearchMethodClassName(styles.typeSwitch3)
    closeNotification()
    setMapPinning(false);
  };

  const [resultTypeClassName, setResultTypeClassName] = useState(styles.typeSwitch1);
  const handleresultType1 = () => {
    setResultTypeClassName(styles.typeSwitch1)
  };

  const handleresultType2 = () => {
    setResultTypeClassName(styles.typeSwitch2)
  };

  const handleresultType3 = () => {
    setResultTypeClassName(styles.typeSwitch3)
  };

  const [activetab, setActivetab] = useState('1');

  const reset = () => {

  }

  const [showFormValidInfo, setShowFormValidInfo] = useState(false)
  const [showFormValidInfo2, setShowFormValidInfo2] = useState(false)

  const handleSubmit = () => {
    formAddress.validateFields()
      .then((values) => {
        setActivetab('2');
        setSearchBoxClassName(styles.searchAreaExpandResult)
        // console.log(value)
        onSubmit(values); // 將表單的值提交給父組件或其他處理函數

        setShowFormValidInfo(false)
        setShowFormValidInfo2(false)
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
        if (searchMethodClassName == styles.typeSwitch3) {
          setShowFormValidInfo2(true)
        } else {
          if (!errorInfo.values.addressfullname) {
            setShowFormValidInfo(true)
          }
        }
      });
  };

  const backtoTabs1 = () => {
    setActivetab('1');
    setSearchBoxClassName(styles.searchAreaExpand)
    setSearchByClickArea(false)
  };
  const items = [
    {
      key: '1',
      label: '搜尋地區',
      children: (
        <div style={{ backgroundColor: '#454B52', borderRadius: '6px' }} >
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={styles.searchBeginText} >搜尋地區</span>
              <button onClick={handlesearchBoxClose} style={{ display: 'flex', alignItems: 'center' }}><CloseIcon color='#6CD9C7' /></button>
            </div>
            <hr style={{ borderColor: '#565C66', margin: '16px 0px' }}></hr>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontFamily: 'Noto Sans CJK TC', fontSize: '16px', fontWeight: '400', color: '#FFF', marginBottom: '8px' }}>位置資訊</span>
              <div style={{ borderRadius: '100px', height: '38px', backgroundColor: '#676D73', display: 'flex', alignItems: 'center' }}>
                <div className={`${styles.typeSelectedBackground} ${searchMethodClassName}`}>
                </div>
                <button onClick={handlesearchMethod1} style={{ width: '116px', height: '34px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>自行輸入</button>
                <button onClick={handlesearchMethod2} style={{ width: '116px', height: '34px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>地圖上釘選</button>
                <button onClick={handlesearchMethod3} style={{ width: '116px', height: '34px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>選擇地區</button>
              </div>
            </div>
            <Form form={formAddress} className={styles.addressSearchForm}>
              {
                searchMethodClassName == styles.typeSwitch3 ?
                  <div >
                    <Row gutter={14}>
                      <Col>
                        <Form.Item
                          name='city'
                          rules={[
                            {
                              required: true,
                              message: ''
                            },
                          ]}
                        >
                          <Select
                            popupClassName={styles.selectDropdownDark}
                            style={{ width: '108px', height: '40px' }}
                            placeholder='選擇縣市'
                            options={[
                              {
                                label: '台北市',
                                value: 1
                              },
                              {
                                label: '新北市',
                                value: 2
                              },
                              {
                                label: '桃園市',
                                value: 3
                              }
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          name='county'
                          rules={[
                            {
                              required: true,
                              message: ''
                            },
                          ]}
                        >
                          <Select
                            popupClassName={styles.selectDropdownDark}
                            style={{ width: '108px', height: '40px' }}
                            placeholder='--'
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          name='village'
                          rules={[
                            {
                              required: true,
                              message: ''
                            },
                          ]}
                        >
                          <Select
                            popupClassName={styles.selectDropdownDark}
                            style={{ width: '108px', height: '40px' }}
                            placeholder='--'
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    {
                      showFormValidInfo2 ?
                        <div className={showFormValidInfo2 ? styles.formValidInfoMoveIn : styles.formValidInfoMoveOut} >
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
                            <InfoCircleIcon size={14} color='#4DBFB6' />
                            <span style={{ fontFamily: 'Noto Sans TC', fontSize: '16px', fontWeight: '400', color: '#4DBFB6', marginLeft: '4px' }}>
                              請輸入位置資訊
                            </span>
                          </div>
                        </div> : <div style={{ height: '0px' }}></div>
                    }
                  </div> :
                  <div>
                    <Row>
                      <Form.Item
                        name='addressfullname'
                        rules={[
                          {
                            required: true,
                            message: ''
                          },
                        ]}
                      >
                        <Input
                          className={searchMethodClassName == styles.typeSwitch2 ? `${styles.inputDark} ${styles.inputDrag}` : `${styles.inputDark}`}
                          placeholder='輸入地址'
                          size='large'
                          style={{ width: '352px' }}
                          disabled={searchMethodClassName == styles.typeSwitch2}
                        />
                      </Form.Item>
                      {
                        showFormValidInfo || searchMethodClassName == styles.typeSwitch2 ?
                          <div className={showFormValidInfo || searchMethodClassName == styles.typeSwitch2 ? styles.formValidInfoMoveIn : styles.formValidInfoMoveOut} >
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
                              <InfoCircleIcon size={14} color='#4DBFB6' />
                              <span style={{ fontFamily: 'Noto Sans TC', fontSize: '16px', fontWeight: '400', color: '#4DBFB6', marginLeft: '4px' }}>
                                {searchMethodClassName == styles.typeSwitch1 ? '請輸入位置資訊' : '拖曳地圖以移動大頭針'}
                              </span>
                            </div>
                          </div> : <div style={{ height: '0px' }}></div>
                      }
                    </Row>

                    <Row style={showFormValidInfo || searchMethodClassName == styles.typeSwitch2 ? { marginTop: '36px' } : { marginTop: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'Noto Sans TC', fontSize: '16px', fontWeight: '400', color: '#FFF' }}>場域面積(㎡)</span>
                      </div>
                      <Form.Item
                        name='area'
                      >
                        <InputNumber
                          className={styles.inputDark}
                          placeholder='輸入場域面積'
                          size='large'
                          style={{ width: '352px' }}
                          min={0}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </Form.Item>
                    </Row>

                    <Row style={{ marginTop: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'Noto Sans TC', fontSize: '16px', fontWeight: '400', color: '#FFF' }}>車格數</span>
                        <InfoCircleIcon color='#FFF' size='16' innerStyle={{ marginLeft: '4px' }} />
                      </div>
                      <Form.Item
                        name='carslots'
                        rules={[
                          {
                            required: true,
                            message: '數字不可為0或大於系統建議值'
                          },
                          {
                            type: "number",
                            min: 1,
                            message: '數字不可為0或大於系統建議值'
                          },
                          {
                            type: "number",
                            max: 999,
                            message: '數字不可為0或大於系統建議值'
                          }
                        ]}
                      >
                        <InputNumber
                          className={styles.inputDark}
                          placeholder='輸入車格數'
                          size='large'
                          style={{ width: '352px' }}
                          min={0}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </Form.Item>
                    </Row>
                  </div>
              }
            </Form>

            <hr style={{ borderColor: '#565C66', margin: '48px 0px 16px 0px' }}></hr>
            <Row style={{ marginTop: '20px', justifyContent: 'flex-end' }}>
              <Button className={styles.btnReset} onClick={reset}>重設</Button>
              <Button className={styles.btnPrimary} style={{ marginLeft: '16px' }} type='primary' onClick={handleSubmit}>搜尋</Button>
            </Row>
          </div>
        </div>),
    },
    {
      key: '2',
      label: '搜尋結果',
      children: (
        <div style={{ backgroundColor: '#454B52', borderRadius: '6px' }}>
          <div style={{ padding: '24px', maxHeight: 'calc(100vh - 124px)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={backtoTabs1} style={{ display: 'flex', marginRight: '8px' }}><ChevronLeftIcon color='#FFF' size='20' /></button>
              <span className={styles.searchResultText} >搜尋結果</span>
              <button onClick={handlesearchBoxClose} style={{ display: 'flex', alignItems: 'center' }}><CloseIcon color='#6CD9C7' /></button>
            </div>
            <hr style={{ borderColor: '#565C66', margin: '16px 0px' }}></hr>
            <div>
              <div style={{ borderRadius: '100px', height: '38px', backgroundColor: '#676D73', display: 'flex', alignItems: 'center' }}>
                <div className={`${styles.typeSelectedBackground} ${resultTypeClassName}`}>
                </div>
                <button onClick={handleresultType1} style={{ width: '116px', height: '34px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>需求圖層數據</button>
                <button onClick={handleresultType2} style={{ width: '116px', height: '34px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>供給圖層數據</button>
                <button onClick={handleresultType3} style={{ width: '116px', height: '34px', borderRadius: '100px', color: '#FFF', zIndex: '2' }}>站點評分</button>
              </div>
            </div>
            {resultTypeClassName == styles.typeSwitch1 ?
              <div>
                人口統計<br />
                小客車統計<br />
                道路小客車流統計<br />
                POI統計
              </div> : null}

            {resultTypeClassName == styles.typeSwitch2 ?
              <div>
                CPO統計
              </div> : null}

            {resultTypeClassName == styles.typeSwitch3 ?
              <div>
                <span style={{ fontFamily: 'Noto Sans TC', fontSize: '20px', fontWeight: '700', color: '#FFF', marginTop: '24px', display: 'block' }}>
                  搜集範圍：方圓3公里
                </span>
                <span style={{ fontFamily: 'Noto Sans TC', fontSize: '14px', fontWeight: '400', color: '#FFF', display: 'block' }}>
                  {addressSearchString}
                </span>
                <div style={{ margin: '16px 0px 24px 0px', borderRadius: '6px', backgroundColor: '#2B2F33', boxShadow: '0px 0px 5px 0px #00000033', padding: '0px 28px', overflowY: 'auto', height: 'calc(100vh - 340px)' }}>
                  <div style={{ height: '52px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Noto Sans TC', fontSize: '16px', fontWeight: '700', color: '#FFF' }}>站點評分表</span>
                  </div>
                  <hr style={{ borderColor: '#565C66' }}></hr>
                  <div style={{ width: '100%', height: '255px', marginTop: '32px' }}>
                    <GaugeBasic
                      dataValue={6}
                    />
                  </div>
                  <div style={{ position: 'relative', top: '-10px' }}>
                    <span style={{ fontFamily: 'Noto Sans TC', fontSize: '10px', fontWeight: '400', color: '#FFF', display: 'block' }}>
                      今年度建站預估度數總額
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'Noto Sans TC', fontSize: '24px', fontWeight: '700', color: '#FFF', display: 'block' }}>
                        2376
                      </span>
                      <span style={{ fontFamily: 'Noto Sans TC', fontSize: '10px', fontWeight: '400', color: '#FFF', display: 'block' }}>
                        &nbsp;kWh
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '160px', marginTop: '8px' }}>
                      <BarBasic />
                    </div>
                  </div>
                </div>
              </div> : null}
          </div>
        </div>),
    }
  ];

  useEffect(() => {
    if (searchByClickArea == true) {
      handlesearchBoxOpen();
      setActivetab('2');
      setSearchBoxClassName(styles.searchAreaExpandResult);
    }
  }, [searchByClickArea])

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
