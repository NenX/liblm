/* eslint-disable @typescript-eslint/camelcase */
import React, { Component, lazy, Suspense } from 'react';
import { Row, Col } from 'antd';
import { isString, isEmpty, get, cloneDeep } from 'lodash';
import { getRenderData, getFormData } from './utils';
import { MyFormProp, MyFormState, FormConfig } from './interface';
import { createFormHandler } from './form_new';
import './index.less';
import FormItem from './formItem'

// const FormItem = lazy(() => import('./formItem'));
const defaultGutterConfig = {
  gutter: [0, 0], // px
  justify: 'start',
};
export default class MyForm extends Component<MyFormProp, MyFormState> {
  constructor(props: MyFormProp) {
    super(props);
    this.state = {
      formHandler: {},
      myConfig: [],
    };
  }

  componentDidMount() {
    const { getFormHandler, config, value, submitChange } = this.props;
    /*key值加上‘.’*/
    const cloneConfig = cloneDeep(config);
    if (!isEmpty(cloneConfig)) {
      cloneConfig.forEach((item) => {
        let key = item.key;
        item.rawKey = item.rawKey ?? key!
        item.key = key?.startsWith('.') ? key : `.${key}`;
      });
    }

    this.setState(
      {
        myConfig: getRenderData(cloneConfig, value),
        formHandler: createFormHandler(getRenderData(cloneConfig, value), { submitChange }),
      },
      () => {
        if (getFormHandler) {
          getFormHandler(this.state.formHandler);
        }
      },
    );
  }

  // 没有新建formHandler 只是增加了其中的键值
  componentDidUpdate(prevProps: MyFormProp, prevState: MyFormState) {
    const { getFormHandler, config, value, submitChange } = this.props;
    /*key值加上‘.’*/
    const cloneConfig = cloneDeep(config);
    if (!isEmpty(cloneConfig)) {
      cloneConfig.forEach((item) => {
        let key = item.key;
        item.rawKey = item.rawKey ?? key!;
        item.key = key && key.startsWith('.') ? key : `.${key}`;
      });
    }

    if (!config) return;
    // 数据不同
    if (JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
      this.setState({ myConfig: getRenderData(cloneConfig, value) });
    }
    // 配置不同
    if (JSON.stringify(this.props.config) !== JSON.stringify(prevProps.config)) {
      const formData = getFormData(get(this.state.formHandler, 'formData'));
      const currentValue = isEmpty(formData) ? value : formData;
      this.setState({
        myConfig: getRenderData(cloneConfig, currentValue),
        formHandler: createFormHandler(getRenderData(cloneConfig, currentValue), { submitChange }),
      });
    }
    if (JSON.stringify(prevState.formHandler.uuid) !== JSON.stringify(this.state.formHandler.uuid)) {
      if (getFormHandler) {
        getFormHandler(this.state.formHandler);
      }
    }
  }

  renderForm = () => {
    const config = this.state.myConfig ?? [] as Array<FormConfig>;
    const formHandler = this.state.formHandler as any;
    const gridConfig: any = defaultGutterConfig;
    let count = 0; // 计算占比
    let row = 0;
    const formDom = [];
    let spanArr = [];
    for (let i = 0; i < config.length; i++) {
      const { span = 24, offset = 0 } = config[i];
      const thisConfig = config[i];
      const {
        label = '',
        unit = '',
        input_props = {},
        rules = [],
        key = '',
        is_new_row = false,
        name = '',
        header_label = false,
        hidden = false,
        just_header = false,
        className = '',
        isActive,
      } = thisConfig
      const getParseJson = (str: any) => {
        try {
          const obj = JSON.parse(str);
          return obj;
        } catch {
          return str;
        }
      };

      const resetIsNewRow = get(config[i], 'isNewRow') || is_new_row ? true : false;
      const resetHidden = hidden || isActive === 0 ? true : false;
      const resetName = isEmpty(name) && key ? key.substr(1) : name;
      const resetInputType = get(config[i], 'inputType') ? get(config[i], 'inputType') : config[i].input_type;
      const resetInputProps = get(config[i], 'inputProps') ? getParseJson(get(config[i], 'inputProps')) : input_props;
      const resetRules = isString(rules) ? getParseJson(rules) : rules;
      const resetUnit = get(resetInputProps, 'unit') ? get(resetInputProps, 'unit') : unit;
      const resetHeaderLabel = get(resetInputProps, 'header_label')
        ? get(resetInputProps, 'header_label')
        : header_label;
      const resetJustHeader = get(resetInputProps, 'just_header') ? get(resetInputProps, 'just_header') : just_header;

      // console.log(config[i], get(resetInputProps, 'unit'), '554');
      // console.log(config[i].inputProps, key, typeof getParseJson(config[i].inputProps));

      if (!resetHidden) {
        count += span + offset;
      }
      if (count > 24 || resetIsNewRow) {
        formDom.push(
          <Row key={`row-${row}`} {...gridConfig}>
            {spanArr}
          </Row>,
        );
        spanArr = [];
        // 计算上一行换行的offset数量
        // prevOffset = 24 - count + (span + offset);
        // 减去上一行换行所用offset
        count = span + offset;
        row += 1;
      }

      spanArr.push(
        <Col
          span={resetHidden ? 0 : span}
          offset={resetHidden ? 0 : offset}
          key={`${config[i].key}|row-${row}|span-${count}`}
        >
          <FormItem
            thisConfig={thisConfig}
            disabled_all={this.props.disabled_all}
            config={config}
            formHandler={formHandler}
            dispatch={formHandler.dispatch}
            subscribe={formHandler.subscribe}
            // setMyRef={formHandler.setMyRef}
            setMyRef={this.props.setRef}
            value={config[i].value}
            allValue={this.props.value}
            labelSign={get(config, `${i}.labelSign`)}
            type={resetInputType}
            label={label}
            header_label={resetHeaderLabel}
            just_header={resetJustHeader}
            unit={resetUnit}
            input_props={resetInputProps}
            validate={resetRules}
            path={key}
            name={resetName}
            hidden={resetHidden}
            className={className}
            getActions={(functions: any) => this.handlerGetActions(resetName, functions)}
          />
        </Col>,
      );
    }
    if (spanArr) {
      formDom.push(
        <Row key={`row-${row}`} {...gridConfig}>
          {spanArr}
        </Row>,
      );
    }
    return formDom;
  };

  handlerGetActions = (name: string, actions: any) => {
    const { formHandler } = this.state;
    if (!formHandler[name] || !formHandler[name].actions) {
      formHandler[name] = {};
      formHandler[name].actions = {};
    }
    formHandler[name].actions = actions;
    this.setState({ formHandler });
  };

  render() {
    return <Suspense>
      <div className="custom-my-form">{this.renderForm()}</div>
    </Suspense>
  }
}
