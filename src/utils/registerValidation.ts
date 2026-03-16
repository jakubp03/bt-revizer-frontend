/**
 * Validation utility functions for form inputs
 */

export interface ValidationErrors {
    emailError: boolean;
    emailErrorMessage: string;
    passwordError: boolean;
    passwordErrorMessage: string;
    passwordConfirmError: boolean;
    passwordConfirmErrorMessage: string;
    nameError: boolean;
    nameErrorMessage: string;
}

export interface RegistrationCredentials {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

/**
 * Validates registration form inputs
 * 
 * @param credentials - User registration credentials
 * @returns Object containing validation errors and isValid flag
 */
export const validateRegistrationInputs = (
    credentials: RegistrationCredentials
): { isValid: boolean; errors: ValidationErrors } => {
    let isValid = true;
    const errors: ValidationErrors = {
        emailError: false,
        emailErrorMessage: '',
        passwordError: false,
        passwordErrorMessage: '',
        passwordConfirmError: false,
        passwordConfirmErrorMessage: '',
        nameError: false,
        nameErrorMessage: '',
    };

    // email validation
    if (!credentials.email || !/\S+@\S+\.\S+/.test(credentials.email)) {
        errors.emailError = true;
        errors.emailErrorMessage = 'Please enter a valid email address.';
        isValid = false;
    }

    // password length validation
    if (!credentials.password || credentials.password.length < 6) {
        errors.passwordError = true;
        errors.passwordErrorMessage = 'Password must be at least 6 characters long.';
        isValid = false;
    }

    // password confirmation match validation
    if (!credentials.password || credentials.password !== credentials.passwordConfirm) {
        errors.passwordConfirmError = true;
        errors.passwordConfirmErrorMessage = 'Passwords dont match.';
        isValid = false;
    }

    // username validation
    if (!credentials.username || credentials.username.length < 1) {
        errors.nameError = true;
        errors.nameErrorMessage = 'Name is required.';
        isValid = false;
    }

    return { isValid, errors };
};
