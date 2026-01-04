import axios from "axios";
import { assign, setup, fromPromise } from "xstate";

// Khai báo Context ban đầu
const stepContext = {
    step: 1 as 1 | 2 | 3 | 4, // Khởi tạo step là 1
};

export const ApproveProcessMachine = setup({
    // 1. ĐỊNH NGHĨA ACTIONS Ở ĐÂY
    actions: {
        // Hành động cập nhật Context, sử dụng hàm assign
        incrementStep: assign(({ context }) => {
            // Chỉ tăng step nếu nó nhỏ hơn 4
            if (context.step < 4) {
                return {
                    step: (context.step + 1) as 1 | 2 | 3 | 4,
                };
            }
            // Nếu không thay đổi, trả về đối tượng rỗng
            return {};
        }),
        sendApproveToServer: () => {
            axios.post("/backend/approve");
        },
        fetchStepFromServer: () => {
            axios.get("/backend/step");
        }
    },

    actors: {
        fetchStepFromServer: fromPromise(async () => {
            const response = await axios.get("/backend/step");
            return response.data;
        })
    },

    // 2. KHAI BÁO TYPES (Sử dụng typeof để Typescript biết Context là gì)
    types: {} as {
        context: typeof stepContext;
        events: { type: 'APPROVE' } | { type: 'REJECT' };
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqBOB7AbmACtgMZywB0WAdgJKUCWALgMQCC++ASgPIBqAogG0ADAF1EoVFliM6VcSAAeiAIwBmAOxllAFgAc21QFYAnMe1DjANgBMAGhABPFesNlrQ1cuXrv63caEdAF8g+zRMXAJiUgpKQiwSWGlKKFZ2bn5hMSQQSWkGWUp5JQRra20tdSF1AL9tH2MdeycEAFodazIbS11lY3Ua5WtjQ1UQsPRsPHjE8ioZ0joUtM5eQWVsiSkZORySkwqzK20DbUtDdUttZsRW1TITUaEhMpPtY08B8ZBwqaiEmLzaJJJapDh8ABSfAAwgAVLLyPI7Ip7RB6IRkdTWc6WAZmbTWVS6VQ3BDKXS6Mi6Sz9S6E9QGUyWEKhECULAQODyX6RBZJRHbAq7UAlVqWUmtQkYoY9QmWIQ9F7nb486bAuY0egMAX5QrFNF2RzOVxVTzknw+PTaFWTXnq2J85JQHXI-WlKxUkxEwyjVTPd6k8mdEaeaxYsM48k2iJqgFJWIsW14CAuoUokWIAaWLSGbp+ZQKrzKQPWZRUml0ly6Cz6YzRv6O2IcMAAKzARG1OSRabdWZzed6ha8gYpWj6lzOQgMPpsLKCQA */
    id: 'approveProcess',
    // 3. GÁN CONTEXT BAN ĐẦU
    context: stepContext,

    initial: 'onInit',
    states: {
        onInit: {
            on: {
                // Chuyển từ idle -> processing
                APPROVE: 'onProcessing',
            }
        },
        onProcessing: {
            invoke: {
                src: 'fetchStepFromServer',
                onDone: {
                    target: 'onProcessing',
                    actions: 'incrementStep',
                    guard: ({ context }) => context.step < 4
                }
            },
            on: {
                APPROVE: [
                    // Chuyển từ processing -> idle
                    {
                        target: 'onProcessing',
                        // 4. GÁN ACTION ĐÃ ĐỊNH NGHĨA VÀO ĐÂY
                        actions: 'incrementStep',
                        // 5. Tùy chọn: Thêm guard để ngăn chuyển trạng thái nếu step đã max
                        guard: ({ context }) => context.step < 4
                    },

                    {
                        target: 'onApproved',
                        description: 'Final step completed, moving to done.'
                    },


                ],
                REJECT: {
                    target: 'onReject'
                }
            }
        },
        // Thêm trạng thái hoàn thành
        onApproved: {
            type: 'final'
        },
        onReject: {
            type: 'final'
        }
    }
});