import React, { Component } from 'react';
import { Button } from 'antd';
import { PrinterOutlined, SaveOutlined } from '@/components/GeneralComponents/CustomIcon';
import toolbar from './config';
import './index.less';
export default class SoDiaoEditor extends Component {
  sde: any;
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { mode = 'DESIGN', value } = this.props;
    let sde = new window.SDE({
      el: '#editorRef',
      iframe_css_src: null,
      iframe_js_src: null, // string/Array数组 扩展js
      page_start_num: 1, // 页面起始页//默认为1
      print: {
        resettingPrint(opt, viewDom) {}, // 默认重置（包括首次设置）打印页面前触发。优先级高于render系列函数
        resetedPrint(opt, viewDom) {}, // 默认重置（包括首次设置）打印页面后触发。优先级高于render系列函数
        renderHeader(index, page) {
          return `<div style="line-height:55px;background:red;border:1px solid yellow;">这里是header</div>`;
        }, //返回要渲染的页眉。默认从零开始
        renderFooter(index, page) {
          return `<div style="line-height:35px;background:blue;border:1px solid green;"><center>第${
            index + 1
          }页<center></div>`;
        }, //返回要渲染的页脚。默认从零开始
        renderedHeader(index, count, page, header) {}, //渲染后
        renderedFooter(index, count, page, footer) {}, //渲染后
        scale: 2, //放大比例，默认2倍，越大越清晰，相应的渲染也更慢
        autoPrint: true, //是否默认打开pdfviewer即执行打印操作
        isDownload: false, //是否下载，如果为true，则不再打开pdfviewer页面
        fileName: 'SDE 测试打印', //如果isDownload=true时的pdf文件下载名称
        pageMode: 'A4', //页面模式:A3|A4|A5 ……
        width: 794, //以下默认值
        height: 1123,
        top: 72,
        right: 72,
        bottom: 72,
        left: 72,
        printMode: 'normal', // 打印模式：normal|neat|revise|comment
        ctrlMode: 'normal', // 控件模式：normal|hidden|remove
        printDirection: 'vertical', // 打印方向 vertical|horizontal
        printCssUrl: null, // 打印的样式表，可以是string，也可以是array
        printJsUrl: null, // 打印的js，可以是string，也可以是array
      },
      ctrl_remote_handle: function (data) {
        // 这里可以处理url，对url进行再加工。比如重置data.url值
        // data.url='static/sdeEditor/'+data.url;
        return data;
      },
      mode, // 默认为设计模式设计模式（DESIGN）、编辑模式（EDITOR）、严格模式STRICT、只读模式（READONLY）
      default_open_toolbar: 'sde-toolbar-editor', // 默认打开的toolbar的集合，如果不填，默认使用第一个集合
      toolbar,
    });

    sde.addListener('ready', function () {
      sde.html(value);
    });

    this.sde = sde;
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.sde && nextProps.value !== this.props.value) {
  //     this.sde.html(nextProps.value);
  //   }
  // }

  componentWillUnmount() {
    this.sde.destroy();
  }

  onPrint = () => {};

  onSave = () => {};

  render() {
    return (
      <div className="sde-wrapper">
        <div id="editorRef" className="sde-container"></div>
        <div className="right-bottom-btns">
          <Button className="case-templete-container_actions-btns" onClick={this.onPrint} icon={<PrinterOutlined />}>
            打印
          </Button>
          <Button
            type="primary"
            className="case-templete-container_actions-btns"
            onClick={this.onSave}
            icon={<SaveOutlined />}
          >
            保存
          </Button>
        </div>
      </div>
    );
  }
}
