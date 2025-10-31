import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MapPin, User, Mail, Phone, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const FormPage = () => {
  const location = useLocation();
  const locationData = location.state?.location || { latitude: 0, longitude: 0 };
  const isFallback = location.state?.isFallback || false;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submissionData = {
        ...formData,
        location: locationData,
        isFallbackLocation: isFallback,
      };

      console.log("Form submitted:", submissionData);
      toast.success("Form submitted successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
      setErrors({
        name: "",
        email: "",
        phone: "",
      });
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Location Display Card */}
        <Card className="border-border shadow-[var(--shadow-medium)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Captured Location</CardTitle>
            </div>
            <CardDescription>
              {isFallback
                ? "Using fallback location (New Delhi, India)"
                : "Your current device location"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFallback && (
              <div className="mb-4 flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  We couldn't access your device location. Using default coordinates instead.
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Latitude</p>
                <p className="text-xl font-semibold text-foreground">
                  {locationData.latitude.toFixed(4)}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Longitude</p>
                <p className="text-xl font-semibold text-foreground">
                  {locationData.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="border-border shadow-[var(--shadow-medium)]">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Please fill in your details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit Form
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormPage;
