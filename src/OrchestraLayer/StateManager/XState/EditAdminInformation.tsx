
import { input } from "@material-tailwind/react";
import axios from "axios";
import { assign, createMachine, fromPromise, setup } from "xstate";
import Cookies from "js-cookie";


const editAdminInformationMachine = setup({
    actors: {
        postEditAdminInformation: fromPromise(async ({ input }: { input: { location: string, university: string } }) => {
            // 1. MUST return the promise
            console.log(input);
            const token = Cookies.get("auth_jwt");

            const res = await axios.post(
                `/backend_app/information/edit?location=${input.location}&university=${input.university}`,

                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return res.data;
        })
    }
}

).
    createMachine({
        /** @xstate-layout N4IgpgJg5mDOIC5SQJYBcCCEC2KB2AkngGYD2ATtgIZoql4CyVAxgBb5gB09R6AxAFEAIgQAqAbQAMAXUSgADqVjo6eOSAAeiAIwBmAOydtAFgAcx45ICcxgKy7dtgGxOANCACeiU9s63JAdpOVgBMTgZOtgC+Ue6omDj4RGSUNKpMbBzceAIQ-ADKGABqAlKySCCKyrT06loIDsacTpLatvpWTiEh7bpunt6+-oHBYRHRMe54pBBw6vFYuIQkFNQ1jCzseGDqVSq1FfUAtP1eCCeT4HkJS8mrafQZW1w8eOi7Svtqh4jGIe5nHycKwgkF6fR9bT6ZyXBaJZYpNbpTZZei5d4VPbrOqIEK6JptLrOKFtew9AGDYGgqzgyHQpyw66LJIrVLrJ6ovD5KgANx2mM+2J+CGMfU40P0phCphaJmlFIQUs4AQCf2MHT0tj+MRiQA */

        id: "editAdminInformationMachine",
        initial: "onInit",

        context: {
            location: '',
            university: '',

        },

        states: {
            onInit: {
                on: {
                    EDIT: {

                        target: "onEdit"
                    }
                }
            },
            onEdit: {
                on: {
                    TYPE: {
                        target: "onType"
                    }
                }
            },
            onType: {
                on: {
                    SAVE: {

                        actions: [

                            assign({
                                location: ({ event }) => event.location, // ✅ Correct v5 syntax
                                university: ({ event }) => event.university,
                            })
                        ],
                        target: "onSave"
                    }
                }
            },
            onDone: {
                on: {
                    // NEXT: {
                    target: "onInit"
                    // }
                }
            },
            onError: {
                on: {
                    // NEXT: {
                    target: "onInit"
                    // }
                }
            },
            onSave: {
                invoke: {
                    src: "postEditAdminInformation",
                    input: ({ context }) => ({
                        location: context.location,
                        university: context.university,
                    }),
                    onDone: {
                        target: "onDone"
                    },
                    onError: {
                        target: "onError"
                    }

                },
                on: {
                    onDone: {
                        target: "onDone"
                    },
                    onError: {
                        target: "onError"
                    }
                }
            }
        }
    })


export default editAdminInformationMachine;