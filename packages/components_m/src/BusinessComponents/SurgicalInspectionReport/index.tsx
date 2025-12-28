import { Button, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get, map } from 'lodash';
import React, { Component } from 'react';
import { getResourcesByID } from '../../utils/defaultMethod';
// import { mockData } from './mock';
import { LazyAntd } from '@lm_fe/components';
import { mchcModal } from '../../modals';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const SaveLabExamsUrl = '/api/lab-exams'; // 手术记录-送检结果保存接口
//合并数组单元格
export const createNewArr = (data: any) => {
  return data
    .reduce((result: any, item: any) => {
      //首先将name字段作为新数组result取出
      if (result.indexOf(item.id) < 0) {
        result.push(item.id);
      }
      return result;
    }, [])
    .reduce((result: any, id: any) => {
      //将name相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
      const children = data.filter((item: any) => item.id === id);
      result = result.concat(
        children.map((item: any, index: number) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0, //将第一行数据添加rowSpan字段
        })),
      );
      return result;
    }, []);
};

// 计算合并行数
export const getMergeRowNum = (colName: string, row: any, dataSource: any, compareColName: string | null = null) => {
  const temp = {};
  let n = 0;
  /**
   * colName:labexamName
   */
  console.log(dataSource, 'dataSource');
  if (colName !== temp[colName]) {
    // 针对送检项目做处理
    temp[colName] = row[colName];
    if (colName === 'labexamName') {
      temp[colName] += row['fetal'];
    }

    dataSource.forEach((e: any) => {
      if (compareColName !== null) {
        if (colName === 'labexamName') {
          if (e[colName] + e['fetal'] === temp[colName] && e[compareColName] === row[compareColName]) {
            n += 1;
          }
        } else {
          if (e[colName] === temp[colName] && e[compareColName] === row[compareColName]) {
            n += 1;
          }
        }
      } else {
        if (colName === 'labexamName') {
          if (e[colName] + e['fetal'] === temp[colName]) {
            n += 1;
          }
        } else {
          if (e[colName] === temp[colName]) {
            n += 1;
          }
        }
      }
    });
  }
  return n;
};
interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
  result: string;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input value={record.result || ''} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
interface IProps {
  activeItem: string;
}
interface IState {
  dataSource: any[];
  editKey: string;
}
export default class SurgicalInspectionReport extends Component<IProps, IState> {
  state = {
    dataSource: [],
    editKey: '',
  };

  componentDidMount() {
    this.getPdOperationsInspectionResults();
  }
  async getPdOperationsInspectionResults() {
    const { activeItem } = this.props;
    if (get(activeItem, 'id') > 1) {
      const result = await getResourcesByID('/api/pd-operations-inspection-results', get(activeItem, 'id'));
      // await getResourcesByID('/api/pd-operations-inspection-results', get(activeItem, 'id'));
      // const result = mockData;
      const dataSource = this.translateDataSource(result);
      this.setState({
        dataSource,
      });
    }
  }

