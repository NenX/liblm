import { Button, Layout } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from 'store';
import { DD } from './DD';
import Left from './.Left';
import Right from './.Right';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  IModel_EarlyPregnancyCheckSurgeryType,
  IModel_EarlyPregnancySurgicalTemplate,
  SModel_EarlyPregnancyCheckSurgeryType,
  SModel_EarlyPregnancySurgicalTemplate,
  stupidEnums,
} from '../../.stupid_model';
const { Content, Sider } = Layout;
const FAMILY_PLANNING_BOOKING_MANAGEMENT_COLLAPSED_KEY = 'FAMILY_PLANNING_BOOKING_MANAGEMENT_COLLAPSED_KEY';
export default function WorkFlow() {
  const [collapsed, setCollapsed] = useState(store.get(FAMILY_PLANNING_BOOKING_MANAGEMENT_COLLAPSED_KEY) || false);
  const [leftList, setLeftList] = useState<Partial<IModel_EarlyPregnancyCheckSurgeryType>[]>([]);
  const [colorList, setColorList] = useState<IModel_EarlyPregnancySurgicalTemplate[]>([]);
  const [name, setName] = useState<string>();
  const dd = useMemo(() => new DD(), []);

  const onCollapse = (status: boolean) => {
    store.set(FAMILY_PLANNING_BOOKING_MANAGEMENT_COLLAPSED_KEY, status);
    setCollapsed(status);
  };
  function fetchLeftData(_name = name) {
    SModel_EarlyPregnancyCheckSurgeryType.getList({
      params: {
        progressStatus: stupidEnums.EarlyPregnancyCheckSurgeryType.progressStatus.getValue('待预约'),
        name: _name,
        'schedulingDate.greaterOrEqualThan': dd.start.format('YYYY-MM-DD'),
        'schedulingDate.lessOrEqualThan': dd.end.format('YYYY-MM-DD'),
      },
    }).then((r) => setLeftList(r.length ? r : []));

    SModel_EarlyPregnancySurgicalTemplate.getList().then((r) => {
      setColorList(r);
    });
  }
  useEffect(() => {
    const cb = dd.observe((data) => fetchLeftData(name));
    return cb;
  }, [name]);

  useEffect(() => {
    // __DEV__ && SModel_EarlyPregnancyCheckSurgeryType.getList().then(data => {
    //   data.forEach(_ => {
    //     if (_.progressStatus === stupidEnums.EarlyPregnancyCheckSurgeryType.progressStatus.getValue('已完成')) {
    //       _.progressStatus = stupidEnums.EarlyPregnancyCheckSurgeryType.progressStatus.getValue('超时'),
    //         _.payment = 1
    //       const type: TOperationType = '宫内节育器取出术'
    //       _.operationName = type
    //       SModel_EarlyPregnancyCheckSurgeryType.put(_)
    //     }
    //   })
    // })
  }, []);

  const footHeight = 0;
  const ToggleIcon = collapsed ? RightOutlined : LeftOutlined;
  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          userSelect: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: `calc(((100vh - 48px) - 36px) - 24px - ${footHeight}px)`,
            overflowY: 'hidden',
          }}
        >
          <Sider
            style={
              {
                // height: 'calc(((100vh - 48px) - 36px) - 24px)',
              }
            }
            theme="light"
            collapsedWidth={0}
            width={340}
            collapsed={collapsed}
            onCollapse={onCollapse}
          >
            <Left
              leftList={leftList}
              name={name}
              setName={setName}
              fetchLeftData={fetchLeftData}
              colorList={colorList}
              dd={dd}
            />
          </Sider>

          <Content
            style={{
              margin: '0',
              paddingBottom: 6,
              background: '#fff',
              position: 'relative',
              // height: 'calc(((100vh - 48px) - 36px) - 24px)',
              // overflowY: 'scroll'
            }}
          >
            <Right
              dd={dd}
              colorList={colorList}
              toggleNode={
                <>
                  <Button
                    type="text"
                    onClick={() => onCollapse(!collapsed)}
                    style={{
                      background: '#fff',
                      boxShadow: '0px 0px 9px 1px rgba(131, 131, 131, 0.12), 0px 2px 4px 1px rgba(0, 0, 0, 0.09)',
                      position: 'absolute',
                      left: 14,
                      top: 12,
                    }}
                    shape="circle"
                    title="切换"
                    icon={<ToggleIcon />}
                  />
                </>
              }
            />
          </Content>
        </div>
      </div>
    </DndProvider>
  );
}
