import {Menu, MenuItem, MenuList, MenuButton, Button} from "@chakra-ui/react";
import {useNetwork, useSwitchNetwork} from "wagmi";
import {ChevronDownIcon} from "@chakra-ui/icons";
const ChainSelector = ({selectorScheme}: {selectorScheme?: string}) => {
    const {chain} = useNetwork();
    const {chains, isLoading, pendingChainId, switchNetwork} = useSwitchNetwork();

    return (
        <code>
            <Menu colorScheme={"blue"} gutter={0} matchWidth={true} variant="rounded">
                <MenuButton
                    mx={2}
                    px={6}
                    h="32px"
                    w="250px"
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="menu"
                    // size="lg"
                >
                    {(chain && typeof chain === "string" && chain) ?? "Chain selector"}
                </MenuButton>
                <MenuList pb={20} minW="0px" mt={0} pt={0} placeContent="center">
                    {chains.map((x) => {
                        return (
                            <MenuItem
                                isDisabled={x.id === chain?.id || !x?.id}
                                key={x.id}
                                onClick={() => switchNetwork?.(x.id)}
                            >
                                {x.name}
                                {isLoading && pendingChainId === x.id && " (switching)"}
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
        </code>
    );
};
export default ChainSelector;
