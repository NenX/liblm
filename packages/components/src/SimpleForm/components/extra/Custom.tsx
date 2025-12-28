import { InputProps } from "antd";
import { FC } from "react";
export { InputProps }
export default function Custom<T>(props: InputProps & { CustomedComponent: FC<T>, [x: string]: any }) {
    const { CustomedComponent, value, onChange, ...others } = props
    //@ts-ignore
    return <CustomedComponent value={value} onChange={onChange} {...others} />
}
