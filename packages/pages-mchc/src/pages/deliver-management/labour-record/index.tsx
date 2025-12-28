import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { mchcEnv } from "@lm_fe/env";
import { BF_Wrap2, mchcModal__, MyBaseList } from '@lm_fe/pages';
import { request } from "@lm_fe/utils";
import { Button, message, Tag } from "antd";
import { get, set } from "lodash";
import React from "react";
// import { form_config } from './form_config';
// import { modalFormConfig } from './modalForm_config';

export default function BreastCancerDataReport(prop: any) {
	const { config, Wrap } = BF_Wrap2({
		default_conf: {
			title: mchcEnv.is_primary ? '分娩记录-列表' : '产科住院-新生儿分娩记录',
			tableColumns: () => import('./form_config'),
			searchConfig: [
				{ label: '分娩日期', name: 'labourDate', inputType: 'rangeDate' },
				{ label: '姓名', name: 'admissionCriteria.name', inputType: 'Input' },
				{ label: '证件号码', name: 'admissionCriteria.idNO', inputType: 'Input' },
			]
		}
	})
	return <Wrap>
		<MyBaseList
			name="/api/labour-records"
			useListSourceCount
			searchConfig={config?.searchConfig}
			showAction={false}
			showAdd={false}
			baseTitle='分娩记录'
			genColumns={ctx => [
				...(config?.tableColumns ?? []),

				{
					title: '状态',
					dataIndex: 'state',
					width: 64,
					align: 'center',
					fixed: 'right',
					render: (text, record) => {
						return text ? <Tag style={{ marginRight: 0 }}>已上报</Tag> : <Tag style={{ marginRight: 0 }}>未上报</Tag>;
					},
				}, {
					label: '操作',
					fixed: 'right',
					width: 188,
					render: (value, rowData) => {
						return (
							<Button.Group>
								<Button
									size="small"
									type="link"
									icon={<UploadOutlined className="global-table-action-icon" />}
									disabled={rowData.state}
									onClick={() => {
										request.get(`/api/labour-records/${rowData.id}/upload`)
										message.info('上传成功！')
									}}
								>
									上报
								</Button>
								<Button
									size="small"
									type="link"
									icon={<EditOutlined className="global-table-action-icon" />}
									onClick={() => {
										console.log('ctx', rowData.id, ctx);
										mchcModal__.open('modal_form', {
											width: 1600,
											modal_data: {
												bf_title: mchcEnv.is_primary ? '分娩记录-编辑' : undefined,
												async getInitialData() {
													return rowData
												},
												// formDescriptions: modalFormConfig,
												formDescriptions: () => import('./modalForm_config'),
												async onSubmit(values) {
													console.log('values', values)
													const admission = get(rowData, 'admission');
													set(admission, 'noenateRecords', get(values, 'admission.noenateRecords'))
													let finalValues = {
														...values,
														admission: admission,
													}
													if (get(finalValues, 'id')) {
														await request.put(`/api/labour-records`, finalValues);
													} else {
														await request.post(`/api/labour-records`, finalValues);
													}
													message.success('修改成功');
													ctx.handleSearch()
													return true;
												},
											},
										})
									}}>
									编辑
								</Button>
								<Button type="link" size="small" icon={<DeleteOutlined className="global-table-action-icon" />} onClick={() => ctx.handleDelete(rowData)}>
									删除
								</Button>
							</Button.Group>
						)
					}
				}]}
		/>
	</Wrap >
}

