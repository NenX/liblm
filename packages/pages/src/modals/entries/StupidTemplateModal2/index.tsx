import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { IGlobalModalProps, SimpleForm } from '@lm_fe/components';
import { IMchc_TemplateTree_Item as IModel_TemplateTrees, SLocal_State, SMchc_TemplateTrees as SModel_TemplateTrees } from '@lm_fe/service';
import { Button, Col, Empty, Form, message, Modal, Popconfirm, Radio, Row, Space, TreeProps } from 'antd';
import { compact, get, indexOf, isEmpty, isNil, keyBy, keys, map } from 'lodash';
import React from 'react';
// import { AllTypes } from '../../../FU_components/SimpleForm/types/metaTypes';

import { AllTypes } from '@lm_fe/components/dist/SimpleForm/types/metaTypes';
import { createResources, getResourcesByID, updateResources } from '@lm_fe/components_m';
import { mchcEnv } from '@lm_fe/env';
import { useEffect, useState } from 'react';
import TemplateSelect from './components/TemplateSelect';
import styles from './index.module.less';
import { transferTemplates } from './methods';

import { LazyAntd } from '@lm_fe/components';

const { Tree } = LazyAntd


export const DEFAULT_URL = '/api/template-trees';
interface IProps<T> {
    depid?: any
    type?: number | { value: number, label: string }[]
    canOperate?: boolean
    onValueCheck?: (e: IModel_TemplateTrees[]) => void
    renderTitle?: (item: IModel_TemplateTrees) => React.ReactNode
    treeProps?: TreeProps
    multiple?: boolean
    hierarchical?: boolean
    editFormItems?: AllTypes<T>[]
}
export default function TemplateModal2(props: IGlobalModalProps<IProps<IModel_TemplateTrees>>) {
    const { modal_data, onCancel, onOk, getContainer, ...others } = props
    const {
        hierarchical,
        onValueCheck,
        depid = 1,
        canOperate = mchcEnv.is('广三') ? SLocal_State.isAdmin : false,
        treeProps = {},
        type = 1001,
        renderTitle = (item) => <div>{item.val}</div>,
        multiple = true,
        editFormItems = [
            { type: 'Input', outerOptions: { name: 'val', label: '标题' }, id: '0' },
            { type: 'Input', outerOptions: { name: 'mnemonic', label: '描述' }, id: '0' },
        ],
    } = modal_data;

    const userid = mchcEnv.is('广三') ? undefined : SLocal_State.getUserData()?.id
    const [curType, setCurType] = useState(-1)
    const [result, setResult] = useState<IModel_TemplateTrees[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [activeTemplate, setActiveTemplate] = useState<IModel_TemplateTrees>()
    const [splitTemplatesMapping, setSplitTemplatesMapping] = useState<{ [x: string]: IModel_TemplateTrees }>({})

    useEffect(() => {

        const t = Array.isArray(type) ? type[0].value : type
        setCurType(t)
        return () => {

        }
    }, [type])

    useEffect(() => {


        getTemplateList(curType);
        return () => {

        }
    }, [curType])


    async function getTemplateList(t = curType) {
        if (t < 0) return
        const result = await SModel_TemplateTrees.getList({
            params: {
                depid,
                type: t,
                userid,
                size: 99999,
                page: 0,
            }
        })
        const templates = transferTemplates(result);
        // 拆分为多个树
        const splitTemplates = compact(
            map(templates, (template) => {
                if (get(template, 'pid') === 0) {
                    return {
                        ...template,
                        children: [],
                    };
                }
            }),
        );
        const splitTemplatesMapping = keyBy(splitTemplates, 'id');
        map(result, (template) => {
            const templatePid = get(template, 'pid');
            if (indexOf(keys(splitTemplatesMapping), String(templatePid)) > -1) {
                splitTemplatesMapping[templatePid]['children'].push(template);
            }
        });
        setSplitTemplatesMapping(splitTemplatesMapping)
        setResult(result)
    };

    function handleAddTemplate(e: any) {
        e.stopPropagation();
        setEditModalVisible(true)
        setActiveTemplate({})

    };

    function handleHideEditModal() {
        setEditModalVisible(false)
        setActiveTemplate({})


    };

    function closeModal() {
        onCancel?.(null as any);
        setSplitTemplatesMapping({})
    };

    async function handleSubmitEditModal(data: IModel_TemplateTrees) {
        data.type = curType
        data.userid = userid
        if (activeTemplate?.id) {
            await updateResources(DEFAULT_URL, {
                ...activeTemplate,
                ...data,
                depid,
            });
        } else {
            await createResources(DEFAULT_URL, { ...data, depid });
        }
        setEditModalVisible(false)
        setActiveTemplate(undefined)

        message.success('提交模板成功');
        getTemplateList();
    };

    function handleEditTemplate(template: any) {
        return async (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            const activeTemplate = await getResourcesByID(DEFAULT_URL, get(template, 'id'));
            setEditModalVisible(true)
            setActiveTemplate(activeTemplate)

        };
    }

    function handleConfirmDelete(template: any) {
        return (e?: React.MouseEvent<HTMLElement>) => {
            e?.stopPropagation();
            deleteResourcesByID(DEFAULT_URL, get(template, 'id')).then(() => {
                message.success('删除模板成功');
                getTemplateList();
            });

        };
    }

    function handleSelectTemplates(checked: any[], e: any) {
        console.log('check', checked, e)
        const arr = multiple ? checked : checked
        setSelectedRowKeys(arr)
        setSelectedRows(e.checkedNodes)

    };

    function handleOk() {

        let content: IModel_TemplateTrees[] = [];

        let treeDataMapping = keyBy(result, 'id');

        map(selectedRowKeys, (selectedKey) => {
            const item = get(treeDataMapping, selectedKey);
            if (!isEmpty(item) && (get(item, 'isLeaf') || !hierarchical)) {
                content.push(item);
            }
        });


        onValueCheck?.(content);
        onOk?.(null as any)

    };






    function renderTreeNode(templatesTree: IModel_TemplateTrees[]) {
        return map(templatesTree, (template) => {
            const titleWithOperation = <div className={styles["template-list-item"]}>
                {renderTitle(template)}
                {(canOperate) && (
                    <div className={styles["template-list-item__actions"]}>
                        {/* <PlusCircleOutlined className={styles["template-list-item__actions-icon"]} onClick={handleAddTemplate} /> */}
                        <EditOutlined
                            className={styles["template-list-item__actions-icon"]}
                            onClick={handleEditTemplate(template)}
                        />
                        <Popconfirm title="确定要删除吗？" onConfirm={handleConfirmDelete(template)}>
                            <DeleteOutlined className={styles["template-list-item__actions-icon"]} />
                        </Popconfirm>
                    </div>
                )}
            </div>
            if (!isEmpty(get(template, 'children')) && !isNil(get(template, 'children'))) {
                return (
                    <Tree.TreeNode
                        title={titleWithOperation}
                        key={get(template, 'id')}
                    >
                        {renderTreeNode(get(template, 'children'))}
                    </Tree.TreeNode>
                );
            }
            return (
                <Tree.TreeNode
                    title={titleWithOperation}
                    key={get(template, 'id')}
                />
            );
        });
    };



    const [modalForm] = Form.useForm();

    useEffect(() => {
        activeTemplate && modalForm.setFieldsValue({
            ...activeTemplate,
            pid: activeTemplate.pid || 0,
            type: curType,
        });
    }, [activeTemplate]);

    const handleSubmit = async () => {
        await modalForm.validateFields();
        const formData = modalForm.getFieldsValue();
        handleSubmitEditModal(formData);
    };


    return (
        <Modal
            className={styles["textarea-with-template__modal"]}
            width={1100}
            onCancel={closeModal}
            onOk={handleOk}
            getContainer={getContainer}
            {...others}

        >
            <div>
                <Space >

                    <Button disabled={!canOperate} onClick={handleAddTemplate}>添加</Button>
                    {
                        Array.isArray(type) ? <Radio.Group
                            options={type}
                            onChange={e => setCurType(e.target.value)}
                            value={curType}
                            optionType="button"
                            buttonStyle="solid"
                        /> : null
                    }

                </Space>
                {
                    <Row className={styles["textarea-with-template__modal-body"]}>
                        {hierarchical ? map(splitTemplatesMapping, (templateTree) => {
                            return (
                                <Col span={12}>
                                    <Tree checkable defaultExpandAll selectable={false} checkedKeys={selectedRowKeys} onCheck={handleSelectTemplates} {...treeProps} multiple={false}>
                                        {renderTreeNode([templateTree])}
                                    </Tree>
                                </Col>
                            );
                        }) : <Col span={12}>
                            {result.length ?
                                <Tree checkable defaultExpandAll selectable={false} checkedKeys={selectedRowKeys} onCheck={handleSelectTemplates} {...treeProps} multiple={false}>
                                    {renderTreeNode(result)}
                                </Tree>
                                : <Empty />
                            }
                        </Col>}
                    </Row>
                }

                <Modal
                    getContainer={getContainer}
                    visible={editModalVisible}
                    className={styles["textarea-with-template__modal-edit"]}
                    onCancel={handleHideEditModal}
                    onOk={handleSubmit}
                    closable={false}
                    width={680}
                >
                    {
                        editModalVisible && <SimpleForm formProps={{ labelCol: { span: 4 }, wrapperCol: { span: 14 }, layout: 'vertical' }} form={modalForm} formItems={[
                            hierarchical ? { outerOptions: { name: 'pid', label: '上级' }, customNode: <TemplateSelect templateType={curType} depid={depid} />, id: '' } : null,
                            ...editFormItems,

                        ]} />
                    }

                </Modal>

            </div>

        </Modal >
    );
}

