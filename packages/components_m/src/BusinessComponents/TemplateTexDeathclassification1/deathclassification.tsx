import {
  Button, Col, Form,
  Input, List, Modal, Row
} from 'antd';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

import React from 'react';
// import { Input, Space } from 'antd';
// import { AudioOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styles from './deathclassification.less';
import { LazyAntd } from '@lm_fe/components';
export default class deathclassification extends React.Component {

  refs = React.createRef();
  //   str = [];
  state = {
    data: [],
    dataList: this.props.classificationData,
    isLoading: false,
  };

  onSearch = (value) => {
    console.log('value', value.currentTarget.value);

    const { dataList } = this.state;
    const searchValue: string = value.currentTarget.value;
    let newdataList = dataList.filter((item => {
      return item.name?.search(searchValue) != -1
    }))
    this.setState({
      dataList: newdataList
    })
    if (searchValue == '') {
      this.setState({
        dataList: this.props.classificationData
      })
    }
  }
  handleChange = (value) => {
    this.setState({
      data: value
    })

  };

  onCancel = () => {
    //    let data= this.ref.current.getFieldValue('content');
    this.props.onCancel(this.props.index)
  }
  onOk = () => {
    this.props.onOk(this.props.index, this.state.data)
  }

  render() {
    let { isLoading } = this.state

    return (
      <Modal
        title={<div style={{ fontWeight: '700' }}>{this.props.index == 'children' ? '儿童死亡死因分类编号' : '孕妇孕死亡死因分类选择'}</div>}
        visible={this.props.visible}
        width="708px"
        // footer={null}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <div className={styles["content"]}>
          <div className={styles["above"]}>
            <Form ref={this.ref}>
              <Row>
                <Col span={21}>
                  <Form.Item label="分类编号">
                    <Select
                      // allowClear
                      // onChange={this.state.clear}
                      mode="tags"
                      className={styles["highrisk-factor"]}
                      value={this.props.str}
                      onChange={this.handleChange}
                      onDeselect={this.props.onDeselect}
                    // onSearch={this.onSearch}
                    >

                    </Select>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Button size={'middle'} style={{ marginLeft: '-155px' }} onClick={this.props.ificationReset}>
                    重置
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col span={13} push={3} style={{ marginLeft: '-18px' }}>
                  <Input placeholder="输入模糊查询" style={{ width: '367px' }} onPressEnter={this.onSearch} />
                </Col>
                {/* <Col span={3} style={{ marginLeft: '86px' }}>
                  <Button size={'middle'}>全部收起</Button>
                </Col>
                <Col span={3} style={{ marginLeft: '3px' }}>
                  <Button size={'middle'}>全部展开</Button>
                </Col> */}
              </Row>
            </Form>
          </div>
          <div className={styles["below"]}>
            {isLoading ?
              <Spin tip="数据加载中...">
                <div style={{ height: 128 }} />
              </Spin> :
              <List
                style={{ overflow: 'scroll', height: '430px' }}
                size="small"
                split={false}
                bordered={false}
                dataSource={this.state.dataList}
                renderItem={(item, index) => (
                  <List.Item onClick={this.props.listClick} index={item.no} style={{ fontWeight: '700px' }}>

                    {index < 10 ? '0' + (index + 1) + item.name : (index + 1) + item.name}
                  </List.Item>
                )}
              />
            }
          </div>
        </div>
      </Modal>
    );
  }
}
