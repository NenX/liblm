import React, { lazy } from 'react';
import { Form, Modal, message } from 'antd';
import { isFunction } from 'lodash';
import DynamicForm from '../BaseModalForm/DynamicForm';
import { request } from '@lm_fe/utils';
// const FormSection = lazy(() => import('./FormSection'));
import { MyFormSection } from '../FU_components/FormSection'
export default ({
  formDescriptions,
  url,
  title,
  fromApi,
  toApi,
  modalProps = {
    width: 800,
  },
  fixedFormParams = {},
  formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  },
}: any) => {
  return class BaseModalForm extends DynamicForm {
    constructor(props) {
      super(props);
      this.formRef = React.createRef();
      this.state = {
        id: undefined,
        data: {},
      };
    }

    renderEditItem = this.generateRenderEditItem(formDescriptions, {
      formItemLayout,
    });

    // // 获取父组件传过来的值，这里还可以监听父组件传值变了，然后重新赋值给 state。
    // // props 表示父组件传过来的值， state 表示当前子组件的state。
    // static async getDerivedStateFromProps(nextProps, state) {
    //   // 父组件传过来的 type 和 子组件的 type 不一样，那么子组件重新赋值。
    //   // 也可以理解成，父组件传过来的值变了。
    //   const { id, primaryKey, visible } = nextProps;
    //   if (visible && id !== state.id) {
    //     // 这里执行相应的方法
    //     let data = await request.get(`${url}/${primaryKey || id}`);
    //     if (isFunction(fromApi)) {
    //       data = fromApi(data);
    //     }
    //     return {
    //       id,
    //       data,
    //     };
    //   }
    //   // 父组件的值没有变化，这里不做任何操作。
    //   return null;
    // }

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
      let values = (await request.get(`${url}/${id}`)).data;
      if (isFunction(fromApi)) {
        values = fromApi(values);
      }
      this.form.setFieldsValue(values);
      this.setState({ data: values });
    };

    handleSubmit = async () => {
      const { data } = this.state;
      this.form = this.formRef.current;
      const { id, onCancel, onSearch, onSubmit } = this.props;
      let tip = '';
      let method = '';

      await this.form.validateFields();
      const values = isFunction(toApi)
        ? toApi({ ...data, ...this.form.getFieldsValue(), id })
        : { ...data, ...this.form.getFieldsValue(), id };
      if (isFunction(onSubmit)) {
        onSubmit({
          ...values,
          ...fixedFormParams,
        });
        return;
      }
      if (id) {
        tip = `修改${title}成功`;
        method = 'put';
      } else {
        tip = `添加${title}成功`;
        method = 'post';
      }
      await request[method](`${url}`, {
        ...values,
        ...fixedFormParams,
      });
      message.success(tip);
      onCancel();
      onSearch();
    };

    renderEditContent = () => {
      console.log('this.props', { props: this.props })
      return <MyFormSection {...this.props} renderEditItem={this.renderEditItem} formDescriptions={formDescriptions} />;
    };

    render() {
      const { visible, onCancel, id } = this.props;
      return (
        <Modal
          centered
          {...modalProps}
          visible={visible}
          onCancel={onCancel}
          onOk={this.handleSubmit}
          title={id ? `修改${title}` : `添加${title}`}
        >
          <Form autoComplete="off" ref={this.formRef} initialValues={this.state.data} {...formItemLayout}>
            {this.renderEditContent()}
          </Form>
        </Modal>
      );
    }
  };
};
export { MyFormSection as FormSection, DynamicForm }
