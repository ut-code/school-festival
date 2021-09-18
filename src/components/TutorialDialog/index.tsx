import { Fragment, useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import SwipeableViews from "react-swipeable-views";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Icon,
} from "@chakra-ui/react";

export type TutorialDialogProps = {
  title: string;
  visible: boolean;
  steps: TutorialDialogPropsStep[];
  onClose(): void;
};

export type TutorialDialogPropsStep = { title: string; content: JSX.Element };

export function TutorialDialog(props: TutorialDialogProps): JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Modal size="4xl" isOpen onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" alignItems="center">
          {props.steps.map((step, i) => (
            <Fragment key={step.title}>
              {i > 0 && <Icon mx={2} w={5} h={5} as={RiArrowRightSLine} />}
              <Button
                key={step.title}
                colorScheme="blue"
                variant={i === selectedIndex ? "solid" : "ghost"}
                disabled={i === selectedIndex}
                flexGrow={1}
                flexBasis={0}
                onClick={() => {
                  setSelectedIndex(i);
                }}
              >
                {step.title}
              </Button>
            </Fragment>
          ))}
        </ModalBody>
        <SwipeableViews
          index={selectedIndex}
          onChangeIndex={setSelectedIndex}
          enableMouseEvents
        >
          {props.steps.map((step) => (
            <ModalBody key={step.title}>{step.content}</ModalBody>
          ))}
        </SwipeableViews>
        <ModalFooter>
          <Button colorScheme="blue" onClick={props.onClose}>
            はじめる
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
