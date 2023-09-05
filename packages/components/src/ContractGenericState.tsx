import {chakra, Editable as _Editable} from "@chakra-ui/react";
import {AbiItem} from "viem";

const _ContractGenericState = ({
    abi,
    initalContractAddress,
    ...props
}: {
    abi: AbiItem[];
    initalContractAddress?: string;
}) => {
    return <></>;
};

const ContractGenericState = chakra(_ContractGenericState);
export default ContractGenericState;
