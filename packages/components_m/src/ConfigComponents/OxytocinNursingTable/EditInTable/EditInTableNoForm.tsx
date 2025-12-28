import BaseFormComponent from '../../../BaseFormComponent';
import { Form } from 'antd';
import {
  cloneDeep,
  concat,
  filter,
  get,
  includes,
  isArray,
  isEmpty,
  isEqual,
  join,
  keyBy,
  map,
  set,
  split,
  size,
} from 'lodash';
import React, { Component } from 'react';
import BaseTable from './BaseTable';
import dayjs from 'dayjs';
import { formatTimeToDate } from '@/utils/format';
import { isMoment } from '@lm_fe/utils';
export const tableColumnsSpecialInputType = ['select_tag_with_options', 'tree_select_v2', 'tree_select'];
export default ({ tableColumns, changeImmediate = true }) => {
  class EditInTable extends Component {
    addedNum = 0;

    constructor(props: any) {
      super(props);
      this.state = {
        selectedRowKeys: [],
        dataSource: map(get(props, 'value'), (item) => {
          return {
            ...item,
            key: get(item, 'id'),
          };
        }),
        oldDataSource: [],
        isEditing: false,
      };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const { value } = nextProps;
      if (!isEqual(value, get(prevState, 'value'))) {
        return {
          dataSource: map(value, (item) => {
            return {
              ...item,
              key: get(item, 'id') || get(item, 'key'),
            };
          }),
        };
      }
      return null;
    }

    handleAdd = async () => {
      const { value = [], onChange, defaultInputData = {} } = this.props;
      const { dataSource, isEditing } = this.state;
      if (isEditing) {
        this.addedNum += 1;
      }

      const newDataSource = [
        ...value,
        {
          ...defaultInputData,
          key: -Math.random(),
        },
      ];
      await this.setState({
        oldDataSource: dataSource,
        dataSource: newDataSource,
      });
      this.handleEdit();
      onChange && onChange(newDataSource, { isAdd: true });
    };

    handleEdit = () => {
      const { dataSource } = this.state;
      this.setFormData(dataSource);
      this.setState({
        isEditing: true,
        oldDataSource: dataSource,
      });
    };

    getAllColumnsMapping = (tableColumns) => {
      let tempColumns: any = [];
      map(tableColumns, (col) => {
        const colChildren = get(col, 'children');
        if (colChildren && !isEmpty(colChildren)) {
          tempColumns = concat(tempColumns, this.getAllColumnsMapping(colChildren));
        } else {
          tempColumns.push(col);
        }
      });
      return tempColumns;
    };

    setFormData = (dataSource) => {
      const formData = {};
      const allColumns = this.getAllColumnsMapping(tableColumns);
      const allColumnsMapping = keyBy(allColumns, 'dataIndex');
      map(dataSource, (data, index) => {
        map(data, (value, key) => {
          const inputType = get(allColumnsMapping, `${key}.inputType`);
          let tempValue = value;
          if (inputType === 'single_date_picker') {
            tempValue = dayjs(tempValue);
          }
          if (key !== 'key') {
            if (Object.prototype.toString.call(value) === '[object Object]') {
              // 新增 value 可能是子对象的情况
              map(value, (item, itemKey) => {
                set(formData, `${index}-${key},${itemKey}`, item);
              });
            } else {
              set(formData, `${index}-${key}`, tempValue);
            }
          }
        });
      });
      this.form.resetFields();
      this.form.setFieldsValue(formData);
    };

    handleDelete = async () => {
      const { value } = this.props;
      const { selectedRowKeys, dataSource } = this.state;

      const cloneData = cloneDeep(dataSource);
      map(cloneData, (item, index) => {
        if (size(item) === 1) {
          set(cloneData, index, { ...get(value, index), ...item });
        }
      });

      const newDataSource = filter(cloneData, (data) => !includes(selectedRowKeys, data.key));
      this.setState({
        dataSource: newDataSource,
        selectedRowKeys: [],
      });
      this.doOutData(newDataSource);
    };

    handleCancel = () => {
      const { oldDataSource, dataSource } = this.state;
      this.setFormData(oldDataSource);
      this.setState({
        isEditing: false,
        dataSource: dataSource.slice(0, dataSource.length - this.addedNum),
      });
      this.addedNum = 0;
    };

    handleSave = () => {
      const dataSource = this.mapFormDataToDatasource();
      this.doOutData(dataSource);
      this.setState({
        dataSource,
        isEditing: false,
      });
      this.addedNum = 0;
    };

    handleRowSelected = (selectedRowKeys, selectedRows) => {
      this.setState({
        selectedRowKeys,
      });
    };

    isEditing = () => this.state.isEditing;

    handleFieldsChange = (changedFields: any[], allFields: any[]) => {
      if (this.form && changeImmediate) {
        const dataSource = this.mapFormDataToDatasource();
        this.doOutData(dataSource);
      }
    };

    mapFormDataToDatasource = () => {
      const { value: oldData } = this.props;
      const data = this.form.getFieldsValue();
      const dataSourceObj = {};
      const dataSource: any = [];
      map(data, (value, key) => {
        const names = split(key, '-');
        let tempValue = value;
        if (isMoment(tempValue)) {
          tempValue = formatTimeToDate(tempValue);
        }
        set(dataSourceObj, `${names[0]}.${names[1]}`, tempValue);
      });
      map(dataSourceObj, (data: object, index) => {
        dataSource[index] = {
          ...data,
          type: 2,
          id: get(oldData, `${index}.id`),
          key: -Math.random(),
        };
      });
      return dataSource;
    };

    doOutData = (dataSource: any) => {
      const { onChange } = this.props;
      const outData = map(dataSource, (data) => {
        const tempData = { ...data };
        map(data, (item, key) => {
          if (split(key, ',').length > 1) {
            set(tempData, split(key, ','), item);
          }
        });
        return tempData;
      });
      onChange && onChange(outData);
    };

    // 添加 getDataSource 方法，重新渲染预览模式下的表格数据，主要是针对非输入项的 mapping 值
    getDataSource = () => {
      const { dataSource } = this.state;
      const { dictionaries } = this.props;
      const allTableColumns = this.getAllColumnsMapping(tableColumns);
      return map(dataSource, (rowData) => {
        const tempRowData = cloneDeep(rowData);
        map(allTableColumns, (col: any) => {
          const { inputType, inputProps, dataIndex } = col;
          if (isArray(dataIndex)) {
            set(tempRowData, dataIndex, get(rowData, join(dataIndex, ',')) || get(rowData, dataIndex));
          }
          if (isArray(get(rowData, dataIndex))) {
            set(tempRowData, dataIndex, join(get(rowData, dataIndex), ','));
          }
          // 如果是从字典获取 options
          if (inputType === 'dictionary_select_in_table') {
            const uniqueKey = get(inputProps, 'uniqueKey');
            const dictionary = get(dictionaries, uniqueKey);
            const optionMapping = keyBy(get(dictionary, 'enumerations'), 'value');
            map(rowData, (item, index) => {
              if (isEqual(index, dataIndex) || isEqual(index, join(dataIndex, ','))) {
                set(tempRowData, dataIndex, get(optionMapping, `${item}.label`));
              }
            });
          }
        });
        return tempRowData;
      });
    };

    getColumns = (tableColumns: any) => {
      return map(tableColumns, (col: any) => {
        if (get(col, 'children')) {
          return {
            ...col,
            children: this.getColumns(get(col, 'children')),
          };
        } else {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (rowData: any, rowIndex) => {
              return {
                record: rowData,
                inputType: col.inputType,
                inputProps: col.inputProps,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: this.isEditing(),
                rowIndex,
              };
            },
          };
        }
      });
    };

    renderEditableCell = (cell: any) => {
      const {
        editing,
        dataIndex,
        title,
        inputType = 'input',
        inputProps,
        rules,
        record,
        rowIndex,
        children,
        inputConfig,
        ...restProps
      } = cell;
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item
              name={`${rowIndex}-${dataIndex}`}
              style={{
                margin: 0,
              }}
              rules={rules}
            >
              <BaseFormComponent {...inputProps} inputType={inputType} config={inputConfig ?? cell} />
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    };

    render() {
      const { selectedRowKeys, isEditing } = this.state;
      const mergedColumns = this.getColumns(tableColumns);
      const mergedDataSource = this.getDataSource();
      return (
        <Form
          ref={(formRef) => {
            this.form = formRef;
          }}
          component={false}
          onFieldsChange={this.handleFieldsChange}
        >
          <BaseTable
            {...this.props}
            columns={mergedColumns}
            dataSource={mergedDataSource}
            scroll={{}}
            rowSelection={{
              type: 'checkbox',
              onChange: this.handleRowSelected,
            }}
            selectedRowKeys={selectedRowKeys}
            onAdd={this.handleAdd}
            onEdit={this.handleEdit}
            onDelete={this.handleDelete}
            onCancel={this.handleCancel}
            onSave={this.handleSave}
            rowKey="key"
            isEditing={isEditing}
            components={{
              body: {
                cell: this.renderEditableCell,
              },
            }}
            pagination={false}
          />
        </Form>
      );
    }
  }

  return EditInTable
};
