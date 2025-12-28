import React, { useEffect, useState } from 'react';
import { AutoComplete } from 'antd';
import { get, map, includes } from 'lodash';
import { request } from '@lm_fe/utils';
import { getInputStyle } from 'src/utils';
export default function DataSelectWithOptionsOrInput(props: any) {
  const { onChange, inputProps, width, style = {}, value } = props;
  const [options, setOptions] = useState<any[]>([]);
  const [data, setData] = useState();
  const [flag, setFlag] = useState(false);
  const _style = getInputStyle({ ...props, width: width ?? style.width ?? '100%' })

  const handleChange = (data: any) => {
    onChange && onChange(data);
    setData(data);
  };
  // const handleOnFocus = async () => {
  //   const { memorieskey } = props;
  //   const memories = await request.get(`/api/text-memories?key.equals=${memorieskey}`, {
  //     headers: { isLoading: false },
  //   });
  //   let options: { label: any; value: any }[] = [];
  //   map(memories, (value, index) => {
  //     options.push({ label: value.lavel, value: value.value });
  //   });
  //   setOptions(options);
  // };
  const handleOnBlur = () => {
    if (data) {
      let optionsValues: any = [];
      map(options, (item, key) => {
        optionsValues.push(item.value);
      });
      if (!includes(optionsValues, data)) {
        setFlag(true);
      }
    }
  };
  // const handleOnKeyUp = async (e: any) => {
  //   //监听回车提交
  //   if (e.keyCode === 13) {
  //     if (e.target.value) {
  //       let optionsValues: any = [];
  //       map(options, (item, key) => {
  //         optionsValues.push(item.value);
  //       });
  //       if (!includes(optionsValues, e.target.value)) {
  //         setData(e.target.value);
  //         setFlag(true);
  //         // const { memorieskey, memoriesname } = props;
  //         // await request['post'](
  //         //   `/api/text-memories`,
  //         //   { key: memorieskey, name: memoriesname, value: e.target.value },
  //         //   {
  //         //     headers: { isLoading: false },
  //         //   },
  //         // );
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    const { memorieskey } = props;
    let memories: any = [];
    let subscribe = false;
    const getData = async () => {
      const res = await request.get(`/api/text-memories?key.equals=${memorieskey}`, {
        headers: { isLoading: false },
      });
      memories = res.data
      let options: { label: any; value: any }[] = [];
      map(memories, (value, index) => {
        options.push({ label: value.value, value: value.value });
      });
      if (!subscribe) {
        setOptions(options);
      }
    };
    getData();
    return () => {
      subscribe = true;
    };
  }, []);
  useEffect(() => {
    const { memorieskey, memoriesname } = props;
    const postData = async () => {
      await request['post'](
        `/api/text-memories`,
        { key: memorieskey, name: memoriesname, value: data },
        {
          headers: { isLoading: false },
        },
      );
    };
    if (flag) {
      postData();
    }
    // return () => {
    //   setFlag(false);
    // };
  }, [flag]);
  return (
    <AutoComplete
      // bordered={false}
      style={_style}
      {...props}
      dropdownMatchSelectWidth={get(inputProps, 'dropdownMatchSelectWidth') || 120}
      options={options || []}
      onChange={handleChange}
      value={value}
      //onFocus={handleOnFocus}
      onBlur={handleOnBlur}
    //onKeyUp={handleOnKeyUp}
    />
  );
}
