import { DesktopOutlined, MobileOutlined, TabletOutlined } from '@ant-design/icons';
import { IMchc_Questionnaire, IMchc_QuestionItem, IMchc_QuestionGroup, SMchc_Questionnaire } from '@lm_fe/service';
import { Button, Checkbox, Form, Input, message, Radio, Rate } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { getQuestionsInGroup, QuestionTypeEnums } from './common';
import styles from './step3.module.less';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface IProps {
  data: IMchc_Questionnaire
  onChangeStep: any
}
export default (props: IProps) => {
  const [device, setDevice] = useState('mobile');
  const [globalLogic, setGlobalLogic] = useState([]);
  const { data, onChangeStep, } = props;
  console.log('data', data)
  const { questionList = [], questionnaireTitle, description, groupVOList = [] } = data;
  const [form] = Form.useForm();

  async function handleSave() {
    let method = 'post';
    if (typeof data.id === 'number') {
      method = 'put';
    }
    await SMchc_Questionnaire[method](data)
    message.success('保存问卷成功');
    onChangeStep(0)

  };

  useEffect(() => {
    const newGlobalLogic: any = [...globalLogic];
    questionList.map((question, index) => {
      const { logic } = question;
      if (logic) {
        newGlobalLogic.push({ bindIndex: logic.bind, index });
      }
    });
    setGlobalLogic(newGlobalLogic);
  }, []);



  const handleValuesChange = (values, allValues) => {
    const changedKey = Object.keys(values)[0];
    globalLogic.map(({ bindIndex, index }) => {
      if (changedKey == bindIndex) {
        form.setFieldsValue({
          [index]: undefined,
        });
      }
    });
  };

  const renderFormItem = (question: IMchc_QuestionItem, index: any) => {
    const { logic, questionOptionList = [], questionTitle, questionType } = question;
    let itemStyle = {};
    let Component: any = <Fragment />;
    const bindIndex = logic?.bind
    const bindIndexSelectOption = logic?.selectOption || [];
    const formItemValue = form.getFieldValue(bindIndex);
    if (logic) {
      itemStyle = {
        display: 'none',
      };
      if (Array.isArray(formItemValue)) {
        formItemValue.map((itemOption) => {
          if (bindIndexSelectOption?.indexOf(itemOption) > -1) {
            itemStyle = {};
          }
        });
      } else {
        if (bindIndexSelectOption?.indexOf(formItemValue) > -1) {
          itemStyle = {};
        }
      }
    }
    switch (QuestionTypeEnums.getLabel(questionType)) {
      case '单选题':
        Component = (
          <Radio.Group>
            {questionOptionList.map((option, key) => {
              return (
                <Radio style={{ display: 'block' }} key={key} value={key}>
                  {option.optionTitle}
                </Radio>
              );
            })}
          </Radio.Group>
        );
        break;
      case '多选题':
        Component = (
          <Checkbox.Group>
            {questionOptionList.map((option, key) => {
              return (
                <Checkbox style={{ display: 'block', margin: 0 }} key={key} value={key}>
                  {option.optionTitle}

                </Checkbox>
              );
            })}
          </Checkbox.Group>
        );
        break;
      case '下拉题':
        Component = (
          <Select>
            {questionOptionList.map((option, key) => {
              return (
                <Select.Option key={key} value={key}>
                  {option.optionTitle}

                </Select.Option>
              );
            })}
          </Select>
        );
        break;
      case '打分题':
        Component = <Rate />;
        break;
      case '段落说明':
        break;
      default:
        Component = <Input />;
        break;
    }
    return (
      <Form.Item style={itemStyle} name={index} label={`${index + 1}.${questionTitle}`}>
        {Component}
      </Form.Item>
    );
  };

  const renderMobileShow = () => {
    return (
      <Form autoComplete="off" form={form} layout="vertical" onValuesChange={handleValuesChange}>
        {
          groupVOList.map(g => {
            return <>
              <div className={styles["questions-title"]}>{g.groupTitle}</div>
              <div className={styles["questions-desc"]} dangerouslySetInnerHTML={{ __html: g.groupDescription }}></div>
              {
                getQuestionsInGroup(questionList, g)
                  .map((question, index) => {
                    return <Fragment key={index}>{renderFormItem(question, index)}</Fragment>;
                  })
              }
            </>
          })
        }

      </Form>
    );
  };

  const renderComputeShow = () => {
    return (
      <Form autoComplete="off" form={form} layout="vertical" onValuesChange={handleValuesChange}>

        {
          groupVOList.map(g => {
            return <>
              <div className={styles["questions-title"]}>{g.groupTitle}</div>
              <div className={styles["questions-desc"]} dangerouslySetInnerHTML={{ __html: g.groupTitle }}></div>
              {
                getQuestionsInGroup(questionList, g)
                  .map((question, index) => {
                    return <Fragment key={index}>{renderFormItem(question, index)}</Fragment>;
                  })
              }
            </>
          })
        }


      </Form>
    );
  };

  return (
    <div className={styles["question-step-three__panel"]}>
      <div className={styles["question-step-three__panel-radio"]}>
        <Radio.Group onChange={e => setDevice(e.target.value)} value={device}>
          <Radio.Button value="mobile">
            <MobileOutlined style={{ marginRight: 5 }} />
            手机
          </Radio.Button>
          <Radio.Button value="compute">
            <DesktopOutlined style={{ marginRight: 5 }} />
            电脑
          </Radio.Button>
          <Radio.Button value="tablet">
            <TabletOutlined style={{ marginRight: 5 }} rotate={270} />
            床头屏
          </Radio.Button>
        </Radio.Group>
      </div>
      {device === 'mobile' && (
        <div className={styles["question-step-three__panel-mobile"]}>
          <div className={styles["question-step-three__panel-mobile-preview"]}>
            <div className={styles["question-step-three__panel-mobile-preview_content"]}>{renderMobileShow()}</div>
          </div>
        </div>
      )}
      {device === 'tablet' && <div className={styles["question-step-three__panel-tablet"]}>{renderComputeShow()}</div>}
      {device === 'compute' && <div className={styles["question-step-three__panel-compute"]}>{renderComputeShow()}</div>}
      <div className={styles["question-step-three__panel-bottom"]}>
        <Button
          style={{ marginRight: 8 }}
          // icon={<CustomIcon type="icon-reset" />}
          onClick={() => {
            onChangeStep(1);
          }}
        >
          上一步
        </Button>
        <Button
          type="primary"
          // icon={<CustomIcon type="icon-task" />}
          style={{ marginRight: 8 }}
          onClick={handleSave}
        >
          提交
        </Button>
      </div>
    </div>
  );
};
