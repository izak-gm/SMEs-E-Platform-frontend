import { useAuth } from "@/components/auth/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import z from "zod";
import { STORESTATUS } from "./enums/storeEnum";
import { AxiosError } from "axios";

const storeSchema = z.object({
  name: z.string().min(1, "Name of the store is required"),
  slug: z.string().min(1, "Name of the slug is required"),
  description: z.string().min(1, "Name of the store is required"),
  status: z.string().min(1, "Name of the store is required"),
});

type StoreFormData = z.infer<typeof storeSchema>;

export default function StoreForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "",
    },
  });

  const onSubmit = async (data: StoreFormData) => {
    setIsLoading(true);
    setError("");
    const userId = user?.id;
    try {
      const response = await api.post("auth/stores", {
        ...data,
        status: STORESTATUS.PENDING,
        owner_id: userId,
      });
      if (!response) {
        throw Error("An Error occured during creating a Store");
      }

      toast({
        title: "Store Created",
        description: `Store has been successfully created.`,
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
          <CardTitle>My Store</CardTitle>
          <CardDescription>
            This your store account that buyers will us to buy your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a name of the store"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="slug"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a slug of the store"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a description of the store"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {error && <p className=" text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving Store" : "Save Store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
