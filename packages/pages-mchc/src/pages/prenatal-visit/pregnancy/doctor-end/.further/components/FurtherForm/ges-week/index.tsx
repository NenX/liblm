import { Modal } from 'antd';
import { get } from 'lodash';
import React, { useState } from 'react';
import { FormConfig, MyForm } from '@lm_fe/components_m';
import { IMchc_Doctor_OutpatientHeaderInfo, IMchc_Pregnancy, TIdTypeCompatible } from '@lm_fe/service';
import { api } from '../../../../.api';
import './index.less';
const config: Array<FormConfig> = [
  { name: 'sureEdd', key: '.sureEdd', label: '预产期-B超', input_type: 'date', span: 16 },
];
interface IProps {
  updateHeaderInfo(id: TIdTypeCompatible): void
  closeModal(t: 'isShowGesWeek', b?: string, c?: string): void
  getVisitDate(): void
  Treatmentmeasures(a: string, b: string): void
  isShowGesWeek: boolean
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
}
function GesWeek({ closeModal, updateHeaderInfo, getVisitDate, Treatmentmeasures, headerInfo, isShowGesWeek }: IProps) {
  const [formHandler, setFormHandler] = useState({} as any)

  async function handleOk() {
    const { res } = await formHandler.submit();
    const sureEdd = res.sureEdd.value;
    const visitDate = getVisitDate();
    const pregnancyId = headerInfo?.id;

    const params = { sureEdd, date: visitDate, id: pregnancyId };
    const { gestationalWeek } = await api.calcGesWeek(params);
    updateHeaderInfo(pregnancyId);

    closeModal('isShowGesWeek', gestationalWeek, 'gestationalWeek');
    Treatmentmeasures('预产期B超修订为' + res.sureEdd.value, 'prescription');
  };

  function handleCancel() {
    closeModal('isShowGesWeek');
  };

  const value = { sureEdd: headerInfo.edd };

  return (
    <Modal
      className="ges-week-modal label-width5"
      title={null}
      visible={isShowGesWeek}
      maskClosable={false}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <MyForm
        config={config}
        value={value}
        getFormHandler={setFormHandler}
        submitChange={false}
      />
    </Modal>
  );
}
export default GesWeek
