import { useState } from 'react';

export const useAlert = () => {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setError('');
    };

    const showError = (msg: string) => {
        setError(msg);
        setSuccess('');
    };

    const clear = () => {
        setSuccess('');
        setError('');
    };



    return { success, error, showSuccess, showError, clear };
};
