import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import api from "../../services/Api";
import { useAppDispatch } from "../../store/hooks";
import { setToken, setUser } from "../../store/slices/authSlice";

/**
 * Login component that handles user authentication.
 * 
 * Provides a login form with email and password fields. On successful authentication,
 * stores the access token and user data in Redux state and navigates to the home page.
 * The authentication request bypasses the auth interceptor since no token is available yet.
 * 
 * @returns {React.ReactElement} Login form component
 */
export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginSuccess, setIsLoginSuccess] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const unauthRequestConfig = { skipAuthInterceptor: true };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setIsLoginSuccess(null);

        try {
            // Send login request to the server, implicitly skipping the auth interceptor
            const response = await api.post('/auth/authenticate', credentials, unauthRequestConfig);
            dispatch(setToken(response.data.access_token));
            dispatch(setUser(response.data.access_token));
            setIsLoginSuccess(true);
            navigate('/');

        } catch (error) {
            setIsLoginSuccess(false);
            console.error('Login failed:', error);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-4">
                {isLoginSuccess === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Login failed</AlertTitle>
                        <AlertDescription>Invalid email or password.</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={credentials.email}
                                    disabled={isLoading}
                                    onChange={(e) =>
                                        setCredentials({
                                            ...credentials,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={credentials.password}
                                        disabled={isLoading}
                                        onChange={(e) =>
                                            setCredentials({
                                                ...credentials,
                                                password: e.target.value,
                                            })
                                        }
                                        className="pr-12"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1 h-7 w-7"
                                        disabled={isLoading}
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </Button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                    "Login"
                                )}
                            </Button>

                            <Separator />

                            <p className="text-muted-foreground text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link to="/register" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}