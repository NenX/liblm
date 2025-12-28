import React from 'react';
import { Tabs, Input, Row, Col, Radio, InputNumber, Button, Divider } from 'antd';
import { map, get, set, isEmpty, isFunction, toArray, cloneDeep, isEqual } from 'lodash';
import DynamicForm from '../../BaseModalForm/DynamicForm';
import FilterDateInput from '../../MyForm/components/business/FilterDateInput';
import { PlusOutlined } from '@ant-design/icons';
import PregnancyHistoryFormSection from './PregnancyHistoryFormSection';
import NormalSelect from '../../selects/NormalSelect';
import { formDescriptionsWithoutSectionApi, formDescriptionsFromApi } from '../../utils/adapter';
import { SMchc_FormDescriptions } from '@lm_fe/service';
const TAB_TITLE = '孕次';
interface IProps {
  value?: any;
  onChange?: any;
}
class PregnancyHistoryForm extends DynamicForm {
  constructor(props: IProps) {
    super(props);
    this.newTabIndex = 1;
    this.state = {
      tabPanes: [],
      activeKey: undefined,
      formData: {},
    };
  }

  nativeFormDescriptions = {};

  /**
   * 获取表单配置以及渲染数据
   */
  async componentDidMount() {
    const { value: pregnancyHistories, form, system } = this.props;
    const formField = await SMchc_FormDescriptions.getModuleParseCache('pregnant-history-setting');
    const nativeFormDescriptions = formDescriptionsWithoutSectionApi(formField);
    this.nativeFormDescriptions = nativeFormDescriptions;

    // 渲染数据
    if (!isEmpty(pregnancyHistories)) {
      const tabPanes: any = [];
      map(pregnancyHistories, (pregnancyHistory, index) => {
        const activeKey = `${TAB_TITLE}${this.newTabIndex++}`;
        tabPanes.push({ title: activeKey, key: activeKey });

        if (get(pregnancyHistory, 'fetalcount') > 0) {
          form.setFieldsValue({ [`hasPregnancy_${index}`]: true });
          if (get(pregnancyHistory, 'vaginalDelivery')) {
            form.setFieldsValue({ [`deliverWay_${index}`]: 'vaginalDelivery' });
          } else if (get(pregnancyHistory, 'cesareanSection')) {
            form.setFieldsValue({ [`deliverWay_${index}`]: 'cesareanSection' });
          } else if (get(pregnancyHistory, 'forceps')) {
            form.setFieldsValue({ [`deliverWay_${index}`]: 'forceps' });
          } else if (get(pregnancyHistory, 'vacuumAssisted')) {
            form.setFieldsValue({ [`deliverWay_${index}`]: 'vacuumAssisted' });
          } else if (get(pregnancyHistory, 'breechMidwifery')) {
            form.setFieldsValue({ [`deliverWay_${index}`]: 'breechMidwifery' });
          }
        } else {
          form.setFieldsValue({ [`hasPregnancy_${index}`]: false });
          const abortionWayArr = [];
          if (get(pregnancyHistory, 'medicalAbortion')) abortionWayArr.push('medicalAbortion');
          if (get(pregnancyHistory, 'surgicalAbortion')) abortionWayArr.push('surgicalAbortion');
          if (get(pregnancyHistory, 'naturalAbortion')) abortionWayArr.push('naturalAbortion');
          if (get(pregnancyHistory, 'currettage')) abortionWayArr.push('currettage');
          form.setFieldsValue({ [`abortionWay_${index}`]: abortionWayArr });

          const badPregnancyArr = [];
          if (get(pregnancyHistory, 'inducedLabor')) badPregnancyArr.push('inducedLabor');
          if (get(pregnancyHistory, 'fetusdeath')) badPregnancyArr.push('fetusdeath');
          if (get(pregnancyHistory, 'ectopicPregnancy')) badPregnancyArr.push('ectopicPregnancy');
          if (get(pregnancyHistory, 'hydatidMole')) badPregnancyArr.push('hydatidMole');
          if (get(pregnancyHistory, 'multiple')) badPregnancyArr.push('multiple');
          form.setFieldsValue({ [`badPregnancy_${index}`]: badPregnancyArr });
        }

        form.setFieldsValue({
          [`year_${index}`]: get(pregnancyHistory, 'year'),
          [`exceptionalcase_${index}`]: get(pregnancyHistory, 'exceptionalcase'),
          [`complicationNote_${index}`]: get(pregnancyHistory, 'complicationNote'),
          [`hospital_${index}`]: get(pregnancyHistory, 'hospital'),
          [`fetalcount_${index}`]: get(pregnancyHistory, 'fetalcount'),
          [`gestationalWeek_${index}`]: get(pregnancyHistory, 'gestationalWeek'),
          [`puerperalFever_${index}`]: get(pregnancyHistory, 'puerperalFever'),
          [`hemorrhage_${index}`]: get(pregnancyHistory, 'hemorrhage'),
        });
        map(get(pregnancyHistory, 'children'), (children, i) => {
          form.setFieldsValue({
            [`childLiving_${index}_${i}`]: get(children, 'childLiving'),
            [`childDeathTime_${index}_${i}`]: get(children, 'childDeathTime'),
            [`childDeathNote_${index}_${i}`]: get(children, 'childDeathNote'),
            [`childGender_${index}_${i}`]: get(children, 'childGender'),
            [`sequelaNote_${index}_${i}`]: get(children, 'sequelaNote'),
            [`childDeformity_${index}_${i}`]: get(children, 'childDeformity'),
            [`neonateWeight_${index}_${i}`]: get(children, 'neonateWeight'),
            [`neonateHeight_${index}_${i}`]: get(children, 'neonateHeight'),
          });
        });
      });
      this.setState({
        tabPanes,
        activeKey: isEmpty(tabPanes) ? undefined : get(tabPanes, '0.key'),
      });
    }
  }

