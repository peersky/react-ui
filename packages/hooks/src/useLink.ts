import {useQuery} from "react-query";
import {queryPublic} from "@peersky/utils";
import {queryCacheProps} from "./hookCommon";

const useURI = ({link}: {link: string | undefined}) => {
    const contents = useQuery(
        ["link", link],
        (query: any) => {
            return queryPublic(query.queryKey[1]).then((r: any) => r.data);
        },
        {
            ...queryCacheProps,
            enabled: !!link,
        }
    );
    return contents;
};

export default useURI;
