import { IGlobalModalProps } from '@lm_fe/components';
import { IMchc_Doctor_PreRiskAssessmentInfo, IMchc_Doctor_VteAssessForm, SMchc_Doctor, TIdTypeCompatible } from '@lm_fe/service';
import { Button, Col, Form, message, Modal, Radio, Row, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { MyCheckbox, Title } from './components';
import { displayBlock, multipleOptions, singleOptions } from './config';
import { getDefaultResultBaseOnInfo } from './utils'
import React from 'react';
import { CheckboxWithValue } from '@lm_fe/components_m';
interface IProos {
  pregnancyId: TIdTypeCompatible


}
const text = '《2015RCOG降低妊娠及产褥期静脉血栓栓塞的风险》附录3,Obstetric thromboprophylaxis risk assessment and management'
export function getDiffYears(date: string, preDate: string) {
  return dayjs(date).diff(dayjs(preDate), 'years', true);
}
const title = '深静脉血栓高危因素孕期用药筛查表'
type TItem = Partial<IMchc_Doctor_VteAssessForm<"广三">>
export function ThrombusGysy(props: IGlobalModalProps<IProos>) {

  const { modal_data, close, ...others } = props;
  const { pregnancyId, } = modal_data;
  const [form] = Form.useForm()

  const [score, setScore] = useState(0)
  const [info, setInfo] = useState<IMchc_Doctor_PreRiskAssessmentInfo>()

  const printTableRef = useRef<HTMLDivElement>(null)


  function countAndSetScore(data: TItem) {
    console.log('countAndSetScore', data)
    const keys = multipleOptions
      .map(_ => _.data)
      .reduce((a, b) => [...a, ...b], [])
      .map(_ => _.key)
    const n = keys.reduce((a, k) => {
      const v = data[k] ?? 0
      return a + v
    }, 0)
    setScore(n)
    return n

  }

  useEffect(() => {
    init()
  }, [])


  async function init() {
    const data = await SMchc_Doctor.getVteAssessForm<'mchc'>(pregnancyId)

    const info = await SMchc_Doctor.getPreRiskAssessmentInfo(pregnancyId)

    const isFirstTime = countAndSetScore(data) === 0

    if (isFirstTime) {
      const defaultResult = getDefaultResultBaseOnInfo(info)
      console.log('defaultResult', defaultResult)
      Object.assign(data, defaultResult)
    }
    setInfo(info)
    form.setFieldsValue(data)
    countAndSetScore(data)
  }





  function handleCancel() {
    close?.(false);
  };

  async function handleOk() {
    const values = form.getFieldsValue()
    console.log('gg', form.getFieldsValue())
    await SMchc_Doctor.updateVteAssessForm({ ...values, })
    message.success('操作成功！')
    close?.(true);
  };



  const footer = [
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p >{text}</p>
      <Space>
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleOk}>
          确定
        </Button>
        <ReactToPrint
          trigger={() => (
            <div>
              <Button type="primary">打印</Button>
            </div>
          )}
          /*为了获取更新数据后的页面*/
          onBeforeGetContent={async () => {
            setTimeout(() => { }, 100);
          }}
          content={() => printTableRef.current}
        />
      </Space>
    </div>,
  ];
  const el = (
    <Form size='small'
      onValuesChange={(a, values) => countAndSetScore(values)}
      form={form}
      style={{ padding: 6 }}
    >
      <Form.Item name="id" hidden >
        <input />
      </Form.Item>
      <Row gutter={12}>
        {/* 左边 */}
        <Col xs={12}>
          {
            multipleOptions
              .filter(_ => !_.hide)
              .map(o =>
                <div key={o.title}>

                  <Title title={o.title} extra={<span style={{ color: '#aaa' }}>评分</span>} />

                  {
                    o.data
                      .filter(_ => !_.hide)

                      .map((d, d_index) =>
                        <Form.Item key={d.label} name={`${d.key}`} >
                          <MyCheckbox checkedValue={d.value} uncheckedValue={null}> {d.label} </MyCheckbox>
                        </Form.Item>
                      )
                  }
                </div>
              )
          }
        </Col>
        {/* 右边 */}
        <Col xs={12}>
          {
            singleOptions.filter(_ => !_.hide).map(o =>
              <div key={o.title}>
                <Title title={o.title} />
                {
                  o.data.map((d, idx) => {
                    return <Form.Item key={d.label} name={`${o.key}`}>
                      <CheckboxWithValue checkedValue={d.value} uncheckedValue={null}> {d.label} </CheckboxWithValue>
                    </Form.Item>
                  })
                }
              </div>
            )
          }
          {
            displayBlock.filter(_ => !_.hide).map(_ => {
              return <div key={_.title}>

                <Title title={_.title} />
                {<_.C data={info} />}
              </div>

            })
          }
          <div style={{ float: 'right' }}>
            <span>总分：</span>
            <span style={{ fontSize: 36, color: score >= 3 ? 'red' : '#666', fontWeight: 'bold' }}>{score}</span>
          </div>
        </Col>
      </Row>
    </Form>
  )
  return (
    <Modal
      {...others}
      title={title}
      width={"80vw"}
      bodyStyle={{ height: '80vh', overflowY: 'scroll' }}
      onCancel={handleCancel}
      footer={footer}
      maskClosable={false}
    >
      {el}
      <div style={{ display: 'none' }}>
        <div style={{ marginTop: '12px' }} ref={printTableRef} >
          <h3 style={{ textAlign: 'center' }}>{title}</h3>
          {el}
        </div>
      </div>
    </Modal>
  );
}




