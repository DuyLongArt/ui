import React from "react";
import type { ChildrenInterface } from "./ChildrenComponent";
import Box from "@mui/material/Box";
// import { Provider } from "react";
// import { Store } from "./ReduxToolkit/Store";
import { AuthenticateFactor, authenState } from "./StateManager/XState/AuthenticateMachine";
// import { useActor, useMachine } from "@xstate/react";
import { OrchestraButtonActor } from "./StateManager/XState/OrchestraButton";
import { ChangeIOTSessionActor } from "./StateManager/XState/ChangeIOTSession";
const 
OrchestraLayer: React.FC<ChildrenInterface> = ({ children }) => {


    return (
        <Box>
            <AuthenticateFactor.Provider>
                <OrchestraButtonActor.Provider>
                    <ChangeIOTSessionActor.Provider>

                        {children}
                    </ChangeIOTSessionActor.Provider>
                </OrchestraButtonActor.Provider>
            </AuthenticateFactor.Provider>
        </Box>
    )
}
export default OrchestraLayer;



