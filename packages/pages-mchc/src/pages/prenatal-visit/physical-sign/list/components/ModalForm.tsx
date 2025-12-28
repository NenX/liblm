import React from 'react';
import { Form, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { get, set, isEqual, size, isUndefined } from 'lodash';
// import FormSection from '@/components/BaseModalForm/FormSection';
import { modalFormDescriptions as formDescriptions } from '../config/form';
import { getPregnancyByOutpatientNO, getPrenatalVisits, getMeasuresByDate } from '../methods';
import styles from '../index.module.less';
import { DynamicForm, FormSection, formatTimeToDate } from '@lm_fe/components_m';
import { request } from '@lm_fe/utils';

const url = '/api/measures';
const title = '体格检查';
const modalProps = { width: 1020 };
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

export default class BaseModalForm extends DynamicForm {
  type = 0;
  state = {
    data: undefined,
  };

  renderEditItem = this.generateRenderEditItem(formDescriptions, {
    formItemLayout,
  });

  componentDidMount() {
    const { id, primaryKey } = this.props;
    setTimeout(async () => {
      if (id) {
        const values = (await request.get(`${url}/${primaryKey || id}`)).data;
        this.form = this.formRef.current;
        this.form.setFieldsValue({
          ...values,
          bloodPressure: {
            systolic: get(values, 'physicalExamMeasure.systolic'),
            diastolic: get(values, 'physicalExamMeasure.diastolic'),
          },
          bloodPressure2: {
            systolic: get(values, 'physicalExamMeasure.systolic2'),
            diastolic: get(values, 'physicalExamMeasure.diastolic2'),
          },
          bloodPressure3: {
            systolic: get(values, 'physicalExamMeasure.systolic3'),
            diastolic: get(values, 'physicalExamMeasure.diastolic3'),
          },
        });
        this.setState({ data: values });
      } else {
        this.form = this.formRef.current;
        this.form.setFieldsValue({
          createDate: dayjs(),
        });
        this.setState({ data: {} });
      }
    }, 100);
  }

  handleFieldsChange = async (changedFields: any) => {
    if (
      size(changedFields) === 1 &&
      isEqual(get(changedFields, '0.name'), ['outpatientNO']) &&
      get(changedFields, '0.touched')
    ) {
      const outpatientNO = get(changedFields, '0.value');
      const pregnancy = await getPregnancyByOutpatientNO(outpatientNO);
      const dataSize = size(pregnancy);
      const tempData = {};
      if (dataSize > 0) {
        const pregnancyData = get(pregnancy, '0');
        const pregnancyId = get(pregnancyData, 'id');
        const prenatalVisits = await getPrenatalVisits(pregnancyId);
        if (size(prenatalVisits) > 0) this.type = 1;
        if (get(pregnancyData, 'periodState') === '2') this.type = 2;
        set(tempData, 'name', get(pregnancyData, 'name'));
        this.form?.setFieldsValue(tempData);
      } else {
        set(tempData, 'name', '');
        this.form?.setFieldsValue(tempData);
      }
    }
  };

  handleSubmit = async () => {
    const { data } = this.state;
    const { id, onCancel, onSearch } = this.props;
    let tip = '';
    let method = '';

    await this.form
      .validateFields()
      .then(async () => {
        const formData = this.form?.getFieldsValue();
        const gynecologicalExamMeasure = {
          ...get(data, 'gynecologicalExamMeasure'),
          ...get(formData, 'gynecologicalExamMeasure'),
        };
        const physicalExamMeasure = {
          ...get(data, 'physicalExamMeasure'),
          ...get(formData, 'physicalExamMeasure'),
          systolic: get(formData, 'bloodPressure.systolic'),
          diastolic: get(formData, 'bloodPressure.diastolic'),
          systolic2: get(formData, 'bloodPressure2.systolic'),
          diastolic2: get(formData, 'bloodPressure2.diastolic'),
          systolic3: get(formData, 'bloodPressure3.systolic'),
          diastolic3: get(formData, 'bloodPressure3.diastolic'),
        };
        const values = {
          ...data,
          ...formData,
          physicalExamMeasure,
          gynecologicalExamMeasure,
          createDate: formatTimeToDate(formData.createDate),
        };

        if (id) {
          tip = `修改${title}成功`;
          method = 'put';
        } else {
          set(values, 'type', this.type);
          tip = `添加${title}成功`;
          method = 'post';
        }

        if (!get(values, 'id')) {
          const measureData = await getMeasuresByDate(get(values, 'outpatientNO'), get(values, 'createDate'));
          if (size(measureData) > 0) {
            message.destroy();
            message.warning('此用户当天已记录体征数据，请搜索对应的记录编辑。');
            return;
          }
        }

        await request[method](`${url}`, values);
        message.success(tip);
        onCancel();
        onSearch();
      })
      .catch((error: any) => {
        const errors = get(error, 'errorFields.0.errors.0');
        message.error(errors);
      });
  };

  renderEditContent = () => {
    return <FormSection {...this.props} formDescriptions={formDescriptions as any} />;
  };

  render() {
    const { data } = this.state;
    const { visible, onCancel, id } = this.props;
    return (
      <Modal
        {...modalProps}
        centered
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        title={id ? `修改${title}` : `添加${title}`}
        className={styles['physical-sign-model']}
      >
        <Form
          onFieldsChange={this.handleFieldsChange}
          autoComplete="off"
          ref={this.formRef}
          {...formItemLayout}
          style={{ minHeight: 433 }}
        >
          {!isUndefined(data) && this.renderEditContent()}
        </Form>
      </Modal>
    );
  }
}
