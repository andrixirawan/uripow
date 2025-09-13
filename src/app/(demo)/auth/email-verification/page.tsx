"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  SuccessAnimation,
  EmailSentIllustration,
} from "../../_components/auth/auth-icons";

import {
  Mail,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Shield,
} from "lucide-react";

function EmailVerificationContent() {
  const [status, setStatus] = useState<
    "pending" | "verifying" | "success" | "error" | "expired"
  >("pending");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "user@example.com";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Auto-verify if token is present
    if (token && mounted) {
      verifyEmail(token);
    }
  }, [token, mounted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && status === "pending") {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend, status]);

  const verifyEmail = async (verificationToken: string) => {
    setStatus("verifying");
    setError("");

    try {
      // Demo verification logic - replace with actual API call
      console.log("Verifying email with token:", verificationToken);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate different outcomes based on token
      if (verificationToken === "expired") {
        setStatus("expired");
        setError("Verification link has expired. Please request a new one.");
      } else if (verificationToken === "invalid") {
        setStatus("error");
        setError(
          "Invalid verification link. Please check your email or request a new one."
        );
      } else {
        setStatus("success");
        // Auto-redirect after success
        setTimeout(() => {
          router.push("/auth/signin?verified=true");
        }, 3000);
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to verify email");
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setError("");

    try {
      // Demo resend logic - replace with actual API call
      console.log("Resending verification email to:", email);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCanResend(false);
      setCountdown(60);
      setStatus("pending");
    } catch (err) {
      setError("Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  const handleManualVerification = () => {
    // Simulate manual verification with a demo token
    verifyEmail("demo-token");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="animate-pulse">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-4">
              <div className="h-16 w-16 bg-gray-200 rounded-2xl mx-auto"></div>
              <div className="h-8 bg-gray-200 rounded mx-auto w-48"></div>
              <div className="h-4 bg-gray-200 rounded mx-auto w-64"></div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <SuccessAnimation className="h-20 w-20" />;
      case "verifying":
        return (
          <div className="h-16 w-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        );
      case "error":
      case "expired":
        return (
          <div className="h-16 w-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
        );
      default:
        return (
          <div className="relative">
            <div className="h-16 w-16 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
        );
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "success":
        return "Email verified successfully!";
      case "verifying":
        return "Verifying your email...";
      case "error":
        return "Verification failed";
      case "expired":
        return "Link expired";
      default:
        return "Verify your email";
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case "success":
        return "Your email has been verified. You'll be redirected to sign in shortly.";
      case "verifying":
        return "Please wait while we verify your email address...";
      case "error":
        return "There was a problem verifying your email. Please try again.";
      case "expired":
        return "Your verification link has expired. Please request a new one.";
      default:
        return "We've sent a verification link to your email address. Please check your inbox.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 py-12">
      <div className="w-full max-w-lg animate-in fade-in-0 duration-500">
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-8">
            <div className="flex justify-center mb-6">{getStatusIcon()}</div>

            <CardTitle
              className={`text-3xl text-center font-bold ${
                status === "success"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                  : status === "error" || status === "expired"
                  ? "text-red-600"
                  : "bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent"
              }`}
            >
              {getStatusTitle()}
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600 pt-2">
              {getStatusDescription()}
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

            {status === "success" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-emerald-800 mb-2">
                    Welcome aboard!
                  </h3>
                  <p className="text-sm text-emerald-700 mb-4">
                    Your email address has been successfully verified. Your
                    account is now active and ready to use.
                  </p>
                  <div className="bg-white/70 border border-emerald-200 rounded-lg p-3">
                    <p className="text-xs font-mono text-emerald-600">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">
                      Redirecting automatically...
                    </p>
                  </div>
                  <p className="text-xs text-blue-600">
                    You'll be taken to the sign-in page in a few seconds, or
                    click the button below to continue immediately.
                  </p>
                </div>

                <Button
                  onClick={() => router.push("/auth/signin?verified=true")}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue to sign in
                </Button>
              </div>
            )}

            {status === "verifying" && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                  <p className="text-sm text-blue-700">
                    Processing your verification request...
                  </p>
                </div>
              </div>
            )}

            {(status === "pending" ||
              status === "error" ||
              status === "expired") && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6">
                  <div className="flex justify-center mb-4">
                    <EmailSentIllustration className="h-16 w-16" />
                  </div>
                  <h3 className="font-semibold text-teal-800 mb-2 text-center">
                    Check your email
                  </h3>
                  <p className="text-sm text-teal-700 mb-4 text-center">
                    We sent a verification link to:
                  </p>
                  <div className="bg-white/70 border border-teal-200 rounded-lg p-3 text-center">
                    <p className="text-sm font-mono text-teal-600">{email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Demo verification button for testing */}
                  <Button
                    onClick={handleManualVerification}
                    className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Demo: Verify Email Now
                  </Button>

                  <Button
                    onClick={handleResendEmail}
                    disabled={!canResend || isResending}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : canResend ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend verification email
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Resend in {countdown}s
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Email not received?
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Check your spam or junk folder</li>
                        <li>• Make sure you entered the correct email</li>
                        <li>• Verification links expire after 15 minutes</li>
                        <li>• Contact support if issues persist</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center gap-4 pt-6">
            <div className="text-sm text-gray-600">
              Wrong email address?{" "}
              <Link
                href="/auth/signup"
                className="text-teal-600 hover:text-teal-700 hover:underline font-semibold transition-colors duration-200"
              >
                Sign up again
              </Link>
            </div>
            <div className="text-xs text-gray-400 text-center">
              Already verified?{" "}
              <Link
                href="/auth/signin"
                className="text-teal-500 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Loading fallback component
function EmailVerificationLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="animate-pulse">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <div className="h-16 w-16 bg-gray-200 rounded-2xl mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded mx-auto w-48"></div>
            <div className="h-4 bg-gray-200 rounded mx-auto w-64"></div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<EmailVerificationLoading />}>
      <EmailVerificationContent />
    </Suspense>
  );
}
