import { FormInputType, RoleEnum } from '@/@crema/constants/AppEnums';
import { MessageFormatElement } from 'react-intl';

export const Fields = ({
  t,
}: {
  t: Record<string, string> | Record<string, MessageFormatElement[]>;
}) => {
  return [
    {
      type: FormInputType.Text,
      name: 'name',
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
      type: FormInputType.Switch,
      name: 'phone',
      label: t['common.phone'] as string,
    },
    {
      type: FormInputType.Select,
      name: 'role',
      label: t['common.role'] as string,
      placeholder: t['common.role'] as string,
      options: [
        { value: RoleEnum.ADMIN, label: t['common.admin'] as string },
        { value: RoleEnum.CUSTOMER, label: t['common.customer'] as string },
        { value: RoleEnum.COACH, label: t['common.coach'] as string },
      ],
      allowClear: false,
      rules: [{ required: true, message: t['common.validation.required'] as string }],
    },
  ];
};
