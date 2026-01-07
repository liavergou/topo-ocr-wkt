import { AxiosError } from 'axios';

/** Extracts error messages from API responses and exceptions. */

//Για να πιάνει τα μηνύματα του back. Παραγωγή από llm
export function getErrorMessage(error: unknown): string {
    if (error instanceof AxiosError && error.response) {
        const responseData = error.response.data;

        // 1. Έλεγχος για ASP.NET Core validation errors
        if (responseData && responseData.errors && typeof responseData.errors === 'object') {
            const firstErrorField = Object.keys(responseData.errors)[0];
            if (firstErrorField && responseData.errors[firstErrorField]?.length > 0) {
                return responseData.errors[firstErrorField][0];
            }
        }

        // 2. Έλεγχος για custom message
        if (responseData && typeof responseData.message === 'string') {
            return responseData.message;
        }

        // 3. Έλεγχος για title
        if (responseData && typeof responseData.title === 'string') {
            return responseData.title;
        }

        // 4. Fallback με το status text
        return `Σφάλμα ${error.response.status}: ${error.response.statusText}`;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Προέκυψε ένα άγνωστο σφάλμα.";
}