import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { message } from 'antd';
import {
  formDescriptionsWithoutSectionApi,
  fromApi as defaultFromApi,
  toApi as defaultToApi,
} from '../utils/adapter';
import { getSearchParamsValue, request } from '@lm_fe/utils';
import observePatientData from '../utils/observePatientData';
import styles from './less/index.module.less';
import { SMchc_FormDescriptions } from '@lm_fe/service';
export interface IProps {
  routerQuery?: any;
  moduleName?: string;
  title?: string;
  baseUrl?: string;
  fromApi?: any;
  toApi?: any;
  Form?: any;
  printTemplate?: any;
  printResource?: any;
  history?: any;
  isHospitalRegistrationOnceSaved?: any
  changeTitleOfTabs?: any
  deliverFormToFather?: any
}
export default function BaseEditPanelFC(props: IProps) {
  const { toApi = defaultToApi, baseUrl = '', title } = props;
  const { Form, printTemplate = '', printResource = '', history, ...rest } = props;
  const { routerQuery, moduleName, fromApi = defaultFromApi } = props;

  const formRef = React.useRef(null);
  const [data, setData] = useState<any>({})
  const [formDescriptions, setFormDescriptions] = useState<any[]>([])
  const [formDescriptionsWithoutSection, setFormDescriptionsWithoutSection] = useState<any>({})
  const [spinning, setSpinning] = useState(false)
  const [formKey, setFormKey] = useState<any>();


  useEffect(() => {
    const prevData = data;

    (async () => {

      // 订阅从 panel 获取的数据
      observePatientData.subscribe((data: any) => {
        setData({

          ...prevData,
          ...data,

        });
      });
      // 优先从 props 里面获取id，因为可能作为组件，被其它页面引用使用
      const id = get(props, 'id') || getSearchParamsValue('id');
      // 未配置moduleName时，不请求配置
      if (!moduleName) {
        return;
      }
      // 请求表单配置表
      const newFormDescriptions = await SMchc_FormDescriptions.getModuleParseCache(moduleName);
      // const formDescriptions = formDescriptionsFromApi(formField);
      const newFormDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(newFormDescriptions);
      setFormDescriptions(newFormDescriptions)
      setFormDescriptionsWithoutSection(newFormDescriptionsWithoutSection)
      // 请求表单值
      const values = id ? await request.get(`${baseUrl}/${id}`) : {};
      const newData = id ? fromApi(values, newFormDescriptionsWithoutSection) : {};
      const newFormKey = get(newData, 'id') || Math.random(); // 当前dataSource id

      setData(newData)
      setFormKey(newFormKey)


    })()
    return () => {
      observePatientData.unSubscribe();

    }
  }, []);




  async function handleSubmit(values: any) {

    const params = await toApi(
      {
        ...data,
        ...values,
      },
      formDescriptionsWithoutSection,
    );
    let newData = null;
    if (get(values, 'id')) {
      newData = await request.put(baseUrl, params);
      message.success(`修改${title}成功`);
    } else {
      newData = await request.post(baseUrl, params);
      message.success(`新增${title}成功`);
    }
    setData(newData)
  };

  function renderOtherModal() { };

  const extraEvents = {
    /** 额外的事件 */
  };

  return (
    <div className={styles["base-edit-panel"]}>
      <Form
        {...rest}
        key={formKey}
        ref={(ref: any) => (formRef.current = ref)}
        spinning={spinning}
        printId={get(data, 'id')}
        printResource={printResource}
        printTemplate={printTemplate}
        data={data}
        onFinish={handleSubmit}
        formDescriptions={formDescriptions}
        formDescriptionsWithoutSection={formDescriptionsWithoutSection}
        extraEvents={extraEvents}
        history={history}
        isHospitalRegistrationOnceSaved={props.isHospitalRegistrationOnceSaved}
        changeTitleOfTabs={props.changeTitleOfTabs}
        deliverFormToFather={props.deliverFormToFather}
      />
      {renderOtherModal()}
    </div>
  );
}
