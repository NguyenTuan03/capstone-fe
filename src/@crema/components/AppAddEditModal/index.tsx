import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, message, Flex } from 'antd';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { FormInputPicker, FormInputType } from '@/@crema/constants/AppEnums';
import {
  DATE_FORMAT_YMD,
  DATE_TIME_FORMAT_YMD_Hms,
  TIME_FORMAT_HM,
  YEAR,
} from '@/@crema/constants/AppConst';
import dayjs from 'dayjs';
import {
  applyApiDataToDynamicFields,
  convertDynamicFieldsGroupToApiData,
} from '@/@crema/helper/FormHelper';
import { FormInstance } from 'antd';
import FormItemField from './FormItemFields';
import { ApiOptions, PaginatedAPIResponse } from '@/@crema/types/api';
import { handleErrorValidate } from '@/@crema/helper/FormHelper';
import IntlMessages from '@/@crema/helper/IntlMessages';

export interface FetchApi<T = void> {
  fetchApi: (options?: ApiOptions<T>, isFetch?: boolean) => Promise<any>;
  loading: boolean;
  data?: PaginatedAPIResponse<any>;
}

interface AppAddEditModalProps {
  form: FormInstance;
  title?: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  items: any[];
  isEdit: boolean;
  getApi?: FetchApi;
  createApi?: any;
  updateApi?: any;
  loading?: boolean;
  model?: any;
  onClose?: () => void;
  handleCallbackSuccess?: () => void;
  skipRouterPush?: boolean;
}

