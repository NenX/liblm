import React, { Component } from 'react';
import { Col, Row } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { filter, get, isEmpty, map } from 'lodash';
import { PatientAutoComplete } from '@lm_fe/components_m';

export default class UserSelect extends Component {
  state = {
    users: [
      {
        key: Math.random(),
      },
    ],
  };

  componentDidMount() {
    const { value } = this.props;
    if (!isEmpty(value)) {
      this.setState({
        users: value,
      });
    }
  }

  handleAdd = () => {
    const { users } = this.state;
    const { onChange } = this.props;
    const newUsers = [...users, { key: Math.random() }];
    this.setState({
      users: newUsers,
    });
    onChange && onChange(newUsers);
  };

  handleDelete = (key) => () => {
    const { users } = this.state;
    const { onChange } = this.props;
    const newUsers = filter(users, (user) => get(user, 'key') !== key);
    this.setState({
      users: newUsers,
    });
    onChange && onChange(newUsers);
  };

  handleChange = (key) => (value) => {
    const { onChange } = this.props;
    const { users } = this.state;
    const newUsers = map(users, (user) => {
      if (get(user, 'key') === key) {
        return {
          ...user,
          value,
        };
      }
      return user;
    });
    this.setState({
      users: newUsers,
    });
    onChange && onChange(newUsers);
  };

  render() {
    const { users } = this.state;

    return (
      <div>
        {map(users, (user, index) => {
          return (
            <Row style={{ alignItems: 'center' }} key={get(user, 'key')}>
              <Col span={20}>
                <PatientAutoComplete
                  value={get(user, 'value')}
                  onChange={this.handleChange(get(user, 'key'))}
                />
              </Col>
              <Col span={1} offset={1}>
                <PlusCircleOutlined onClick={this.handleAdd} />
              </Col>
              <Col span={1} offset={1}>
                {index !== 0 && (
                  <MinusCircleOutlined style={{ color: 'red' }} onClick={this.handleDelete(get(user, 'key'))} />
                )}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  }
}
