import React, { useState } from 'react';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { Button, InputNumber, Input } from 'antd';
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Modal from './Modal';
import styles from './index.less';
const DATA = {
  gravidity: null, // 孕次
  parity: null, // 产次
  gestationalWeek: '',
  list: [],
};
export default function DiagnosisList({ value = DATA, user, onChange }: any) {
  const [visible, setVisible] = useState(false);

  const onCancel = () => {
    setVisible(false);
  };

  const handleShow = () => {
    setVisible(true);
  };

  const handleDel = (i: string | number) => {
    const d = value.list.filter((_, index) => index !== i);
    onChange({
      ...value,
      list: d,
    });
  };

  const handleSelect = (val: string) => {
    const addItem = { id: '', diagnosis: val, createDate: dayjs().format('YYYY-MM-DD'), note: '' };
    if (value.list) {
      onChange({ ...value, list: [...value.list, addItem] });
    } else {
      onChange({ ...value, list: [addItem] });
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    const index = e.target.getAttribute('data-index');
    const newList = value.list;
    newList[index]['note'] = val;
    onChange({
      ...value,
      list: newList,
    });
  };

  const handleNumberChange = (val, key) => {
    // onChange({
    //   ...value,
    //   [key]: val,
    // });
  };

  return (
    <div className={styles["diagnosis-wrapper"]}>
      <div className={styles["diagnosis-action"]}>
        <Button icon={<PlusOutlined />} onClick={handleShow}>
          添加诊断
        </Button>
      </div>
      <ul className={styles["diagnosis-list"]}>
        <li className={styles["diagnosis-list-item"]}>
          <i className={styles["diagnosis-list-item-sequence"]}>{'1、'}</i>
          <span>
            G{' '}
            <InputNumber
              name="gravidity"
              value={value.gravidity}
              onChange={(val) => handleNumberChange(val, 'gravidity')}
              style={{ width: 42 }}
            />
          </span>
          <span>
            P{' '}
            <InputNumber
              name="parity"
              value={value.parity}
              onChange={(val) => handleNumberChange(val, 'parity')}
              style={{ width: 42 }}
            />
          </span>
          <span>
            妊娠{' '}
            <Input
              name="gestationalWeek"
              value={value.gestationalWeek}
              onChange={(e) => handleNumberChange(e.target.value, 'gestationalWeek')}
              style={{ width: 60 }}
            />{' '}
            周
          </span>
        </li>
        {value.list &&
          value.list.map((_, i: number) => {
            return (
              <li key={_.id || i.toString()} className={styles["diagnosis-list-item"]}>
                <i className={styles["diagnosis-list-item-sequence"]}>{`${i + 2}、`}</i>
                <span className={styles["diagnosis-list-item-text"]}>{_.diagnosis}</span>
                <Input
                  data-index={i}
                  className={styles["diagnosis-list-item-input"]}
                  type="text"
                  placeholder="备注"
                  value={_.note}
                  onChange={handleTextChange}
                />
                <span className={styles["diagnosis-list-item-extra"]}>
                  <span className={styles["date"]}>{_.createDate}</span>
                  <Button type="text" onClick={() => handleDel(i)}>
                    <CloseCircleOutlined />
                  </Button>
                </span>
              </li>
            );
          })}
      </ul>
      {visible && <Modal visible={visible} onCancel={onCancel} onSelect={handleSelect} />}
    </div>
  );
}
