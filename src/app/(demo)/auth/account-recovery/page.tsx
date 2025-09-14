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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Key,
  HelpCircle,
  Lock,
  Sparkles,
} from "lucide-react";

interface RecoveryMethod {
  id: string;
  type: "email" | "phone" | "security" | "backup";
  title: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

export default function AccountRecoveryPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [securityAnswers, setSecurityAnswers] = useState<
    Record<string, string>
  >({});
  const [backupCode, setBackupCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const recoveryMethods: RecoveryMethod[] = [
    {
      id: "email",
      type: "email",
      title: "Email Recovery",
      description: "Send recovery link to your registered email address",
      icon: <Mail className="h-5 w-5" />,
      available: true,
    },
    {
      id: "phone",
      type: "phone",
      title: "SMS Recovery",
      description: "Receive verification code via text message",
      icon: <Phone className="h-5 w-5" />,
      available: true,
    },
    {
      id: "security",
      type: "security",
      title: "Security Questions",
      description: "Answer your pre-set security questions",
      icon: <HelpCircle className="h-5 w-5" />,
      available: true,
    },
    {
      id: "backup",
      type: "backup",
      title: "Backup Codes",
      description: "Use one of your saved backup recovery codes",
      icon: <Key className="h-5 w-5" />,
      available: true,
    },
  ];

  const securityQuestions = [
    { id: "pet", question: "What was the name of your first pet?" },
    { id: "school", question: "What elementary school did you attend?" },
    { id: "city", question: "In what city were you born?" },
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setError("");
  };

  const handleStepNavigation = (step: number) => {
    if (step === 2 && !selectedMethod) {
      setError("Please select a recovery method first");
      return;
    }
    setCurrentStep(step);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      // Validation based on method
      if (selectedMethod === "email" || selectedMethod === "phone") {
        if (!identifier.trim()) {
          throw new Error(`Please enter your ${selectedMethod}`);
        }
        if (
          selectedMethod === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
        ) {
          throw new Error("Please enter a valid email address");
        }
        if (selectedMethod === "phone" && !/^\+?[\d\s-()]+$/.test(identifier)) {
          throw new Error("Please enter a valid phone number");
        }
      }

      if (selectedMethod === "security") {
        const unanswered = securityQuestions.find(
          (q) => !securityAnswers[q.id]?.trim()
        );
        if (unanswered) {
          throw new Error("Please answer all security questions");
        }
      }

      if (selectedMethod === "backup") {
        if (!backupCode.trim()) {
          throw new Error("Please enter your backup code");
        }
        if (backupCode.length !== 8) {
          throw new Error("Backup code must be 8 characters long");
        }
      }

      // Demo recovery process
      console.log("Account recovery initiated:", {
        method: selectedMethod,
        identifier,
        securityAnswers,
        backupCode,
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate different outcomes
      if (selectedMethod === "email" && !identifier.includes("@")) {
        throw new Error("Email not found in our records");
      }

      if (selectedMethod === "backup" && backupCode !== "DEMO1234") {
        throw new Error("Invalid backup code");
      }

      // Success - move to final step
      setCurrentStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Recovery failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Choose Recovery Method
              </h3>
              <p className="text-sm text-gray-600">
                Select how you&apos;d like to recover access to your account
              </p>
            </div>

            <RadioGroup
              value={selectedMethod}
              onValueChange={handleMethodSelect}
            >
              <div className="space-y-3">
                {recoveryMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      selectedMethod === method.id
                        ? "border-indigo-300 bg-indigo-50"
                        : method.available
                        ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                    }`}
                    onClick={() =>
                      method.available && handleMethodSelect(method.id)
                    }
                  >
                    <RadioGroupItem
                      value={method.id}
                      disabled={!method.available}
                    />
                    <div
                      className={`p-2 rounded-lg ${
                        selectedMethod === method.id
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {method.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                      {!method.available && (
                        <p className="text-xs text-red-500 mt-1">
                          Not available for your account
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 2:
        const method = recoveryMethods.find((m) => m.id === selectedMethod);
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  {method?.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {method?.title}
              </h3>
              <p className="text-sm text-gray-600">{method?.description}</p>
            </div>

            {selectedMethod === "email" && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-gray-500">
                  We&apos;ll send a recovery link to this email address
                </p>
              </div>
            )}

            {selectedMethod === "phone" && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your registered phone number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-gray-500">
                  We&apos;ll send a verification code to this number
                </p>
              </div>
            )}

            {selectedMethod === "security" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center mb-4">
                  Please answer the security questions you set up for your
                  account
                </p>
                {securityQuestions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <Label
                      htmlFor={question.id}
                      className="text-gray-700 font-medium"
                    >
                      {question.question}
                    </Label>
                    <Input
                      id={question.id}
                      type="text"
                      placeholder="Enter your answer"
                      value={securityAnswers[question.id] || ""}
                      onChange={(e) =>
                        setSecurityAnswers((prev) => ({
                          ...prev,
                          [question.id]: e.target.value,
                        }))
                      }
                      className="h-12"
                    />
                  </div>
                ))}
              </div>
            )}

            {selectedMethod === "backup" && (
              <div className="space-y-2">
                <Label htmlFor="backup" className="text-gray-700 font-medium">
                  Backup Recovery Code
                </Label>
                <Input
                  id="backup"
                  type="text"
                  placeholder="Enter your 8-character backup code"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  className="h-12 font-mono"
                  maxLength={8}
                />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Demo code:</strong> DEMO1234
                    <br />
                    Use this code to test the recovery process
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-yellow-800" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Recovery Initiated!
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedMethod === "email" &&
                  "Check your email for recovery instructions"}
                {selectedMethod === "phone" &&
                  "Check your phone for the verification code"}
                {selectedMethod === "security" &&
                  "Your security answers have been verified"}
                {selectedMethod === "backup" &&
                  "Your backup code has been verified"}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-medium text-green-800 mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-green-700 text-left space-y-1">
                <li>• You&apos;ll receive further instructions shortly</li>
                <li>• Follow the steps to regain access to your account</li>
                <li>• Set up additional security measures if needed</li>
                <li>• Contact support if you need additional help</li>
              </ul>
            </div>

            <Button
              onClick={() => (window.location.href = "/auth/signin")}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Return to Sign In
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <div className="animate-pulse">
          <Card className="w-full max-w-2xl">
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 px-4 py-12">
      <div className="w-full max-w-2xl animate-in fade-in-0 duration-500">
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Lock className="h-6 w-6 text-blue-400 animate-pulse" />
                </div>
              </div>
            </div>

            <CardTitle className="text-3xl text-center bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent font-bold">
              Account Recovery
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600 pt-2">
              Let&apos;s help you regain access to your account safely and
              securely
            </CardDescription>

            {/* Progress indicator */}
            <div className="pt-6">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Recovery Progress</span>
                <span>Step {currentStep} of 3</span>
              </div>
              <Progress value={(currentStep / 3) * 100} className="h-2" />
            </div>
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

            {renderStepContent()}

            {currentStep < 3 && (
              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <Button
                    onClick={() => handleStepNavigation(currentStep - 1)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}

                <Button
                  onClick={() =>
                    currentStep === 1 ? handleStepNavigation(2) : handleSubmit()
                  }
                  className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
                  disabled={
                    isSubmitting || (currentStep === 1 && !selectedMethod)
                  }
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : currentStep === 1 ? (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  ) : (
                    <Shield className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting
                    ? "Processing..."
                    : currentStep === 1
                    ? "Continue"
                    : "Recover Account"}
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center gap-4 pt-6">
            <Link
              href="/auth/signin"
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>

            <div className="text-xs text-gray-400 text-center">
              Still having trouble?{" "}
              <Link href="/contact" className="text-indigo-500 hover:underline">
                Contact Support
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
