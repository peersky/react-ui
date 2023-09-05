import React, {useState} from "react";
import {
    Flex,
    Button,
    chakra,
    Stack,
    Heading,
    Switch,
    Spacer,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select,
    FormLabel,
} from "@chakra-ui/react";
import {useToast} from "@peersky/react-hooks";
import Web3MethodField from "./We3MethodField";

import {ArgumentFields, UIFragment} from "@peersky/react-types";
import {useABIItemForm} from "@peersky/react-hooks";
import {AbiFunction} from "abitype";
import {useAccount, useContractWrite, usePrepareContractWrite} from "wagmi";

const Web3MethodForm = ({
    method,
    argumentFields,
    hide,
    key,
    rendered,
    title,
    onCancel,
    onSuccess,
    beforeSubmit,
    contractAddress,
    BatchInputs,
    initialValue,
    showSwitch = true,
    className,
    ...props
}: {
    title?: string;
    key: string;
    method: AbiFunction;
    className?: string;
    argumentFields?: ArgumentFields;
    hide?: string[];
    BatchInputs?: string[];
    rendered: boolean;
    onClose?: () => void;
    onCancel?: () => void;
    onSuccess?: (resp: any) => void;
    beforeSubmit?: (state: UIFragment) => any;
    contractAddress: string;
    initialValue?: string;
    showSwitch?: boolean;
    props?: any;
}) => {
    const toast = useToast();
    const _BatchInputs = BatchInputs ?? [];
    const [value, setValue] = useState(initialValue?.toString() ?? "0");
    const [valueIsEther, setValueIsEther] = useState(false);
    const [, setAllBytesAreStrings] = React.useState(false);
    const [wasSent, setWasSent] = React.useState(false);
    const account = useAccount();
    const {state, dispatchArguments, getArgs} = useABIItemForm(method, argumentFields, hide);
    const handleClose = React.useCallback(() => {
        if (onCancel) {
            state?.inputs?.forEach((inputElement: any, index: any) => {
                dispatchArguments({
                    value: (argumentFields && argumentFields[inputElement.name]?.initialValue) ?? "",
                    index,
                });
            });
            onCancel();
        }
    }, [state, argumentFields, onCancel]);

    const tx = useContractWrite({
        address: contractAddress as any,
        abi: [method],
        functionName: method.name as any,
        onSuccess: (resp) => {
            toast("Transaction went to the moon!", "success");
            onSuccess && onSuccess(resp);
        },
        onError: () => {
            toast("Transaction failed >.<", "error");
        },
    });

    const handleSubmit = () => {
        if (method.stateMutability === "view" || method.stateMutability === "pure") {
        } else {
            const returnedObject = getArgs();
            beforeSubmit && beforeSubmit(returnedObject);
            tx.write({args: returnedObject});
        }
    };

    React.useEffect(() => {
        if (!tx.isLoading && wasSent) {
            setWasSent(false);
            handleClose();
        }
        if (!wasSent && tx.isLoading) {
            setWasSent(true);
        }
    }, [tx.isLoading, state, argumentFields, onCancel, wasSent, handleClose]);

    const handleKeypress = (e: any) => {
        //it triggers by pressing the enter key
        if (e.charCode === 13) {
            handleSubmit();
        }
    };

    const [isUploading, setIsUploading] = React.useState(false);
    const handleParsingError = function (error: string): void {
        setIsUploading(false);
        toast(error, "error", "CSV Parse Error");
        throw error;
    };

    const validateHeader = function (
        headerValue: string,
        column: number
        // expected: string
    ): string {
        const expected = _BatchInputs && _BatchInputs[column].trim().toLowerCase();
        const header = headerValue.trim().toLowerCase();
        if (column == 0 && header != expected) {
            handleParsingError(`First column header must be '${expected}' but got ${headerValue}.`);
        }
        if (column == 1 && header != expected) {
            handleParsingError(`Second column header must be '${expected}' but got ${headerValue}`);
        }
        return header;
    };
    if (!rendered) return <></>;
    return (
        <>
            <Stack className={className} justifyContent="center" px={2} alignItems="center" m={0} key={key} {...props}>
                {/* <Fade in={rendered}> */}
                <Flex direction={"row"} w="100%">
                    <Heading
                        wordBreak={"break-all"}
                        fontSize={method?.name?.length && method?.name?.length > 12 ? "xl" : "3xl"}
                    >
                        {title ?? method.name}
                    </Heading>
                    <Spacer />
                    {showSwitch && (
                        <Switch
                            size="sm"
                            ml={4}
                            justifySelf={"flex-end"}
                            aria-label="as string"
                            onChange={() => {
                                setAllBytesAreStrings((old) => {
                                    dispatchArguments({
                                        allBytesAsStrings: !old,
                                    });
                                    return !old;
                                });
                            }}
                        >
                            All Bytes as strings
                        </Switch>
                    )}
                </Flex>
                {state?.inputs?.map((inputItem, index) => {
                    if (
                        !state.ui[index]?.hide &&
                        !(inputItem.name && _BatchInputs?.includes(inputItem.name)) &&
                        inputItem.name &&
                        inputItem.name.length > 0
                    ) {
                        return (
                            <Web3MethodField
                                key={`${inputItem.name}-${index}-abiitems`}
                                dispatchArguments={dispatchArguments}
                                abiItem={inputItem}
                                uiFragment={state.ui[index]}
                                index={index}
                                onKeyPress={handleKeypress}
                                // inputsProps={inputsProps}
                            />
                        );
                    }
                })}
                <Flex direction={"row"} w="100%">
                    {!hide?.includes("msg.value") && method.stateMutability == "payable" && (
                        <Flex direction={"column"} w="100%" borderTopWidth={"1px"} mt={4}>
                            <FormLabel>Value to pay</FormLabel>
                            <Flex w="100%">
                                <NumberInput variant={"outline"} flexBasis="75px" flexGrow={1}>
                                    <NumberInputField
                                        onFocus={(event) => event.target.select()}
                                        placeholder={value}
                                        textColor={"blue.500"}
                                        onKeyPress={handleKeypress}
                                        value={value}
                                        onChange={(event) => setValue(event.target.value)}
                                        fontSize={"sm"}
                                        w="100%"
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <Select
                                    onChange={(e) => setValueIsEther(e.target.value === "1" ? false : true)}
                                    flexBasis="25px"
                                    flexGrow={1}
                                    maxW="200px"
                                    ml={4}
                                >
                                    <option value="1">wei (**1)</option>
                                    <option value="18">Eth (**18)</option>
                                </Select>
                            </Flex>
                        </Flex>
                    )}
                </Flex>
                <Flex direction={"row"} flexWrap="wrap">
                    <Button
                        variant={"solid"}
                        colorScheme={"orange"}
                        size="sm"
                        onClick={handleSubmit}
                        isLoading={tx.isLoading}
                    >
                        Submit
                    </Button>
                    {onCancel && (
                        <Button variant={"solid"} colorScheme={"orange"} size="sm" onClick={() => handleClose()}>
                            Cancel
                        </Button>
                    )}
                </Flex>
                {/* </Fade> */}
            </Stack>
        </>
    );
};

export default chakra(React.memo(Web3MethodForm));
