import { mchcEnv } from '@lm_fe/env';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { get } from 'lodash';
import React, { useState } from 'react';
interface IProps {
    onChange?(v: any): void,
    value?: any,
    form: any,
    actionApi: any,
    outputParamType: any,
}
export default ({ onChange, value, form, actionApi, outputParamType }: IProps) => {
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
                    url: getImageAddress() + value,
                },
            ]);
        }
    }, [value]);

    // 查看图片
    const getImageAddress = () => {
        let address = '';
        if (process.env.NODE_ENV === 'development') {
            // address = 'http://47.106.199.237:3351/'
            address = 'https://47.106.199.237';
        } else {
            // address = window.location.host
            address = '';
        }
        return address;
    };

    const handleChange = ({ fileList: newFileList, file }) => {
        if (outputParamType == 'new') {
            form && form.setFieldsValue({ imageName: get(newFileList, '0.response.data.imageName') });
            onChange?.(getImageAddress() + get(newFileList, '0.response.data.imageAddress'));
        } else {
            onChange?.(get(newFileList, '0.response.url'));
        }
        setFileList(newFileList);
    };

    const onPreview = async (file) => {
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
        const imgWindow = window.open(src)!;
        imgWindow.document.write(image.outerHTML);
    };
    return (
        <ImgCrop rotate aspect={1.5} minZoom={0.2} maxZoom={4}>
            <Upload
                // action="/api/uploadImage"
                action={actionApi}
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
