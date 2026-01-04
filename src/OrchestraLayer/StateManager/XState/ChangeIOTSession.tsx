import { createActorContext } from "@xstate/react";
import { setup } from "xstate";


const changeIOTSession = setup(
    {
        types: {

            context: {} as {
            },
            events: {} as {

                type: "ROUTE";
                target: string;

            }
        }
    }
).createMachine(

    {
        id: "changeIOTSessionMachine",
        initial: "onMyRoom",
        context: {},
        states: {
            onMyRoom: {
                on: {
                    ROUTE: [
                        { target: "onSubRoom", guard: ({ event }) => event.target === "onSubRoom" },
                        { target: "onNetwork", guard: ({ event }) => event.target === "onNetwork" }
                    ]
                }
            },
            onSubRoom: {
                on: {
                    ROUTE: [
                        { target: "onMyRoom", guard: ({ event }) => event.target === "onMyRoom" },
                        { target: "onNetwork", guard: ({ event }) => event.target === "onNetwork" }
                    ]
                }
            },
            onNetwork: {
                on: {
                    ROUTE: [
                        { target: "onMyRoom", guard: ({ event }) => event.target === "onMyRoom" },
                        { target: "onSubRoom", guard: ({ event }) => event.target === "onSubRoom" }
                    ]
                }
            }
        }
    }
)

const ChangeIOTSessionActor = createActorContext(changeIOTSession);

export { changeIOTSession, ChangeIOTSessionActor }
