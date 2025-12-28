import { Checkbox, Divider, Input, InputNumber, Radio, Rate, Row, Slider, Switch } from "antd";
import SimpleSelect from './extra/SimpleSelect';
// import HospitalTreeSelect from '@/demain-components/HospitalTreeSelect';
import { DatePicker_L, LazyAntd, TimePicker_L } from "@lm_fe/components";
import CusDatePicker from "src/GeneralComponents/DatePicker";
import Custom from './extra/Custom';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

// import TabForm from './TabForm'
export const ComponentMapping = {
    Input,
    Select,
    Radio,
    TextArea: Input.TextArea,
    InputNumber,
    Checkbox,
    TimePicker:TimePicker_L,
    DatePicker: DatePicker_L,
    MyDatePicker: CusDatePicker,
    Switch,
    Rate,
    Slider,
    Color: Input,
    CheckboxGroup: Checkbox.Group,
    Text,
    Divider,
    Grid: Row,
    // HospitalTreeSelect,
    SwitchSelect: Select,
    SimpleSelect,
    Custom,
    TabForm: (p: any) => { return null; }

}




