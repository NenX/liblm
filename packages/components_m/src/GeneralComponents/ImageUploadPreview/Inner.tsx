import React, { useState } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { get } from 'lodash';
import { mchcEnv } from '@lm_fe/env';
export default ({ onChange, value, disabled }: { onChange?(v: any): void, value?: any, disabled?: boolean }) => {
  const [fileList, setFileList] = useState<any[]>([]);

  React.useEffect(() => {
    // let imgUrl = value;
    // if (value && value.includes('?')) {
    //   const arr = value.split('?');
    //   console.log('----789----', arr);
    //   imgUrl = arr[0];
    // }
    if (value) {
      setFileList([
        {
          uid: -new Date().getTime(),
          name: 'image.png',
          status: 'done',
          url: value,
        },
      ]);
    }
  }, [value]);

  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    onChange && onChange(get(newFileList, '0.response.url'));
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <ImgCrop rotate aspect={1.5}>
      <Upload
        disabled={disabled}
        action="/api/uploadImage"
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        onPreview={onPreview}
        headers={{
          Authorization: mchcEnv.token!,
        }}
      >
        {fileList.length < 1 && '+ 点击上传'}
      </Upload>
    </ImgCrop>
  );
};
