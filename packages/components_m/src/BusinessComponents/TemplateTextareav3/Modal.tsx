// 出生缺陷诊断管理
import { CustomIcon } from '../../GeneralComponents/CustomIcon';
import { CloseOutlined } from '@ant-design/icons'
import {
  Input, List, Modal, Timeline
} from 'antd';
import { get } from 'lodash';
import React from 'react';
import styles from './Modal.less';
const { Search } = Input;
export default class modal extends React.Component {
  refs = React.createRef();
  str = [];
  state = {
    data: [],
  };
  render() {
    this.str = get(this.props, 'inputValue');

    return (
      <Modal
        title={
          <div>
            <CustomIcon type={'icon-doctor'} style={{ color: '#150F55', fontSize: '24px', marginRight: '10px' }} />
            <span style={{ color: '#150F55', fontSize: '16px', fontWeight: 500 }}>出生缺陷诊断管理</span>
          </div>
        }
        visible={get(this.props, 'visible')}
        onCancel={() => this.props.onCancel(this.str)}
        width="800px"
        footer={null}
        className={styles["modal_"]}
      >
        <div>
          <Search
            placeholder="请输入诊断信息"
            allowClear
            enterButton="添加诊断"
            size="large"
            defaultValue={''}
            onSearch={this.props.onSearch}
            style={{ width: '50%' }}
          />
        </div>
        <div style={{ display: 'flex', width: '100%', height: '460px' }}>
          <div style={{ width: '50%' }}>
            <List
              style={{ overflow: 'scroll', height: '468px' }}
              size="small"
              split={false}
              bordered={false}
              dataSource={get(this.props, 'data')}
              renderItem={(item) => (
                <List.Item onClick={(e) => this.props.listClick(e, get(item, 'supplement'), get(item, 'no'), get(item, 'code'))}>
                  {get(item, 'name')}
                </List.Item>
              )}
            />
          </div>
          <div style={{ flex: '1', paddingLeft: '10px', paddingRight: '10px' }}>
            <p>已选诊断</p>

            <div style={{ overflow: 'auto', height: '447px' }}>
              <ol type="I">
                {Array.isArray(this.str) &&
                  this.str.length > 0 &&
                  this.str.map((item, index) => {
                    return get(item, 'supplement') == true ? (
                      <li className={styles["Listitem"]}>
                        <Timeline>
                          <Timeline.Item color="#fff" className={styles["lis"]}>
                            {get(item, 'name')}
                            <span className={styles["delete"]} onClick={() => this.props.deleteinputValue(get(item, 'name'))}>
                              <CloseOutlined />
                            </span>
                          </Timeline.Item>

                          <Timeline.Item color="#ccc">
                            <Input
                              defaultValue={get(item, 'item')}
                              placeholder={get(item, 'name') == '其他' ? '请输入病因并详细描述' : '请输入类型'}
                              style={{ width: '70%' }}
                              onChange={(value) => this.props.InputChange(value, get(item, 'name'))}
                            />
                            {/* 病因并详细描述 */}
                          </Timeline.Item>
                        </Timeline>
                      </li>
                    ) : (
                      <li className={styles["Listitem lis lisborder"]} style={{ marginLeft: '25px' }}>
                        {get(item, 'name')}
                        <span className={styles["delete"]} onClick={() => this.props.deleteinputValue(get(item, 'name'))}>
                          <CloseOutlined />
                        </span>
                      </li>
                    );
                  })}
              </ol>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
