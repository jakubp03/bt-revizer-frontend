import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { validateRegistrationInputs } from "@/utils/registerValidation";
import api from "../../services/Api";
import { useAppDispatch } from "../../store/hooks";
import { setToken, setUser } from "../../store/slices/authSlice";

/**
 * Register component that handles user registration.
 * 
 * Provides a registration form with validation for:
 * - Username, email, password, and password confirmation fields
 * - Password matching validation
 * - Form submission with success/error feedback
 * 
 * The component displays different states:
 * - Registration form (initial state)
 * - Loading state during submission
 * - Success/error feedback after submission
 * 
 * Registration requests bypass the auth interceptor since no token is available yet.
 * 
 * @returns {React.ReactElement} Registration form or feedback component
 */
export default function Register() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isRegistrationSuccess, setIsRegistrationSuccess] = useState<boolean | null>(null);
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [, setIsLoginSuccess] = useState<boolean | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const unauthRequestConfig = { skipAuthInterceptor: true };
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const clearAllFields = () => {
        setCredentials({
            username: "",
            email: "",
            password: "",
        });
        setPasswordConfirm("");
        setEmailError(false);
        setEmailErrorMessage("");
        setPasswordError(false);
        setPasswordErrorMessage("");
        setPasswordConfirmError(false);
        setPasswordConfirmErrorMessage("");
        setNameError(false);
        setNameErrorMessage("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validation = validateRegistrationInputs({
            ...credentials,
            passwordConfirm
        });

        if (!validation.isValid) {
            setEmailError(validation.errors.emailError);
            setEmailErrorMessage(validation.errors.emailErrorMessage);
            setPasswordError(validation.errors.passwordError);
            setPasswordErrorMessage(validation.errors.passwordErrorMessage);
            setPasswordConfirmError(validation.errors.passwordConfirmError);
            setPasswordConfirmErrorMessage(validation.errors.passwordConfirmErrorMessage);
            setNameError(validation.errors.nameError);
            setNameErrorMessage(validation.errors.nameErrorMessage);
            return;
        }

        setIsSubmitted(true);
        setIsLoginSuccess(null);
        setIsRegistrationSuccess(null);

        try {
            await api.post('/auth/register', credentials, unauthRequestConfig);
            setIsRegistrationSuccess(true);

            try {
                const responseLogin = await api.post('/auth/authenticate', { email: credentials.email, password: credentials.password }, unauthRequestConfig);
                dispatch(setToken(responseLogin.data.access_token));
                dispatch(setUser(responseLogin.data.access_token));
                setIsLoginSuccess(true);
                clearAllFields();
                navigate('/');
            } catch (error) {
                setIsLoginSuccess(false);
                console.log("login after registration failed: " + error);
            }

        } catch (error) {
            setIsRegistrationSuccess(false);
            console.error("registration error " + error);
        } finally {
            setIsSubmitted(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-4">
                {isRegistrationSuccess === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Registration failed</AlertTitle>
                        <AlertDescription>Please check your input and try again.</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Register</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    autoComplete="username"
                                    value={credentials.username}
                                    disabled={isSubmitted}
                                    onChange={(e) =>
                                        setCredentials({
                                            ...credentials,
                                            username: e.target.value,
                                        })
                                    }
                                    aria-invalid={nameError}
                                />
                                {nameErrorMessage ? <p className="text-destructive text-sm">{nameErrorMessage}</p> : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    type="email"
                                    value={credentials.email}
                                    disabled={isSubmitted}
                                    onChange={(e) =>
                                        setCredentials({
                                            ...credentials,
                                            email: e.target.value,
                                        })
                                    }
                                    aria-invalid={emailError}
                                />
                                {emailErrorMessage ? <p className="text-destructive text-sm">{emailErrorMessage}</p> : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        autoComplete="new-password"
                                        type={showPassword ? "text" : "password"}
                                        value={credentials.password}
                                        disabled={isSubmitted}
                                        onChange={(e) =>
                                            setCredentials({
                                                ...credentials,
                                                password: e.target.value,
                                            })
                                        }
                                        className="pr-12"
                                        aria-invalid={passwordError}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1 h-7 w-7"
                                        disabled={isSubmitted}
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </Button>
                                </div>
                                {passwordErrorMessage ? <p className="text-destructive text-sm">{passwordErrorMessage}</p> : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="passwordConfirm"
                                        name="passwordConfirm"
                                        autoComplete="new-password"
                                        type={showPasswordConfirm ? "text" : "password"}
                                        value={passwordConfirm}
                                        disabled={isSubmitted}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        className="pr-12"
                                        aria-invalid={passwordConfirmError}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1 h-7 w-7"
                                        disabled={isSubmitted}
                                        onClick={() => setShowPasswordConfirm((prev) => !prev)}
                                        aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
                                    >
                                        {showPasswordConfirm ? <EyeOff /> : <Eye />}
                                    </Button>
                                </div>
                                {passwordConfirmErrorMessage ? <p className="text-destructive text-sm">{passwordConfirmErrorMessage}</p> : null}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitted}>
                                {isSubmitted ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                    "Register"
                                )}
                            </Button>
                        </form>

                        <Separator className="my-4" />

                        <p className="text-center text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline">
                                Login now
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


