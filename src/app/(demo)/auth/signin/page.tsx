"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { GitHubIcon, GoogleIcon } from "../../_components/auth/auth-icons";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.length > 0) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(null);
    }
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Demo authentication - replace with actual auth logic
      if (email === "demo@example.com" && password === "password123") {
        console.log("Demo sign in successful");
        router.push("/");
      } else {
        setError("Invalid credentials. Use demo@example.com / password123");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError("");
    try {
      // Demo OAuth - replace with actual OAuth logic
      console.log(`Demo ${provider} OAuth triggered`);
      setError(`${provider} OAuth not implemented in demo`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to sign in with ${provider}`
      );
    }
  };

  const isFormLoading = isSubmitting;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50">
        <div className="animate-pulse">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-4">
              <div className="h-12 w-12 bg-gray-200 rounded-xl mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded mx-auto w-32"></div>
              <div className="h-4 bg-gray-200 rounded mx-auto w-48"></div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 px-4 py-12">
      <div className="w-full max-w-md animate-in fade-in-0 duration-500">
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-r from-rose-400 via-orange-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-6 w-6 text-orange-400 animate-pulse" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent font-bold">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600 pt-2">
              Sign in to your account to continue your journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Demo Account Info */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 bg-rose-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-rose-800 font-semibold">
                  Demo Account
                </p>
              </div>
              <div className="text-xs text-rose-600 space-y-1">
                <p className="font-mono bg-white/50 px-2 py-1 rounded">
                  demo@example.com
                </p>
                <p className="font-mono bg-white/50 px-2 py-1 rounded">
                  password123
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    disabled={isFormLoading}
                    required
                    className={`pr-10 transition-all duration-200 focus:ring-2 ${
                      emailValid === null
                        ? "focus:ring-rose-200"
                        : emailValid
                        ? "ring-2 ring-green-200 border-green-300"
                        : "ring-2 ring-red-200 border-red-300"
                    }`}
                  />
                  {email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailValid ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-red-300 rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isFormLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isFormLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    disabled={isFormLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-rose-600 hover:text-rose-700 hover:underline transition-colors duration-200 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isFormLoading}
              >
                {isFormLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in to your account"
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleOAuth("google")}
                disabled={isFormLoading}
                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isFormLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    <span className="font-medium">Google</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuth("github")}
                disabled={isFormLoading}
                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isFormLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <GitHubIcon className="mr-2 h-5 w-5" />
                    <span className="font-medium">GitHub</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center gap-4 pt-8">
            <div className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-rose-600 hover:text-rose-700 hover:underline font-semibold transition-colors duration-200"
              >
                Create account
              </Link>
            </div>
            <div className="text-xs text-gray-400 text-center">
              Need help?{" "}
              <Link
                href="/auth/account-recovery"
                className="text-rose-500 hover:underline"
              >
                Account Recovery
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
