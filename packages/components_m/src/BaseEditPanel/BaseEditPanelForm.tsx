import {
  PrinterOutlined,
  RedoOutlined,
  SaveOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { mchcEvent, mchcLogger } from '@lm_fe/env';
import { Button, Form, Modal, Space, message } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { FormInstance } from 'antd/lib/form';
import classnames from 'classnames';
import { debounce, get, isFunction, map } from 'lodash';
import React from 'react';
import DynamicForm from '../BaseModalForm/DynamicForm';
import { mchcModal } from '../modals';
import styles from './less/base-edit-panel-form.module.less';
import { MyFormSection } from 'src/FU_components/FormSection';
import { LazyAntd } from '@lm_fe/components';


export const formItemLayout = {
  // layout: 'horizontal',
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
interface IProps {
  data: any;
  targetLabelCol?: number
  formDescriptionsWithoutSection: any;
  formDescriptions: any;
  onFinish: (data: any) => void;
  loading?: boolean;
  // 是否展示导入按钮
  showImport?: boolean;
  //  导入弹出框的内容
  List?: any;
  size?: SizeType
  deliverFormToFather?: any
  showReset?: boolean
  extraData?: any
  disabledSubmit?: boolean
}
interface IState { }
export default class BaseEditPanelForm extends DynamicForm<IProps, IState> {
  form: FormInstance | null = null;
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      importModalVisible: false,
    };
  }

  renderEditItem?: ((key: string, ReactNode: React.ReactNode, others?: object) => React.ReactNode);

  componentDidMount() {
    const { data, formDescriptionsWithoutSection } = this.props;
    this.form = this.formRef.current;
    this.form && this.form.setFieldsValue(data);
    this.renderEditItem = this.generateRenderEditItem(formDescriptionsWithoutSection, {
      formItemLayout,
    });
    // 强制渲染获取 form
    this.forceUpdate();
  }

  // 可能需要从外部更新获取数据;
  componentWillReceiveProps(nextProps: any) {
    const { formDescriptionsWithoutSection, data } = nextProps;
    const formData = {};
    if (data != this.props.data) {
      this.form &&
        this.form.setFieldsValue({
          ...data,
        });
    }


  }

  handleReset = () => {
    const isOk = confirm('确定重置吗？')
    if (!isOk) return
    const form = this.form as unknown as FormInstance;
    form.resetFields();
  };

  handleFinish = async () => {
    const form = this.form as unknown as FormInstance;
    const { onFinish, data } = this.props;
    form &&
      form
        .validateFields()
        .then(() => {
          const params = {
            ...form.getFieldsValue(),
            id: get(data, 'id'),
          };
          onFinish && onFinish(params);
        })
        .catch((error) => {
          console.log('error', error)
          message.error(get(error, 'errorFields.0.errors.0'));
          form.scrollToField(get(error, 'errorFields.0.name.0'));
        });
  };

  handleFill = () => ({});
  handleOk = () =>
    this.setState({
      importModalVisible: false,
    });
  handleCancel = () => {
    const form = this.form as unknown as FormInstance;
    form.setFieldsValue({
      checkupNO: '',
      outpatientNO: '',
      'mother.name': '',
    });
    this.setState({
      importModalVisible: false,
    });
  };

  getEvents = () => ({});

  getRegistrationEvents = () => ({});

  handleItemChange = (changedValues, allValues) => ({});

  handleFieldsChange = (changedFields, allFields) => ({});

  handleItemBlur = () => ({});

  renderSection = (section: any) => {
    const { data, targetLabelCol } = this.props;
    return (
      <>
        {/* <Divider key={`${get(section, 'flag')}-divider`} orientation="left">
          {get(section, 'name')}
        </Divider> */}
        <span className={styles["base-edit-panel-form_section_title"]} key={`${get(section, 'flag')}-divider`}>
          {get(section, 'name') ?? get(section, 'label')}
        </span>
        {this.form && (
          <MyFormSection
            targetLabelCol={targetLabelCol}
            key={`${get(section, 'flag')}-section`}
            data={data}
            size={this.props.size}
            extraData={this.props.extraData}
            formDescriptions={get(section, 'fields') ?? get(section, 'children')}
            // renderEditItem={this.renderEditItem}
            form={this.form}
            events={isFunction(this.getEvents) && this.getEvents()}
            registrationEvents={isFunction(this.getRegistrationEvents) && this.getRegistrationEvents()}
          />
        )}
      </>
    );
  };

  renderEditContent = () => {
    const { targetLabelCol, data, formDescriptions } = this.props;
    // return map(formDescriptions, (section, index) => {
    //   return (
    //     <div className={classnames(styles['base-edit-panel-form_section'], { [styles['border']]: !!(section.name ?? section.label) })} key={index}>
    //       {this.renderSection(section)}
    //     </div>
    //   );
    // });

    return <MyFormSection
      targetLabelCol={targetLabelCol}

      data={data}
      size={this.props.size}
      extraData={this.props.extraData}
      formDescriptions={formDescriptions}
      // renderEditItem={this.renderEditItem}
      form={this.form}
      events={isFunction(this.getEvents) && this.getEvents()}
      registrationEvents={isFunction(this.getRegistrationEvents) && this.getRegistrationEvents()}
    />
  };

  renderResetBtn = () => {
    return (
      <Button hidden={!this.props.showReset} size="large" htmlType="reset" icon={<RedoOutlined />} onClick={this.handleReset}>
        重置
      </Button>
    );
  };

  renderSubmitBtn = () => {
    return (
      <Button
        size="large"
        type="primary"
        icon={<SaveOutlined />}
        htmlType="submit"
        disabled={this.props.disabledSubmit}
        onClick={debounce(this.handleFinish)}
      >
        保存
      </Button>
    );
  };

  renderPrintBtn = () => {
    const { printUrl = '/api/pdf-preview', printResource, printTemplate, printId } = this.props;


    return true ? null : (
      <Button
        type="primary"
        size="large"
        icon={<PrinterOutlined />}
        disabled={!printId}
        onClick={() => {

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
        }}
      >
        打印
      </Button>
    );
  };

  renderBtns = () => {
    return (
      <Space size="middle">
        {this.renderResetBtn()}
        {this.renderPrintBtn()}
        {this.renderSubmitBtn()}
      </Space>
    );
  };

  renderBtnTip = () => { };

  renderFreeButton = () => {
    return <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 99, width: '100%' }}></div>;
  };



  // 导入按钮
  renderImportBtn = () => {
    return (
      <Button
        type="primary"
        htmlType="button"
        icon={<SolutionOutlined />}
        onClick={() => {
          this.setState({
            importModalVisible: true,
          });
        }}
      >
        导入信息
      </Button>
    );
  };

  // 导入信息弹框
  renderImportModal = () => {
    const { importModalVisible } = this.state;
    const { List } = this.props;
    return (
      <Modal
        title="导入信息"
        width="680"
        visible={importModalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <List clickImport={this.handleFill}></List>
      </Modal>
    );
  };

  renderModal = () => {
    return <></>;
  };

  render() {
    return (
      <Form
        size={this.props.size}
        autoComplete="off"
        ref={this.formRef}
        onBlur={this.handleItemBlur}
        onValuesChange={(changedValues, values) => {
          this.handleItemChange(changedValues, values)
          mchcEvent.emit('my_form', {
            type: 'onChange',
            name: Object.keys(changedValues)[0],
            value: Object.values(changedValues)[0],
            values,
            setValue: (name, value) => {
              this.formRef.current?.setFieldsValue({ [name]: value })
            },
          })
        }}
        onFieldsChange={this.handleFieldsChange}
        {...formItemLayout}
      >
        {this.props.showImport ? (
          <div>
            {this.renderImportBtn()}
            {this.renderImportModal()}
          </div>
        ) : (
          ''
        )}
        {this.renderEditContent()}
        <div className={styles["right-bottom-btns"]}>
          <Space size="middle">
            {this.renderFreeButton()}
            {this.renderBtns()}
          </Space>

          {this.renderBtnTip()}
        </div>
        {this.renderModal()}
      </Form>
    );
  }
}
