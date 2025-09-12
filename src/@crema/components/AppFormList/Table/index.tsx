import React, { useCallback, useEffect, useState } from 'react';
import ReactDragListView from 'react-drag-listview';
import { PAGE_SIZE_LIST } from '@/@crema/constants/AppConst';
import Table, { ColumnsType, TableProps } from 'antd/es/table';
import { AnyObject } from 'antd/es/_util/type';
import { useRouter } from 'next/router';
import { TableRowSelection } from 'antd/es/table/interface';
import { Resizable, ResizeCallbackData } from 'react-resizable';

interface Column {
  title: React.ReactNode;
  dataIndex: string;
  key: string;
  width?: number;
  onHeaderCell?: (column: Column) => any;
}

interface ListTableProps {
  initColumns: ColumnsType<any>;
  dataSource: any[];
  currPage: number;
  currPageSize: number;
  total: number;
  handlePageChange: (page: number, pageSize: number) => void;
  loading: boolean;
  scrollX: string;
  filterData?: any;
  handleSortChange: (newFilterData: Record<string, any>) => void;
  filterHeight?: number;
  rowSelection?: TableRowSelection<any>;
  expandable?: TableProps<any>['expandable'];
}

const ResizableTitle: React.FC<any> = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={typeof width === 'number' ? width : Number(width)}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const ListTable: React.FC<ListTableProps> = ({
  initColumns,
  dataSource,
  currPage,
  currPageSize,
  total,
  handlePageChange,
  loading,
  handleSortChange,
  filterHeight,
  rowSelection,
  expandable,
}) => {
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<any>(null);
  const [columns, setColumns] = useState<ColumnsType<AnyObject>>(initColumns ?? []);
  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const newColumns = [...columns];
      const item = newColumns.splice(fromIndex, 1)[0];
      newColumns.splice(toIndex, 0, item);
      setColumns(newColumns);
    },
    nodeSelector: 'th',
    handleSelector: '.dragHandler',
    ignoreSelector: 'react-resizable-handle',
  };

  useEffect(() => {
    if (initColumns) setColumns(initColumns);
  }, [initColumns]);
  const handleResize = useCallback(
    (index: number) =>
      (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
        setColumns((prevColumns) => {
          const nextColumns = [...prevColumns];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          return nextColumns;
        });
      },
    [],
  );

  const mappedColumns = columns.map((col, index) => {
    const minWidth = 120;
    const currentWidth = !col?.title ? 50 : col.width || minWidth;
    return {
      ...col,
      width: currentWidth,
      ellipsis: false,
      sortOrder: router?.query?.order_by
        ? sortOrder?.columnKey === col?.key
          ? sortOrder?.order
          : null
        : null,
      onHeaderCell: (column: Column) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    };
  });

  return (
    <div
      className="react-resizable {
    position: relative;
    background-clip: padding-box;
  }

  .react-resizable-handle {
    position: absolute;
    width: 10px;
    height: 100%;
    bottom: 0;
    right: -5px;
    cursor: col-resize;
    z-index: 1;
  }

  .dragHandler:hover {
    cursor: move;
    background-color: #ccc;
  }"
    >
      <div>
        <ReactDragListView.DragColumn {...dragProps}>
          <Table
            className="min-height: 0.01%;
  overflow-x: auto;
  overflow-y: auto;

  thead > tr > td,
  tbody > tr > td,
  tfoot > tr > td {
    white-space: nowrap;
  }

  thead > tr > th,
  tbody > tr > th,
  tfoot > tr > th {
    text-align: center !important;
  }

  @media screen and (max-width: 767px) {
    &.ant-table {
      width: 100%;
      overflow-y: hidden;
      -ms-overflow-style: -ms-autohiding-scrollbar;
      border: 1px solid ${({ theme }) => theme.palette.borderColor};
    }
  }

  &.hoverColor {
    & tbody > tr {
      transition: all 0.2s ease;
      transform: scale(1);
    }

    & .ant-table-tbody > tr.ant-table-row:hover > td {
      background-color: transparent;
    }
  }
  & .ant-table table {
    table-layout: fixed !important;
  }

  & .ant-table-thead > tr > th {
    font-size: 13px;
    padding: 8px;
    font-weight: ${({ theme }) => theme.font.weight.bold};
    background-color: transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;

    &:first-child {
      padding-left: 20px;

      [dir='rtl'] & {
        padding-left: 8px;
        padding-right: 20px;
      }
    }

    &:last-child {
      padding-right: 12px;
      padding-left: 12px;
    }

    &.customer-table-actions {
      text-align: center;
      background-color: ${({ theme }) => theme.palette.background.paper} !important;
    }
  }

  & .ant-table-tbody > tr > td {
    font-size: 13px;
    padding: 6px 8px;

    &:first-child {
      padding-left: 20px;

      [dir='rtl'] & {
        padding-left: 8px;
        padding-right: 20px;
      }
    }

    &.customer-table-actions {
      text-align: center;
      background-color: ${({ theme }) => theme.palette.background.paper} !important;
    }
  }"
            components={{ header: { cell: ResizableTitle } }}
            columns={mappedColumns as any}
            dataSource={dataSource}
            rowKey="id"
            rowSelection={rowSelection}
            expandable={expandable}
            pagination={{
              current: currPage,
              pageSize: currPageSize,
              total,
              position: ['bottomCenter'],
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_LIST,
              onChange: handlePageChange,
            }}
            loading={loading}
            onChange={(_pagination: any, _filters: any, sorter: any) => {
              setSortOrder(sorter);
              if (!sorter?.field) return;
              handleSortChange({
                order_by: sorter.field,
                order_direction: sorter.order === 'ascend' ? 'asc' : 'desc',
              });
            }}
            sticky
            scroll={{
              x: 'max-content',
              y: `calc(100dvh - ${filterHeight ? filterHeight + 270 : 0}px)`,
            }}
          />
        </ReactDragListView.DragColumn>
      </div>
    </div>
  );
};

export default ListTable;
