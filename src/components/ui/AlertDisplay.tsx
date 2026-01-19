import { Alert } from '@mui/material';
import type { AlertDisplayProps } from '@/types';

/**
 * Reusable alert component for displaying success and error messages
 */
export const AlertDisplay = ({ success, error, onClose }: AlertDisplayProps) => {
    return (
        <>
            {success && (
                <Alert variant="filled" severity="success" onClose={onClose} sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert variant="filled" severity="error" onClose={onClose} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
        </>
    );
};
