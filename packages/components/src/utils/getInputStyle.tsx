import React from "react"

interface IBase { style?: React.CSSProperties, width?: any, inputWidth?: any, disabled?: boolean }
interface IProps extends IBase {

}
export function getInputStyle(props: IProps = {}) {
    const { style = {}, width, inputWidth, disabled } = props
    if (width) {
        style.width = width
    }

    return {
        // background: disabled ? style.background : '#fff',
        // border: 0,
        // borderBottom: '2px solid #ddd',
        // borderRadius: 0,
        ...style
    } as React.CSSProperties

}
