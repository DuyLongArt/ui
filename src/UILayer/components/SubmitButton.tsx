import { useState } from 'react';

// A mock API call that takes 2 seconds to resolve
const someAsyncOperation = () => new Promise(resolve => setTimeout(resolve, 2000));

export function SubmitButton() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClick = async () => {
        // Prevent new clicks if already loading
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        try {
            await someAsyncOperation();
            console.log('Operation complete!');
            // Handle success (e.g., show a message, redirect)
        } catch (error) {
            console.error('Operation failed:', error);
            // Handle the error
        } finally {
            // CRITICAL: Always re-enable the button in a 'finally' block
            // This ensures it becomes clickable again even if the async call fails.
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleClick} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Submit Action'}
        </button>
    );
}