const AppAddEditModal: React.FC<AppAddEditModalProps> = ({
  createApi,
  updateApi,
  title,
  visible,
  setVisible,
  items,
  isEdit,
  loading,
  model,
  onClose,
  handleCallbackSuccess,
  form,
  skipRouterPush = false,
}) => {
  const router = useRouter();
  const { messages: t } = useIntl();
  const [disabledSave, setDisabledSave] = useState(!isEdit);
  const onReset = () => {
    onClose?.();
    form.resetFields();
    setVisible(false);
  };

  const handleFinish = async (values: any) => {
    const operation = isEdit ? updateApi : createApi;

    // Process Switch fields to ensure they always have boolean values
    const switchFields = items.filter((item) => item.type === FormInputType.Switch);
    switchFields.forEach((field) => {
      if (values[field.name] === undefined || values[field.name] === null) {
        values[field.name] = field.value !== undefined ? field.value : false;
      }
    });

    // Process email array fields - convert comma-separated strings to arrays
    const emailArrayFields = items.filter(
      (item) =>
        item.type === FormInputType.TextArea &&
        (item.name === 'email_to' || item.name === 'email_cc'),
    );
    emailArrayFields.forEach((field) => {
      if (values[field.name] && typeof values[field.name] === 'string') {
        const trimmedEmails = values[field.name]
          .split(',')
          .map((email: string) => email.trim())
          .filter((email: string) => email.length > 0);
        values[field.name] = trimmedEmails.length > 0 ? trimmedEmails : null;
      } else if (!values[field.name] || values[field.name] === '') {
        values[field.name] = null;
      }
    });

    const rangeDateFields = items.filter((item) => item.type === FormInputType.RangePicker);
    rangeDateFields.forEach((field) => {
      if (!values[field.name]) {
        return;
      }
      if (values[field.name][0]) {
        values[field.fromDateField] = values[field.name][0].format(
          field.inputFormat ?? DATE_FORMAT_YMD,
        );
      }
      if (values[field.name][1]) {
        values[field.toDateField] = values[field.name][1].format(
          field.inputFormat ?? DATE_FORMAT_YMD,
        );
      }
    });

    const timeFields = items.filter((item) => item.type === FormInputType.Time);
    timeFields.forEach((field) => {
      if (values[field.name]) {
        values[field.name] = values[field.name].format(field.inputFormat ?? TIME_FORMAT_HM);
      }
    });

    const dateFields = items.filter((item) => item.type === FormInputType.Date);
    dateFields.forEach((field) => {
      if (values[field.name]) {
        const isYearPicker = field.picker === FormInputPicker.YEAR;
        const format = isYearPicker ? YEAR : (field.inputFormat ?? DATE_FORMAT_YMD);
        values[field.name] = values[field.name].format(format);
      }
    });

    const dateTimeFields = items.filter((item) => item.type === FormInputType.DateTime);
    dateTimeFields.forEach((field) => {
      if (values[field.name]) {
        values[field.name] = values[field.name].format(
          field.inputFormat ?? DATE_TIME_FORMAT_YMD_Hms,
        );
      }
    });

    const dynamicFields = items.filter((item) => item.type === FormInputType.DynamicField);
    if (dynamicFields.length) {
      const groups = dynamicFields.reduce((acc: Record<string, any[]>, f: any) => {
        const key = f.outputName || 'dynamic_fields';
        (acc[key] ||= []).push(f);
        return acc;
      }, {});
      Object.entries(groups).forEach(([outName, fs]) => {
        const idKey = fs[0]?.idKey || 'id';
        const valueKey = fs[0]?.valueKey || 'value';
        const arr = convertDynamicFieldsGroupToApiData(values, fs, idKey, valueKey);
        fs.forEach((f) => delete values[f.name]);
        values[outName] = arr;
      });
    }

    if (operation) {
      await operation({
        payload: values,
        onSuccess: (data: any) => {
          if (!data) return;
          message.success(t['common.success'].toString());
          form.resetFields();
          handleCallbackSuccess?.();
        },
        onError: (error: any) => {
          handleErrorValidate(form, error);
        },
      });
    }

    if (!skipRouterPush) {
      if (!isEdit) {
        router.push({ pathname: router.pathname, query: { page: 1 } });
      } else if (!handleCallbackSuccess) {
        router.push({
          pathname: router.pathname,
          query: router.query,
        });
      }
    }
  };

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    setDisabledSave(hasErrors);
  };

  useEffect(() => {
    if (!isEdit && !model) {
      return;
    }
    if (model) {
      form.setFieldsValue(model);
      const dateFields = items.filter((item) => item.type === FormInputType.Date);
      dateFields.forEach((field) => {
        const format =
          field.picker === FormInputPicker.YEAR ? YEAR : (field.inputFormat ?? DATE_FORMAT_YMD);
        form.setFieldValue(field.name, dayjs(model[field.name], format));
      });

      const rangeDateFields = items.filter((item) => item.type === FormInputType.RangePicker);
      rangeDateFields.forEach((field) => {
        if (model[field.fromDateField]) {
          form.setFieldValue(
            field.fromDateField,
            dayjs(model[field.fromDateField], field.inputFormat ?? DATE_FORMAT_YMD),
          );
        }
        if (model[field.toDateField]) {
          form.setFieldValue(
            field.toDateField,
            dayjs(model[field.toDateField], field.inputFormat ?? DATE_FORMAT_YMD),
          );
        }
        if (model[field.fromDateField] && model[field.toDateField]) {
          form.setFieldValue(field.name, [
            dayjs(model[field.fromDateField], field.inputFormat ?? DATE_FORMAT_YMD),
            dayjs(model[field.toDateField], field.inputFormat ?? DATE_FORMAT_YMD),
          ]);
        }
      });

      const timeFields = items.filter((item) => item.type === FormInputType.Time);
      timeFields.forEach((field) => {
        if (model[field.name]) {
          form.setFieldValue(
            field.name,
            dayjs(model[field.name], field.inputFormat ?? TIME_FORMAT_HM),
          );
        }
      });

      const dateTimeFields = items.filter((item) => item.type === FormInputType.DateTime);
      dateTimeFields.forEach((field) => {
        if (model[field.name]) {
          form.setFieldValue(
            field.name,
            dayjs(model[field.name], field.inputFormat ?? DATE_TIME_FORMAT_YMD_Hms),
          );
        }
      });

      // Process Switch fields to ensure they always have boolean values
      const switchFields = items.filter((item) => item.type === FormInputType.Switch);
      switchFields.forEach((field) => {
        const value = model[field.name];
        form.setFieldValue(field.name, value !== undefined ? value : false);
      });

      const searchSelectFields = items.filter((item) => item.type === FormInputType.SearchSelect);
      searchSelectFields.forEach((field) => {
        const relatedObjectName = field?.queryField
          ? field.name.replace(`_${field?.queryField}`, '')
          : field.name.replace('_id', '');
        const relatedObject = model[relatedObjectName];
        if (relatedObject) {
          form.setFieldValue(field.name, {
            value: field?.queryField ? relatedObject[field?.queryField] : relatedObject.id,
            label: relatedObject[field.labelOptions || 'code'],
            subLabel: field.extraField?.includes('description')
              ? relatedObject.description
              : undefined,
          });
        } else if (model[field.name]) {
          form.setFieldValue(field.name, model[field.name]);
        }
      });

      const dynamicSpecFields = items.filter((item) => item.type === FormInputType.DynamicField);

      if (dynamicSpecFields.length) {
        const groups = dynamicSpecFields.reduce((acc: Record<string, any[]>, f: any) => {
          const key = f.outputName || 'dynamic_fields';
          (acc[key] ||= []).push(f);
          return acc;
        }, {});
        Object.entries(groups).forEach(([outName, fs]) => {
          const apiArray = model[outName];
          if (Array.isArray(apiArray)) {
            const idKey = fs[0]?.idKey || 'id';
            const valueKey = fs[0]?.valueKey || 'value';

            const mapped = applyApiDataToDynamicFields(apiArray, fs, idKey, valueKey);

            Object.keys(mapped).forEach((fieldName) => {
              form.setFieldValue(fieldName, mapped[fieldName]);
            });
          }
        });
      }
      return;
    }
    const initialValues = items.reduce((acc, item) => {
      // For switch fields, ensure we always have a boolean value
      if (item.type === FormInputType.Switch) {
        acc[item.name] = item.value !== undefined ? item.value : false;
      } else {
        acc[item.name] = item.value;
      }
      return acc;
    }, {});
    form.setFieldsValue(initialValues);
  }, [isEdit, model, items, form]);

  return (
    <>
      <Modal
        footer={null}
        title={title ?? (t['common.addEditModal'] as string)}
        open={visible}
        onCancel={onReset}
        width={items.length > 8 ? 800 : undefined}
      >
        <Form
          form={form}
          layout="vertical"
          onFieldsChange={handleFormChange}
          onFinish={handleFinish}
        >
          <Flex
            gap={10}
            wrap
            className="mb-[12px]"
            style={items.length > 8 ? { display: 'flex', gap: 24 } : {}}
          >
            {items.length > 8 ? (
              <>
                <div style={{ flex: 1 }}>
                  {items.slice(0, Math.ceil(items.length / 2)).map((item) => (
                    <FormItemField key={item.name} item={item} />
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  {items.slice(Math.ceil(items.length / 2)).map((item) => (
                    <FormItemField key={item.name} item={item} />
                  ))}
                </div>
              </>
            ) : (
              (items || []).map((item) => <FormItemField key={item.name} item={item} />)
            )}
          </Flex>
          <Flex gap={'15px'} justify="flex-end" align="center" className="mt-[16px]">
            <Button onClick={onReset}>
              <IntlMessages id="common.cancel" />
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              danger={true}
              loading={loading}
              disabled={disabledSave}
            >
              <IntlMessages id="common.save" />
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};

export default AppAddEditModal;
