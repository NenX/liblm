import React from 'react';
import { message, Row, Col, Button, Popconfirm, Input } from 'antd';
import { get, cloneDeep, set } from 'lodash';
import { CustomIcon, } from '../../GeneralComponents/CustomIcon';
import { PlusCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs';
import Template from './template';
import styles from './index.module.less';
class Index extends React.Component {
  state = {
    isShowDiagnosesTemplate: false,
  };

  getTitle = (item: any) => {
    const createdDate = item.createDate ? `诊断时间: ${item.createDate}\n` : '';
    const diagnosis = item.diagnosis ? `诊断全称: ${item.diagnosis}\n` : '';
    const note = item.note ? `诊断备注: ${item.note}\n` : '';
    return `${createdDate}${diagnosis}${note}`;
  };

  handleDelete = async (item: any, i: number) => {
    const { value, onChange } = this.props as any;
    const newList = cloneDeep(get(value, 'list'));
    newList.splice(i, 1);
    onChange({ ...value, list: newList });
  };

  changeNote = (v: string, i: number) => {
    const { value, onChange } = this.props as any;
    const newList = cloneDeep(get(value, 'list'));
    const item = newList[i];
    item.note = v;
    onChange({ ...value, list: newList });
  };

  handleBtnClick = () => {
    this.setState({
      isShowDiagnosesTemplate: true,
    });
  };

  addDiag = async (diagnosisObj: any) => {
    const { value, onChange } = this.props as any;
    const list = get(value, 'list') || [];
    const diag = get(diagnosisObj, 'diagnosis');
    if (list.filter((item: any) => item.diagnosis === diag).length === 0) {
      const newList = cloneDeep(list);
      set(diagnosisObj, 'createDate', dayjs().format('YYYY-MM-DD'));
      set(diagnosisObj, 'diagnosisCode', get(diagnosisObj, 'code'));
      // 诊断互斥项
      const specialList = ['妊娠', '早孕', '中孕', '晚孕'];
      let specialIndex = -1;
      newList.forEach((item: any, index: any) => {
        if (specialList.includes(item.diagnosis)) specialIndex = index;
      });
      if (specialIndex !== -1 && specialList.includes(diag)) {
        newList.splice(specialIndex, 1);
        newList.unshift(diagnosisObj);
      } else if (specialIndex === -1 && specialList.includes(diag)) {
        newList.unshift(diagnosisObj);
      } else {
        newList.push(diagnosisObj);
      }
      // 对诊断进行排序，sort赋值
      newList.forEach((subItem: any, subIndex: number) => {
        subItem.sort = subIndex + 1;
      });

      onChange({ ...value, list: newList });
    } else {
      message.warning('添加诊断重复！');
    }
  };

  closeTemplate = () => {
    this.setState({
      isShowDiagnosesTemplate: false,
    });
  };

  renderDiagnoses = () => {
    const { isAllPregnancies, value, id, isShow } = this.props as any;
    return (
      <div className={styles["diagWrapper"]}>
        {!isAllPregnancies && (
          <Button className={styles["diag-btn"]} icon={<PlusCircleOutlined />} onClick={this.handleBtnClick}>
            添加诊断
          </Button>
        )}
        {!isShow && (
          <div className={styles["firstDiag"]}>
            <span className={styles["diagNum"]}>1、</span>G<span className={styles["diagGP"]}>{get(value, 'gravidity')}</span>P
            <span className={styles["diagGP"]}>{get(value, 'parity')}</span>
            妊娠
            {
              <>
                <span className={styles["diagGP diagWeek"]}>{get(value, 'gestationalWeek')}</span>周
              </>
            }
            {id === 'inductionLabourDiagnosisDocument' && (
              <span>
                <span className={styles["diagGP diagWeek2"]}>
                  {get(value, 'fetalPostion') ? (
                    get(value, 'fetalPostion')
                  ) : (
                    <span style={{ color: '#ccc' }}>胎方位</span>
                  )}
                </span>{' '}
                ,引产
              </span>
            )}
          </div>
        )}

        {get(value, 'list') &&
          get(value, 'list').map((item: any, i: number) => (
            <Row className={styles["singleDiag"]} title={this.getTitle(item)} key={i}>
              <Col span={18} className={styles["diagWord"]}>
                <span className={styles["diagNum"]}>{!isShow ? i + 2 : i + 1}、</span>
                <span className={styles["diag-words"]}>{item.diagnosis}</span>
                <Input
                  className={styles["diagNote"]}
                  placeholder="备注"
                  disabled={isAllPregnancies ? true : false}
                  value={item.note}
                  onChange={(e) => this.changeNote(e.target.value, i)}
                />
              </Col>
              <Col span={4}>{item.createDate}</Col>
              {!isAllPregnancies && (
                <Col span={1}>
                  <Popconfirm
                    placement="topRight"
                    title={'你确定要删除这个诊断吗？'}
                    onConfirm={() => this.handleDelete(item, i)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <CustomIcon className={styles["delBtn"]} type="icon-cacncel" />
                  </Popconfirm>
                </Col>
              )}
            </Row>
          ))}
      </div>
    );
  };

  render() {
    const { isShowDiagnosesTemplate } = this.state;
    return (
      <div>
        {this.renderDiagnoses()}
        {isShowDiagnosesTemplate && (
          <Template
            isShowDiagnosesTemplate={isShowDiagnosesTemplate}
            closeTemplate={this.closeTemplate}
            addDiag={this.addDiag}
            {...this.props}
          />
        )}
      </div>
    );
  }
}
export default Index;
