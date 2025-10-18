import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/utils/axios";
import { useAuth } from "../auth/contexts/AuthContext";
import { AxiosError } from "axios";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";

const addressShema = z.object({
  town: z.string().min(1, " Town is required"),
  city: z.string().min(1, " City is required"),
  county: z.string().min(1, " County is required"),
  postalCode: z.string().min(1, "Postal Code required"),
  user: z.object({
    id: z.string(),
  }),
});

type PersonalAddressData = z.infer<typeof addressShema>;

export default function Address() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  console.log(user)

const form = useForm<PersonalAddressData>({
  resolver: zodResolver(addressShema),
  defaultValues: {
    county: "",
    town: "",
    city: "",
    postalCode: "",
    user: { id: user?.id?.toString() ?? "" },
  },
});

  const onSubmit = async (data: PersonalAddressData) => {
      console.log("Submitting form with data:", data);

    setIsLoading(true);
    const userId = user?.id
    try {
      const response = await api.post(`user/location`, {
        ...data,
        user: { id:data.user.id },
      });
      if (!response.data) {
        throw new Error("An error occurred when updating loction");
      }

      toast({
        title: "Location Updated",
        variant: "success",
        description: "Loaction updated successfully",
      });
    } catch (err) {
      let errorMessage = "an error occured.Please try again";
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
        variant: "error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Update Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>County</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Add a county" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="town"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Town</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a town for your area"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a city for your location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add a postal codefor your address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Updating Location..." : "Save"}{" "}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
