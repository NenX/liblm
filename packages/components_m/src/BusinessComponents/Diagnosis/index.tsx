import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import { filter, get, isEmpty, isNil, map, isArray, size, slice } from 'lodash';
import React, { Component } from 'react';
import DiagnosisAutoComplete from '../../selects/DiagnosisAutoComplete';
import { TemplateModal } from '../TemplateTextarea/TemplateModal';
import styles from './index.less';
export default class Diagnosis extends Component {
  state = {
    data: [
      {
        key: -Math.random(),
      },
    ],
  };

  componentDidMount() {
    const { value } = this.props;
    if (!isEmpty(value) && !isNil(value)) {
      this.setState({
        data: map(value, (item) => {
          return {
            ...item,
            key: get(item, 'id') || get(item, 'key'),
          };
        }),
      });
    }
  }

  handleAdd = () => {
    const { data } = this.state;
    data.push({
      key: -Math.random(),
    });
    this.setState({
      data,
    });
    this.doOutData(data);
  };

  handleDelete = (item) => () => {
    const { data } = this.state;
    const newData = filter(data, (value) => get(value, 'key') !== get(item, 'key'));
    this.setState({
      data: newData,
    });
    this.doOutData(newData);
  };

  handleDiagnosisChange = (item) => (diagnosis) => {
    const { data } = this.state;
    const newData = map(data, (value) => {
      if (get(item, 'key') === get(value, 'key')) {
        return {
          ...value,
          diagnosis,
        };
      }
      return value;
    });
    this.setState({
      data: newData,
    });
    this.doOutData(newData);
  };

  handleNoteChange = (item) => (e) => {
    const { data } = this.state;
    const newData = map(data, (value) => {
      if (get(item, 'key') === get(value, 'key')) {
        return {
          ...value,
          note: get(e, 'target.value'),
        };
      }
      return value;
    });
    this.setState({
      data: newData,
    });
    this.doOutData(newData);
  };

  doOutData = (data) => {
    const { onChange } = this.props;
    onChange && onChange(data);
  };

  handleOpenModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleOk = (callBackData: string) => {
    const { data } = this.state;
    if (isArray(callBackData)) {
      let newData = [...data, ...callBackData];
      if (size(get(newData, '0')) === 1) {
        newData = slice(newData, 1);
      }
      this.setState({
        modalVisible: false,
        data: newData,
      });
      this.doOutData(newData);
      return;
    }
    this.setState({
      modalVisible: false,
      data: [
        ...data,
        {
          key: -Math.random(),
          diagnosis: callBackData.replaceAll('；', ''),
        },
      ],
    });
  };

  render() {
    const { patientId } = this.props;
    const { data, modalVisible } = this.state;
    return (
      <div>
        <Button onClick={this.handleOpenModal}>查看模板</Button>
        {map(data, (item, index) => {
          return (
            <Row key={get(item, 'key')} className={styles["diagnosis-container"]}>
              <Col className={styles["diagnosis-container__before"]} span={10}>
                <span style={{ display: 'block' }}>{index + 1}、</span>
                <DiagnosisAutoComplete value={get(item, 'diagnosis')} onChange={this.handleDiagnosisChange(item)} />
              </Col>
              <Col span={12}>
                <Input value={get(item, 'note')} onChange={this.handleNoteChange(item)} placeholder="请输入备注" />
              </Col>
              <Col span={2} className={styles["diagnosis-container__actions"]}>
                <PlusCircleOutlined onClick={this.handleAdd} />
                {index !== 0 && <DeleteOutlined onClick={this.handleDelete(item)} />}
              </Col>
            </Row>
          );
        })}
        {modalVisible && (
          <TemplateModal
            visible={modalVisible}
            onCancel={this.handleCancel}
            onOk={this.handleOk}
            patientId={patientId}
          />
        )}
      </div>
    );
  }
}
