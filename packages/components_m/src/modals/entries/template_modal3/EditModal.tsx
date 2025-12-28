import { Form, Input, Modal } from 'antd';
import { get } from 'lodash';
import { useEffect, useRef } from 'react';
import TemplateSelect from './components/TemplateSelect';
import { ITemplateType } from './types';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export default function EditModal(props: any) {
  const { onCancel, onSubmit, visible, templateType, data, depid, getContainer, templateTypes, ...others } = props;
  const [form] = Form.useForm();
  const el = useRef<HTMLDivElement>(null)

  const types: ITemplateType[] = templateTypes
  useEffect(() => {
    form &&
      form.setFieldsValue({
        ...data,
        pid: get(data, 'pid') || 0,
        type: templateType,
      });
  }, []);

  const handleSubmit = async () => {
    await form.validateFields();
    const formData = form && form.getFieldsValue();
    onSubmit && onSubmit(formData);
  };

  return (
    <Modal

      getContainer={getContainer}
      visible={visible}
      className="textarea-with-template__modal-edit"
      onCancel={onCancel}
      onOk={handleSubmit}
      closable={false}
      width={500}

    >
      <div ref={el}>
        <Form autoComplete="off" form={form} labelAlign="right" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="所属模块" name="type">
            <Select getPopupContainer={() => el.current!}>
              {types.map(({ title, type }, key) => {
                return (
                  <Select.Option value={type} key={type}>
                    {title}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="上级模板" name="pid">
            <TemplateSelect getPopupContainer={() => el.current!} templateType={templateType} depid={depid} />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '模板内容是必填项' }]} label="模板内容" name="val">
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
