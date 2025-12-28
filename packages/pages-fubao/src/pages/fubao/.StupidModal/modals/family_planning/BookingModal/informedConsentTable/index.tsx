import { LazyAntd } from '@lm_fe/components';
import { Button, Input } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { IModel_EarlyPregnancyCheckSurgeryType } from '../../../../../.stupid_model';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

type IArrData = IModel_EarlyPregnancyCheckSurgeryType['informedConsents'];
type IItem = Partial<IArrData[number]>;
interface IProps {
  data?: IItem[];
  onChange: (v: IArrData) => void;
  disabled?: boolean;
}
export const InformedConsentTable = ({ data, onChange, disabled }: IProps) => {
  const [editingId, setEditingId] = useState<number>();

  const [_data, set_data] = useState(data || []);
  useEffect(() => {
    const d = _data.map((_) => ({
      id: _.id,
      state: _.state || 0,
      archiveTime: _.archiveTime || '',
      consentName: _.consentName || '',
    }));
    onChange(d);
  }, [_data]);
  function setData<T extends keyof IItem>(item: IItem, k: T, value: IItem[T]) {
    item[k] = value;
    set_data([..._data]);
  }
  useEffect(() => {
    set_data(data || []);
    console.log('form0 ', data);
  }, [data]);
  return (
    <div style={{ width: '100%', padding: '0 50px' }}>
      <Table
        style={{ width: '100%', margin: '12px 0' }}
        pagination={false}
        bordered
        dataSource={_data}
        columns={[
          {
            title: '知情同意书名称',
            dataIndex: 'consentName',
            width: 350,
            render(a, b) {
              // return <DataSelect
              //     url="document-templates?moduleType.equals=1&page=0&size=9999"
              //     labelKey="title"
              //     valueKey="title"
              //     dropdownMatchSelectWidth={350}
              //     // value={b.id}
              //     onChange={title => b.consentName = title}
              // />
              return <Input disabled={disabled} value={a} onChange={(e) => (b.consentName = e.target.value)} />;
            },
          },
          {
            title: '状态',
            dataIndex: 'state',
            width: 350,

            render(a, b) {
              return (
                <Select
                  disabled={disabled}
                  value={a}
                  options={['待归档', '已归档'].map((_, i) => ({ label: _, value: i }))}
                  onChange={(i) => {
                    setData(b, 'state', i as number);
                    b.archiveTime = i ? dayjs().format('YYYY-MM-DD HH-mm:ss') : '';
                  }}
                />
              );
            },
          },
          {
            title: '归档时间',
            dataIndex: 'archiveTime',
            width: 200,
          },
          {
            title: '操作',
            dataIndex: '',
            align: 'center',
            render(a, b, idx) {
              return (
                <Button
                  disabled={disabled}
                  onClick={() => {
                    _data.splice(idx, 1);
                    set_data([..._data]);
                  }}
                >
                  删除
                </Button>
              );
            },
          },
        ]}
      />
      <Button disabled={disabled} block onClick={() => set_data([..._data, {}])}>
        添加知情同意书
      </Button>
    </div>
  );
};
export default InformedConsentTable;
