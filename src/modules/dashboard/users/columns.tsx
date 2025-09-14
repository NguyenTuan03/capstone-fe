import { getFormattedDate } from '@/@crema/helper/DateHelper';
import { DATE_TIME_FORMAT } from '@/@crema/constants/AppConst';
import { TableColumnsType } from 'antd';

import TableAction from '@/@crema/components/AppTableAction';
import { UserApi } from '@/@crema/services/apis/users';
import TitleTable from '@/@crema/components/AppTable/TitleTable';
import { User } from '@/@crema/hooks/useBusinessQueries';

export const Columns = ({
  handleEditItem,
  refreshData,
}: {
  handleEditItem: (item: User) => void;
  refreshData: () => void;
}) => {
  return [
    {
      title: <TitleTable id="common.id" />,
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '60px',
    },
    {
      title: <TitleTable id="common.name" />,
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
    },
    {
      title: <TitleTable id="common.email" />,
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: <TitleTable id="common.role" />,
      dataIndex: ['role', 'name'],
      key: 'role',
      align: 'center',
      render: (val: any) => <p>{val}</p>,
    },
    {
      title: <TitleTable id="common.createdAt" />,
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (createdAt: any) => <p>{getFormattedDate(createdAt, DATE_TIME_FORMAT)}</p>,
    },
    {
      title: '',
      align: 'center',
      fixed: 'right',
      render: (record: User) => (
        <TableAction
          item={record}
          onRefresh={refreshData}
          handleEditItem={handleEditItem}
          api={{
            ...UserApi(),
            removeItem: (id: number) => ({
              fetchApi: () => UserApi().useRemoveItem().mutate(id),
              loading: UserApi().useRemoveItem().isPending,
              error: UserApi().useRemoveItem().error,
            }),
          }}
          canEdit
          canDelete
          itemName={record.fullName || ''}
          itemType="users.title"
        />
      ),
      width: '60px',
    },
  ] as TableColumnsType<User>;
};
