import {
  Text,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalBody,
  AspectRatio,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

export function HelpDialog(props: {
  visible: boolean;
  onClose: () => void;
}): JSX.Element {
  return (
    <Modal size="3xl" isOpen={props.visible} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ヘルプ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={3}>下の動画を見て、基本操作を学習できます。</Text>
          <AspectRatio ratio={16 / 9}>
            <iframe
              title="unique"
              src="https://www.youtube-nocookie.com/embed/iQXYZJ3R8pg"
              frameBorder="0"
              allow="autoplay; picture-in-picture"
              allowFullScreen
            />
          </AspectRatio>
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose} colorScheme="blue">
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
