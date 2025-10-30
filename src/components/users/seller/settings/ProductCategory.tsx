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

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  parent: z.string().min(2, "Category name is required"),

});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoryForm() {
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", parent: '' },
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    setError("");

    try {
       const response = await api.post("auth/categories", data);

      if (!response.data) {
        throw new Error("An error occurred during creating Category");
      }
      toast({
        title: "Category Created",
        description: `Category has been successfully created.`,
        variant: "success",
      });

      form.reset();
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
          <CardTitle>Product Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="parent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Caterory</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a Category eg(Electronics,Health & Medicine)"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product category <span className="text-sm text-gray-500">(minor)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a Category eg(phones,TVs,Beaty)"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
