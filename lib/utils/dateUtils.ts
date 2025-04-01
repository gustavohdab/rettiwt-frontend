import { format, parseISO } from "date-fns";

/**
 * Format a date to Month Year format (e.g., "January 2022")
 * @param dateString ISO date string
 */
export function formatDateToMonthYear(dateString: string): string {
    try {
        const date =
            typeof dateString === "string" ? parseISO(dateString) : dateString;
        return format(date, "MMMM yyyy");
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
    }
}

/**
 * Format a date to Month Day, Year format (e.g., "January 1, 2022")
 * @param dateString ISO date string
 */
export function formatDateToMonthDayYear(dateString: string): string {
    try {
        const date =
            typeof dateString === "string" ? parseISO(dateString) : dateString;
        return format(date, "MMMM d, yyyy");
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
    }
}