  /**
   *
   * this.state.formData 作为重渲染的关键，form 中字段改变后，
   * 需要对比 formData 和 form.getFieldsValue()，如果不一致，
   * form.getFieldsValue() 再赋值一次给 this.state.formData
   */
  componentDidUpdate(prevProps, prevState) {
    const { form } = this.props;
    const { formData: prevFormData } = prevState;
    if (form) {
      if (!isEqual(prevFormData, form.getFieldsValue())) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          formData: form.getFieldsValue(),
        });
      }
    }
  }

  // 改变 active Tab
  handleChange = (activeKey) => {
    this.setState({ activeKey });
  };

  // 更新 tab
  handleEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  // 添加 tab
  add = () => {
    const { tabPanes } = this.state;
    const activeKey = `${TAB_TITLE}${this.newTabIndex++}`;
    tabPanes.push({ title: activeKey, key: activeKey });
    this.setState({ tabPanes, activeKey });
  };

  // 删除 tab
  remove = (targetKey) => {
    let { activeKey, tabPanes } = this.state;
    let lastIndex;
    tabPanes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = tabPanes.filter((pane) => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ tabPanes: panes, activeKey });
  };

  // 设置表单数据
  setFormData = () => {
    const { form } = this.props;
    this.setState({
      formData: form.getFieldsValue(),
    });
  };

  // 渲染胎儿信息
  renderChildrens = (index, formDescriptions) => {
    const { formData } = this.state;
    const childrens = [];
    const fetalcount = get(formData, `fetalcount_${index}`);
    let renderEditItem;
    const newFormDescriptions = {};

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < fetalcount; i++) {
      map(formDescriptions, (formDescription, formDescriptionKey) => {
        set(newFormDescriptions, `${formDescriptionKey}_${i}`, formDescription);
      });
      renderEditItem = this.generateRenderEditItem(newFormDescriptions);
      const temp = (
        <div>
          <Divider key={`fetalcount-${index + 1}`} orientation="left">
            <span style={{ fontSize: 12 }}>胎儿{i + 1}</span>
          </Divider>
          <Row>
            <Col
              span={get(this.nativeFormDescriptions, 'childLiving.span')}
              offset={get(this.nativeFormDescriptions, 'childLiving.offset')}
            >
              {renderEditItem(
                `childLiving_${index}_${i}`,
                <Radio.Group
                  onChange={(e) => {
                    this.setFormData();
                  }}
                >
                  <Radio value={true}>健在</Radio>
                  <Radio value={false}>死亡</Radio>
                </Radio.Group>,
                { customFormItemLayout: get(this.nativeFormDescriptions, 'childLiving.formItemLayout') || {} },
              )}
            </Col>
            {!get(formData, `childLiving_${index}_${i}`) && (
              <Col
                span={get(this.nativeFormDescriptions, 'childDeathTime.span')}
                offset={get(this.nativeFormDescriptions, 'childDeathTime.offset')}
              >
                {renderEditItem(
                  `childDeathTime_${index}_${i}`,
                  <FilterDateInput {...get(this.nativeFormDescriptions, 'childDeathTime.inputProps')} />,
                  { customFormItemLayout: get(this.nativeFormDescriptions, 'childDeathTime.formItemLayout') || {} },
                )}
              </Col>
            )}
            {!get(formData, `childLiving_${index}_${i}`) && (
              <Col
                span={get(this.nativeFormDescriptions, 'childDeathNote.span')}
                offset={get(this.nativeFormDescriptions, 'childDeathNote.offset')}
              >
                {renderEditItem(
                  `childDeathNote_${index}_${i}`,
                  <Input {...get(this.nativeFormDescriptions, 'childDeathNote.inputProps')} />,
                  { customFormItemLayout: get(this.nativeFormDescriptions, 'childDeathNote.formItemLayout') || {} },
                )}
              </Col>
            )}
          </Row>
          {get(formData, `childLiving_${index}_${i}`) && (
            <>
              <Row>
                <Col
                  span={get(this.nativeFormDescriptions, 'childGender.span')}
                  offset={get(this.nativeFormDescriptions, 'childGender.offset')}
                >
                  {renderEditItem(
                    `childGender_${index}_${i}`,
                    <NormalSelect
                      type="genderMapping"
                      {...get(this.nativeFormDescriptions, 'childGender.inputProps')}
                    />,
                    { customFormItemLayout: get(this.nativeFormDescriptions, 'childGender.formItemLayout') || {} },
                  )}
                </Col>
                <Col
                  span={get(this.nativeFormDescriptions, 'sequelaNote.span')}
                  offset={get(this.nativeFormDescriptions, 'sequelaNote.offset')}
                >
                  {renderEditItem(
                    `sequelaNote_${index}_${i}`,
                    <Input {...get(this.nativeFormDescriptions, 'sequelaNote.inputProps')} />,
                    // <Radio.Group {...get(this.nativeFormDescriptions, 'sequelaNote.inputProps')}>
                    //   <Radio value={false}>无</Radio>
                    //   <Radio value={true}>有</Radio>
                    // </Radio.Group>,
                    { customFormItemLayout: get(this.nativeFormDescriptions, 'sequelaNote.formItemLayout') || {} },
                  )}
                </Col>
                <Col
                  span={get(this.nativeFormDescriptions, 'neonateWeight.span')}
                  offset={get(this.nativeFormDescriptions, 'neonateWeight.offset')}
                >
                  {renderEditItem(
                    `neonateWeight_${index}_${i}`,
                    <InputNumber min={0} {...get(this.nativeFormDescriptions, 'neonateWeight.inputProps')} />,
                    { customFormItemLayout: get(this.nativeFormDescriptions, 'neonateWeight.formItemLayout') || {} },
                  )}
                </Col>
                {/* <Col
                  span={get(this.nativeFormDescriptions, 'childDeformity.span')}
                  offset={get(this.nativeFormDescriptions, 'childDeformity.offset')}
                >
                  {renderEditItem(
                    `childDeformity_${index}_${i}`,
                    <Radio.Group {...get(this.nativeFormDescriptions, 'childDeformity.inputProps')}>
                      <Radio value={false}>无</Radio>
                      <Radio value={true}>有</Radio>
                    </Radio.Group>,
                    { customFormItemLayout: get(this.nativeFormDescriptions, 'childDeformity.formItemLayout') || {} },
                  )}
                </Col> */}
              </Row>
              {/* <Row>
                <Col
                  span={get(this.nativeFormDescriptions, 'neonateWeight.span')}
                  offset={get(this.nativeFormDescriptions, 'neonateWeight.offset')}
                >
                  {renderEditItem(
                    `neonateWeight_${index}_${i}`,
                    <InputNumber min={0} {...get(this.nativeFormDescriptions, 'neonateWeight.inputProps')} />,
                    { customFormItemLayout: get(this.nativeFormDescriptions, 'neonateWeight.formItemLayout') || {} },
                  )}
                </Col>
                <Col
                  span={get(this.nativeFormDescriptions, 'neonateHeight.span')}
                  offset={get(this.nativeFormDescriptions, 'neonateHeight.offset')}
                >
                  {renderEditItem(
                    `neonateHeight_${index}_${i}`,
                    <InputNumber min={0} {...get(this.nativeFormDescriptions, 'neonateHeight.inputProps')} />,
                    { customFormItemLayout: get(this.nativeFormDescriptions, 'neonateHeight.formItemLayout') || {} },
                  )}
                </Col>
              </Row> */}
            </>
          )}
        </div>
      );
      childrens.push(temp);
    }
    return childrens;
  };

  // 渲染孕次
  renderTabContent = (key, index) => {
    const { formData } = this.state;
    const { form } = this.props;
    const newFormDescriptions = {};
    map(cloneDeep(this.nativeFormDescriptions), (formDescription, formDescriptionKey) => {
      set(formDescription, 'key', `${formDescriptionKey}_${index}`);
      set(formDescription, 'native_key', formDescriptionKey);
      set(newFormDescriptions, `${formDescriptionKey}_${index}`, formDescription);
    });
    const renderEditItem = this.generateRenderEditItem(newFormDescriptions);
    return (
      <>
        {isFunction(renderEditItem) && (
          <PregnancyHistoryFormSection
            tabIndex={index}
            formData={formData}
            form={form}
            formDescriptions={toArray(newFormDescriptions)}
            events={{ setFormData: this.setFormData }}
            renderEditItem={renderEditItem}
          />
        )}
        {get(formData, `hasPregnancy_${index}`) && this.renderChildrens(index, newFormDescriptions)}
      </>
    );
  };

  render() {
    const { tabPanes, activeKey } = this.state;
    return (
      <>
        <div style={{ marginLeft: 8, marginBottom: 8 }}>
          <Button onClick={this.add} type="default" icon={<PlusOutlined />}>
            添加孕产史信息
          </Button>
        </div>
        {!isEmpty(tabPanes) && (
          <Tabs
            tabBarStyle={{ margin: '0 8px 16px' }}
            type="editable-card"
            hideAdd
            onChange={this.handleChange}
            activeKey={activeKey}
            onEdit={this.handleEdit}
          >
            {map(tabPanes, (pane, index) => {
              const paneIndex = Number(pane.key.slice(-1)) - 1;
              return (
                <Tabs.TabPane forceRender key={get(pane, 'key')} tab={get(pane, 'title')}>
                  {this.renderTabContent(get(pane, 'key'), paneIndex)}
                </Tabs.TabPane>
              );
            })}
          </Tabs>
        )}
      </>
    );
  }
}
export default PregnancyHistoryForm
