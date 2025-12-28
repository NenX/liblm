import {
  IModel_EarlyPregnancyCheckSurgeryType,
  IModel_EarlyPregnancySurgicalTemplate,
  SModel_EarlyPregnancyCheckSurgeryType,
} from '../../../.stupid_model';
import { Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import DragItem from '../components/drag-item';
import { findOperationColor } from '../util';
import { Item } from './Item';
import { DD } from '../DD';
// import notThing from '@/assets/imgs/gy-not-thing.png';
interface IProps {
  leftList: Partial<IModel_EarlyPregnancyCheckSurgeryType>[];
  colorList: IModel_EarlyPregnancySurgicalTemplate[];
  name?: string;
  setName: (v?: string) => void;
  fetchLeftData: (name?: string) => void;
  dd: DD;
}
export default function WorkFlow(props: IProps) {
  const { leftList, colorList, fetchLeftData, name, setName, dd } = props;
  const handleDragEnd = (item: { name: string }, position: { x: number; y: number }) => { };
  useEffect(() => { }, []);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography.Title
        onClick={(e) => { }}
        level={5}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          height: 46,
          padding: '9px 0',
          margin: '0 12px',
        }}
      >
        <span style={{ color: '#150F55' }} onClick={() => { }}>
          {`待预约患者`}
          <span style={{ color: '#828C99', fontSize: 12, paddingLeft: 8 }}>{`(${leftList.length})`}</span>
        </span>
      </Typography.Title>
      <Input.Search
        style={{ padding: 12 }}
        value={name}
        placeholder="请输入患者姓名"
        onChange={(e) => setName(e.target.value)}
        allowClear
        onSearch={(value) => fetchLeftData(value)}
      />

      {/* <div>
                {
                    colorList.map((_, i) => <span style={{ color: '#000', background: _.backgroundColor, display: 'inline-block', padding: '4px 6px', marginRight: 4 }}>{_.operationName || '无'}</span>)
                }
            </div> */}
      <div style={{ overflowY: 'scroll' }}>
        {leftList.length > 0 ? (
          <>
            <ul style={{ padding: '0 12px' }}>
              {leftList.map((_) => {
                return (
                  <DragItem name="rect" data={_} onDragEnd={handleDragEnd} key={_.id}>
                    <Item
                      color={findOperationColor(colorList, _?.operationName as any)[0]}
                      data={_}
                      dd={dd}
                      onClose={() => {
                        SModel_EarlyPregnancyCheckSurgeryType.del(_.id).then(() => fetchLeftData());
                      }}
                    />
                  </DragItem>
                );
              })}
            </ul>
            <div style={{ fontSize: 12, color: '#8D8DAC', textAlign: 'center', marginBottom: 16 }}>没有更多了</div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: '#8D8DAC', textAlign: 'center' }}>
            <div style={{ margin: '16px 21px' }}>
              
                <img src={"/lm_imgs/gy-not-thing.png"} />
              
            </div>
            <div>暂无用户需要预约</div>
          </div>
        )}
      </div>
    </div>
  );
}
