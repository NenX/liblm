import { FormInstance } from 'antd/lib/form';
import { message } from 'antd';
import dayjs from 'dayjs';
import { get, isNil, set } from 'lodash';
import Table from './components/Table';
import { tableColumns } from './config/table';
import { formatDate, request, } from '@lm_fe/utils';
import { BaseListOld, } from '@lm_fe/components_m';
import { getFutureDate } from '@lm_fe/utils';

export default class List extends BaseListOld {
  staticDefaultQuery = {
    page: 0,
    size: 20,
    sort: 'createDate,DESC',
    'type.equals': 1,
  };

  static defaultProps = {
    baseUrl: '/api/measures',
    asChildComponentQueryLabel: 'outpatientNO.equals',
    baseTitle: '复诊记录',
    needPagination: true,
    needEditInTable: true,
    showQuery: false,
    showAdd: true,
    showAction: true,
    tableColumns,
    rowKey: 'id',
    Table,
    otherTableProps: {
      scroll: { x: 1278 },
    },
  };

  handleEdit = (rowData: any) => () => {
    const { dataSource, } = this.state;

    const form = this.form as FormInstance;
    form.setFieldsValue({
      ...rowData,
      bloodPressure: {
        systolic: get(rowData, 'physicalExamMeasure.systolic'),
        diastolic: get(rowData, 'physicalExamMeasure.diastolic'),
      },
      bloodPressure2: {
        systolic: get(rowData, 'physicalExamMeasure.systolic2'),
        diastolic: get(rowData, 'physicalExamMeasure.diastolic2'),
      },
      bloodPressure3: {
        systolic: get(rowData, 'physicalExamMeasure.systolic3'),
        diastolic: get(rowData, 'physicalExamMeasure.diastolic3'),
      },
      createDate: dayjs(get(rowData, 'createDate')),
    });
    this.setState({
      editKey: get(rowData, 'editKey') || get(rowData, 'id'),
      dataSource: dataSource.map(_ => ({ ..._ }))
    });
  };

  handleAdd = async () => {
    const { pregnancyData, user } = this.props;
    const { dataSource, editKey } = this.state;
    const toDayData: any = dataSource.find((_: any) => _.createDate === formatDate())
    if (toDayData) {
      message.warning('此用户当天已记录体征数据，请搜索对应的记录编辑。');
      return;
    }
    if (!isNil(editKey)) {
      message.error('请先保存上一条记录');
      return;
    }
    const mockKey = new Date().toString();
    const addData = {
      createDate: dayjs(getFutureDate(0)),
      // gestationalWeek: get(pregnancyData, 'gestationalWeek'),
      createUser: get(user, 'basicInfo.firstName'),
      editKey: mockKey,
    };
    const form = this.form as FormInstance;
    form.setFieldsValue(addData);

    await this.setState({
      dataSource: [addData, ...dataSource],
      editKey: mockKey,
    });
  };

  handleItemSave = (rowData: any) => async () => {
    const { baseUrl, pregnancyData } = this.props;
    await this.form?.validateFields();
    const formData = this.form?.getFieldsValue();
    const physicalExamMeasure = {
      ...get(rowData, 'physicalExamMeasure'),
      ...get(formData, 'physicalExamMeasure'),
      systolic: get(formData, 'bloodPressure.systolic'),
      diastolic: get(formData, 'bloodPressure.diastolic'),
      systolic2: get(formData, 'bloodPressure2.systolic'),
      diastolic2: get(formData, 'bloodPressure2.diastolic'),
      systolic3: get(formData, 'bloodPressure3.systolic'),
      diastolic3: get(formData, 'bloodPressure3.diastolic'),
    };
    const gynecologicalExamMeasure = {
      ...get(rowData, 'gynecologicalExamMeasure'),
      ...get(formData, 'gynecologicalExamMeasure'),
    };
    const data = {
      ...rowData,
      ...formData,
      createDate: formatDate(formData.createDate),
      physicalExamMeasure,
      gynecologicalExamMeasure,
    };

    if (get(data, 'id')) {
      await request.put(baseUrl, data);
    } else {
      set(data, 'outpatientNO', get(pregnancyData, 'outpatientNO'));
      set(data, 'name', get(pregnancyData, 'name'));
      set(data, 'type', 1);
      await request.post(baseUrl, data);
    }
    this.form?.resetFields();
    message.success('保存成功');
    await this.setState({
      editKey: undefined,
    });
    await this.handleSearch();
  };
}
