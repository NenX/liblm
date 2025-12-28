import React, { Component } from 'react';
import { FormInstance, } from 'antd';
import { get, isObject, map, set } from 'lodash';
import { getAllResources } from '../../utils/defaultMethod';
import { SMchc_Common } from '@lm_fe/service';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export class MyReferralOrganizationSelect extends Component<{ value?: any, onChange?(id: any): void, form?: FormInstance, directionKey?: string }> {
    state = {
        data: undefined,
        options: [],
    };

    componentDidMount() {
        const { value } = this.props;
        this.setState({
            data: isObject(value) ? value : { id: value },
        });
        if (value) {
            this.handleGetOptions()
        }
    }

    handleGetOptions = async () => {
        const options = await getAllResources(`/api/referral-organizations`);
        this.setState({
            options,
        });
    };

    handleChange = async (id: any) => {
        const { onChange, form, directionKey } = this.props;
        this.setState({
            data: { id },
        });
        onChange?.(id);
        if (form && directionKey) {
            const organization = await SMchc_Common.getReferralOrganizations({ id })
            const currentOrganization = await SMchc_Common.getCurrReferralOrganization()
            const selectGrade = organization[0]?.grade;
            const currentGrade = currentOrganization?.grade;
            const direction = currentGrade === selectGrade ? 1 : currentGrade > selectGrade ? 2 : 3;
            const values = form.getFieldsValue()
            set(values, directionKey, direction)
            form.setFieldsValue(values);
        }
    };

    render() {
        const { data, options } = this.state;
        return (
            <Select
                onFocus={this.handleGetOptions}
                onChange={this.handleChange}
                value={get(data, 'id')}
                showSearch
                allowClear
            >
                {map(options, (option, index) => {
                    return (
                        <Select.Option key={get(option, 'id') || index} value={get(option, 'id')}>
                            {get(option, 'name') || '--'}
                        </Select.Option>
                    );
                })}
            </Select>
        );
    }
}
