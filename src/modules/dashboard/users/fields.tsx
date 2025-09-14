import { FormInputType } from '@/@crema/constants/AppEnums';
import { MessageFormatElement } from 'react-intl';

export const Fields = ({
  t,
}: {
  t: Record<string, string> | Record<string, MessageFormatElement[]>;
}) => {
  return [
    {
      type: FormInputType.Text,
      name: 'fullName',
      label: t['common.name'] as string,
      placeholder: t['common.name'] as string,
      rules: [{ required: true, message: t['common.validation.required'] as string }],
    },
    {
      type: FormInputType.Text,
      name: 'email',
      label: t['common.email'] as string,
      placeholder: t['common.email'] as string,
      rules: [{ required: true, message: t['common.validation.required'] as string }],
    },
    {
      type: FormInputType.Text,
      name: 'phone',
      label: t['common.phone'] as string,
      placeholder: t['common.phone'] as string,
    },
    {
      type: FormInputType.Select,
      name: 'roleId',
      label: t['common.role'] as string,
      placeholder: t['common.role'] as string,
      options: [
        { value: '1', label: t['common.admin'] as string },
        { value: '2', label: t['common.customer'] as string },
        { value: '3', label: t['common.coach'] as string },
      ],
      allowClear: false,
      rules: [{ required: true, message: t['common.validation.required'] as string }],
    },
  ];
};
