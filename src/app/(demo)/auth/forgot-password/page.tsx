"use client";

import { useState, useEffect } from "react";
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
import {
  EmailSentIllustration,
  SuccessAnimation,
} from "@/components/auth/auth-icons";

import {
  ArrowLeft,
  Mail,
  Loader2,
  CheckCircle2,
  Sparkles,
  Shield,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

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

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Demo forgot password - replace with actual logic
      console.log("Demo forgot password for:", email);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      setCanResend(false);
      setCountdown(60); // 60 second cooldown
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    setIsSubmitting(true);

    try {
      // Demo resend logic
      console.log("Resending email to:", email);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCanResend(false);
      setCountdown(60);
    } catch (err) {
      setError("Failed to resend email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setEmail("");
    setEmailValid(null);
    setError("");
    setCountdown(0);
    setCanResend(true);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-pulse">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-4">
              <div className="h-16 w-16 bg-gray-200 rounded-2xl mx-auto"></div>
              <div className="h-8 bg-gray-200 rounded mx-auto w-40"></div>
              <div className="h-4 bg-gray-200 rounded mx-auto w-64"></div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      <div className="w-full max-w-md animate-in fade-in-0 duration-500">
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {success ? (
                  <SuccessAnimation className="h-16 w-16" />
                ) : (
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                )}
                {!success && (
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-6 w-6 text-indigo-400 animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            <CardTitle className="text-3xl text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
              {success ? "Check your email" : "Reset your password"}
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600 pt-2">
              {success
                ? "We've sent password reset instructions to your email"
                : "Enter your email address and we'll send you reset instructions"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2 duration-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="space-y-6 text-center">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex justify-center mb-4">
                    <EmailSentIllustration className="h-20 w-20" />
                  </div>
                  <h3 className="font-semibold text-green-800 mb-2">
                    Email sent successfully!
                  </h3>
                  <p className="text-sm text-green-700 mb-4">
                    We've sent password reset instructions to:
                  </p>
                  <p className="text-sm font-mono bg-white/70 px-3 py-2 rounded-lg border border-green-200">
                    {email}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          What to do next:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Check your email inbox for our message</li>
                          <li>• Click the reset link within 15 minutes</li>
                          <li>• Check your spam folder if you don't see it</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={handleResendEmail}
                      disabled={!canResend || isSubmitting}
                      className="w-full h-12 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : canResend ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend email
                        </>
                      ) : (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Resend in {countdown}s
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={resetForm}
                      className="w-full text-gray-600 hover:text-gray-800"
                    >
                      Try a different email address
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      disabled={isSubmitting}
                      required
                      autoFocus
                      className={`pr-10 h-12 transition-all duration-200 focus:ring-2 ${
                        emailValid === null
                          ? "focus:ring-blue-200"
                          : emailValid
                          ? "ring-2 ring-green-200 border-green-300"
                          : "ring-2 ring-red-200 border-red-300"
                      }`}
                    />
                    {email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {emailValid ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {emailValid === false && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  disabled={isSubmitting || !email || emailValid === false}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending instructions...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send reset instructions
                    </>
                  )}
                </Button>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Security notice
                      </p>
                      <p className="text-xs text-gray-600">
                        Reset links expire after 15 minutes for your security.
                        If you don't receive an email, check your spam folder.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center gap-4 pt-6">
            <Link
              href="/auth/signin"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>

            <div className="text-xs text-gray-400 text-center">
              Need more help?{" "}
              <Link
                href="/auth/account-recovery"
                className="text-blue-500 hover:underline"
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
