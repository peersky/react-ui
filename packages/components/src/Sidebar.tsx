import { Sidebar, Menu } from "react-pro-sidebar";
import { useContext } from "react";
import {
  IconButton,
  Divider,
  useColorMode,
  useColorModeValue,
  useTheme,
  Box,
} from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import ChainSelector from "./ChainSelector";
import {UIContext} from "@peersky/react-providers"

export const _Sidebar = ({
  initialLogo = undefined,
  selectorSchema = undefined,
  metamaskSchema = undefined,
  colorScheme = undefined,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const ui = useContext(UIContext);
  const theme = useTheme();
  const { components } = theme;
  const themeLogo = theme.logo;
  const bgC = useColorModeValue(
    `${colorScheme ?? components.Navbar.colorScheme}.0`,
    `${colorScheme ?? components.Navbar.colorScheme}.800`
  );
  return (
    <Sidebar
      width="280px"
      backgroundColor={"#006D99"}
      breakPoint="lg"
      hidden={!ui.sidebarVisible}
    >
      <Menu>
        <Box p={4} alignItems="center">
          <Divider borderColor="blue.600" />
          {!!ui.webSiteConfig.ENABLE_WEB3 && (
            <>
              <ChainSelector selectorScheme={selectorSchema} />
            </>
          )}
          <IconButton
            alignSelf="flex-start"
            aria-label="Menu"
            colorScheme="blue"
            size="sm"
            variant="solid"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MdDarkMode /> : <MdLightMode />}
          />
        </Box>
      </Menu>
    </Sidebar>
  );
};

export default _Sidebar;
