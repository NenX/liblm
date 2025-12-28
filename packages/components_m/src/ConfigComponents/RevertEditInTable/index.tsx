import { Input } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
// import './index.less';

const table_label = [
  '检测孕周/时间',
  '病毒载量(拷贝/ ml)',
  '白细胞计数(x 10^9/L)',
  '总淋巴细胞计数(x 10^9/L)',
  '血小板计数(x 10^9/L)',
  '血红蛋白(g/L)',
  '谷丙转氨酶(ALT)(u/L)',
  '谷草转氨酶(AST)(u/L)',
  '总胆红素(T.BIL)(μmol/L)',
  '血肌酐(μmol/L)',
  '血尿素氮(mmol/L)',
  'CD4细胞计数（个/mm3）',
  'CD8细胞计数（个/mm3）',
];

const table_key = [
  'alt',
  'ast',
  'bc',
  'bun',
  'cd4',
  'cd8',
  'lymphocytes',
  'mcv',
  'plt',
  'relatedTestingGestationalAge',
  'tbil',
  'viralLoad',
  'wbc',
];

const head_line = ['相关检测', '检测结果', '检测结果', '检测结果', '检测结果'];

export default function DataSelectWithOptionsOrInput(props: any) {
  const { onChange, value } = props;
  const [options, setOptions] = useState<any[]>([]);
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);
  const [values, setValues] = useState({});

  const handleChange = (e: any, key: string, row: string) => {
    console.log(e, 'e');
    const firstObj = {};
    const secondObj = {};
    const thirdObj = {};
    const fourObj = {};
    const tempData: any = [{ ...firstObj }, { ...secondObj }, { ...thirdObj }, { ...fourObj }];
    // let res: {} = await request.get(
    //   `/api/women/healthcare/knowledge/getWomenHealthcareKnowledgePage/page?sort=id,desc&page=0&size=999&deleteFlag.equals=0&releaseType.equals=1&type.equals=${Number(
    //     data,
    //   )}`,
    //   {
    //     headers: { isLoading: false },
    //   },
    // );
    // let listData = get(res, 'data.pageData');
    // const tempData = cloneDeep(values);
    // setKnowledgeList(listData);
    // set(tempData, 'type', data);
    // setValues(tempData);
    onChange && onChange(tempData);
  };

  useEffect(() => {
    !isEmpty(value) && setValues(value);
  }, [value]);

  return (
    <>
      <div>
        <div className="lable-container">
          <div>{head_line[0]}</div>
          {table_label.map((_, index) => {
            return (
              <div className="label" key={index}>
                {_}
              </div>
            );
          })}
        </div>
        <div className="key-contaner">
          <div>{head_line[1]}</div>
          {table_key.map((key, index) => {
            return <Input placeholder="Basic usage" onChange={(e) => handleChange(e, key, 'first')} />;
          })}
        </div>
        <div className="key-contaner">
          <div>{head_line[2]}</div>
          {table_key.map((key, index) => {
            return <Input placeholder="Basic usage" onChange={(e) => handleChange(e, key, 'second')} />;
          })}
        </div>
        <div className="key-contaner">
          <div>{head_line[3]}</div>
          {table_key.map((key, index) => {
            return <Input placeholder="Basic usage" onChange={(e) => handleChange(e, key, 'third')} />;
          })}
        </div>
        <div className="key-contaner">
          <div>{head_line[4]}</div>
          {table_key.map((key, index) => {
            return <Input placeholder="Basic usage" onChange={(e) => handleChange(e, key, 'four')} />;
          })}
        </div>
      </div>
    </>
  );
}
