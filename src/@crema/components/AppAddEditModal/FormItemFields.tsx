import React from 'react';
import { Form } from 'antd';
import DynamicInputField from '../AppFormList/AppFilterTable/DynamicInput';

interface FormItemFieldProps {
  item: any;
}

const FormItemField: React.FC<FormItemFieldProps> = ({ item }) => (
  <Form.Item
    key={item.name}
    label={item.label}
    name={item.name}
    hidden={item.hide}
    style={{ width: item.width ? item.width : '100%' }}
    initialValue={item.initialValue}
    rules={item.rules}
  >
    <DynamicInputField
      fieldType={item.type}
      defaultValue={item.defaultValue ?? item.initialValue}
      placeholder={item.placeholder}
      options={item.options}
      {...item}
    />
  </Form.Item>
);

export default FormItemField;
