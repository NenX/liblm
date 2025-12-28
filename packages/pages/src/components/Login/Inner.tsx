import React, { useEffect, useState } from "react";
import styles from './index.module.less'
import classNames from "classnames";
import { Button, Checkbox, Form, Input } from "antd";
import { SafetyOutlined, UserOutlined, } from "@ant-design/icons";
import store from 'store'
import { mchcEnv } from "@lm_fe/env";

interface IProps {
    systemName?: string
    logo?: string
    onFinish(values: any): Promise<void>
}
export default function LoginInner(props: IProps) {

    const { systemName = '默认系统名', logo, onFinish } = props

    useEffect(() => {


        return () => {

        }
    }, [])

    return <div className={classNames(styles["container"])}>
        <div className={classNames(styles["left-panel"])}>
            <div className={classNames(styles["decorations "])}>
                <div className={classNames(styles["dot"], styles["dot-1"])}></div>
                <div className={classNames(styles["dot"], styles["dot-2"])}></div>
                <div className={classNames(styles["dot"], styles["dot-3"])}></div>
            </div>
        </div>
        <div className={classNames(styles["right-panel"])}>
            <div />
            <div className={classNames(styles["login-form"], styles["animate-in"])}>

                <h2>
                    {logo ? <img alt="logo" src={logo} /> : null}
                    {systemName}
                </h2>
                <LoginForm onFinish={onFinish} />
            </div>
            <footer className={classNames(styles["footer"])}>
                {/* {APP_CONFIG.COPYRIGHT} */}
                <div>
                    备案号：
                    <a href="https://beian.miit.gov.cn">
                        粤ICP备17048892号-1
                    </a>
                </div>
                Copyright © 2020{' '}
                <a href="http://www.lian-med.com/">
                    广州莲印医疗科技有限公司
                </a>
                , 版权所有
            </footer>
        </div>
    </div>
}

function LoginForm(props: { onFinish(values: any): Promise<void> }) {
    const { onFinish } = props

    const [loading, setLoading] = useState(false)
    return <Form initialValues={mchcEnv.loginRemember!} className="login-main-center-form" onFinish={values => {
        if (values.remember) {
            mchcEnv.loginRemember = values
        }
        setLoading(true)
        onFinish(values).finally(() => setLoading(false))
    }}>
        <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!', },]}
        >
            <Input autoFocus allowClear size="large" prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
            name="password"
            rules={[
                {
                    required: true,
                    message: '请输入密码！',
                },
                { type: 'string' },
                { min: 5, message: '密码不能少于5位' },
                { max: 16, message: '密码不能超过16位' },
            ]}
        >
            <Input.Password visibilityToggle={false} allowClear size="large" prefix={<SafetyOutlined />} placeholder="请输入密码" />
        </Form.Item>
        <Form.Item hidden={!__LOCAL__} valuePropName="checked" name="remember" label={`记住密码（${__LOCAL__}）`}>
            <Checkbox onChange={e => {
                const checked = e.target.checked
                if (!checked) {
                    mchcEnv.loginRemember = undefined
                }
            }} />
        </Form.Item>
        <Form.Item>
            <Button
                block
                size="large"
                className="login-main-center-button"
                type="primary"
                loading={loading}
                htmlType="submit"
            >
                登 录
            </Button>
        </Form.Item>
    </Form>
}