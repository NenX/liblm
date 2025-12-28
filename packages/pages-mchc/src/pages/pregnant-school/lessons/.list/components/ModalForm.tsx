
import { DynamicForm, FormSection } from '@lm_fe/components_m';
import { request } from '@lm_fe/utils';
import { Button, Form, Modal, Space, Tooltip, message } from 'antd';
import { get, isFunction } from 'lodash';
import dayjs from 'dayjs';
import React from 'react';
import { fromApi, toApi } from '../config/adapter';
import { modalFormDescriptions as formDescriptions } from '../config/form';
import './modalForm.less';

export default class BaseModalForm extends DynamicForm<any, any> {
  static defaultProps = {
    formDescriptions: formDescriptions,
    fixedFormParams: {},
    modalProps: {
      width: 900,
      centered: false,
      className: 'archives-modal-container',
    },
    formItemLayout: {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    },
    url: '/api/courses',
    fromApi: fromApi,
    toApi: toApi,
  };
  constructor(props: any) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      id: undefined,
      data: {},
      btnDisable: true,
      isModal: false,
      VisModal: false,
    };
  }

  renderEditItem = this.generateRenderEditItem(formDescriptions, {
    formItemLayout: this.props.formItemLayout,
  });

  componentDidMount() {
    const { id, primaryKey, visible } = this.props;
    setTimeout(async () => {
      if (visible && id) {
        this.fetchDetails(primaryKey || id);
      }
    }, 200);
  }

  componentDidUpdate(prevProps) {
    const { id, primaryKey, visible } = this.props;
    setTimeout(async () => {
      if (visible !== prevProps.visible && id) {
        this.fetchDetails(primaryKey || id);
      }
    }, 200);
  }

  fetchDetails = async (id: string) => {
    this.form = this.formRef.current;
    let values = (await request.get(`${this.props.url}/${id}`)).data;
    if (isFunction(this.props.fromApi)) {
      values = this.props.fromApi(values);
    }
    this.form.setFieldsValue(values);
    this.setState({ data: values });
  };
  onValuesChange = (val) => {
    //  当原本开课时间小于当前日期，为true
    let changeVal1 =
      get(val, `datetime.date`) &&
      get(val, `datetime.time`) &&
      dayjs(get(val, `datetime.date`) + ' ' + get(val, `datetime.time`).split('-')[0]).isSame(
        get(this.state, `data.datetime.date`) + ' ' + get(this.state, `data.datetime.time`).split('-')[0],
      );
    let changeVal2 =
      get(val, `datetime.date+val.datetime`) &&
      dayjs(get(val, `datetime.date+val.datetime`).time.split('-')[1]).isSame(
        get(this.state, `data.datetime.date`) + get(this.state, `data.datetime.time`).split('-')[1],
      );
    let date =
      get(this.state, `data.datetime.date`) && get(this.state, `data.datetime.time`) &&
      dayjs(get(this.state, `data.datetime.date`) + get(this.state, `data.datetime.time`).split('-')[1]).isBefore(
        dayjs().format('YYYY-MM-DD HH:mm'),
      );
    if (val.datetime && date && (changeVal1 == false || changeVal2 == false)) {
      this.setState({
        isModal: true,
      });
    } else {
      this.setState({
        isModal: false,
      });
    }
  };
  handleClick() {
    const { data } = this.state;
    if (data.reserveNum > 0) {
      if (this.state.isModal) {
        this.setState({
          VisModal: true,
        });
      }
      if (this.state.isModal == false) {
        this.handleSubmit();
      }
    } else if (data.reserveNum == 0) {
      this.handleSubmit();
    }
  }
  handleOk = () => {
    this.setState({
      VisModal: false,
    });
    this.handleSubmit();
  };
  handleCancel = () => {
    this.setState({
      VisModal: false,
    });
  };
  async handleSubmit(type?: any) {
    const { data } = this.state;
    this.form = this.formRef.current;
    const { id, onCancel, onSearch, onSubmit, fixedFormParams, title } = this.props;
    let tip = '';
    let method = 'post';
    await this.form
      .validateFields()
      .then(async () => {
        const values = isFunction(this.props.toApi)
          ? this.props.toApi({ ...data, ...this.form.getFieldsValue(), id })
          : { ...data, ...this.form.getFieldsValue(), id };
        if (isFunction(onSubmit)) {
          onSubmit({
            ...values,
            ...fixedFormParams,
          });
          return;
        }
        if (id) {
          tip = `修改成功`;
          method = 'put';
        } else {
          tip = `添加成功`;
        }
        if (type == 'add') {
          method = 'post';
          tip = `添加成功`;
          delete values['id'];
        }
        if (get(values, 'datetime.date') == '' || get(values, 'datetime.time') == null) {
          message.error('开课日期是必填项');
          return
        }
        await request[method](`${this.props.url}`, {
          ...values,
          ...fixedFormParams,
        });
        message.success(tip);
        onCancel();
        onSearch();
      })
      .catch((error: any) => {
        const errors = get(error, 'errorFields.0.errors.0');
        message.error(errors);
      });
  }

  /**
   *
   * /api/pr/importDocumentByPregnancy
   */

  async handleImport() {
    this.setState({ btnDisable: true });
    this.form = this.formRef.current;
    const outpatientNO = this.form.getFieldValue('outpatientNO');
    let values = (await request.get(`/api/pr/importDocumentByPregnancy?outpatientNO=${outpatientNO}`)).data;
    this.form.setFieldsValue(values);
  }

  renderEditContent = () => {
    return <FormSection {...this.props} renderEditItem={this.renderEditItem} formDescriptions={formDescriptions!} />;
  };
  renderFooter() {
    const { data } = this.state;
    const { id } = this.props;
    if (!id) {
      return (
        <Space>
          {(get(data, `state`) != 2 || true) && (
            <Button type="primary" onClick={this.handleSubmit.bind(this)} disabled={get(data, `state`) == 2}>
              确定
            </Button>
          )}
          <Button
            onClick={() => {
              this.props.onCancel();
            }}
          >
            取消
          </Button>
        </Space>
      );
    } else {
      return (
        <Space>
          <Tooltip title="根据现有窗口信息创建新的课程" color={'#ccc'}>
            <Button type="primary" onClick={this.handleSubmit.bind(this, 'add')}>
              新开课程
            </Button>
          </Tooltip>

          <Button type="primary" onClick={this.handleClick.bind(this)}>
            确定
          </Button>
          {this.state.isModal && (
            <Modal title="确认修改" visible={this.state.VisModal} onOk={this.handleOk} onCancel={this.handleCancel}>
              <p>存在患者预约该课程，若修改了开课时间，将同步修改患者的预约时间, 是否确认修改</p>
            </Modal>
          )}
          <Button
            onClick={() => {
              this.props.onCancel();
            }}
          >
            取消
          </Button>
        </Space>
      );
    }
  }

  render() {
    const { visible, onCancel, id, modalProps, formItemLayout, title } = this.props;

    return (
      <Modal
        centered
        {...modalProps}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        title={id ? `修改${title}` : `添加${title}`}
        footer={this.renderFooter()}
        className="modal-form-container"
        width={1000}
      >
        <Form
          autoComplete="off"
          ref={this.formRef}
          initialValues={this.state.data}
          {...formItemLayout}
          onValuesChange={this.onValuesChange}
          className="course"
        >
          {this.renderEditContent()}
        </Form>
      </Modal>
    );
  }
}
