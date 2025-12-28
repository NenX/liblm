import { Input } from 'antd';
import React, { useEffect } from 'react';
import { mchcModal } from '../../../modals';
interface IProps {
    menus: any[]
    onSelect(item: any): void
}
const styles: React.CSSProperties = { border: '1px solid #ccc', color: '#ccc', fontFamily: 'Arial', fontSize: '90%', borderBottomWidth: 2, margin: '0 2px', borderRadius: 2, minWidth: 20, minHeight: 20, padding: '0 2px', lineHeight: '20px', textAlign: 'center', display: 'inline-block' }
const id = 'MenuSearch'.split('').reduce((sum, a) => sum + a.charCodeAt(0), 0)
export default function MenuSearch_Inner(props: IProps) {
    const { menus, onSelect } = props;
    function open() {
        mchcModal.openOne(id, 'text_search', {
            modal_data: {
                items: menus,
                getLabel(target) {
                    return target.name
                },
                onSelect(target) {
                    onSelect(target)
                }
            }
        })
    }
    const suffix = (
        <span onClick={open} style={{ cursor: 'pointer' }}>
            <kbd style={styles}>Ctrl</kbd>
            <kbd style={styles}>P</kbd>
        </span>
    );
    useEffect(() => {
        const keydownCb = function (event: KeyboardEvent) {
            // event 参数的类型为 KeyboardEvent
            // event.preventDefault();
            if (event.ctrlKey) {
                if (event.key === 'p') {
                    event.preventDefault()
                    open()
                }
            }
        }

        window.addEventListener("keydown", keydownCb);

        return () => {
            window.removeEventListener("keydown", keydownCb);
        }
    }, [])

    return (
        <div style={{}} >
            <Input suffix={suffix} placeholder='快捷入口' onClick={open} />
        </div>

    );
};
