// import Editor from '@/components/GeneralComponents/Editor';
import { IMchc_QuestionGroup, IMchc_QuestionItem, } from '@lm_fe/service';
import { Checkbox, Form } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { getTargetQuestionInGroup, QuestionTypeEnums } from './common';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface IProps {
  groupQuestions: IMchc_QuestionItem[]
  activeQuestion: IMchc_QuestionItem
  onQuesionChange(q: IMchc_QuestionItem): void
  activeGroup: IMchc_QuestionGroup
  index: number
}
export function Step2Right(props: IProps) {
  const { groupQuestions, activeQuestion, onQuesionChange, activeGroup, index } = props;




  const bind = activeQuestion.logic?.bind
  const realIndex = groupQuestions.findIndex(_ => _.questionIndex === activeQuestion.questionIndex)


  const selectQuestions = groupQuestions
    .filter((q, idx) =>
      // QuestionTypeEnums.getValues(['多选题', '单选题', '下拉题']).includes(q.questionType) &&
      idx < realIndex
    )
  const targetBind = groupQuestions.find(_ => _.questionIndex === bind)
  console.log('aax', bind, targetBind)
  // groupQuestions.find(_ => _.questionIndex === b)
  const boxOptions = targetBind?.questionOptionList || []


  function onChange(selectOption: any[], bind = activeQuestion.logic?.bind) {

    onQuesionChange({ ...activeQuestion, logic: { selectOption, bind } })
  }
  return (
    <>
      <div>
        <span>当前题目：</span>
        <span>{activeQuestion.questionTitle}</span>
      </div>
      <div>
        <Form.Item label="关联题目：">
          <Select
            style={{ width: 300 }}
            dropdownMatchSelectWidth={300}
            allowClear
            placeholder="请选择"
            value={activeQuestion.logic?.bind}
            onChange={(value) => {

              onChange([], value)

            }}
            // QuestionTypeEnums.getValues(['多选题', '单选题', '下拉题']).includes(q.questionType)
            options={
              selectQuestions
                .map((_, index) =>
                ({
                  label: `${index + 1}.${_.questionTitle}`,
                  value: _.questionIndex,
                  disabled: !QuestionTypeEnums.getValues(['多选题', '单选题', '下拉题']).includes(_.questionType)
                })
                )}
          >

          </Select>
        </Form.Item>
        {targetBind && (
          <>
            <div>当“关联题目”选择下面的选项：</div>
            <Checkbox.Group
              value={activeQuestion.logic?.selectOption || []}
              onChange={value => onChange(value)}
            >
              {boxOptions.map((option, index) => {
                return (
                  <Fragment key={index}>
                    <Checkbox key={index} value={index}>
                      {option.optionTitle}
                    </Checkbox>
                    <br />
                  </Fragment>
                );
              })}
            </Checkbox.Group>
            <div>中的任意一个时，“当前题目”才出现</div>
          </>
        )}
      </div>

      <Form.Item label="是否全屏显示">
        <Checkbox checked={activeQuestion.fullscreen} onChange={e => {
          onQuesionChange({ ...activeQuestion, fullscreen: e.target.checked })

        }} />
      </Form.Item>
      {/* <div style={{ marginTop: 12 }}>
        <span>是否独占整页：</span>
        <Checkbox checked={isFullscreen} onChange={e => setIsFullscreen(e.target.checked)} />
      </div> */}
    </>
  );
}
