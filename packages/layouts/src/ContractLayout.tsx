import React, {useContext} from "react";
import {useAppRouter} from "@peersky/react-hooks";
import {getLayout as getSiteLayout} from "./AppLayout";
import {
    Modal,
    Button,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Input,
    chakra,
} from "@chakra-ui/react";
// import Web3Context from "../providers/Web3Provider/context";
import {useToast} from "@peersky/react-hooks";
import {isAddress} from "viem";
import {useAccount} from "wagmi";
const ContractLayout = ({children, ...props}: {children: React.ReactNode}) => {
    const router = useAppRouter();
    const account = useAccount();
    const toast = useToast();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [value, setValue] = React.useState("");
    const handleChange = (event: any) => setValue(event.target.value);
    const {contractAddress} = router.query;
    const handleSubmit = () => {
        const _value = value.toLocaleLowerCase();
        if (value && isAddress(_value)) {
            router.appendQuery("contractAddress", _value, true, false);
        } else {
            toast("Not an address", "error", "Not an address");
        }
    };
    if (!contractAddress || !isAddress(contractAddress))
        return (
            <Modal isOpen={true} onClose={() => {}}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Please set contract address</ModalHeader>
                    <ModalBody>
                        <Input
                            value={value}
                            onKeyDown={(e) => {
                                e.code === "Enter" && handleSubmit();
                            }}
                            onChange={handleChange}
                            variant="outline"
                            placeholder="0x.."
                        ></Input>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={() => handleSubmit()}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    return <>{children}</>;
};

const CL = chakra(ContractLayout);
export const getLayout = (page: any) => getSiteLayout(<CL>{page}</CL>);

export default ContractLayout;
