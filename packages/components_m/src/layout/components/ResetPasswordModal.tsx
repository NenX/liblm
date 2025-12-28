import React from 'react';
import { resetFormDescriptions as formDescriptions } from './reset-config';
import DynamicForm from '@/components/BaseModalForm/DynamicForm';
import { request } from '@lm_fe/utils';
import FormSection from '@/components/BaseModalForm/FormSection';
import { Modal, Form, message } from 'antd';
import { get } from 'lodash';
import storage from '@/utils/storage';
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};
interface IProps {
  primaryKey?: string;
  id?: string;
  visible?: boolean;
  onCancel: () => void;
}
export default class ResetPasswordModal extends DynamicForm<IProps> {
  state = {
    data: {},
  };

  renderEditItem = this.generateRenderEditItem(formDescriptions, {
    formItemLayout,
  });

  componentDidMount() {
    const { primaryKey } = this.props;
    setTimeout(async () => {
      this.form = this.formRef.current;
      const data = await request.get(`/api/users/${primaryKey}`);
      this.setState({ data });
    }, 100);
  }

  handleSubmit = async () => {
    const { data } = this.state;
    const { onCancel } = this.props;
    await this.form.validateFields();
    const { oldPassword, password } = this.form.getFieldsValue();
    try {
      await request.post('/api/authenticate', {
        username: get(data, 'login'),
        password: oldPassword,
      });
    } catch (error) {
      message.error('旧密码不正确，请重新输入');
      return;
    }
    await request.post('/api/account/reset-password', {
      login: get(data, 'login'),
      password,
    });
    onCancel();
    message.success('重置密码成功, 请重新登录', 1000);
    setTimeout(() => {
      storage.clearApp();
      window.location.href = `${process.env.PUBLIC_PATH}login`;
    }, 1000);
  };

  renderEditContent = () => {
    return <FormSection {...this.props} renderEditItem={this.renderEditItem} formDescriptions={formDescriptions} />;
  };

  render() {
    const { visible, onCancel } = this.props;
    return (
      <Modal width={400} visible={visible} onCancel={onCancel} onOk={this.handleSubmit} title="修改密码">
        <Form autoComplete="off" ref={this.formRef} {...formItemLayout}>
          {this.renderEditContent()}
        </Form>
      </Modal>
    );
  }
}
