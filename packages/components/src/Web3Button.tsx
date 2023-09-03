import {useContext} from "react";
import {
    Button,
    Image,
    useColorModeValue,
    Skeleton,
    Flex,
    chakra,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import wagmi, {useAccount, useConnect} from "wagmi";
const _Web3Button = ({colorScheme, ...props}: {colorScheme?: string}) => {
    const account = useAccount();
    const {connect, connectors, error, isLoading, pendingConnector} = useConnect();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const bgC = useColorModeValue("blue.500", "blue.800");
    return (
        <>
            <Button onClick={onOpen}>{account.address ?? "Connect wallet"}</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {connectors.map((connector) => {
                            return (
                                <Button
                                    disabled={!connector.ready}
                                    key={connector.id}
                                    onClick={() => connect({connector})}
                                >
                                    {connector.name}
                                    {!connector.ready && " (unsupported)"}
                                    {isLoading && connector.id === pendingConnector?.id && " (connecting)"}
                                </Button>
                            );
                        })}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="ghost">Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
        // <>
        //   {account.isDisconnected &
        // & (
        //     <Button
        //       isDisabled={
        //         web3Provider.WALLET_STATES.UNKNOWN_CHAIN === web3Provider.buttonText
        //       }
        //       variant="link"
        //       colorScheme={
        //         web3Provider.buttonText === web3Provider.WALLET_STATES.CONNECTED
        //           ? "green"
        //           : web3Provider.WALLET_STATES.UNKNOWN_CHAIN ===
        //             web3Provider.buttonText
        //           ? "red"
        //           : colorScheme
        //       }
        //       onClick={() => web3Provider.onConnectWalletClick()}
        //       {...props}
        //     >
        //       {web3Provider.buttonText}
        //       {"  "}
        //       <Image
        //         pl={2}
        //         h="24px"
        //         src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
        //       />
        //     </Button>
        //   )}
        //   {account.isConnected ||
        //     account.isConnecting ||
        //     (account.isReconnecting && (
        //       <Flex
        //         bgColor={bgC}
        //         px={2}
        //         fontWeight="semibold"
        //         borderRadius="md"
        //         {...props}
        //       >
        //         <Skeleton
        //           isLoaded={!!account.isConnecting}
        //           h="100%"
        //           colorScheme={"red"}
        //           w="100%"
        //           borderRadius={"inherit"}
        //           startColor="red.500"
        //           endColor="blue.500"
        //           p={1}
        //         >
        //           {account.address}
        //         </Skeleton>
        //       </Flex>
        //     ))}
        // </>
    );
};

export const Web3Button = chakra(_Web3Button);
