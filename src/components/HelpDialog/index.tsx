import React from 'react';
import { Button, Modal, Typography } from 'antd';
import styles from './style.module.css';

export const HelpDialog = (props: {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      width="700px"
      title="ようこそ"
      visible={props.visible}
      footer={
        <Button type="primary" onClick={props.onClose}>
          了解！
        </Button>
      }
      centered
      onCancel={props.onClose}
    >
      <Typography.Paragraph>
        下の動画を見て、基本操作を学習できます。
      </Typography.Paragraph>
      <div className={styles.ratio16x9}>
        <iframe
          title="unique"
          src="https://www.youtube-nocookie.com/embed/iQXYZJ3R8pg"
          frameBorder="0"
          allow="autoplay; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Modal>
  );
};
