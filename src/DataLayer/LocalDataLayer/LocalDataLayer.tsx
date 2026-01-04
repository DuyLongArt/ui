import React, { useEffect } from "react";
import type {ChildrenInterface} from "../../OrchestraLayer/ChildrenComponent.tsx";
import Box from "@mui/material/Box";

const LocalDataLayer:React.FC<ChildrenInterface>=({children})=>{
    //init data
    useEffect(()=>{
        sessionStorage.setItem("authen","false");
    },[])
return(
    <Box>
        {children}
    </Box>
)
}
export default LocalDataLayer;