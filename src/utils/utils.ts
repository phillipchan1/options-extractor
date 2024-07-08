type ValidationType = 'string' | 'number' | string[];

export function validateObjectShape<T>(obj: any, shape: { [K in keyof T]: ValidationType }): obj is T {
    for (const [key, expectedType] of Object.entries(shape)) {
        if (!(key in obj)) return false;

        if (expectedType === 'string') {
            if (typeof obj[key] !== 'string') return false;
        } else if (expectedType === 'number') {
            if (typeof obj[key] !== 'number') return false;
        } else if (Array.isArray(expectedType)) {
            if (!expectedType.includes(obj[key])) return false;
        }
    }
    return true;
}

export function formatDate(dateString: string | null | undefined): string | null {
    if (!dateString) {
        return null;
    }

    // Check if the date is already in ISO 8601 format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    // If not, attempt to parse and format the date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.warn(`Invalid date: ${dateString}`);
        return null;
    }
    return date.toISOString().split('T')[0];
}
