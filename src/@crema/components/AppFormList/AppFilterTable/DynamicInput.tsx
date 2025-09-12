import React, { useMemo } from 'react';
import { FormInputPicker, FormInputType } from '@/@crema/constants/AppEnums';
import {
  Input,
  Select,
  DatePicker,
  InputNumber,
  Checkbox,
  Radio,
  Switch,
  Upload,
  Flex,
  TimePicker,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import {
  DATE_TIME_FORMAT_YMD_Hms,
  TIME_FORMAT_HM,
  TIME_FORMAT_HMS,
  YEAR,
} from '@/@crema/constants/AppConst';
import { createAccentInsensitiveFilter } from '@/@crema/helper/Stringhelper';
import dayjs from 'dayjs';
import { BsAsterisk } from 'react-icons/bs';
import { wrapIconWithBadge } from '@/@crema/helper/Common';

const { RangePicker } = DatePicker;
const { Dragger } = Upload;

export interface DynamicInputFieldProps {
  fieldType?: FormInputType;
  icon?: React.ReactNode;
  rules?: any[];
  [x: string]: any;
}
const DynamicInputField: React.FC<DynamicInputFieldProps> = ({
  fieldType,
  icon,
  rules,
  ...props
}) => {
  const { messages: t } = useIntl();

  const isFieldRequired = useMemo(() => {
    if (!rules || !Array.isArray(rules)) return false;

    return rules.some((rule) => rule && typeof rule === 'object' && rule.required === true);
  }, [rules]);

  const processedIcon = useMemo(() => {
    if (!icon) return null;

    return isFieldRequired
      ? wrapIconWithBadge({
          mainIcon: icon,
          badgeIcon: <BsAsterisk size={6} color="red" />,
          ...props,
        })
      : icon;
  }, [icon, isFieldRequired, props.badgeIcon, props.badge, props.dot, props.offset, props.color]);

  const renderFieldWithIcon = (field: React.ReactNode): React.ReactElement => {
    if (!processedIcon) {
      return field as React.ReactElement;
    }

    return (
      <Flex align="center" gap={10}>
        {processedIcon}
        {field}
      </Flex>
    );
  };

  switch (fieldType) {
    case FormInputType.Text:
      return renderFieldWithIcon(<Input allowClear {...props} />);
    case FormInputType.Number:
      return renderFieldWithIcon(<InputNumber style={{ width: '100%' }} {...props} />);
    case FormInputType.Select:
      return renderFieldWithIcon(
        <Select
          showSearch
          filterOption={createAccentInsensitiveFilter}
          allowClear
          style={{ width: '100%' }}
          {...props}
        />,
      );
    case FormInputType.Checkbox:
      return renderFieldWithIcon(<Checkbox {...props} />);
    case FormInputType.Date: {
      let value = props.value;
      if (
        props.picker === FormInputPicker.YEAR &&
        (typeof value === 'number' || typeof value === 'string')
      ) {
        value = dayjs(String(value), props.format ?? YEAR, true);
      }
      return renderFieldWithIcon(
        <DatePicker
          style={{ width: '100%' }}
          allowClear
          format={props.format ?? ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY', 'YYYY-MM']}
          picker={props.picker}
          {...props}
          value={value}
        />,
      );
    }
    case FormInputType.DateTime:
      return renderFieldWithIcon(
        <DatePicker
          showTime
          style={{ width: '100%' }}
          allowClear
          format={props.format ?? [DATE_TIME_FORMAT_YMD_Hms]}
          {...props}
        />,
      );
    case FormInputType.Time:
      return renderFieldWithIcon(
        <TimePicker
          style={{ width: '100%' }}
          allowClear
          format={props.format ?? [TIME_FORMAT_HM, TIME_FORMAT_HMS]}
          {...props}
        />,
      );
    case FormInputType.RangePicker:
      return renderFieldWithIcon(<RangePicker style={{ width: '100%' }} allowClear {...props} />);
    case FormInputType.Radio:
      return renderFieldWithIcon(<Radio.Group {...props} />);
    case FormInputType.Switch:
      return renderFieldWithIcon(<Switch {...props} />);
    case FormInputType.Password:
      return renderFieldWithIcon(<Input.Password {...props} />);
    case FormInputType.TimePicker:
      return renderFieldWithIcon(
        <TimePicker
          style={{ width: '100%' }}
          allowClear
          format={props.format ?? [TIME_FORMAT_HM, TIME_FORMAT_HMS]}
          {...props}
        />,
      );
    case FormInputType.TextArea:
      return renderFieldWithIcon(<Input.TextArea {...props} />);
    case FormInputType.Dragger:
      return (
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{props?.['uploadText'] || t['dragger.uploadText']}</p>
          <p className="ant-upload-hint">{props?.['uploadHint'] || t['dragger.uploadHint']}</p>
        </Dragger>
      );
    case FormInputType.DynamicField:
      switch (props?.fieldType) {
        case FormInputType.Number:
          return renderFieldWithIcon(<InputNumber style={{ width: '100%' }} {...props} />);
        case FormInputType.Text:
          return renderFieldWithIcon(<Input allowClear {...props} />);
        case FormInputType.Select:
          return renderFieldWithIcon(
            <Select
              showSearch
              filterOption={createAccentInsensitiveFilter}
              allowClear
              style={{ width: '100%' }}
              {...props}
            />,
          );
        default:
          return renderFieldWithIcon(<InputNumber style={{ width: '100%' }} {...props} />);
      }
    default:
      return renderFieldWithIcon(<Input allowClear {...props} />);
  }
};

export default DynamicInputField;
