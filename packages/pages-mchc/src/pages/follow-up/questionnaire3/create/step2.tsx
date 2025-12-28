// import Editor from '@/components/GeneralComponents/Editor';
import { IMchc_QuestionGroup, IMchc_QuestionItem, IMchc_Questionnaire } from '@lm_fe/service';
import { Button, Col, Form, Input, message, Row, Tabs } from 'antd';
import React, { useRef, useState } from 'react';

import { chooseArray, descArray, getQuestionsInGroup, getTargetQuestionInGroup, initQuestionMap, starArray, TQuestionType } from './common';
import { QuestionItem } from './question-item';
import styles from './step2.module.less';
import { Step2Right } from './Step2Right';





const btns = [
  {
    id: 1,
    title: '选择填空',
    value: chooseArray,
  },
  {
    id: 2,
    title: '评分题',
    value: starArray,
  },
  {
    id: 3,
    title: '文字说明',
    value: descArray,
  },
];
interface IProps {
  onChangeStep: (v: number) => void
  onPreview: (v: IMchc_Questionnaire) => void
  data: IMchc_Questionnaire
  onEditorUpload?: any
}


export default function Step2(props: IProps) {
  const { data, onPreview, onChangeStep, onEditorUpload } = props;



  const [questionnaireTitle, setQuestionnaireTitle] = useState(data.questionnaireTitle)
  const [questions, setQuestions] = useState(data.questionList || [])
  const [description, setDescription] = useState(data.description)
  const [dragItemType, setDragItemType] = useState<TQuestionType>()
  const [groups, setGroups] = useState(data.groupVOList || [{ groupIndex: 0, groupDescription: '', code: '', groupTitle: '第一组', questionIndexList: data.questionList?.map(_ => _.questionIndex) || [] }])
  const [activeGroupIdx, setActiveGroupIdx] = useState(0)
  const [activeQuestionIndexInGroup, setActiveQuestionIndexInGroup] = useState(-1)
  const activeGroup = groups.find(_ => _.groupIndex === activeGroupIdx)
  const activeQuestion = getTargetQuestionInGroup(questions, activeQuestionIndexInGroup, activeGroup)
  const groupQuestions = getQuestionsInGroup(questions, activeGroup)
  console.log('idx', activeQuestionIndexInGroup, activeQuestion)

  const indexRef = useRef(0)
  function generateQuestionByType(type: TQuestionType) {
    return initQuestionMap[type] as IMchc_QuestionItem

  };

  function handleBtnClick(type: TQuestionType) {
    return () => {
      // lastItemRef && lastItemRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addQuesion(type, questions.length)

    };
  }

  function handleChangeIndex(idx: number) {
    indexRef.current = idx;
  };
  function addQuesion(t: TQuestionType, idx: number) {
    const maxIndex = questions.reduce((a, b) => Math.max(a, b.questionIndex), 1000) + 1
    const newQuestions: IMchc_QuestionItem[] = JSON.parse(JSON.stringify(questions))
    const newItem = generateQuestionByType(t)
    newItem.questionIndex = maxIndex
    const targetGroup = groups.find(_ => _.groupIndex === activeGroupIdx)
    if (targetGroup?.questionIndexList) {
      targetGroup.questionIndexList.splice(idx, 0, maxIndex)
    }

    newQuestions.push(newItem)

    setQuestions(newQuestions)
    setGroups([...groups])

  };
  function handleDragEnd() {
    if (!dragItemType) return
    addQuesion(dragItemType, indexRef.current)

    // const newQuestions: IMchc_QuestionItem[] = JSON.parse(JSON.stringify(questions));
    // newQuestions.map((question, questionIndex: number) => {
    //   if (question?.logic?.bind !== undefined && questionIndex > indexRef.current) {
    //     if (question?.logic?.bind > indexRef.current - 1) {
    //       question!.logic!.bind = question?.logic?.bind + 1
    //     }
    //   }
    // });
    // setQuestions(newQuestions)

  };

  function modifyQuestion(item: IMchc_QuestionItem) {
    const idx = questions.findIndex(_ => _.questionIndex === item.questionIndex)
    questions[idx] = item
    setQuestions([...questions])
  }

  function renderQuestions(q: IMchc_QuestionItem[]) {
    return q
      .map((question, index) => {
        const lastQuestion = questions[questions.length - 1];
        return (
          <QuestionItem
            groupQuestions={groupQuestions}
            key={index}
            index={index}
            question={question}
            lastQuestion={lastQuestion}
            onChangeIndex={handleChangeIndex}
            onQuestionClick={() => setActiveQuestionIndexInGroup(index)}

            onQuesionChange={modifyQuestion}


            onQuestionItemDelete={() => {
              if (!activeGroup) return
              const logicBindIds: number[] = [];
              questions.forEach((question) => {
                typeof question.logic?.bind === 'number' && logicBindIds.push(question.logic.bind);
              });
              if (logicBindIds.indexOf(question.questionIndex) > -1) {
                message.error('该题有逻辑关联，无法删除');
                return;
              }
              const realIndex = questions.findIndex(_ => _.questionIndex === question.questionIndex)
              questions.splice(realIndex, 1);
              const indexOfGroup = activeGroup.questionIndexList?.indexOf(question.questionIndex)
              if (typeof indexOfGroup === 'number' && indexOfGroup > -1) {
                activeGroup.questionIndexList?.splice(indexOfGroup, 1)
                groups.splice(activeGroupIdx, 1, { ...activeGroup })
              }
              setQuestions([...questions])

            }}
          />
        );
      });
  };

  function renderBtns() {
    return (
      <div className={styles["question-step-two__panel-question"]}>
        <div className={styles["question-step-two__panel-question-card"]}>
          {btns.map((btn, index) => {
            return (
              <div key={index} className={styles["question-step-two__panel-question-card-item"]}>
                <span className={styles["question-step-two__panel-question-card-item__title"]}>{btn.title}</span>
                <div className={styles["question-step-two__panel-question-card-item__btns"]}>
                  {btn.value.map((item) => {
                    return (
                      <div
                        key={item.title}
                        className={styles["question-step-two__panel-question-card-item__btns-btn"]}
                        draggable
                        onDragStart={() => {
                          setDragItemType(item.title)
                        }}
                        onDragEnd={handleDragEnd}
                        onClick={handleBtnClick(item.title)}
                      >
                        <img src={item.iconImg} alt="" />
                        <div>{item.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  function renderLogicEdit() {
    return (
      activeQuestion && (
        <div className={styles["question-step-two__panel-func"]}>
          <div className={styles["question-step-two__panel-func__title"]}>题目{activeQuestionIndexInGroup + 1}设置</div>
          {/* <div className="question-step-two__panel-func__item">
            <span>此题必答</span>
            <Switch></Switch>
          </div> */}
          {
            activeGroup && activeQuestion && (
              <Step2Right
                activeGroup={activeGroup}
                onQuesionChange={modifyQuestion}
                index={activeQuestionIndexInGroup}
                groupQuestions={groupQuestions}
                activeQuestion={activeQuestion} />
            )
          }
        </div>
      )
    );
  };


  function setCurrentGroup<T extends keyof IMchc_QuestionGroup>(key: T, value: IMchc_QuestionGroup[T]) {
    if (activeGroup) {
      activeGroup[key] = value
      groups.splice(activeGroupIdx, 1, { ...activeGroup })
      setGroups([...groups])
    }

  }


  return (
    <>
      <Row className={styles["question-step-two__panel"]}>
        <Col span={4}>{renderBtns()}</Col>
        <Col span={12} offset={1} className={styles["question-step-two__panel-preview"]}>
          <div className={styles["question-step-two__panel-preview-top"]}>
            <Input
              className={styles["question-step-two__panel-preview-top__title"]}
              value={questionnaireTitle}
              placeholder="请输入标题"
              onChange={(e) => {
                setQuestionnaireTitle(e.target.value)

              }}
            />
            <Input.TextArea
              className={styles["question-step-two__panel-preview-top__title"]}
              value={description}
              style={{ marginTop: 12 }}
              placeholder="请输入描述"
              onChange={(e) => {
                setDescription(e.target.value)
              }}
            />
            {/* <Editor
              className="question-step-two__panel-preview-top__desc"
              style={{ height: 320, overflow: 'scroll' }}
              onChange={(data: any) => {
                setQuestionsDescription(data)

              }}
              value={questionsDescription}
              onUpload={onEditorUpload}
            /> */}
          </div>
          <Tabs type="editable-card" activeKey={activeGroupIdx.toString()} onChange={e => setActiveGroupIdx(+e)} onEdit={(key, action) => {
            if (action === 'add') {
              groups.push({
                groupIndex: groups.length,
                groupTitle: `第${groups.length + 1}组`,
                questionIndexList: [],
                groupDescription: '',
                code: ''
              })
            } else {
              groups.splice(+key, 1)
            }
            setGroups([...groups])
          }}>

            {
              groups.map((_, idx) => {
                const active = _.groupIndex === activeGroupIdx
                const q = getQuestionsInGroup(questions, _)
                return <Tabs.TabPane tab={_.groupTitle} key={_.groupIndex}>
                  <Form.Item label="标题" wrapperCol={{ span: 17 }} style={{ padding: '0 8px' }}>
                    <Input
                      size="small"
                      value={activeGroup?.groupTitle}
                      onChange={(e) => {
                        setCurrentGroup('groupTitle', e.target.value)

                      }}
                    />
                  </Form.Item>
                  <Form.Item label="描述" wrapperCol={{ span: 17 }} style={{ padding: '0 8px' }}>
                    <Input
                      size="small"
                      value={activeGroup?.groupDescription}
                      onChange={(e) => {
                        setCurrentGroup('groupDescription', e.target.value)
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="规则" wrapperCol={{ span: 17 }} style={{ padding: '0 8px' }}>
                    <Input.TextArea
                      size="small"
                      placeholder={`例如：${JSON.stringify([["[9,13)", "轻度"], ["[13,~)", "中重度"]])}`}
                      value={activeGroup?.code}
                      onChange={(e) => {
                        setCurrentGroup('code', e.target.value)

                      }}
                    />
                  </Form.Item>
                  <div className={styles["question-step-two__panel-preview-middle"]}>
                    {!q.length ? (
                      <div className={styles["question-step-two__panel-preview-middle__start"]}>点击题型 或者 将题型拖入此区域</div>
                    ) : (
                      active && renderQuestions(q)
                    )}
                  </div>
                </Tabs.TabPane>
              })
            }
          </Tabs>

          <div className={styles["question-step-two__panel-preview-bottom"]}>

            {/* <div className="question-step-two__panel-preview-bottom__title">
                <span>完成时显示</span>
              </div>
              <div>
                <Input.TextArea rows={5} defaultValue="感谢您的配合!" />
              </div> */}
            <div className={styles["question-step-two__panel-preview-bottom__btns"]}>
              <Button
                className={styles["question-step-two__panel-preview-bottom__btns-btn"]}
                // icon={<CustomIcon type="icon-reset" />}
                onClick={() => {


                  onChangeStep(0);
                }}
              >
                上一步
              </Button>
              <Button
                type="primary"
                className={styles["question-step-two__panel-preview-bottom__btns-btn"]}
                // icon={<CustomIcon type="icon-next" />}
                onClick={() => {


                  onPreview({
                    ...data,
                    groupVOList: groups,
                    questionnaireTitle,
                    description,
                    questionList: questions,
                    // questions,
                    // questionsTitle,
                    // questionsDescription,
                    // title,
                    // description,
                  });
                }}
              >
                下一步
              </Button>
            </div>
          </div>
        </Col>
        <Col span={6} offset={1}>
          {!!questions.length && renderLogicEdit()}
        </Col>
      </Row>

    </>
  );
}
