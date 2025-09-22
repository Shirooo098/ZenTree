"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectTrigger } from "@radix-ui/react-select";
import React, { useRef } from "react";
import { useForm } from "react-hook-form"
import z from "zod"
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { imageUploadAuthenticator } from "@/app/actions/product/image-authenticator.action";

const formSchema = z.object({
    id: z.number(),
    productCategory: z.string().min(1, "Product category is required"),
    productName: z.string().min(5, 
        "Product name must be at least 5 characters."),
    size: z.string().optional(),
    bonsaiCategory: z.string().optional(),
    bonsaiAge: z.string().optional(),
    bonsaiCareLevel: z.string().optional(),
    productPrice: z.number()
        .min(1, "Price must have a value."),
    stock: z.number()
        .min(1, "Stock must have a value."),
    productDescription: z.string()
        .min(10, "Product description is required."),
    imageProduct: z.file("Only accepts jpeg and png.")
        .min(10_000)
        .max(1_000_000)
        .mime(["image/jpeg", "image/png"])
})

const styles = {
    select:  "w-full flex items-start border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50  w-fit justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

}

export default function UploadProductForm(){
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortController = new AbortController();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productCategory: "",
            productName: "",
            size: "",
            bonsaiCategory: "",
            bonsaiAge: "",
            bonsaiCareLevel: "",
            productPrice: 0,
            stock: 0, 
            productDescription: "",
            imageProduct: undefined
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        
        console.log(values);

        const fileInput = fileInputRef.current;
        if(!fileInput || !fileInput.files || fileInput.files.length === 0){
            alert("Please select a file to upload.");
            return;
        }

        const file = fileInput.files[0];

        let authParams;
        try {
            authParams = await imageUploadAuthenticator();
        } catch (error) {
            console.error("Failed to authenticate for upload:", error);
            return;
        }

        const { signature, expire, token, publicKey } = authParams;

        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name, // Optionally set a custom file name
                // Progress callback to update upload progress state
               
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
            });

            console.log("Upload response:", uploadResponse);

          
        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                console.error("Upload error:", error);
            }
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field:any) => {
        if(e.target.files?.[0]){
            field.onChange(e.target.files[0])
        }
    }
    return(
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                 className="space-y-4">
                <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Product Name..." {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="productCategory"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Category</FormLabel>
                            <Select 
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className={`${styles.select}`}>
                                        <SelectValue placeholder="Select a Category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="bonsai">Bonsai</SelectItem>
                                    <SelectItem value="accessories">Accessecories</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Size</FormLabel>
                            <FormControl>
                                <Input placeholder="Product size..." {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between gap-2">
                    <FormField
                        control={form.control}
                        name="bonsaiCategory"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Bonsai Category</FormLabel>
                                <Select 
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className={`${styles.select}`}>
                                            <SelectValue placeholder="Select a Bonsai Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="formal upright">Formal Upright</SelectItem>
                                        <SelectItem value="informal upright">Inform Upright</SelectItem>
                                        <SelectItem value="slanting">Slanting</SelectItem>
                                        <SelectItem value="cascade">Cascade</SelectItem>
                                        <SelectItem value="Semi-cascade">Semi-Cascade</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bonsaiAge"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Bonsai Age</FormLabel>
                                <Select 
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className={`${styles.select}`}>
                                            <SelectValue placeholder="Select a Bonsai Age" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="young">Young</SelectItem>
                                        <SelectItem value="aged">Aged</SelectItem>
                                        <SelectItem value="mature">Mature</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="bonsaiCareLevel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bonsai Care Level</FormLabel>
                            <Select 
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className={`${styles.select}`}>
                                        <SelectValue placeholder="Select a Bonsai care level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermmediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between gap-2">
                    <FormField
                        control={form.control}
                        name="productPrice"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Product Price</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number"
                                        placeholder="Enter product price..." 
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value === "" ? "" : e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Product Stock</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number"
                                        placeholder="Enter product stock..."
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value === "" ? "" : e.target.valueAsNumber)}
                                        />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="imageProduct"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <Input 
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    ref={fileInputRef}
                                    onChange={(e) => handleImageChange(e, field)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="productDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Size</FormLabel>
                            <FormControl>
                                <Textarea 
                                placeholder="Product description..."
                                 {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}