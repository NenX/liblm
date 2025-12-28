import { Col, Form, Modal, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { IGlobalModalProps } from '@lm_fe/components';
import { IMchc_Doctor_OutpatientHeaderInfo, IMchc_FormDescriptions_Field, IMchc_HBvManage, SMchc_HBvManage, } from '@lm_fe/service';
import { getSearchParamsValue } from '@lm_fe/utils';
import styles from './index.module.less';
import { MyFormSectionForm } from 'src/FU_components/FormSection/FormSectionForm';
interface IProos {
  headerInfo?: IMchc_Doctor_OutpatientHeaderInfo

}
type IData = Partial<IMchc_HBvManage>
export default function SyphilisManagement(props: IGlobalModalProps<IProos>) {

  const { modal_data, close, ...others } = props;
  const { headerInfo } = modal_data
  const [syphilisData, setSyphilisData] = useState<IData>({})
  const datacache = useRef<IData>({})
  const [text, setText] = useState('')
  const id = headerInfo?.id ?? getSearchParamsValue('id')
  const [form] = Form.useForm<IData>()

  useEffect(() => {
    (async () => {
      let syphilisList = await SMchc_HBvManage.getList({ params: { 'pregnancyId.equals': id } });



      // getSyphilisManagers(pregnancyId: TIdTypeCompatible) { return request.get(`/api/syphilis-managers?pregnancyId.equals=${pregnancyId}`) }

      const syphilisData: IData = syphilisList[0] || { pregnancy: { id } };

      handleSuggest(syphilisData)
      datacache.current = syphilisData


      setSyphilisData(syphilisData)
    })()

    return () => {

    }
  }, [])




  function handleCancel() {
    close?.(false);
  };

  async function handleOk() {
    const formData = form.getFieldsValue()
    const submit = { ...datacache.current, ...formData }

    if (submit.id) {
      await SMchc_HBvManage.put(submit);
    } else {
      await SMchc_HBvManage.post(submit);
    }



    close?.(true);
  };

  function config() {

    const config: Partial<IMchc_FormDescriptions_Field>[] = [

      { name: 'hbsag', key: 'hbsag', label: 'HBsAg', inputType: 'MyAutoComplete', span: 24, inputProps: { optionKey: '阴阳3s' } },
      { name: 'hbsab', key: 'hbsab', label: 'HBsAb', inputType: 'MyAutoComplete', span: 24, inputProps: { optionKey: '阴阳3s' } },
      { name: 'hbeag', key: 'hbeag', label: 'HBeAg', inputType: 'MyAutoComplete', span: 24, inputProps: { optionKey: '阴阳3s' } },
      { name: 'hbeab', key: 'hbeab', label: 'HBeAb', inputType: 'MyAutoComplete', span: 24, inputProps: { optionKey: '阴阳3s' } },
      { name: 'hbcab', key: 'hbcab', label: 'HBcAb', inputType: 'MyAutoComplete', span: 24, inputProps: { optionKey: '阴阳3s' } },
      { name: 'hbvDna', key: 'hbvDna', label: 'HBV DNA', inputType: 'MyAutoComplete', span: 24, unit: 'IU/ml', inputProps: { options: ['_ * 10 ^ _'] } },

      {
        name: 'useDrug',
        key: 'useDrug',
        label: '是否用药',
        inputType: 'MyCheckbox',
        inputProps: {

          optionKey: '否是s',
        },
        span: 24,
      },
      {
        name: 'drugContent',
        key: 'drugContent',
        label: '药物',
        inputType: 'MyCheckbox',
        inputProps: {
          options: [
            { "value": '替诺福伟', "label": "替诺福伟", },
            { "value": '提比夫定', "label": "提比夫定", },
            { "value": '拉米夫定', "label": "拉米夫定", },
            { value: '其他', label: '其他', inputType: 'MyInput' }
          ],
        },
        span: 24,
      },
      { name: 'useDrugWeek', key: 'useDrugWeek', label: '用药起始孕周', inputType: 'input', span: 24 },


    ];

    return config;
  };

  function handleSuggest(b: IData) {
    let hbvDna = b.hbvDna ?? ''
    let hbeag = b.hbeag! as string

    hbvDna = hbvDna.replace(/\s/g, '').replace('*10^', 'e')
    console.log('hbvDna', hbvDna)
    const n = +hbvDna
    if (hbvDna && !isNaN(n)) {
      if (n > 2e5 && n <= 2e9) {
        setText("HBV DNA > 2*10^5 IU/m，建议与感染孕产妇充分海通，在知情同意的基础上，于孕 28 周开始抗病毒治疗")
      } else if (n > 2e9) {
        setText("HBV DNA > 2*10^9 IU/ml，可于孕24周开始抗病害")
      }
    }
    else if (hbeag?.includes('阳')) {
      setText("HBeAa阳性，建议与感头孕产妇充分沟通，在知情同意的基础上，于孕 28 周开始抗病毒治疗")
    } else {
      setText('')
    }
  }
  return (
    <Modal
      {...others}
      title="乙肝专案管理"
      className={styles["syphilis-modal"]}
      width={1000}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Row>
        <Col span={14}>
          <MyFormSectionForm<IData>
            onValuesChange={(a, b) => {

              handleSuggest(b)
            }}
            form={form}
            formDescriptions={config()}
            data={syphilisData}
          />
        </Col>
        <Col span={10}>
          <div>
            <div>建议：</div>
            <div style={{ marginTop: 64, fontSize: 18, fontWeight: 'bold' }}> {text ?? '--'}</div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
}




