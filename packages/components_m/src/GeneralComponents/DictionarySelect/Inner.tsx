import React from 'react';
import { get, map, last, keyBy, indexOf, isEqual } from 'lodash';
import { Radio, Checkbox, Row, Col, Input } from 'antd';
import { mchcUtils } from '@lm_fe/env'
import { GeneralComponents_DictionarySelect_Display } from './Display';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
interface IProps {
  mode?: 'single' | 'multiple';
  type?: 'radio' | 'checkbox' | 'select';
  uniqueKey?: string;
  boxSpan?: number;
  dictionaries?: any;
  onChange?: any;
  value?: any;
  disabled?: boolean
}
const FIX_OTHER_VALUE = 99;

class GeneralComponents_DictionarySelect extends React.Component<IProps> {
  static defaultProps = {
    mode: 'single',
    type: 'select',
    boxSpan: 3,
  };

  state = {
    showOther: false,
    otherNote: '',
    selectedData: undefined,
  };

  static Display = GeneralComponents_DictionarySelect_Display;

  componentDidMount() {
    const { value } = this.props;

    this.setState({
      selectedData: get(value, 'selectedData'),
      otherNote: get(value, 'otherNote'),

    });
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    const { value } = nextProps;
    const prevValue = {
      selectedData: get(prevState, 'selectedData'),
      otherNote: get(prevState, 'otherNote'),
    };
    // console.log(value, prevValue)
    if (!isEqual(value, prevValue)) {
      return {
        selectedData: get(value, 'selectedData'),
        otherNote: get(value, 'otherNote'),
      };
    }
    return null;
  }

  handleSelectedChange = (e: any) => {
    const { type, mode, onChange } = this.props;
    const { otherNote: note } = this.state;
    let selectedData: any;
    let otherNote = note;
    switch (type) {
      case 'radio':
        if (mode === 'single') {
          selectedData = get(e, 'target.value');
        }
        break;
      case 'checkbox':
        if (mode === 'multiple') {
          selectedData = e;
        }
        if (mode === 'single') {
          selectedData = last(e);
        }
        break;
      case 'select':
        selectedData = e;
        break;
      default:
        break;
    }
    if (typeof selectedData === 'object' && indexOf(selectedData, FIX_OTHER_VALUE) > -1) {
      this.setState({
        showOther: true,
      });
    } else if (selectedData === FIX_OTHER_VALUE) {
      this.setState({
        showOther: true,
      });
    } else {
      otherNote = '';
      this.setState({
        showOther: false,
        otherNote: '',
      });
    }
    this.setState({
      selectedData,
    });
    onChange &&
      onChange({
        selectedData,
        otherNote,
      });
  };

  handleInputChange = (e: any) => {
    const { onChange } = this.props;
    const { selectedData } = this.state;
    this.setState({
      otherNote: get(e, 'target.value'),
    });
    onChange &&
      onChange({
        selectedData,
        otherNote: get(e, 'target.value'),
      });
  };

  renderRadios = () => {
    const { boxSpan, uniqueKey, disabled = false } = this.props;
    const { showOther, otherNote, selectedData } = this.state;

    const options = mchcUtils.getDictionariesEnumerations(uniqueKey ?? '');

    return (
      <Radio.Group
        disabled={disabled}
        onChange={this.handleSelectedChange}
        style={{ width: '100%' }}
        value={selectedData}
      >
        <Row>
          {map(options, (option) => {
            if (get(option, 'value') === FIX_OTHER_VALUE && showOther) {
              return (
                <React.Fragment key={get(option, 'value')}>
                  <Col span={boxSpan}>
                    <Radio value={get(option, 'value')}>{get(option, 'label')}</Radio>
                  </Col>
                  <Col span={boxSpan}>
                    <Input placeholder="请输入其它" onChange={this.handleInputChange} value={otherNote} />
                  </Col>
                </React.Fragment>
              );
            }
            return (
              <Col key={get(option, 'value')} span={boxSpan}>
                <Radio value={get(option, 'value')}>{get(option, 'label')}</Radio>
              </Col>
            );
          })}
        </Row>
      </Radio.Group>
    );
  };

  renderCheckboxs = () => {
    const { showOther, selectedData, otherNote } = this.state;
    const { mode, boxSpan, uniqueKey, disabled = false } = this.props;
    const value: any = mode === 'single' ? [selectedData] : selectedData;

    const options = mchcUtils.getDictionariesEnumerations(uniqueKey ?? '')

    return (
      <Checkbox.Group disabled={disabled} onChange={this.handleSelectedChange} value={value} style={{ width: '100%' }}>
        <Row>
          {map(options, (option) => {
            if (get(option, 'value') === FIX_OTHER_VALUE && showOther) {
              return (
                <React.Fragment key={get(option, 'value')}>
                  <Col span={boxSpan}>
                    <Checkbox value={get(option, 'value')}>{get(option, 'label')}</Checkbox>
                  </Col>
                  <Col span={boxSpan}>
                    <Input placeholder="请输入其它" onChange={this.handleInputChange} value={otherNote} />
                  </Col>
                </React.Fragment>
              );
            }
            return (
              <Col key={get(option, 'value')} span={boxSpan}>
                <Checkbox value={get(option, 'value')}>{get(option, 'label')}</Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    );
  };

  renderSelects = () => {
    const {
      mode,
      uniqueKey,
      disabled = false,
      boxSpan,
      getPopupContainer = () => document.body,
      ...others
    } = this.props;
    const { showOther, otherNote, selectedData } = this.state;
    let selectSpan = 24;
    const options = mchcUtils.getDictionariesEnumerations(uniqueKey ?? '')

    if (get(keyBy(options, 'value'), FIX_OTHER_VALUE)) {
      selectSpan = 11;
    }
    return (
      <Row>
        <Col flex="1">
          <Select
            {...others}
            dropdownMatchSelectWidth
            mode={mode}
            allowClear
            showSearch
            filterOption={(inputValue, option: any) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
            }
            placeholder="请输入或选择"
            disabled={disabled}
            value={selectedData}
            onChange={this.handleSelectedChange}
            getPopupContainer={getPopupContainer}
          >
            {map(options, (option: any) => {
              return (
                <Select.Option key={get(option, 'value')} value={get(option, 'value')}>
                  {get(option, 'label')}
                </Select.Option>
              );
            })}
          </Select>
        </Col>
        {showOther && (
          <Col flex="1">
            <Input disabled={disabled} placeholder="请输入其它" onChange={this.handleInputChange} value={otherNote} />
          </Col>
        )}
      </Row>
    );
  };

  render() {
    const { type } = this.props;
    switch (type) {
      case 'radio':
        return this.renderRadios();
      case 'checkbox':
        return this.renderCheckboxs();
      case 'select':
        return this.renderSelects();
      default:
        return <></>;
    }
  }
}
export default GeneralComponents_DictionarySelect;
