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
import { Progress } from "@/components/ui/progress";
import { GitHubIcon, GoogleIcon } from "../../_components/auth/auth-icons";

import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  UserPlus,
  Sparkles,
  Shield,
  Zap,
  AlertCircle,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationState {
  name: boolean | null;
  email: boolean | null;
  password: boolean | null;
  confirmPassword: boolean | null;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validation, setValidation] = useState<ValidationState>({
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time validation functions
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ): boolean => {
    return confirmPassword === password && confirmPassword.length > 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    setError("");

    // Real-time validation
    const newValidation = { ...validation };

    switch (field) {
      case "name":
        newValidation.name = value.length > 0 ? validateName(value) : null;
        break;
      case "email":
        newValidation.email = value.length > 0 ? validateEmail(value) : null;
        break;
      case "password":
        newValidation.password =
          value.length > 0 ? validatePassword(value) : null;
        if (formData.confirmPassword) {
          newValidation.confirmPassword = validateConfirmPassword(
            formData.confirmPassword,
            value
          );
        }
        break;
      case "confirmPassword":
        newValidation.confirmPassword =
          value.length > 0
            ? validateConfirmPassword(value, newFormData.password)
            : null;
        break;
    }

    setValidation(newValidation);
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number): string => {
    if (strength <= 1) return "from-red-400 to-red-500";
    if (strength <= 3) return "from-yellow-400 to-orange-500";
    return "from-green-400 to-emerald-500";
  };

  const getStrengthText = (strength: number): string => {
    if (strength <= 1) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  const validateForm = (): string | null => {
    if (!validateName(formData.name))
      return "Please enter a valid name (at least 2 characters)";
    if (!validateEmail(formData.email))
      return "Please enter a valid email address";
    if (!validatePassword(formData.password))
      return "Password must be at least 8 characters long";
    if (!validateConfirmPassword(formData.confirmPassword, formData.password))
      return "Passwords do not match";
    if (!agreedToTerms) return "Please agree to the terms and conditions";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Demo registration - replace with actual signup logic
      console.log("Demo sign up successful:", { ...formData, newsletterOptIn });
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/auth/email-verification");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
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
          : `Failed to sign up with ${provider}`
      );
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const progressValue =
    Object.values(validation).filter((v) => v === true).length * 25;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <div className="animate-pulse">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-4">
              <div className="h-16 w-16 bg-gray-200 rounded-2xl mx-auto"></div>
              <div className="h-8 bg-gray-200 rounded mx-auto w-40"></div>
              <div className="h-4 bg-gray-200 rounded mx-auto w-56"></div>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 px-4 py-12">
      <div className="w-full max-w-lg animate-in fade-in-0 duration-500">
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Zap className="h-6 w-6 text-yellow-400 animate-bounce" />
                </div>
              </div>
            </div>

            <CardTitle className="text-3xl text-center bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent font-bold">
              Join our community
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600 pt-2">
              Create your account and start building amazing things
            </CardDescription>

            {/* Progress indicator */}
            <div className="pt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Profile completion</span>
                <span>{Math.round(progressValue)}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2 duration-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isSubmitting}
                    required
                    className={`pr-10 transition-all duration-200 focus:ring-2 ${
                      validation.name === null
                        ? "focus:ring-violet-200"
                        : validation.name
                        ? "ring-2 ring-green-200 border-green-300"
                        : "ring-2 ring-red-200 border-red-300"
                    }`}
                  />
                  {formData.name && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {validation.name ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {validation.name === false && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Name must be at least 2 characters long
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isSubmitting}
                    required
                    className={`pr-10 transition-all duration-200 focus:ring-2 ${
                      validation.email === null
                        ? "focus:ring-violet-200"
                        : validation.email
                        ? "ring-2 ring-green-200 border-green-300"
                        : "ring-2 ring-red-200 border-red-300"
                    }`}
                  />
                  {formData.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {validation.email ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {validation.email === false && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    disabled={isSubmitting}
                    required
                    className={`pr-10 transition-all duration-200 focus:ring-2 ${
                      validation.password === null
                        ? "focus:ring-violet-200"
                        : validation.password
                        ? "ring-2 ring-green-200 border-green-300"
                        : "ring-2 ring-red-200 border-red-300"
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>

                {formData.password && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getStrengthColor(
                            passwordStrength
                          )} transition-all duration-300`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength <= 1
                            ? "text-red-500"
                            : passwordStrength <= 3
                            ? "text-orange-500"
                            : "text-green-500"
                        }`}
                      >
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div
                        className={`flex items-center gap-1 ${
                          formData.password.length >= 8
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {formData.password.length >= 8 ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3 border border-gray-300 rounded-full" />
                        )}
                        <span>8+ characters</span>
                      </div>

                      <div
                        className={`flex items-center gap-1 ${
                          /[A-Z]/.test(formData.password)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {/[A-Z]/.test(formData.password) ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3 border border-gray-300 rounded-full" />
                        )}
                        <span>Uppercase</span>
                      </div>

                      <div
                        className={`flex items-center gap-1 ${
                          /\d/.test(formData.password)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {/\d/.test(formData.password) ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3 border border-gray-300 rounded-full" />
                        )}
                        <span>Number</span>
                      </div>

                      <div
                        className={`flex items-center gap-1 ${
                          /[^A-Za-z0-9]/.test(formData.password)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {/[^A-Za-z0-9]/.test(formData.password) ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3 border border-gray-300 rounded-full" />
                        )}
                        <span>Symbol</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    disabled={isSubmitting}
                    required
                    className={`pr-10 transition-all duration-200 focus:ring-2 ${
                      validation.confirmPassword === null
                        ? "focus:ring-violet-200"
                        : validation.confirmPassword
                        ? "ring-2 ring-green-200 border-green-300"
                        : "ring-2 ring-red-200 border-red-300"
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {validation.confirmPassword === false && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Passwords do not match
                  </p>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="newsletter"
                    checked={newsletterOptIn}
                    onCheckedChange={(checked) =>
                      setNewsletterOptIn(checked as boolean)
                    }
                    disabled={isSubmitting}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="newsletter"
                    className="text-sm text-gray-600 cursor-pointer leading-5"
                  >
                    I&apos;d like to receive product updates, tips, and special
                    offers via email
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                      setAgreedToTerms(checked as boolean)
                    }
                    disabled={isSubmitting}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-gray-600 cursor-pointer leading-5"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-violet-600 hover:text-violet-700 hover:underline font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-violet-600 hover:text-violet-700 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create my account
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleOAuth("google")}
                disabled={isSubmitting}
                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
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
                disabled={isSubmitting}
                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
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

          <CardFooter className="flex flex-col items-center justify-center gap-4 pt-6">
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-violet-600 hover:text-violet-700 hover:underline font-semibold transition-colors duration-200"
              >
                Sign in instead
              </Link>
            </div>
            <div className="text-xs text-gray-400 text-center">
              <Shield className="inline h-3 w-3 mr-1" />
              Your information is secure and encrypted
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
