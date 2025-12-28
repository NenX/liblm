import { IGlobalModalProps } from '@lm_fe/components';
import { ICommonOption, mchcConfig, mchcEnv, mchcLogger } from '@lm_fe/env';
import {
  IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RiskRecordsOfOutpatient, IMchc_TemplateTree_Item,
  SMchc_Common, SMchc_Doctor
} from '@lm_fe/service';
import { formatDate, request } from '@lm_fe/utils';
import { Button, Col, Input, Modal, Row, Space, Tabs, Timeline, message } from 'antd';
import { DataNode } from 'antd/lib/tree';
import classNames from 'classnames';
import {
  cloneDeep, findIndex,
  get,
  includes,
  isEmpty,
  join,
  keyBy,
  keys,
  map,
  orderBy,
  sortBy,
  split
} from 'lodash';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { getLevelOptions, HighRiskGradeSelectPure, MyCheckbox } from '@lm_fe/components_m';
import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
const boundSymbol = ':';
interface IProps {
  data: IMchc_Doctor_OutpatientHeaderInfo
  onFinish?(v: IMchc_Doctor_OutpatientHeaderInfo): void
  handleSubmit?(): void

  hide高危标记?: boolean
  hide高危时间轴?: boolean
}



export default function HighriskFactor(props: IGlobalModalProps<IProps>) {
  const { modal_data, close, ...others } = props
  const { onFinish, handleSubmit, hide高危时间轴, hide高危标记 } = modal_data;
  const headerInfo = modal_data.data
  const highRiskTreeDataMapping = useRef<{ [x: string]: IMchc_TemplateTree_Item }>({})

  const [highriskTreeData, set_highriskTreeData] = useState<IMchc_TemplateTree_Item[]>([])
  const [currentTreeData, set_currentTreeData] = useState<IMchc_TemplateTree_Item[]>([])
  const [gradeOptions, set_gradeOptions] = useState(getLevelOptions())
  const [contagionOptions, set_contagionOptions] = useState<ICommonOption[]>([])
  const [contagionColor, set_contagionColor] = useState<string>()
  const [expandedKeys, set_expandedKeys] = useState<string[]>([])
  const [riskRecords, set_riskRecords] = useState<IMchc_Doctor_RiskRecordsOfOutpatient[]>([])
  const [searchValue, set_searchValue] = useState('')
  const [activeTabKey, set_activeTabKey] = useState('1')
  const [selectTree, set_selectTree] = useState<IMchc_TemplateTree_Item[]>([])
  const multiple = mchcEnv.is('广三') ? true : false



  const [initData, set_initData] = useState(getInitData(headerInfo))

  function getInitData(_headData?: IMchc_Doctor_OutpatientHeaderInfo<"mchc">) {
    if (!_headData) return _headData
    const _data = {
      ..._headData,
      infectionNote: _headData?.infectionNote,
      highriskNote: _headData?.highriskNote?.split(',')?.filter(_ => _) ?? [],
      highriskGrade: _headData?.highriskLable ?? _headData?.highriskGrade,
    }
    return _data
  }

  useEffect(() => {
    (async () => {



      // const gradeDic = initDictionaries.filter((item) => item.key === 'highriskGrade' && item.type === highriskVersion);

      SMchc_Common.getHighriskContagionConfig()
        .then(r => {
          set_contagionOptions(r.options)
          set_contagionColor(r.color)

        })

      const treeData = await SMchc_Common.getHighriskTree()
      highRiskTreeDataMapping.current = keyBy(treeData, 'id');



      const highriskNote_ = headerInfo.highriskNote?.split(',') ?? [];
      let _selectTree: IMchc_TemplateTree_Item[] = [];
      highriskNote_.map((item) => {
        map(highRiskTreeDataMapping.current, (v, i) => {
          const addNote = getTargetNote(v)
          if (item == addNote) {
            _selectTree.push(v);
          }
        });
      });
      set_highriskTreeData(treeData)
      set_currentTreeData(treeData)
      mchcLogger.log('currentTreeData', treeData)
      set_selectTree(_selectTree)
      set_expandedKeys(Object.keys(highRiskTreeDataMapping.current))
    })()

    return () => {

    }
  }, [])



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

  async function onOk() {
    if (!initData?.infectionNote) {
      return message.info('请选择传染病!')
    }

    if (initData.highriskGrade) {
      if (!initData.highriskNote) {
        message.error('请填写高危因素!');
        return;
      }
    }
    if (initData.highriskNote) {
      if (!initData.highriskGrade) {
        message.error('请填写高危等级!');
        return;
      }
    }
    if (onFinish) {

      // 新建孕册

      onFinish({
        ...initData,
        infectionNote: initData.infectionNote,
        highriskNote: join(get(initData, 'highriskNote'), ','),
        // highriskGrade: getHighriskLabelByGrade(get(data, `highriskGrade`)),
        highriskGrade: get(initData, `highriskGrade`),
      });
      close?.(true)
    } else {
      if (activeTabKey === '1') {
        await updateRiskRecords();
        handleSubmit?.();
      } else {
        close?.(true)

      }
    }
  };

  async function updateRiskRecords() {


    const postData = {
      outEmrId: get(initData, 'id'),
      infectionNote: initData?.infectionNote,
      highriskNote: join(get(initData, 'highriskNote'), ','),
      highriskGrade: get(initData, 'highriskGrade'),
      gestationalWeek: get(initData, `gesweek`),
    };

    const res = await request.put('/api/doctor/assessHighRisk', postData);
    message.success('信息保存成功!');
    // saveHeaderInfo({
    //   ...props.data,
    //   ...pick(post, ['infectionNote', 'highriskNote']),
    //   highriskLable: get(post, `highriskGrade`),
    // });
    // saveHeaderInfo(ress);
    close?.(true)

  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const searchValue: string = get(e, 'target.value');
    const { treeData, expandedKeys } = searchTreeData(searchValue, highriskTreeData);
    set_currentTreeData(!!searchValue ? treeData : highriskTreeData)
    set_expandedKeys(!!searchValue ? expandedKeys : [])
    set_searchValue(searchValue)

  };

  function searchTreeData(value: string, highriskTreeData: IMchc_TemplateTree_Item[]) {
    const expandedKeys: string[] = [];
    const treeData: any = [];
    const searchValueArr = split(value, ',') || [];
    while (searchValueArr.length > 0) {
      let searchValue = searchValueArr[0];
      if (!searchValue) {
        searchValueArr.shift();
        continue;
      }
      highriskTreeData.map((item) => {
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
          map(highriskTreeData, (subItem) => {
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
            map(highriskTreeData, (subItem) => {
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

  function handleClose() {

    close?.()

  };

  function handleSelectHighrisk(values: any[], e: any) {
    let arr: IMchc_TemplateTree_Item[] = []

    // if (multiple) {

    //   values.forEach(k => {
    //     const _item = highRiskTreeDataMapping.current[k]
    //     SelectOne(_item, arr)
    //   })
    // } else {
    //   arr = selectTree

    //   const key = values[0];
    //   const _item = highRiskTreeDataMapping.current[key]

    //   SelectOne(_item, arr)
    // }
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
          highriskNote: nodeArr ?? _addNoteArr,
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
          highriskNote: [],
          infectionNote: '',
        }
      )
    )
    set_selectTree([])

  };

  function handleTabChange(key: string) {
    set_activeTabKey(key)
    getRiskRecords();
  };

  async function getRiskRecords() {
    // /api/doctor/getRiskRecordsOfOutpatient

    if (riskRecords.length > 0) return;

    const id = get(headerInfo, 'id');

    const res = await SMchc_Doctor.getRiskRecordsOfOutpatient(id)
    set_riskRecords(res)
  }

  function getGradeColor(grade: any) {
    grade = grade ?? 'I';

    const target = gradeOptions.find(_ => _.label === grade)
    return target?.note;
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

  let newRiskRecords = cloneDeep(riskRecords);
  newRiskRecords = orderBy(riskRecords, ['eventDate'], ['desc']);
  const is禁止编辑高危等级 = mchcConfig.get('禁止编辑高危等级')

  return (
    <Modal
      {...others}

      className={styles["highrisk-pop"]}
      bodyStyle={{
        padding: 0,
        maxHeight: 700
      }}
      width={1000}
      onCancel={handleClose}
      onOk={onOk}
    >
      <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
        {
          hide高危标记 ? null :
            <Tabs.TabPane tab="高危标记" key="1">
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
                        <Button type="primary" onClick={() => set_initData(getInitData(headerInfo))}>恢复</Button>

                      </Space>
                    </Col>
                    <Col span={2}> 传染病<span style={{ color: 'red', padding: 2, fontWeight: 'bold', fontSize: 22 }}>*</span>:</Col>
                    <Col span={22}>
                      <MyCheckbox
                        options={[{ label: '无', value: '无', exclusive: true }, ...contagionOptions]}
                        onChange={v => {
                          set_initData(Object.assign({}, initData, { infectionNote: v }))
                        }}
                        type="multiple"
                        marshal={0}
                        value={initData?.infectionNote}
                      ></MyCheckbox>
                    </Col>
                    <Col span={2}>高危因素:</Col>
                    <Col span={21}>
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        className={styles["highrisk-factor"]}
                        onChange={handleChange}
                        value={get(initData, 'highriskNote')}
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
            </Tabs.TabPane>
        }
        {/* 暂时屏蔽 */}
        {hide高危时间轴 ? null :
          <Tabs.TabPane tab="高危时间轴" key="2">
            {isEmpty(newRiskRecords) ? (
              '暂无高危记录~'
            ) : (
              <Timeline mode="left" className={styles["highrisk-timeline"]}>
                {map(newRiskRecords, (item) => (
                  <Timeline.Item>
                    <div className={styles["record-left"]}>
                      <div className={styles["record-grade"]} style={{ background: getGradeColor(item.highriskGrade) }}>
                        {item.highriskGrade}
                      </div>
                      <div className={styles["record-week"]}>{item.gestationalWeek ? `孕${item.gestationalWeek}周` : ''}</div>
                    </div>
                    <div className={styles["record-right"]}>
                      <div className={classNames(styles['record-item'], { [styles['infectionNote-item']]: !!item.infectionNote })}>
                        <div className={styles["item-label"]} style={{ background: !!item.infectionNote ? contagionColor : '' }}>
                          传染病：
                        </div>
                        <div className={styles["item-note"]}>{item.infectionNote || '无'}</div>
                      </div>
                      <div className={styles["record-item"]}>
                        <div className={styles["item-label"]}>高危因素：</div>
                        <div className={styles["item-note"]}>{item.highriskNote || '无'}</div>
                      </div>
                      <div className={styles["record-item"]}>
                        <div className={styles["item-label"]}>评定日期：</div>
                        <div className={styles["item-note"]}>{formatDate(item.eventDate)}</div>
                      </div>
                      <div className={styles["record-item"]}>
                        <div className={styles["item-label"]}>评定医生：</div>
                        <div className={styles["item-note"]}>{item.doctor}</div>
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Tabs.TabPane>}
      </Tabs>
    </Modal>
  );
}

// console.dir("mapStateToProps",mapStateToProps);


