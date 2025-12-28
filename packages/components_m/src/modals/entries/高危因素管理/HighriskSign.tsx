import { ICommonOption, mchcConfig, mchcEnv } from '@lm_fe/env';
import {
  IMchc_Doctor_OutpatientHeaderInfo,
  IMchc_HighriskGradeConfig,
  IMchc_TemplateTree_Item
} from '@lm_fe/service';
import { Button, Col, Input, Row, Space } from 'antd';
import { DataNode } from 'antd/lib/tree';
import {
  cloneDeep, findIndex,
  get,
  includes,
  isEmpty,
  keyBy,
  keys,
  map,
  sortBy,
  split
} from 'lodash';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MyCheckbox, MySelect } from '../../../FU_components';
import { HighRiskGradeSelectPure } from '../../../doctor-end';
import styles from './index.module.less';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const boundSymbol = ':';
interface IProps {
  headerInfo?: IMchc_Doctor_OutpatientHeaderInfo
  gradeOptions: IMchc_HighriskGradeConfig[]
  contagionOptions: ICommonOption[]
  highriskTreeData: IMchc_TemplateTree_Item[]
  initData?: IMchc_Doctor_OutpatientHeaderInfo
  set_initData(v?: IMchc_Doctor_OutpatientHeaderInfo): void
}
export function HighriskSign_高危因素管理(props: IProps) {
  const { headerInfo, gradeOptions, contagionOptions, highriskTreeData, initData, set_initData } = props
  const highRiskTreeDataMapping = useRef<{ [x: string]: IMchc_TemplateTree_Item }>({})



  const [currentTreeData, set_currentTreeData] = useState<IMchc_TemplateTree_Item[]>([])

  const [expandedKeys, set_expandedKeys] = useState<string[]>([])
  const [searchValue, set_searchValue] = useState('')
  const [selectTree, set_selectTree] = useState<IMchc_TemplateTree_Item[]>([])
  const multiple = mchcEnv.in(['广三', '建瓯', '郫都']) ? true : false




  function getInitData(_h = headerInfo) {
    if (!_h) return _h
    const grade = _h?.highriskLable || _h?.highriskGrade || ''
    const _data: IMchc_Doctor_OutpatientHeaderInfo = {
      ..._h,
      infectionNote: _h?.infectionNote ?? '',
      highriskNote: _h?.highriskNote ?? '',
      highriskGrade: grade,
      highriskLable: grade,
    }
    return _data
  }

  useEffect(() => {
    (async () => {

      // const gradeDic = initDictionaries.filter((item) => item.key === 'highriskGrade' && item.type === highriskVersion);

      if (headerInfo) {
        highRiskTreeDataMapping.current = keyBy(highriskTreeData, 'id');



        const highriskNote_ = headerInfo.highriskNote?.split?.(',')?.filter(_ => _) ?? [];
        let _selectTree: IMchc_TemplateTree_Item[] = [];
        highriskNote_.map((item) => {
          map(highRiskTreeDataMapping.current, (v, i) => {
            const addNote = getTargetNote(v)
            if (item == addNote) {
              _selectTree.push(v);
            }
          });
        });



        set_selectTree(_selectTree)
        set_expandedKeys(Object.keys(highRiskTreeDataMapping.current))
        set_initData(getInitData())

      }

      set_currentTreeData(highriskTreeData)
    })()

    return () => {

    }
  }, [highriskTreeData, headerInfo])



  function handleChange(value: string[]) {

    const _selectTree: IMchc_TemplateTree_Item[] = [];
    map(value, (str) => {
      map(highRiskTreeDataMapping.current, (v, i) => {
        const addNote = getTargetNote(v)
        if (str == addNote) {
          _selectTree.push(v);
        }
      });
    });
    calAndSetData(_selectTree, value)
    set_selectTree(_selectTree)
  }




  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const searchValue: string = get(e, 'target.value');
    const { treeData, expandedKeys } = searchTreeData(searchValue, highriskTreeData);
    set_currentTreeData(!!searchValue ? treeData : highriskTreeData)
    set_expandedKeys(!!searchValue ? expandedKeys : [])
    set_searchValue(searchValue)

  };

  function searchTreeData(value: string, __highriskTreeData: IMchc_TemplateTree_Item[]) {
    const expandedKeys: string[] = [];
    const treeData: any = [];
    const searchValueArr = split(value, ',') || [];
    while (searchValueArr.length > 0) {
      let searchValue = searchValueArr[0];
      if (!searchValue) {
        searchValueArr.shift();
        continue;
      }
      __highriskTreeData.map((item) => {
        const val = item.val || '';
        const mnemonic = item.mnemonic || '';
        let pid = item.pid;
        const id = item.id;
        if (
          (val.indexOf(searchValue) > -1 || mnemonic.indexOf(searchValue) > -1) &&
          pid === 0 &&
          !includes(expandedKeys, String(item.id))
        ) {
          treeData.push(item);
          expandedKeys.push(String(item.id));
          map(__highriskTreeData, (subItem) => {
            if (subItem.pid === id && !includes(expandedKeys, String(subItem.id))) {
              treeData.push(subItem);
              expandedKeys.push(String(subItem.id));
            }
          });
        } else if (
          searchValue &&
          val.indexOf(searchValue) > -1 &&
          pid !== 0 &&
          !includes(expandedKeys, String(item.id))
        ) {
          treeData.push(item);
          expandedKeys.push(String(item.id));
          while (pid != 0) {
            let bool = false;
            map(__highriskTreeData, (subItem) => {
              if (subItem.id === pid && !includes(expandedKeys, String(subItem.id))) {
                treeData.push(subItem);
                expandedKeys.push(String(subItem.id));
                pid = subItem.pid;
                bool = true;
              }
            });
            if (!bool) pid = 0;
          }
          const id = get(item, 'id').toString();
          searchValueArr.push(id);
        } else if (searchValue === get(item, 'pid')?.toString()) {
          if (findIndex(treeData, (treeValue) => get(treeValue, 'id') == get(item, 'id')) == -1) {
            treeData.push(item);
          }
        }
      });
      searchValueArr.shift();
    }
    const sortTreeData = sortBy(treeData, (item: any) => get(item, 'id'));
    return { treeData: sortTreeData, expandedKeys };
  }



  function handleSelectHighrisk(values: any[], e: any) {
    let arr: IMchc_TemplateTree_Item[] = []


    values.forEach(k => {
      const _item = highRiskTreeDataMapping.current[k]
      SelectOne(_item, arr)
    })

    calAndSetData(arr)
    set_selectTree([...arr])
  };

  function SelectOne(_item: IMchc_TemplateTree_Item, selectArr: IMchc_TemplateTree_Item[]) {

    const isIn = selectArr.find(_ => _.id === _item?.id)
    if (isIn) return
    const pid = _item?.pid;
    if (!pid) return;

    //------
    const ind = selectArr.findIndex(_ => _.pid == _item?.pid);
    const isBrotherIn = ind != -1

    if (isBrotherIn && !multiple) {
      selectArr.splice(ind, 1, _item);
    } else {
      selectArr.push(_item);
    }



  };
  function calAndSetData(selectArr: IMchc_TemplateTree_Item[], nodeArr?: string[]) {
    let _addNoteArr: string[] = [],
      __highriskGrade = '';
    let selectTree_ = cloneDeep(selectArr);
    selectTree_.map((_) => {
      let code = _.code;
      const addNote = getTargetNote(_)
      if (!includes(_addNoteArr, addNote)) {
        _addNoteArr.push(addNote);
      }
      if (__highriskGrade == '' || code > __highriskGrade) {
        __highriskGrade = code;
      }
    });
    console.log('_addNoteArr', _addNoteArr)
    set_initData(
      Object.assign(
        {},
        initData,
        {
          highriskGrade: __highriskGrade,
          highriskNote: (nodeArr ?? _addNoteArr ?? []).join(','),
        }
      )
    )
  }

  function transferHighRiskData(data: IMchc_TemplateTree_Item[], pid = 0) {
    const treeData: DataNode[] = [];
    data.map((item) => {
      if (item.pid === pid) {
        const _item: DataNode = { ...item, key: String(item.id) }

        _item.title = item.val;
        _item.children = transferHighRiskData(data, item.id);
        if (isEmpty(_item.children)) {
          _item.isLeaf = true;
        } else {
          _item.isLeaf = false;
        }
        treeData.push(_item);
      }
    });
    return treeData;
  };

  function handleExpend(expandedKeys: any) {
    set_expandedKeys(expandedKeys)

  };

  function handleReset() {
    set_initData(
      Object.assign(
        {},
        initData,
        {
          highriskGrade: '',
          highriskNote: '',
          infectionNote: '',
        }
      )
    )
    set_selectTree([])

  };





  function getGradeColor(grade: any) {
    grade = grade ?? 'I';

    const target = gradeOptions.find(_ => _.label === grade)
    return target?.colorText;
  };

  function renderColorSpan(label: string) {
    return <span
      style={{
        background: getGradeColor(label),
        display: 'inline-block',
        width: '12px',
        height: '12px',
        margin: '0 10px',
      }}
    ></span>
  }

  function renderTree({ treeData, expandedKeys }: { treeData?: DataNode[], expandedKeys: string[] }) {
    return (
      <Tree
        multiple
        showLine={{ showLeafIcon: false }}
        treeData={treeData}
        onSelect={handleSelectHighrisk}
        onExpand={handleExpend}
        expandedKeys={expandedKeys}
        selectedKeys={selectTree.map(_ => _.id.toString())}
        titleRender={(treeNode) => {
          return (
            <div>
              {treeNode.children?.length == 0 && (
                renderColorSpan(treeNode.code)
              )}
              {get(treeNode, `title`)}
            </div>
          );
        }}
      />
    );
  };

  function renderhiskTree() {

    const treeData__ = transferHighRiskData(currentTreeData);

    const highriskVersion = mchcConfig.get('highriskVersion')

    if (highriskVersion === 23
      || mchcEnv.is('华医')
      || mchcEnv.is('南医增城')
    ) {
      return renderTree({ treeData: treeData__, expandedKeys });
    } else {
      return (
        <Row className={styles["row-content"]} key={searchValue ? searchValue : currentTreeData.length}>
          <Col span={7}>
            <div className={styles["tree-title"]}>{get(treeData__, `[0].title`)}</div>
            <div className={styles["col-content"]}>
              {renderTree({ treeData: get(treeData__, `[0].children`), expandedKeys })}
            </div>
          </Col>
          <Col span={7}>
            <div className={styles["tree-title"]}>{get(treeData__, `[1].title`)}</div>
            <div className={styles["col-content"]}>
              {renderTree({ treeData: get(treeData__, `[1].children`), expandedKeys })}
            </div>
          </Col>
          <Col span={7}>
            <div className={styles["tree-title"]}>{get(treeData__, `[2].title`)}</div>
            <div className={styles["col-content"]}>
              {renderTree({ treeData: get(treeData__, `[2].children`), expandedKeys })}
            </div>
          </Col>
          {/* {
            treeData.map((_: any) => {
              return <Col span={7}>
                <div className={styles["tree-title"]}>{get(_, `title`)}</div>
                <div className={styles["col-content"]}>
                  {renderTree({ treeData: get(_, `children`), expandedKeys })}
                </div>
              </Col>
            })
          } */}
        </Row>
      );
    }
  };
  function getTargetNote(v: IMchc_TemplateTree_Item) {
    const p = get(highRiskTreeDataMapping.current, v.pid)
    const addNote = `${p?.val}${boundSymbol}${v?.val}`;

    return addNote
  }

  const isAppendCheck = !!initData?.infectionNote && contagionOptions.every(_ => _.value !== initData?.infectionNote)
  return (

    <div className={styles["highrisk-sign"]}>
      <div className={styles["highrisk-sign-header"]}>
        <Row gutter={8}>
          <Col span={2}>高危等级:</Col>
          <Col span={6}>
            <HighRiskGradeSelectPure
              onChange={v => {
                set_initData(
                  Object.assign({}, initData, { highriskGrade: v })
                )

              }}
              value={get(initData, 'highriskGrade')}
            />
          </Col>
          <Col span={15} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  set_expandedKeys([])
                }}
              >
                全部收起
              </Button>

              <Button
                onClick={() => {
                  set_expandedKeys(keys(highRiskTreeDataMapping.current))

                }}
              >
                全部展开
              </Button>
              <Button onClick={handleReset}>清空</Button>
              <Button type="primary" onClick={() => set_initData(getInitData())}>恢复</Button>

            </Space>
          </Col>
          <Col span={2}> 传染病<span style={{ color: 'red', padding: 2, fontWeight: 'bold', fontSize: 22 }}>*</span>:</Col>
          <Col span={21}>

            <MySelect
              style={{ width: '100%' }}
              options={[{ label: '无', value: '无', exclusive: true }, ...contagionOptions,]}
              onChange={v => {
                set_initData(Object.assign({}, initData, { infectionNote: v }))
              }}
              mode='tags'
              marshal={0}
              value={initData?.infectionNote}
            ></MySelect>
            {/* <MyCheckbox
              options={[{ label: '无', value: '无', exclusive: true }, ...contagionOptions, ...(isAppendCheck ? [{ value: initData?.infectionNote, label: initData?.infectionNote }] : [])]}
              onChange={v => {
                set_initData(Object.assign({}, initData, { infectionNote: v }))
              }}
              type="multiple"
              marshal={0}
              value={initData?.infectionNote}
            ></MyCheckbox> */}
          </Col>
          <Col span={2}>高危因素:</Col>
          <Col span={21}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              className={styles["highrisk-factor"]}
              onChange={handleChange}
              value={get(initData, 'highriskNote', '').split(',').filter(_ => _)}
            ></Select>
          </Col>

          <Col span={2}>模糊查找:</Col>
          <Col span={21}>
            <Input onChange={handleSearch} />

          </Col>


        </Row>




      </div>
      {/* style={{ overflow: 'hidden' }} */}
      <div className={styles["highrisk-sign-content"]}>{renderhiskTree()}</div>
    </div>

  );
}

// console.dir("mapStateToProps",mapStateToProps);


