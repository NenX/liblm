import React, { Component } from 'react';
import { Upload } from 'antd';
import store from 'store';
import { get } from 'lodash';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module';
import 'react-quill/dist/quill.snow.css';
import './index.less';
import { getMacroValue, mchcEnv, mchcLogger } from '@lm_fe/env';
mchcLogger.log('quill !!!!')


Quill.register('modules/ImageResize', ImageResize);
const modules = {
  toolbar: [
    [{ size: [] }],
    // [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }, { align: [] }],
    // [{ list: 'ordered' }, { indent: '-1' }, { indent: '+1' }],
    [{ list: 'ordered' }],
    ['link', 'image', 'video'],
    // ['clean'],
  ],
  ImageResize: {},
};
const formats = [
  'size',
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'color',
  'background',
  'align',
  'list',
  'indent',
  'link',
  'image',
  'video',
  'clean',
];
export default class MobileEditor extends Component {
  uploadRef: any;
  quillRef: any;

  constructor(props) {
    super(props);
    console.log({ props });
    this.state = {
      value: get(props, 'value'),
    };
  }

  componentDidMount() {
    const quillEditor = this.quillRef.getEditor();
    const quillEditorToolbar = quillEditor.getModule('toolbar');
    quillEditorToolbar.addHandler('image', () => {
      this.uploadRef.click();
    });
  }

  handleChange = (data) => {
    const { onChange } = this.props;
    onChange && onChange(data);
  };

  handleUploadImage = (data) => {
    if (get(data, 'file.status') === 'done') {
      const imageUrl: string = get(data, 'file.response.url');
      const absUrl = imageUrl.startsWith('http') ? imageUrl : `${getMacroValue('API_PREFIX')}${imageUrl}`.replace(/\/+/g,'/')
      const quillEditor = this.quillRef.getEditor();
      let range = quillEditor.selection.savedRange.index;
      if (range || range == 0) {
        quillEditor.insertEmbed(range, 'image', absUrl);
      }
      quillEditor.setSelection(quillEditor.getSelection().index + 1);
    }
  };

  render() {
    const { value } = this.state;

    return (
      <div className="mobile-editor">
        <ReactQuill
          ref={(ref) => {
            this.quillRef = ref;
          }}
          className="mobile-editor_quill"
          theme="snow"
          modules={modules}
          defaultValue={value}
          onChange={this.handleChange}
          formats={formats}
        />
        <div style={{ display: 'none' }}>
          <Upload
            action={`${getMacroValue('API_PREFIX')}/api/uploadImage`.replace(/\/+/g,'/')}
            listType="text"
            accept=".png,.jpg,.jpeg,gif,.svg"
            onChange={this.handleUploadImage}
            headers={{
              Authorization: mchcEnv.token!,
            }}
          >
            <span
              ref={(ref) => {
                this.uploadRef = ref;
              }}
            ></span>
          </Upload>
        </div>
      </div>
    );
  }
}
