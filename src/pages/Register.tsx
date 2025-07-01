import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { registerProvider } from "@/services/providerService";

interface ValidationErrors {
  businessName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  description?: string;
  logo?: string;
  general?: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const validateForm = (formData: FormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    const businessName = formData.get("businessName")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const logo = formData.get("logo") as File | null;

    if (!businessName) {
      errors.businessName = "Business name is required";
    } else if (businessName.length < 3) {
      errors.businessName = "Business name must be at least 3 characters";
    } else if (businessName.length > 50) {
      errors.businessName = "Business name must be less than 50 characters";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)
    ) {
      errors.password =
        "Password must include uppercase, lowercase, number, and special character";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    const phoneRegex = /^(\+94|0)?[1-9][0-9]{8}$/;
    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      errors.phone = "Please enter a valid Sri Lankan phone number";
    }

    if (description && description.length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    if (logo && logo.size > 0) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const maxSizeInMB = 5;
      if (!allowedTypes.includes(logo.type)) {
        errors.logo = "Logo must be a JPEG, PNG, or WebP image";
      } else if (logo.size > maxSizeInMB * 1024 * 1024) {
        errors.logo = `Logo file size must be less than ${maxSizeInMB}MB`;
      }
    }

    return errors;
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const maxSizeInMB = 5;

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          logo: "Logo must be a JPEG, PNG, or WebP image",
        }));
        return;
      }
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          logo: `Logo file size must be less than ${maxSizeInMB}MB`,
        }));
        return;
      }

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.logo;
        return newErrors;
      });

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    const fileInput = document.getElementById("logo") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.logo;
      return newErrors;
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitDisabled) return;

    setSubmitDisabled(true);
    setTimeout(() => setSubmitDisabled(false), 3000);

    setErrors({});
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    if (logoFile) formData.set("logo", logoFile);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await registerProvider(formData);
      navigate("/provider-dashboard");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const renderError = (fieldName: keyof ValidationErrors) =>
    errors[fieldName] && (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm" aria-live="polite">
        <AlertCircle size={14} aria-hidden="true" />
        <span>{errors[fieldName]}</span>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/sigup.jpg')" }}
    >
      <div className="min-h-screen bg-black/30">
        <div className="container mx-auto px-4 py-10">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Provider Registration</CardTitle>
                <CardDescription className="text-center">
                  Fill in your details to create a provider account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-6 mt-2" autoComplete="off">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertCircle size={16} />
                        <span className="font-medium">{errors.general}</span>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        placeholder="e.g., Ella Spice Garden"
                        aria-invalid={!!errors.businessName}
                        className={`bg-white/50 ${
                          errors.businessName ? "border-red-500 bg-red-50" : ""
                        }`}
                      />
                      {renderError("businessName")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+94 70 123 4567"
                        aria-invalid={!!errors.phone}
                        className={`bg-white/50 ${errors.phone ? "border-red-500 bg-red-50" : ""}`}
                      />
                      {renderError("phone")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter business email"
                      aria-invalid={!!errors.email}
                      className={`bg-white/50 ${errors.email ? "border-red-500 bg-red-50" : ""}`}
                    />
                    {renderError("email")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          aria-invalid={!!errors.password}
                          className={`pr-10 bg-white/50 ${
                            errors.password ? "border-red-500 bg-red-50" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {renderError("password")}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          aria-invalid={!!errors.confirmPassword}
                          className={`pr-10 bg-white/50 ${
                            errors.confirmPassword ? "border-red-500 bg-red-50" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          title={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {renderError("confirmPassword")}
                    </div>
                  </div>
                  {/* Logo Upload - Side by Side Layout */}
                  <div className="space-y-2">
                    <Label htmlFor="logo">Business Logo</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                          errors.logo
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-gray-400 bg-gray-50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="mx-auto flex justify-center">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          </div>
                          <div className="flex flex-col text-sm text-gray-600">
                            <label
                              htmlFor="logo"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 px-3 py-2 mx-auto mb-2"
                            >
                              <span>Upload a file</span>
                              <Input
                                id="logo"
                                name="logo"
                                type="file"
                                className="sr-only"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleLogoChange}
                              />
                            </label>
                            <p className="text-xs">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            PNG, JPG, WebP up to 5MB
                          </p>
                        </div>
                      </div>

                      {/* Preview Area */}
                      <div className="flex items-center justify-center min-h-[140px] border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        {logoPreview ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                          >
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 bg-white shadow-sm">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={removeLogo}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                                title="Remove logo"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <div className="mt-2 text-center text-sm text-gray-600">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <ImageIcon size={14} />
                                <span className="truncate max-w-24" title={logoFile?.name}>
                                  {logoFile?.name}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {logoFile && `${(logoFile.size / (1024 * 1024)).toFixed(2)} MB`}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-center text-gray-400">
                            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Logo preview</p>
                            <p className="text-xs">will appear here</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {renderError("logo")}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your services and what makes you unique"
                      rows={3}
                      aria-invalid={!!errors.description}
                      className={`bg-white/50 ${
                        errors.description ? "border-red-500 bg-red-50" : ""
                      }`}
                    />
                    {renderError("description")}
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={loading || submitDisabled}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 text-base"
                    >
                      {loading ? "Creating Account..." : "Create Provider Account"}
                    </Button>
                  </motion.div>
                </form>
                <div className="text-center pt-6">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary-500 hover:text-primary-600 font-medium"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
