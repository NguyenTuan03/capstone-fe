import React, { ReactNode } from 'react';
import { Modal } from 'antd';

type AppConfirmDialogProps = {
  modalTitle: string | ReactNode;
  open: boolean;
  onDeny: (isOpen: boolean) => void;
  paragraph?: string | ReactNode;
  onConfirm: () => void;
  loading?: boolean;
};

const AppConfirmationModal: React.FC<AppConfirmDialogProps> = ({
  open,
  onDeny,
  onConfirm,
  paragraph = 'Are you sure you want to delete?',
  modalTitle,
  loading,
}) => {
  return (
    <Modal
      title={modalTitle}
      open={open}
      onOk={onConfirm}
      onCancel={() => onDeny(false)}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      confirmLoading={loading}
    >
      <div>{paragraph}</div>
    </Modal>
  );
};

export default AppConfirmationModal;
