import axios from "axios";
import { fromPromise, setup, assign } from "xstate";
import Cookies from 'js-cookie';

export const EditAdminProfileMachine = setup({
    types: {
        context: {} as {
            file: File | null;
            progress: number;
            uploadedUrl: string | null;
            error: string | null;
            mode: 'admin' | 'cover' | null;
        },
        events: {} as
            | { type: "FILE_SELECTED"; file: File; mode: 'admin' | 'cover' }
            | { type: "UPLOAD_STARTED" }
            | { type: "UPLOAD_CANCELLED" }
            | { type: "RESET" }
    },
    actors: {
        updateImageUrl: fromPromise(
            async ({ input: { file, mode } }: { input: { file: File, mode: string } }) => {
                const formData = new FormData();

                // 2. Append the file. 
                // The key 'file' must match @RequestParam("file") in Java
                formData.append("file", file);

                const endpoint = mode === 'cover'
                    ? "/backend/person/cover/update"
                    : "/backend/person/avatar/update";

                const token = Cookies.get('auth_jwt');

                // 3. Send via Axios
                const response = await axios.post(endpoint, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // 4. Return the result to XState (event.output)
                return response.data;
            }
        )
    }
}).createMachine({
    id: "editAdminProfile",
    initial: "idle",
    context: {
        file: null,
        progress: 0,
        uploadedUrl: null,
        error: null,
        mode: null
    },
    states: {
        idle: {
            on: {
                FILE_SELECTED: {
                    actions: assign({
                        file: ({ event }) => event.file,
                        mode: ({ event }) => event.mode,
                        error: null,
                        progress: 0
                    }),
                    target: 'readyToUpload'
                }
            }
        },
        readyToUpload: {
            on: {
                UPLOAD_STARTED: {
                    target: "uploading"
                },
                FILE_SELECTED: {
                    actions: assign({
                        file: ({ event }) => event.file,
                        error: null
                    })
                },
                RESET: {
                    target: "idle",
                    actions: assign({ file: null, error: null, progress: 0 })
                }
            }
        },
        uploading: {
            invoke: {
                id: "uploadService",
                src: "updateImageUrl",
                input: ({ context }) => ({ file: context.file!, mode: context.mode! }),
                onDone: {
                    target: "success",
                    actions: assign({
                        progress: 100,
                        // uploadedUrl: ({ event }) => event
                    })
                },
                onError: {
                    target: "failure",
                    actions: assign({
                        error: ({ event }) => (event.error as Error).message || "Upload failed"
                    })
                }
            },
            on: {
                UPLOAD_CANCELLED: {
                    target: "idle",
                    actions: assign({ file: null, progress: 0 })
                }
            }
        },
        success: {
            on: {
                RESET: {
                    target: "idle",
                    actions: assign({
                        file: null,
                        progress: 0,
                        uploadedUrl: null,
                        error: null
                    })
                },
                FILE_SELECTED: {
                    target: "readyToUpload",
                    actions: assign({
                        file: ({ event }) => event.file,
                        error: null,
                        progress: 0,
                        uploadedUrl: null
                    })
                }
            }
        },
        failure: {
            on: {
                UPLOAD_STARTED: {
                    target: "uploading",
                    actions: assign({ error: null })
                },
                FILE_SELECTED: {
                    target: "readyToUpload",
                    actions: assign({
                        file: ({ event }) => event.file,
                        error: null,
                        progress: 0
                    })
                },
                RESET: {
                    target: "idle",
                    actions: assign({ file: null, error: null })
                }
            }
        }
    }
});