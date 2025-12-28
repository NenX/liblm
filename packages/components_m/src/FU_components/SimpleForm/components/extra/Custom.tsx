import { InputProps } from "antd";
import { FC } from "react";
export default function Custom({ CustomedComponent, value, onChange }: InputProps & { CustomedComponent: FC<any> }) {

    return <CustomedComponent value={value} onChange={onChange} />
}
