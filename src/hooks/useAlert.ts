import { useState, useCallback } from 'react';

/**
 * Custom hook for managing application success and error messages.
 */
export const useAlert = () => {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const showSuccess = useCallback((msg: string) => {
        setSuccess(msg);
        setError('');
    }, []);

    const showError = useCallback((msg: string) => {
        setError(msg);
        setSuccess('');
    }, []);

    const clear = useCallback(() => {
        setSuccess('');
        setError('');
    }, []);

    return { success, error, showSuccess, showError, clear };
};
