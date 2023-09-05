import React from "react";
import { chakra, Button } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

 const _RouteButton  = (props: any) => {
  return (
    <Button as={Link} {...props}>
      {props.children}
    </Button>
  );
};

export const RouteButton = chakra(_RouteButton, { label: "button" });

export default RouteButton;
