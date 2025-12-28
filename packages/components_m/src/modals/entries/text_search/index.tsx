import { Divider, Empty, Input, Modal } from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react'
import { IGlobalModalProps } from '@lm_fe/components';
import store from 'store'
import { CloseOutlined, ClockCircleOutlined } from '@ant-design/icons'
import styles from './index.module.less'
export interface Iprops {
    items: any[]
    getLabel(target: any): string
    onSelect(target: any): void
}
const TEXTSEARCH_HISTORYLIST = 'TEXTSEARCH_HISTORYLIST'
export default function TextSearch({ modal_data, visible, onCancel, close, ...others }: IGlobalModalProps<Iprops>) {
    const { items = [], getLabel = () => '', onSelect, } = modal_data
    const [searchText, setSearchText] = useState('')
    const [inputShow, setInputShow] = useState(false)
    const [historyList, _setHistoryList] = useState<any[]>(store.get(TEXTSEARCH_HISTORYLIST) ?? [])

    function setHistoryList(_list: any[]) {
        _setHistoryList(_list)
        store.set(TEXTSEARCH_HISTORYLIST, _list)
    }

    const resultArr = items.filter(_ => {
        const label = getLabel(_)
        return label.includes(searchText)
    })
    useEffect(() => {

        setTimeout(() => {
            setInputShow(true)
        }, 200);
        return () => {

        }
    }, [])
    const rowStyle: CSSProperties = { padding: 6, marginBottom: 2, textIndent: 24, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }
    return (
        <Modal
            visible={visible}
            title={null}
            closeIcon={null}
            width={512}
            footer={null}
            onCancel={onCancel}
            closable={false}
            style={{ top: '4px', }}
            // mask={false}
            bodyStyle={{}}
            destroyOnClose

        >
            {inputShow && <Input placeholder='输入菜单名称搜索' autoFocus onChange={e => setSearchText(e.target.value)} value={searchText} />}
            {
                historyList.length ? (
                    <>
                        <Divider >历史记录</Divider>

                        <div style={{ maxHeight: '20vh', overflowY: 'scroll' }}>
                            {
                                historyList.map(item => {
                                    return <div className={styles['row-item']} style={rowStyle}
                                        onClick={() => {
                                            onSelect(item)
                                            close?.(true)
                                        }}
                                    >

                                        <span><ClockCircleOutlined style={{ marginRight: 6 }} />{getLabel(item)}</span>

                                        <CloseOutlined title='清除' style={{ cursor: 'pointer' }} onClick={(e) => {
                                            e.stopPropagation()
                                            const idx = historyList.findIndex(_ => _ === item)
                                            historyList.splice(idx, 1)
                                            setHistoryList([...historyList])
                                        }} />

                                    </div>
                                })
                            }
                        </div>
                    </>
                ) : null
            }
            <Divider >搜索结果</Divider>

            <div style={{ height: '40vh', overflowY: 'scroll' }}>
                {
                    (resultArr.length) ? (
                        <>
                            {
                                resultArr.map(_ => {
                                    return <div className={styles['row-item']} style={{ ...rowStyle, }}
                                        onClick={() => {
                                            onSelect(_)
                                            close?.(true)

                                            if (historyList.some(h => getLabel(h) === getLabel(_)))
                                                return
                                            const arr = historyList.length >= 5 ? historyList.slice(1, 5) : historyList
                                            setHistoryList([...arr, _])
                                        }}
                                    >

                                        <span>
                                            <span style={{ fontWeight: 'bold', marginRight: 6 }}>·</span>
                                            {getLabel(_)}
                                        </span>
                                    </div>
                                })
                            }
                        </>
                    ) : <Empty />
                }
            </div>

        </Modal>
    );
};