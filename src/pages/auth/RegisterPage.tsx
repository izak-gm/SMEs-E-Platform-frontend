"use client";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/components/auth/contexts/AuthContext";
import { PasswordInput } from "@/components/ui/common-ui/PasswordInput";
import RequirementItem from "./utils/RequirementItem";
import { UserRole } from "@/components/auth/types/authTypes";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { registeruser } = useAuth(); // Get login from AuthContext

  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registeruser(data.email,data.password);
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "An error occurred. Please try again";
      if ((err as AxiosError<{ message: string }>)?.response?.data?.message) {
        errorMessage =
          (err as AxiosError<{ message: string }>).response?.data?.message ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast({
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // code to be implemented

  useEffect(() => {
    setRequirements({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const isPasswordStrong = Object.values(requirements).every(Boolean);

  const calculateStrength = (reqs: typeof requirements) => {
    const met = Object.values(reqs).filter(Boolean).length;
    return (met / 5) * 100;
  };

  const getStrengthColor = (reqs: typeof requirements) => {
    const strength = calculateStrength(reqs);
    if (strength === 100) return "bg-green-500";
    if (strength >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStrengthText = (reqs: typeof requirements) => {
    const strength = calculateStrength(reqs);
    if (strength === 100) return "Strong";
    if (strength >= 60) return "Moderate";
    return "Weak";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign up
          </CardTitle>
          <CardDescription className="text-center">
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full"
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                className={`${
                  password.length > 0
                    ? isPasswordStrong
                      ? "border-green-500 focus-visible:ring-green-500"
                      : "border-orange-500 focus-visible:ring-orange-500"
                    : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}

              {password.length > 0 && (
                <div className="space-y-2 mt-2">
                  <p className="text-sm font-medium">Password requirements:</p>
                  <ul className="space-y-1 text-sm">
                    <RequirementItem
                      met={requirements.length}
                      text="At least 6 characters long"
                    />
                    <RequirementItem
                      met={requirements.uppercase}
                      text="Contains uppercase letter"
                    />
                    <RequirementItem
                      met={requirements.lowercase}
                      text="Contains lowercase letter"
                    />
                    <RequirementItem
                      met={requirements.number}
                      text="Contains number"
                    />
                    <RequirementItem
                      met={requirements.specialChar}
                      text="Contains special character"
                    />
                  </ul>

                  <div className="pt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor(
                          requirements
                        )}`}
                        style={{ width: `${calculateStrength(requirements)}%` }}
                      />
                    </div>
                    <p className="text-sm mt-1 text-gray-600">
                      Password strength: {getStrengthText(requirements)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val: string) => {
                    if (watch("password") != val) {
                      return "Your passwords do not match";
                    }
                    return true;
                  },
                })}
              />
              {errors.confirmPassword && (
                <span className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/signin")}
            >
              Already have an account? Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
