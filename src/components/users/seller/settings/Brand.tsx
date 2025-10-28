import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";


const brandSchema = z.object({
  name: z.string().min(2, "Brand name is required"),
  logo_url: z.string().url("Please enter a valid URL").optional(),
});

type BrandFormData = z.infer<typeof brandSchema>;


export default function BrandForm() {
    const [loading, setLoading] = useState(false);

    const form = useForm<BrandFormData>({
      resolver: zodResolver(brandSchema),
      defaultValues: { name: "", logo_url: "" },
    });

  const onSubmit = async (data: BrandFormData) => {
    try {
      
    } catch (err) {
      
    } finally {
      
    }
  }
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Brands</CardTitle>
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
                      <Input {...field}  placeholder="Enter a brand name"/>
                    </FormControl>
                  </FormItem>
                )}
              
              />
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input {...field}  placeholder="Provide a logo for the brand"/>
                    </FormControl>
                  </FormItem>
                )}
              
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
