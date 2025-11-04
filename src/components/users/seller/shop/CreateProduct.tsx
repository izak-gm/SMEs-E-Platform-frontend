import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Brand, Category } from "@/types/Types";
import api from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const productSchema = z
  .object({
    store: z.string().min(1, { message: "Invalid store UUID" }).default(""),
    name: z
      .string()
      .min(1, { message: "Name of the product is required" })
      .default(""),
    sku: z
      .string()
      .min(1, { message: "SKU of the product is required eg(ABC23)" })
      .default(""),
    slug: z
      .string()
      .min(1, { message: "SKU of the product is required eg(ABC23)" })
      .default(""),
    description: z
      .string()
      .min(1, { message: "Description of the product is required" })
      .nullable()
      .default(null),
    base_price: z
      .number()
      .positive({
        message: "Base Price of the product is required and should be positive",
      })
      .default(0),
    discount_price: z
      .number()
      .positive({ message: "Discount Price of the product is required" })
      .default(0),

    brand: z.string().min(1, { message: "Invalid brand UUID" }).default(""),
    category: z
      .string()
      .min(1, { message: "Invalid category UUID" })
      .default(""),

    variants: z
      .array(
        z.object({
          sku: z.string().min(1, { message: "SKU for variant is required" }),
          attributes: z
            .record(z.string(), z.string().min(1))
            .refine(
              (attrs) => Object.keys(attrs).length > 0,
              "Attributes cannot be empty"
            ),
          price: z
            .number()
            .positive({ message: "Variant price must be positive" }),
          stock: z
            .number()
            .int()
            .nonnegative({ message: "Stock must be a non-negative integer" }),
        })
      )
      .default([]),

    images: z
      .array(
        z.object({
          url: z.string().refine(
            (val) => {
              try {
                new URL(val);
                return true;
              } catch {
                return false;
              }
            },
            { message: "Invalid image URL" }
          ),
          alt_text: z.string().min(1, { message: "Alt text is required" }),
        })
      )
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (data.discount_price && data.discount_price > data.base_price) {
      ctx.addIssue({
        code: "custom",
        message: "Discount price cannot exceed base price",
        path: ["discount_price"],
      });
    }
  });

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [brands,setBrands]=useState<Brand []>([])
  const [categories, setCategories] = useState<Category[]>([]);

  const { toast } = useToast();

  const form = useForm<Partial<z.infer<typeof productSchema>>>({
    resolver: zodResolver(productSchema),
  });


  // fetch requests
  const fetchBrands = async () => {
    try {
      const res = await api.get("bizhub/brand/");
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("bizhub/category/");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchBrands(),
      fetchCategories()
  },[])
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-start">
            <ArrowLeft />
            <div className="ml-3">
              <CardDescription className="text-sm">
                Back to product list
              </CardDescription>
              <CardTitle className="text-lg">Add New Product</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form>
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter name of product" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug </FormLabel>

                      <FormControl>
                        <Input {...field} placeholder="Enter slug of product" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description </FormLabel>

                      <FormControl>
                        <Input {...field} placeholder="Enter sku of product" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          placeholder="Enter description of product"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price </FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter base price of all product"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount price(optional) </FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter discount price of product"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <h1>Brand</h1>
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Available Brands</SelectLabel>
                            {brands && brands.length > 0 ? (
                              brands.map((brand) => (
                                <SelectItem
                                  key={brand.id}
                                  value={String(brand.id)}
                                >
                                  {brand.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No brands available
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <h1>Category</h1>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Available Categories</SelectLabel>
                            {categories && categories.length > 0 ? (
                              categories.map((cat) => (
                                <SelectItem key={cat.id} value={String(cat.id)}>
                                  {cat.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No categories available
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <section>
                <div>
                  <h1>Variant</h1>
                  <div className="border-red-950 border-2">
                    <div className=" flex mx-3 justify-between items-center">
                      <Label>Product Variants</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">Open popover</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="leading-none font-medium">
                                Dimensions
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                Set the dimensions for the layer.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Width</Label>
                                <Input
                                  id="width"
                                  defaultValue="100%"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxWidth">Max. width</Label>
                                <Input
                                  id="maxWidth"
                                  defaultValue="300px"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="height">Height</Label>
                                <Input
                                  id="height"
                                  defaultValue="25px"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxHeight">Max. height</Label>
                                <Input
                                  id="maxHeight"
                                  defaultValue="none"
                                  className="col-span-2 h-8"
                                />
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>          <div className=" flex mx-3 justify-between items-center">
                      <Label>Product Variants</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">Open popover</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="leading-none font-medium">
                                Dimensions
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                Set the dimensions for the layer.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Width</Label>
                                <Input
                                  id="width"
                                  defaultValue="100%"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxWidth">Max. width</Label>
                                <Input
                                  id="maxWidth"
                                  defaultValue="300px"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="height">Height</Label>
                                <Input
                                  id="height"
                                  defaultValue="25px"
                                  className="col-span-2 h-8"
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxHeight">Max. height</Label>
                                <Input
                                  id="maxHeight"
                                  defaultValue="none"
                                  className="col-span-2 h-8"
                                />
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </section>
              <div></div>
              <div></div>
              <div></div>
              <div></div>

              <Button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Product"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
