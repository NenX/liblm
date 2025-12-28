import {
  BorderOutlined,
  CaretDownOutlined, CheckCircleOutlined,
  CloseCircleOutlined, DeleteOutlined, StarOutlined
} from '@ant-design/icons';
import { Button, Col, Input, InputNumber, Row } from 'antd';
import React, { useRef, useState } from 'react';
import styles from './step2.module.less';
import { labelsArrayMapping, QuestionTypeEnums } from './common';
import { IMchc_QuestionGroup, IMchc_QuestionItem, IMchc_QuestionOption, } from '@lm_fe/service';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface IProps {
  index: number;
  question: IMchc_QuestionItem;
  groupQuestions: IMchc_QuestionItem[];
  lastQuestion: IMchc_QuestionItem;
  onChangeIndex: any;
  onQuestionItemDelete: any;
  onQuestionClick(q: IMchc_QuestionItem): void
  onQuesionChange(q: IMchc_QuestionItem): void
}

export function QuestionItem(props: IProps) {
  const {
    index,
    question,
    onChangeIndex,
    onQuestionClick,
    onQuestionItemDelete,
    onQuesionChange,
    groupQuestions,
  } = props;
  const { questionType, questionOptionList = [] } = question;
  const ref = useRef<HTMLDivElement>(null);
  const [hoverTargetQuestionPlace, setHoverTargetQuestionPlace] = useState('');
  const bind = question.logic?.bind
  // useEffect(() => {
  //   ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  // }, [lastQuestion]);
  const handleQuestionDragOver = (e: any) => {
    const { y, height } = ref.current!.getBoundingClientRect();
    const normalClientY = y + height / 2;
    const clientY = e.clientY
    if (clientY) {
      let hoverTargetQuestionPlace = 'Bottom';
      let newQuestionIndex = index + 1;
      if (clientY < normalClientY) {
        hoverTargetQuestionPlace = 'Top';
        newQuestionIndex = index;
      }
      setHoverTargetQuestionPlace(hoverTargetQuestionPlace);
      onChangeIndex(newQuestionIndex);
    }
  };

  const handleQuestionDragLeave = () => {
    setHoverTargetQuestionPlace('');
  };

  const renderQuestionInput = () => {
    const typeLabel = QuestionTypeEnums.getLabel(questionType)
    if (typeLabel === '单选题' || typeLabel === '多选题' || typeLabel === '下拉题') {
      const icons = {
        '单选题': <CheckCircleOutlined />,
        '多选题': <BorderOutlined />,
        '下拉题': <CaretDownOutlined />,
      }
      return questionOptionList.map((option, optionIndex) => {
        return (
          <Row key={optionIndex} className={styles["question-step-two__panel-preview-middle__question-options"]}>
            <Col span={14}>
              <Input
                className={styles["question-step-two__panel-preview-middle__question-options-input"]}
                addonBefore={icons[typeLabel]}
                value={option.optionTitle}

                onChange={(e) => {
                  questionOptionList.splice(optionIndex, 1, { ...option, optionTitle: e.target.value })
                  onQuesionChange({ ...question, questionOptionList: [...questionOptionList] })
                }}
                size="small"
              />
            </Col>
            <Col span={7} offset={1} style={{ display: 'flex' }}>
              <div style={{ width: 80 }}>分值：</div>
              <InputNumber
                className={styles["question-step-two__panel-preview-middle__question-options-input"]}
                value={option.optionScore}
                onChange={(score) => {
                  questionOptionList.splice(optionIndex, 1, { ...option, optionScore: score! })
                  onQuesionChange({ ...question, questionOptionList: [...questionOptionList] })

                }}
                size="small"
              />
            </Col>

            <Col span={1} offset={1}>
              <CloseCircleOutlined
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  questionOptionList.splice(optionIndex, 1)
                  onQuesionChange({ ...question, questionOptionList: [...questionOptionList] })
                }}
                className={styles["question-step-two__panel-preview-middle__question-options-delete"]}
              />
            </Col>
          </Row>
        );
      });
    }


    if (typeLabel === '填空题') {
      return (
        <div className={styles["question-step-two__panel-preview-middle__question-completion"]}>
          <Input
            className={styles["question-step-two__panel-preview-middle__question-completion-input"]}
            size="small"


            style={{ marginTop: 4 }}
          />
          {questionOptionList.map((option, optionIndex) => {
            return (
              <Row key={optionIndex} className={styles["question-step-two__panel-preview-middle__question-options"]}>
                <Col span={6} style={{ display: 'flex' }}>
                  <div style={{ width: '100%' }}>计分规则：</div>
                  <Select
                    className={styles["question-step-two__panel-preview-middle__question-options-input"]}
                    value={option.optionTitle}

                    onSelect={(value) => {

                      questionOptionList.splice(optionIndex, 1, { ...option, optionTitle: value })
                      onQuesionChange({ ...question, questionOptionList: [...questionOptionList] })
                    }}
                    dropdownMatchSelectWidth
                    size="small"
                  >
                    <Select.Option value="equal">相等</Select.Option>
                    <Select.Option value="contain">包含</Select.Option>
                  </Select>
                </Col>
                <Col span={7} offset={1} style={{ display: 'flex' }}>
                  <div style={{ width: '100%' }}>标准答案：</div>
                  <Input
                    className={styles["question-step-two__panel-preview-middle__question-options-input"]}
                    value={option.fillTemplate}
                    onChange={(e) => {

                      questionOptionList.splice(optionIndex, 1, { ...option, fillTemplate: e.target.value })
                      onQuesionChange({ ...question, questionOptionList: [...questionOptionList] })
                    }}
                    size="small"
                  />
                </Col>
                <Col span={7} offset={1} style={{ display: 'flex' }}>
                  <div style={{ width: 80 }}>分值：</div>
                  <InputNumber
                    className={styles["question-step-two__panel-preview-middle__question-options-input"]}
                    value={option.optionScore}
                    onChange={(score) => {

                      questionOptionList.splice(optionIndex, 1, { ...option, optionScore: score })
                      onQuesionChange({ ...question, questionOptionList: [...questionOptionList] })
                    }}
                    size="small"
                  />
                </Col>
              </Row>
            );
          })
          }
        </div >
      );
    }
    if (typeLabel === '段落说明') {
      return <div className={styles["question-step-two__panel-preview-middle__question-options"]}></div>;
    }
    if (typeLabel === '打分题') {
      return (
        <div className={styles["question-step-two__panel-preview-middle__question-options"]}>
          <StarOutlined />
          <StarOutlined />
          <StarOutlined />
          <StarOutlined />
          <StarOutlined />
        </div>
      );
    }
    return <></>;
  };

  const renderBottomBtns = () => {

    if (QuestionTypeEnums.getValues(['单选题', '多选题', '下拉题']).includes(question.questionType)) {
      return (
        <div style={{ marginTop: 20 }}>
          <Button
            size="small"
            onClick={(e: React.MouseEvent) => {


              onQuesionChange({
                ...question,
                questionOptionList: [
                  ...questionOptionList,
                  { optionTitle: '新增选项', optionIndex: questionOptionList.reduce((a, b) => Math.max(a, b.optionIndex), 1000) + 1, optionScore: 0, questionType: question.questionType } as IMchc_QuestionOption
                ]
              })

            }}
          >
            添加选项
          </Button>
        </div>
      );
    }
  };

  return (
    <div
      style={
        hoverTargetQuestionPlace
          ? {
            [`border${hoverTargetQuestionPlace}`]: '4px solid #ff0000',
          }
          : {}
      }
      ref={ref}
      className={styles["question-step-two__panel-preview-middle__question"]}
      onDragOver={handleQuestionDragOver}
      onDragLeave={handleQuestionDragLeave}
      onClick={() => {
        onQuestionClick({ ...question, questionIndex: index });
      }}
    >
      <div className={styles["question-step-two__panel-preview-middle__question-title"]}>
        <h4>
          {index + 1}.{labelsArrayMapping[QuestionTypeEnums.getLabel(question.questionType)].title}

        </h4>
        <DeleteOutlined
          onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
            e.stopPropagation();
            onQuestionItemDelete();
          }}
          className={styles["question-step-two__panel-preview-middle__question-title-icon-delete"]}
        />
      </div>
      <div>
        <Input
          className={styles["question-step-two__panel-preview-middle__question-options-input"]}
          value={question.questionTitle}
          size="small"
          placeholder="请输入标题"
          onChange={(e) => {
            onQuesionChange({ ...question, questionTitle: e.target.value })

          }}
        />
        {renderQuestionInput()}
      </div>
      {!!question.logic?.selectOption.length && groupQuestions.findIndex(_ => _.questionIndex === bind) > -1 && (
        <div className={styles["question-step-two__panel-preview-middle__question-tip"]}>
          依赖于第{groupQuestions.findIndex(_ => _.questionIndex === question.logic?.bind) + 1}题的第
          {
            question.logic.selectOption.map((value) => value + 1).join('、')

          }
          选项
        </div>
      )}
      {renderBottomBtns()}
    </div>
  );
};
