import { Button } from 'antd';
import { get } from 'lodash';
import React, { Component } from 'react';
import { defaultToolbars } from './config';
import './index.less';
import { PrinterOutlined, SaveOutlined } from '@ant-design/icons';
import { appEnv } from '@lm_fe/utils';
interface IProps {
  onSave: any;
  content?: any;
  containerProps?: any;
  toolbars?: any;
  mode?: 'DESIGN' | 'EDITOR' | 'STRICT' | 'READONLY';
  hiddenButton?: boolean;
}
export default class CaseTempleteEdit extends Component<IProps> {
  editRef: any;

  componentDidMount() {
    window.apiToken = appEnv.token;
    this.initSDE();
  }

  componentDidUpdate() {
    if (this.props.content) {
      this.initSDE();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.content === this.props.content) {
      return false;
    }
    return true;
  }

  initSDE = () => {
    const { toolbars, content, mode, containerProps } = this.props;
    var sde = (window.sde = new window.SDE({
      el: this.editRef,
      mode,
      iframe_css_src: '/lib/sde/index.css',
      page_start_num: 1,
      ctrl_remote_handle: function (data) { },
      default_open_toolbar: 'sde-toolbar-tools',
      toolbars: toolbars || defaultToolbars,
    }));
    sde.addListener('ready', function () {
      sde.html(content);
    });
    window.sde = sde;
    const editorElement = document.getElementsByClassName('sde-editor')[0];
    editorElement.style.height = `${get(containerProps, 'height') - 143}px`;
    if (mode === 'STRICT') {
      const toolbarElement = document.getElementsByClassName('sde-toolbars')[0];
      toolbarElement.style.display = 'none';
      editorElement.style.height = `${get(containerProps, 'height')}px`;
    }
  };

  handleSave = () => {
    const { onSave } = this.props;
    const content = window.sde.html();
    onSave && onSave(content);
  };

  handlePrint = () => {
    window.sde.execCommand('print');
  };

  render() {
    const { hiddenButton } = this.props;
    return (
      <div id="case-templete-container" className="case-templete-container">
        <div
          className="sde-container"
          key={Math.random()}
          ref={(refNode) => {
            this.editRef = refNode;
          }}
        ></div>
        {/* <div className="case-templete-container_actions"> */}
        {!hiddenButton && (
          <div className="right-bottom-btns">
            <Button
              className="case-templete-container_actions-btns"
              onClick={this.handlePrint}
              icon={<PrinterOutlined />}
            >
              打印
            </Button>
            <Button
              type="primary"
              className="case-templete-container_actions-btns"
              onClick={this.handleSave}
              icon={<SaveOutlined />}
            >
              保存
            </Button>
          </div>
        )}
      </div>
    );
  }
}
