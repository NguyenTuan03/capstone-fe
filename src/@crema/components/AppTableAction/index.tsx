import { MoreOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import Tooltip from 'antd/lib/tooltip';
import React from 'react';
import { useIntl } from 'react-intl';
import { Button, message, Popconfirm } from 'antd';
import type { PopconfirmProps } from 'antd';
import TableActionButton from '../AppTable/ActionTable';

export interface AdditionalActionProps {
  key: string;
  label: React.ReactNode;
  permission?: string;
  icon?: React.ReactNode;
  onClick?: (item: any) => void;
}

interface TableActionProps {
  item: any;
  onRefresh?: () => void;
  handleEditItem?: (item: any) => void;
  api: {
    removeItem: (id: number) => {
      fetchApi: () => any;
      loading: boolean;
    };
  };
  canEdit?: boolean;
  canDelete?: boolean;
  itemName?: string;
  itemType?: string;
  editLabel?: string;
  deleteLabel?: string;
  successMessage?: string;
  deleteMessage?: string;
  deleteDescription?: string;
  yesLabel?: string;
  noLabel?: string;
  viewOnly?: boolean;
  additionalActions?: AdditionalActionProps[];
}

const TableAction: React.FC<TableActionProps> = ({
  item,
  onRefresh,
  handleEditItem,
  api,
  canEdit,
  canDelete,
  viewOnly,
  itemName = 'item',
  itemType = 'item',
  editLabel = 'common.edit',
  deleteLabel = 'common.delete',
  successMessage = 'common.deleteSuccess',
  deleteMessage = 'common.delete.message',
  deleteDescription = 'common.content_confirm_delete',
  yesLabel = 'common.yes',
  noLabel = 'common.no',
  additionalActions = [],
}) => {
  const { messages: t, formatMessage } = useIntl();
  const { removeItem } = api;

  const confirm: PopconfirmProps['onConfirm'] = async () => {
    try {
      await removeItem(item.id);
      message.success(formatMessage({ id: successMessage }, { name: itemName }));
      onRefresh?.();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const processedAdditionalActions = additionalActions
    .filter((action) => {
      if (!action.permission) return true;
      return action.permission;
    })
    .map((action) => ({
      key: action.key,
      label: (
        <Button onClick={() => action.onClick?.(item)} type="link" icon={action.icon}>
          {action.label}
        </Button>
      ),
    }));

  const items: any[] = viewOnly
    ? [
        {
          key: 'view',
          style: { padding: 0 },
          label: (
            <TableActionButton
              onClick={() => handleEditItem?.(item)}
              style={{ color: 'black' }}
              label="common.view"
            />
          ),
        },
        ...processedAdditionalActions,
      ]
    : [
        canEdit && {
          key: 'edit',
          style: { padding: 0 },
          label: (
            <TableActionButton
              onClick={() => handleEditItem?.(item)}
              style={{ color: 'black' }}
              label={editLabel}
            />
          ),
        },
        canDelete && {
          key: 'delete',
          style: { padding: 0 },
          label: (
            <Popconfirm
              placement="left"
              title={formatMessage(
                { id: deleteMessage },
                { type: `${t[itemType]?.toString().toLocaleLowerCase()}`, name: <b>{itemName}</b> },
              )}
              description={t[deleteDescription] as string}
              onConfirm={confirm}
              okText={t[yesLabel] as string}
              cancelText={t[noLabel] as string}
            >
              <TableActionButton danger label={deleteLabel} />
            </Popconfirm>
          ),
        },
        ...processedAdditionalActions,
      ].filter(Boolean);

  if (items.length === 0) {
    return (
      <Tooltip title={t['common.noPermissionMessage'] as string} placement="left">
        <MoreOutlined style={{ fontSize: 20 }} />
      </Tooltip>
    );
  }

  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={['click']}
    >
      <MoreOutlined style={{ fontSize: 20 }} />
    </Dropdown>
  );
};

export default TableAction;
