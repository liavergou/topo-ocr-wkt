import { AxiosError } from 'axios';

/** Extracts error messages from API responses and exceptions. */

export function getErrorMessage(error: unknown): string {
    if (error instanceof AxiosError && error.response) {
        const responseData = error.response.data;


        if (responseData && responseData.errors && typeof responseData.errors === 'object') {
            const firstErrorField = Object.keys(responseData.errors)[0];
            if (firstErrorField && responseData.errors[firstErrorField]?.length > 0) {
                return responseData.errors[firstErrorField][0];
            }
        }


        if (responseData && typeof responseData.message === 'string') {
            return responseData.message;
        }


        if (responseData && typeof responseData.title === 'string') {
            return responseData.title;
        }


        return `Σφάλμα ${error.response.status}: ${error.response.statusText}`;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Προέκυψε ένα άγνωστο σφάλμα.";
}