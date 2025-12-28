import BaseEditPanelForm from '../../../BaseEditPanel/BaseEditPanelForm';
import { event } from '@lm_fe/utils';
export const formItemLayout = {
  // layout: 'horizontal',
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
export default class AdmissionForm extends BaseEditPanelForm {
  componentDidMount() {
    const { data, formDescriptionsWithoutSection } = this.props;
    this.form = this.formRef.current;
    this.form && this.form.setFieldsValue(data);
    this.renderEditItem = this.generateRenderEditItem(formDescriptionsWithoutSection, {
      formItemLayout,
    });
    // 强制渲染获取 form
    this.forceUpdate();
    event.emit('formRef', { form: this.form, formDescriptionsWithoutSection });
  }
  renderBtns = () => {
    return <div></div>;
  };
}
