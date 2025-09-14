import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Tooltip, Button, Popconfirm, message } from 'antd';
import type { PopconfirmProps } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
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
    removeItem: (id: number) =>
      | {
          fetchApi: () => any;
          loading: boolean;
        }
      | Promise<any>
      | any; // tuỳ bạn implement
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
      const maybe = await removeItem(item.id);
      if (maybe?.fetchApi) await maybe.fetchApi();

      message.success(formatMessage({ id: successMessage }, { name: itemName }));
      onRefresh?.();
    } catch (error: any) {
      message.error(error?.message || 'Error');
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
        <Button
          onClick={() => action.onClick?.(item)}
          type="link"
          icon={action.icon}
          className="w-full !justify-between text-xs px-3 py-2"
        >
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
              label="common.view"
              fullWidth
              className="!justify-center px-3 py-2"
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
              label={editLabel}
              fullWidth
              className="!justify-center px-3 py-2"
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
              <div className="w-full">
                <TableActionButton
                  variant="danger"
                  label={deleteLabel}
                  fullWidth
                  className="!justify-center px-3 py-2"
                />
              </div>
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
        className: 'min-w-[180px] p-1',
      }}
      trigger={['click']}
    >
      <MoreOutlined style={{ fontSize: 20 }} />
    </Dropdown>
  );
};

export default TableAction;
