import {Web3Button} from "./Web3Button";
import {Center, Heading, Spinner} from "@chakra-ui/react";
import {useAccount} from "wagmi";

export const RequireWeb3 = ({children}: {children: any}) => {
    const account = useAccount();

    if (!account.isConnecting) return <Spinner />;
    if (!account.isConnected)
        return (
            <Center flexDirection="column" pt={14}>
                <Heading size="md">This page requires web3 connection</Heading>
                <Web3Button pt={3} />
            </Center>
        );
    else return children;
};
