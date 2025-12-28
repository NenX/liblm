import { GestationalWeekProjectTree, MyForm, getFormData, getGesWeek, useFormTabs } from '@lm_fe/components_m';
import { mchcUtils } from '@lm_fe/env';
import { IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';
import { Button, Modal, Tabs, message } from 'antd';
import { cloneDeep, get, isEmpty, set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { api } from '../../../../.api';
import {
  getsurveyList,
  updateSurveyList,
} from '../../../../.initial/methods/request';
import './index.less';
import { DoctorEnd_检验检查_History } from '@lm_fe/pages';
interface IProps {
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  isAllPregnancies: boolean
  isShowListModal: boolean
  // closeModal: (t:  | 'isShowHisModal' | 'isShowManageModal') => void
  closeModal: () => void
  furtherRefresh(): void

}
function SurverList(props: IProps) {
  const { isShowListModal, isAllPregnancies, headerInfo, closeModal, furtherRefresh } = props;
  const [forms] = useFormTabs(3)
  const [cloneData, set_cloneData] = useState({})
  const [surveyFormConfig, set_surveyFormConfig] = useState([])
  const [ultrasoundConfig, set_ultrasoundConfig] = useState([])
  const [formHandler, set_formHandler] = useState({} as any)
  const [itemData, set_itemData] = useState([])
  const [activeKey, set_activeKey] = useState('1')
  const [formData, set_formData] = useState({
    '1': {},
    '2': {},
  })

  useEffect(() => {

    (async () => {
      const surveyConfig = await api.further.getSurveyFormConfig();
      const ultrasoundConfig = await api.further.getUltrasoundFormConfig();


      const b = get(ultrasoundConfig, 'fields')

      set_surveyFormConfig(get(surveyConfig, 'fields'))
      set_ultrasoundConfig(b)
      get_FormData();
    })()

    return () => {

    }
  }, [])





  async function get_FormData(tab = '1', needRequest = false) {
    if (!isEmpty(formData[tab]) && !needRequest) return false;
    const id = get(props, `headerInfo.id`);
    const res = await getsurveyList[tab](id);
    if (tab == '1') {
      set(res, `hbvdna`, get(res, `hbvdna`)?.replace(/&amp;lt;/, '<'));
    }

    set_formData({
      ...formData,
      [tab]: res,
    })
  }





  async function handleBtnClick() {
    forms[0].submit()
    if (activeKey == '1') {
      furtherRefresh && furtherRefresh();
    }
    if (activeKey === '2') {
      const { res, validCode } = await formHandler.submit();
      if (validCode) {
        const resData = getFormData(res);
        await updateSurveyList[activeKey]({ ...resData, id: get(props, `headerInfo.id`) });

        closeModal();
      } else {

        message.destroy();
        message.error('请完善表单项！');
      }


    } else {
      closeModal();
    }
  };

  function setFormHandler(data: any) {
    set_formHandler(data)
  };

  function handleTabChange(key) {
    if (key == 1 || key == 2) {
      get_FormData(key);
    }

    set_activeKey(key)
  }



  const buttons = [
    <div>
      <Button onClick={() => closeModal()}>取消</Button>
      <Button type="primary" onClick={() => handleBtnClick()}>
        确定
      </Button>
      {/* <Button onClick={() => handleBtnClick('print')} type="primary">
          打印
        </Button> */}
    </div>,
  ];

  return (
    <Modal
      className="survey-list"
      width="96vw"
      centered
      footer={isAllPregnancies ? null : buttons}
      title={null}
      bodyStyle={{ height: '90vh' }}
      visible={isShowListModal}
      onCancel={() => closeModal()}
    >
      <Tabs size='small' activeKey={activeKey} onChange={handleTabChange.bind(this)}>
        <Tabs.TabPane className="survey-form label-width6" tab="检验检查" key="1">

          <DoctorEnd_检验检查_History form={forms[0]} pregnancyId={headerInfo?.id} />
        </Tabs.TabPane>

        <Tabs.TabPane className="survey-form label-width6" tab="超声检查" key="2">
          <MyForm
            config={ultrasoundConfig}
            value={formData['2']}
            getFormHandler={(formHandler: any) => setFormHandler(formHandler)}
            submitChange={false}
          />
        </Tabs.TabPane>

        <Tabs.TabPane className="check-items-wrapper" tab="孕期必查项目" key="3">
          <GestationalWeekProjectTree pregnancyId={mchcUtils.getDoctorEndId()} />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}
export default SurverList
