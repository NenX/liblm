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
  transferType: number;
  deptName: string;
  transferDate: any;
  note: string;
}
export default function ReferralToRegister({ onChange, value = [], ...rest }: any) {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingKey, setEditingKey] = useState('');

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
            <a href="javascript:;" onClick={() => onSave(record)} style={{ marginRight: 8 }}>
              保存
            </a>
            <Divider type="vertical" />
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
    setSelectedRowKeys(selectedRowKeys);
  };

  const edit = (record: any) => {
    form.setFieldsValue({ transferType: null, deptName: '', transferDate: null, ...record });
    setEditingKey(record.id);
  };

  const handleAdd = () => {
    const id = `NEW_${new Date().getTime()}`;
    const newData: ItemProps = {
      id,
      transferType: 1,
      deptName: '',
      transferDate: dayjs(),
      note: '',
    };
    onChange([...value, newData]);
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
          ...{ ...row, transferDate: dayjs(row.transferDate).format('YYYY-MM-DD') },
        });
        onChange(newData);
        setEditingKey('');
      } else {
        // 新增
        newData.push({ ...row, transferDate: dayjs(row.transferDate).format('YYYY-MM-DD') });
        onChange(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const onCancel = () => {
    if (editingKey && editingKey.includes('NEW_')) {
      const newData = value.slice(0, -1);
      onChange(newData);
    }
    setEditingKey('');
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
      />
    </Form>
  );
}