  columns = [
    {
      dataIndex: 'fetal',
      title: '胎儿',
      render: (value: any, row: any, index: number) => {
        const { dataSource } = this.state as any;
        const obj: any = {
          children: value,
          props: {},
        };
        if ((index > 0 && row.fetal !== dataSource[index - 1].fetal) || index === 0) {
          obj.props.rowSpan = getMergeRowNum('fetal', row, dataSource);
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      dataIndex: 'fetalLocation',
      title: '胎儿位置',
      render: (value: any, row: any, index: number) => {
        const { dataSource } = this.state as any;
        const obj: any = {
          children: value,
          props: {},
        };
        if ((index > 0 && row.fetalLocation !== dataSource[index - 1].fetalLocation) || index === 0) {
          obj.props.rowSpan = getMergeRowNum('fetalLocation', row, dataSource);
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      dataIndex: 'samplesName',
      title: '送检标本',
      render: (value: any, row: any, index: number) => {
        const { dataSource } = this.state as any;
        const obj: any = {
          children: value,
          props: {},
        };
        if ((index > 0 && row.samplesName !== dataSource[index - 1].samplesName) || index === 0) {
          obj.props.rowSpan = getMergeRowNum('samplesName', row, dataSource);
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      dataIndex: 'labexamName',
      title: '送检项目',
      render: (value: any, row: any, index: number) => {
        const { dataSource } = this.state as any;
        const obj: any = {
          children: value,
          props: {},
        };
        if ((index > 0 && row.labexamName !== dataSource[index - 1].labexamName) || index === 0) {
          obj.props.rowSpan = getMergeRowNum('labexamName', row, dataSource);
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      dataIndex: 'itemName',
      title: '具体项目',
    },
    {
      dataIndex: 'result',
      title: '检查结果',
      width: '20%',
      editable: true,
    },
    // {
    //   title: '操作',
    //   width: '10%',
    //   render: (_: any, record: any) => {
    //     const editable = this.isEditing(record);
    //     const { editKey } = this.state;
    //     return editable ? (
    //       <span>
    //         <a href="javascript:;" onClick={() => this.handleSave(record)} style={{ marginRight: 8 }}>
    //           保存
    //         </a>
    //         <Popconfirm title="是否取消?" onConfirm={this.handleCancel}>
    //           <a>取消</a>
    //         </Popconfirm>
    //       </span>
    //     ) : (
    //       // 如果有检查结果 则不允许编辑
    //       <Typography.Link disabled={editKey !== '' || record.result !== ''} onClick={() => this.handleEdit(record)}>
    //         编辑
    //       </Typography.Link>
    //     );
    //   },
    // },
  ];
  form: FormInstance | null = null;

  translateDataSource = (result: any) => {
    const dataSource: any = [];
    map(result, (item, index) => {
      const {
        LabExamResult,
        fetal,
        fetalLocation,
        samplesName,
        operationName,
        operationDate,
        outpatientNO,
        sendTheProjectName,
      } = item;

      sendTheProjectName.map((labexamName: string) => {
        dataSource.push({
          fetal,
          fetalLocation,
          samplesName,
          operationName,
          operationDate,
          outpatientNO,
          sendTheProjectName,
          labexamName,
          LabExamResult: [],
        });
      });
      dataSource.map((data: any) => {
        map(LabExamResult, (labExamItems) => {
          map(labExamItems, (labExamItemDetail) => {
            const {
              criticalHigh,
              criticalLow,
              index,
              itemNO,
              itemName,
              labexam,
              limit,
              normalHigh,
              normalLow,
              result,
              state,
              unit,
            } = labExamItemDetail;
            if (labexam.suitName === data.labexamName) {
              data.LabExamResult.push({
                fetal,
                fetalLocation,
                samplesName,
                operationName,
                operationDate,
                outpatientNO,
                sendTheProjectName,
                criticalHigh,
                criticalLow,
                index,
                itemNO,
                itemName,
                labexam,
                labexamName: get(labexam, 'suitName'),
                limit,
                normalHigh,
                normalLow,
                result,
                state,
                unit,
              });
            }
          });
        });
      });
    });
    let finalDataSource = [] as any;
    dataSource.map((data: any) => {
      const {
        fetal,
        fetalLocation,
        samplesName,
        operationName,
        operationDate,
        outpatientNO,
        labexamName,
        LabExamResult,
      } = data;
      if (LabExamResult.length === 0) {
        finalDataSource.push({
          fetal,
          fetalLocation,
          samplesName,
          operationName,
          operationDate,
          outpatientNO,
          labexamName,
          itemName: '',
          result: '',
        });
      } else {
        LabExamResult.map((res: any) => {
          finalDataSource.push({
            fetal,
            fetalLocation,
            samplesName,
            operationName,
            operationDate,
            outpatientNO,
            labexamName,
            itemName: res.itemName,
            result: res.result,
          });
        });
      }
    });
    return finalDataSource;
  };

  handlePrint = () => {
    const { printUrl, printResource, printTemplate, } = this.props
    mchcModal.open('print_modal', {
      modal_data: {
        requestData: {
          url: printUrl,
          resource: printResource,
          template: printTemplate,
          version: '',
          note: '',
          id: printId,
        }
      }
    })

  };

  isEditing = (record: any) => {
    const { editKey } = this.state;
    return record.fetal + record.labexamName + record.itemName === editKey;
  };
  handleEdit = (record: any) => {
    const form = this.form as FormInstance;
    form.setFieldsValue({ result: '', ...record });
    this.setState({
      editKey: record.fetal + record.labexamName + record.itemName,
    });
  };
  handleSave = async (record: any) => {
    const form = this.form as FormInstance;
    const inspectionResults: string = form.getFieldValue('result');
    const data = {
      reportDate: record.operationDate,
      suitName: record.labexamName,
      outpatientNO: record.outpatientNO,
      diagnosis: record.samplesName,
      labExamResults: [] as Array<any>,
    };
    if (record.itemName) {
      data.labExamResults.push({
        itemName: record.itemName,
        result: inspectionResults,
      });
    } else {
      data.labExamResults.push({
        result: inspectionResults,
      });
    }
    await Request.post(SaveLabExamsUrl, data);
    this.getPdOperationsInspectionResults();
    this.setState({ editKey: '' });
  };
  handleCancel = () => {
    this.setState({ editKey: '' });
  };

  render() {
    const { dataSource, } = this.state;
    const { activeItem } = this.props;
    const mergedColumns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: Item) => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <Form
        ref={(formRef) => {
          this.form = formRef;
        }}
      >
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          size="middle"
          bordered
          columns={mergedColumns}
          dataSource={dataSource}
        />

        <Button style={{ float: 'right' }} onClick={this.handlePrint}>
          打印
        </Button>
      </Form>
    );
  }
}
