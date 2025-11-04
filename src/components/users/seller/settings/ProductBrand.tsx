import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const brandSchema = z.object({
  name: z.string().min(2, "Brand name is required"),
  logo_url: z
    .instanceof(File, {
      message: "Business License image is required",
    })
    .nullable(),
});

type BrandFormData = z.infer<typeof brandSchema>;

export default function BrandForm() {
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [logo_url, setLogoUrl] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<
    Partial<Record<keyof BrandFormData, string>>
  >({});

  const { toast } = useToast();

  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: "", logo_url: undefined },
  });

  const validateFiles = () => {
    const result = brandSchema.pick({ logo_url: true }).safeParse({ logo_url });
    if (!result.success) {
      const errors: Partial<Record<keyof BrandFormData, string>> = {};
      errors.logo_url = "Logo file is required";
      setFileErrors(errors);
      return false;
    }
    setFileErrors({});
    return true;
  };

  const onSubmit = async (data: BrandFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Validate file before proceeding
      if (!validateFiles()) {
        setIsLoading(false);
        return;
      }

      // Upload logo
      const formData = new FormData();
      if (logo_url) {
        formData.append("file", logo_url);
      }

      const uploadResponse = await api.post("bizhub/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = uploadResponse.data?.url;
      // if (!uploadedUrl) throw new Error("Logo upload failed");

      // Create brand with uploaded logo URL
      const brandPayload = {
        name: data.name,
        logo_url: uploadedUrl,
      };

      const brandResponse = await api.post("bizhub/brand/", brandPayload);

      if (!brandResponse.data) {
        throw new Error("An error occurred during creating Brand");
      }
      toast({
        title: "Brand Created",
        description: `Brand "${data.name}" has been successfully created.`,
        variant: "success",
      });

      // Reset form and file
      form.reset();
      setLogoUrl(null);
      setFileErrors({});
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Product Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter a brand name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo_url"
                render={() => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setLogoUrl(file);
                          form.setValue("logo_url", file);
                        }}
                      />
                    </FormControl>
                    {fileErrors.logo_url && (
                      <p className="text-red-500 text-sm">
                        {fileErrors.logo_url}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Brand"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
