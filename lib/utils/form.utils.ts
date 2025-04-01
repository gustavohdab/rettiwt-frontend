import { ValidationError } from "@/types/api";

/**
 * Extracts a specific field's error message from a potential array of validation errors.
 *
 * @param fieldName - The name of the form field (e.g., 'email', 'password').
 * @param errors - The error state, which can be null, a string (for general errors),
 *                 or an array of ValidationError objects (for validation errors).
 * @returns The error message string for the specified field, or undefined if no specific error exists.
 */
export const getFieldError = (
    fieldName: string,
    errors: string | ValidationError[] | null
): string | undefined => {
    if (!errors || typeof errors === "string") {
        // No field-specific errors if error state is a string or null
        return undefined;
    }
    // Find the error object matching the field name
    const fieldError = errors.find((err) => err.field === fieldName);
    return fieldError?.message;
};

// Add other form-related utility functions here in the future
