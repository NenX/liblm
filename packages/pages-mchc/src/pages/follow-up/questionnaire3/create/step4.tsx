import { LazyAntd, SimpleForm } from '@lm_fe/components';
import { IMchc_QuestionItem, IMchc_Questionnaire, IMchc_QuestionWrite, SMchc_Questionnaire } from '@lm_fe/service';
import { Button, Col, Form, Row, Space } from 'antd';
import React, { FC, useState } from 'react';
import { fakeData } from './fakeData';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface IQuestionParam {
  questionId?: number
  questionType?: number
  optionIndex?: string
}
interface IProps {
  onChangeStep(v: number): void

  data?: IMchc_Questionnaire

}
function download(content: string | Blob, filename: string = '问卷答题情况.xlsx') {
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  var blob = typeof content === 'string' ? new Blob([content]) : content;
  console.log(typeof content, blob)
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
};
const d = fakeData as unknown as IMchc_Questionnaire
interface ILPros { value?: IQuestionParam[], onChange?: (d: any) => void, questions: IMchc_QuestionItem[] }
const L: FC<ILPros> = function L(props) {
  const { value = [], onChange, questions, } = props
  return < div >
    <Button block onClick={e => onChange?.([...value, {}])}>新增</Button>
    {
      value?.map((_, idx) => {
        const target = questions.find(q => q.id === _.questionId)
        return <Row key={idx} style={{ marginTop: 6 }} gutter={8}>
          <Col span={6}>
            <Select value={_.questionId} options={questions?.map(q => ({ label: q.questionTitle, value: q.id, disabled: value.some(v => v.questionId === q.id) }))} onChange={id => {
              const selectTarget = questions.find(_ => _.id === id)
              value.splice(idx, 1, { ..._, questionId: id, questionType: selectTarget?.questionType, optionIndex: '' })
              onChange?.([...value])
            }} />
          </Col>
          <Col span={16}>
            <Select value={_.optionIndex?.split(',')?.filter(_ => !!_)} mode="multiple"
              options={target?.questionOptionList?.map(q => ({ label: q.optionTitle, value: q.optionIndex?.toString() }))} onChange={id => {
                value.splice(idx, 1, { ..._, optionIndex: id?.toString() })
                onChange?.([...value])
              }} />
          </Col>
          <Col span={2}>
            <Button block style={{ marginLeft: 0 }} danger onClick={e => {
              value.splice(idx, 1,)
              onChange?.([...value])
            }}>删除</Button>
          </Col>
        </Row>
      })
    }
  </div >
}
export default ({ onChangeStep, data = d }: IProps) => {
  const [form] = Form.useForm()
  const [list, setList] = useState<IMchc_QuestionWrite[]>([])
  function getReqData() {
    return { questionnaireId: data.id, ...form.getFieldsValue() }
  }
  return (
    <div >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', marginBottom: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 'bold' }}>{data.questionnaireTitle}</span>
        <Space>
          <Button type="primary" onClick={() => SMchc_Questionnaire.fk_downloadResult(getReqData()).then(download)} >导出</Button>
          <Button type="primary" onClick={() => onChangeStep(0)} >返回</Button>
        </Space>
      </div>
      <SimpleForm
        onValuesChange={v => console.log('xxd', v)}
        form={form}
        blocks={[
          {
            title: '搜索条件',
            rows: [
              {
                itemsInRow: [
                  { type: 'Input', outerOptions: { name: 'outpatientNo', label: '就诊卡号' }, },
                  { type: 'RangePicker', outerOptions: { name: 'fillDate', label: '提交日期' }, innerOptions: { placeholder: ['请选择', '请选择'] } },
                  { type: 'InputNumber', outerOptions: { name: 'beginTotalScore', label: '最小分数' }, innerOptions: {} },
                  { type: 'InputNumber', outerOptions: { name: 'endTotalScore', label: '最大分数' }, innerOptions: {} },
                ],
                layoutType: 6
              },
              {
                itemsInRow: [
                  { type: 'Custom', layoutType: 24, innerOptions: { CustomedComponent: L, questions: data.questionList }, outerOptions: { name: 'questionOptionList', label: '题目' } },
                ]
              },
              {
                itemsInRow: [
                  {
                    customNode: <Button type="primary" block style={{ marginLeft: 0 }} onClick={e => {
                      SMchc_Questionnaire
                        .fk_getResult(getReqData())
                        .then(setList)

                    }}>搜索</Button>,
                  },
                ],
                layoutType: 24,
              }
            ]
          }
        ]} />
      <Table sticky scroll={{ x: 1500 }} bordered dataSource={list} style={{ marginTop: 24 }} columns={[
        { dataIndex: 'outpatientNo', title: '就诊卡号', ellipsis: true, fixed: true, width: 160 },
        { title: '姓名', width: 160, render: (a, b) => b.name },
        { title: '年龄', width: 160, render: (a, b) => b.age },
        { title: '孕周', width: 160, render: (a, b) => b.expandField1 },
        { title: '预产期', width: 160, render: (a, b) => b.expandField2 },
        { title: '手机号', width: 160, render: (a, b) => b.telephone },
        { title: '居住地址', width: 160, render: (a, b) => b.residenceAddress },
        { title: '提交日期', width: 160, render: (a, b) => b.fillDate },
        ...(data.groupVOList?.map(g => {
          const questionList = data.questionList?.filter(q => g.questionIndexList?.includes(q.questionIndex))
          return {
            title: g.groupTitle,
            children: questionListMapColumn(questionList)
          }
        }) || []),
        { title: '总分', width: 160, render: (a, b) => b.totalScore },

      ]} />
    </div>
  );


};
function questionListMapColumn(list: IMchc_QuestionItem[] = []) {
  return list.map(q => ({
    title: q.questionTitle,
    align: 'center',
    width: 140,
    ellipsis: true,
    render(a, b: IMchc_QuestionWrite) {

      const target = b.writeDetailList.find(_ => _.questionId === q.id);
      const optionIdxArr = target?.optionIndex?.split(',')?.filter(_ => !!_) || [];
      const displayStr = q.questionOptionList?.filter(_ => optionIdxArr.includes(_.optionIndex?.toString()));

      return <div>{displayStr?.map(_ => _.optionTitle)?.join('、') || target?.questionResult}</div>;
    }
  })) || [];
}