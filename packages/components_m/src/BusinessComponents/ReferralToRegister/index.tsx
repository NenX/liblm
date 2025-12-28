import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { LazyAntd } from '@lm_fe/components';
import { Button, Divider, Form, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import EditableCell from './EditableCell';
import column from './columns';
import './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


export interface ItemProps {
  id: string | number;
  referralType: number;
  referralDept: string;
  referralDate: any;
  reason: string;
}
let newId = -1;
export default function ReferralToRegister({ onChange, value = [], ...rest }: any) {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingKey, setEditingKey] = useState(0);
  const [flag, setFlag] = useState(true);

  const isEditing = (record: ItemProps) => record.id === editingKey;

  const columns = [
    ...column,
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (_: any, record: ItemProps) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {/* <a href="javascript:;" onClick={() => onSave(record)} style={{ marginRight: 8 }}>
              保存
            </a>
            <Divider type="vertical" /> */}
            <Popconfirm title="确定取消编辑?" onConfirm={onCancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Button type="link" icon={<EditOutlined />} className="table-action-btn" onClick={() => edit(record)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定要删除该条记录吗?`}
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                danger
                type="link"
                title="删除"
                size="small"
                icon={<DeleteOutlined />}
                className="table-action-btn"
              >
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ItemProps) => ({
        record,
        inputType: col.inputType,
        options: col.options,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleDelete = async (id: string | number) => {
    const index = value.findIndex((_) => _.id === id);
    if (index > -1) {
      const newData = [...value.slice(0, index), ...value.slice(index + 1)];
      onChange(newData);
    }
  };

  const handleBatchDelete = () => {
    // selectedRowKeys
    const newData = value.filter((_) => !selectedRowKeys.includes(_.id));
    onChange(newData);
  };

  const rowOnChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, 'selectedRowKeys');
    setSelectedRowKeys(selectedRowKeys);
  };

  const edit = (record: any) => {
    let formBaseData = {
      referralDate: record.referralDate ? dayjs(record.referralDate) : null,
    };
    formBaseData = {
      ...record,
      ...formBaseData,
    };
    form.setFieldsValue({ referralType: null, referralDept: '', referralDate: null, ...formBaseData });
    setFlag(false);
    setEditingKey(record.id);
  };

  const handleAdd = () => {
    const id = newId;
    newId--;
    const newData: ItemProps = {
      id,
      referralType: 1,
      referralDept: '',
      referralDate: dayjs(),
      reason: '',
    };
    console.log(newData, [...value, newData], 'newData');
    onChange([...value, newData]);
    console.log(value, 'value5');
    setEditingKey(id);
  };

  const onSave = async (record) => {
    try {
      const row = await form.validateFields();
      const newData = [...value];
      const index = newData.findIndex((item) => record.id === item.id);
      if (index > -1) {
        // 编辑
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...{ ...row, referralDate: dayjs(row.referralDate).format('YYYY-MM-DD') },
        });
        onChange(newData);
        setEditingKey(0);
      } else {
        // 新增
        newData.push({ ...row, referralDate: dayjs(row.referralDate).format('YYYY-MM-DD') });
        onChange(newData);
        setEditingKey(0);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const onCancel = () => {
    if (editingKey && editingKey < 0) {
      const newData = value.slice(0, -1);
      onChange(newData);
    }
    setFlag(true);
    setEditingKey(0);
  };

  return (
    <Form form={form} className="referral-table-form">
      <Space style={{ marginBottom: 8 }}>
        <Button type="primary" onClick={handleAdd}>
          增加
        </Button>
        <Button disabled={!selectedRowKeys.length} onClick={handleBatchDelete}>
          删除
        </Button>
      </Space>
      <Table
        bordered
        rowKey="id"
        size="middle"
        pagination={false}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: rowOnChange,
        }}
        footer={() => {
          return (
            <Button block icon={<PlusOutlined />} onClick={handleAdd}>
              增加
            </Button>
          );
        }}
        columns={mergedColumns}
        dataSource={value}
        onRow={(record) => {
          return {
            onClick: (event) => {
              if (flag) {
                //edit(record);
              }
            }, // 点击行
          };
        }}
      />
    </Form>
  );
}
