import { createActorContext } from "@xstate/react";
import { createMachine } from "xstate";

const orchestraButton = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QHsBOBjAFnALqghgEICuOOyAdgHSUlmUDCANsrGAMQMAyAkgwNIBtAAwBdRKAAOrAJY4ZlCSAAeiAEzC1VAMwBOABwAWbWoBs+gKwB2XQdMAaEAE9E+gIxVDt24Yv7Twm5Whm4AvuGOFMgQcEpoWLgEdOQUStKwcgqpSCqIALQOzvmmVMJl5RUVVhEg8diweESkKTQUyYwsbGmy8oo5qgiGao4uCO5U3ram5obubn41dYlN9NS0zZQA8pJg2VI9WUoD2sK6E26GwhbabrpWVyGFo-palRbCNgYv2uHhQA */
        id: "orchestraButton",
        initial: "onButtonClose",
        states: {
            onButtonClose: {
                on: {
                    CLICK:
                        [
                            {
                                target: "onButtonOpen",

                            }
                        ]
                }
            },
            onButtonOpen: {
                on:
                {
                    CLOSE: [
                        {
                            target: "onButtonClose"
                        }
                    ]
                }
            }
        }
    }
)
const OrchestraButtonActor = createActorContext(orchestraButton);

export { orchestraButton, OrchestraButtonActor };
