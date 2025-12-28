import { UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { SMchc_TemplateTrees } from '@lm_fe/service';
import { Button, Input, message, Modal, Tabs } from 'antd';
import { get, isString, map, omit, set, size } from 'lodash';
import { Component } from 'react';
import TemplateTree from '../TemplateTree';
import styles from './index.module.less';
import React from 'react';
export default class Index extends Component {
  state = {
    activeKey: '1',
    allDiagnosesTemplate: [],
  };

  componentDidMount() {
    this.getDiagnosesTemplate('');
  }

  getDiagnosesTemplate = async (value: string) => {
    const res = await SMchc_TemplateTrees.getDiagnosesTemplate(value);
    this.setState({ allDiagnosesTemplate: res });
  };

  handleChangeTab = (activeKey: string) => {
    this.setState({ activeKey });
  };

  handleChange = async (value: string) => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getDiagnosesTemplate(value);
    }, 500);
  };

  handleSearch = (item: any) => {
    const { closeTemplate, addDiag } = this.props as any;
    if (item) {
      if (!isString(item) && size(item.children) > 0) return;
      if (isString(item)) {
        addDiag({ diagnosis: item });
      } else {
        set(item, 'diagnosis', get(item, 'val'));
        addDiag(omit(item, ['id']));
      }
      closeTemplate();
    }
  };

  handleCancel = () => {
    const { closeTemplate } = this.props as any;
    closeTemplate();
  };

  handleAddIcon = async (item: any, type: number) => {
    const { basicInfo } = this.props as any;
    delete item.id;
    set(item, 'pid', 0);
    set(item, 'type', type);
    if (type === 2) {
      set(item, 'depid', type);
    } else {
      set(item, 'userid', get(basicInfo, 'id'));
    }
    await SMchc_TemplateTrees.addTemplateTree(item);
    message.info('同步成功！');
  };

  render() {
    const { isShowDiagnosesTemplate, basicInfo, diagnosesWord } = this.props;
    const { allDiagnosesTemplate, activeKey } = this.state;

    return (
      <Modal
        centered
        title="添加诊断"
        className={styles["diag-template"]}
        footer={null}
        visible={isShowDiagnosesTemplate}
        onCancel={this.handleCancel}
      >
        <Input.Search
          className={styles["diag-ipt"]}
          placeholder="请输入诊断信息"
          enterButton="添加诊断"
          defaultValue={diagnosesWord}
          onChange={(e) => this.handleChange(e.target.value)}
          onSearch={this.handleSearch}
        />
        <Tabs activeKey={activeKey} onChange={this.handleChangeTab}>
          <Tabs.TabPane tab={<Button className={styles["list-btn"]}>全部</Button>} key="1">
            {map(allDiagnosesTemplate, (item) => (
              <p className={styles["diag-item"]}>
                <span onClick={() => this.handleSearch(item)}>
                  {get(item, 'code') ? '（icd）' : null}
                  {get(item, 'val')}
                </span>
                <UsergroupAddOutlined
                  className={styles["diag-icon"]}
                  title="同步到科室诊断"
                  onClick={() => this.handleAddIcon(item, 2)}
                />
                <UserAddOutlined
                  className={styles["diag-icon"]}
                  title="同步到个人诊断"
                  onClick={() => this.handleAddIcon(item, 3)}
                />
              </p>
            ))}
          </Tabs.TabPane>
          (
          <Tabs.TabPane tab={<Button className={styles["list-btn"]}>科室</Button>} key="2">
            {activeKey === '2' && (
              <TemplateTree
                type={2}
                depid={2}
                checkable={false}
                onSelected={this.handleSearch}
                editable={true}
                showIcd={true}
              />
            )}
          </Tabs.TabPane>
          ) (
          <Tabs.TabPane tab={<Button className={styles["list-btn"]}>个人</Button>} key="3">
            {activeKey === '3' && (
              <TemplateTree
                type={3}
                userid={get(basicInfo, 'id')}
                checkable={false}
                onSelected={this.handleSearch}
                editable={true}
                showIcd={true}
              />
            )}
          </Tabs.TabPane>
          )
        </Tabs>
      </Modal>
    );
  }
}
