import { Modal, Steps } from 'antd';
import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import styles from './style.module.css';

export type TutorialDialogProps = {
  title: string;
  visible: boolean;
  steps: TutorialDialogPropsStep[];
  onClose(): void;
};

export type TutorialDialogPropsStep = { title: string; content: JSX.Element };

export const TutorialDialog = (props: TutorialDialogProps) => {
  const [index, setIndex] = useState(0);

  return (
    <Modal
      width="700px"
      title={props.title}
      bodyStyle={{ padding: 0 }}
      footer={
        <Steps current={index} onChange={setIndex}>
          {props.steps.map((step) => (
            <Steps.Step key={step.title} title={step.title} />
          ))}
        </Steps>
      }
      visible={props.visible}
      onCancel={props.onClose}
      centered
    >
      <SwipeableViews index={index} onChangeIndex={setIndex} enableMouseEvents>
        {props.steps.map((step) => (
          <div key={step.title} className={styles.swipablePanel}>
            {step.content}
          </div>
        ))}
      </SwipeableViews>
    </Modal>
  );
};
