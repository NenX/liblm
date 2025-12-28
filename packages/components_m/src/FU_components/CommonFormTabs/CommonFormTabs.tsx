import { PlusOutlined } from '@ant-design/icons';
import { mchcLogger } from '@lm_fe/env';
import { scrollIntoView } from '@lm_fe/utils';
import { Tabs } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ICommonFormTabsProps } from './types';
import { cloneDeep } from 'lodash';
export default function CommonFormTabs<T extends { id: number }>(props: ICommonFormTabsProps<T>) {
    type TData = { _title?: string; _key: number; } & T
    const { value = [], onChange, onTabChange, title = '项', renderTabNode, onIdxChange, disabled } = props;


    const [arr, _setArr] = useState<TData[]>([])
    const arrRef = useRef<TData[]>([])
    const [_activeKey, set_activeKey] = useState(-1)
    const activeKeyRef = useRef(_activeKey)
    // const [tabs, setTabs] = useState<T[]>([genDefaultData(`${title}1`, '0')])

    function setArr(v: TData[]) {

        _setArr(v)
        arrRef.current = v
    }

    function genDefaultData(_title: string, _key: number) {
        return { _title, _key } as any
    }
    function setKey(k: number) {
        set_activeKey(k)
        activeKeyRef.current = k
    }
    function safeOnchange(v: any) {
        if (onTabChange) {
            onTabChange(v)
        } else {
            onChange?.(v)
        }
    }
    useEffect(() => {

        const data = value.map((_, idx) => ({ ..._, _title: `${title}${idx + 1}`, _key: idx }))
        if (data.length !== arrRef.current.length) {

            setArr(data)
        } else {
            arrRef.current = data
        }
        const firstKey = data[0]?._key
        if (activeKeyRef.current < 0 && firstKey >= 0) {
            setKey(firstKey)
        }




    }, [value])


    useEffect(() => {
        onIdxChange?.(_activeKey)
    }, [_activeKey,])







    function _onChange(k: string) {
        setKey(+k)
    };

    function onEdit(targetKey: any, action: 'add' | 'remove') {
        if (disabled) return
        if (action === 'add') {
            add()
        }
        if (action === 'remove') {
            remove(targetKey)
        }
    };


    function add() {
        const arrData = arrRef.current
        const k = arrData.length ? (arrData.reduce((s, a) => Math.max(s, a._key), 0) + 1) : 0
        const newPanes = [...arrData];


        newPanes.push(genDefaultData(
            `${title}${arrData.length + 1}`,
            k,

        ));
        setKey(k)
        safeOnchange(newPanes)

        scrollIntoView('#xx')
    };



    function remove(targetKey: string) {
        const arrData = arrRef.current

        const _key = +targetKey
        if (!confirm('确定删除吗？')) return
        let rmIdx = arrData.findIndex(_ => _._key === _key);

        const newPanes = arrData.filter((pane) => pane._key !== _key);


        const nextOne = newPanes[rmIdx]
        const preOne = arrData[rmIdx - 1]
        const newKey = nextOne ? rmIdx : (preOne ? rmIdx - 1 : -1)

        setKey(newKey)

        safeOnchange([...newPanes])

    };


    return (
        <>
            <Tabs
                id="xx"
                type="editable-card"
                style={{}}
                onChange={_onChange}
                addIcon={
                    <div>
                        <PlusOutlined />
                        增加
                    </div>
                }
                activeKey={(_activeKey).toString()}
                onEdit={onEdit}
            >
                {arr.map((tab, index) => (
                    <Tabs.TabPane tab={tab._title} key={tab._key} forceRender closable={index === 0 ? false : true}>
                        <div style={{ position: 'relative' }}>
                            {
                                renderTabNode?.(tab, index)
                            }
                        </div>

                    </Tabs.TabPane>
                ))}
            </Tabs>


        </>
    );
}
