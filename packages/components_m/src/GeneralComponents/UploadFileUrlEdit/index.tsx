import { UploadOutlined } from '@ant-design/icons';
import { mchcEnv } from '@lm_fe/env';
import { Button, Upload } from 'antd';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
export default (props: any) => {
  const { onChange, value, config } = props;
  const { url } = config;
  const [fileList, setFileList] = useState([] as any);

  useEffect(() => {
    console.log(props, 'props22334455');
    setFileList(
      value
        ? [
          {
            uid: Math.random(),
            url: value,
            name: value,
          },
        ]
        : [],
    );
  }, [value]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    get(newFileList, '0.response.url') && onChange && onChange(get(newFileList, '0.response.url'));
  };

  return (
    <Upload
      action={url}
      listType="text"
      fileList={fileList}
      onChange={handleChange}
      headers={{
        Authorization: mchcEnv.token!,
      }}
    >
      <Button disabled={fileList.length > 0} icon={<UploadOutlined />}>
        选择文件
      </Button>
    </Upload>
  );
};
