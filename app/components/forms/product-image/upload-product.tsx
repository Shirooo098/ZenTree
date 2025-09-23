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
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form"
import { upload } from "@imagekit/next";
import { catchImageKitError, imageUploadAuthenticator } from "@/app/actions/product/image-authenticator.action";
import { ProductSchema, productSchema } from "@/app/types/schema";
import { createProductAction } from "@/app/actions/product/create-product.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export default function UploadProductForm(){
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortController = new AbortController();

    const fields = [
        "productCategory",
        "productName",
        "size",
        "bonsaiCategory",
        "bonsaiAge",
        "bonsaiCareLevel",
        "productPrice",
        "stock",
        "productDescription",
    ] as const;

    const form = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
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

    const onSubmit = async (values: ProductSchema) => {
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
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
            });

            const fileId = uploadResponse.fileId;
            const url = uploadResponse.url;

            const saveMetadataRes = await fetch("/api/admin/save-metadata", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({ fileId, url })
            })

            const saveMetadata = await saveMetadataRes.json();
            if (!saveMetadata.success) {
                console.error("Failed to save metadata");
                toast.error("Failed to save image metadata.");
                return;
            }

            const imageRecordId = saveMetadata.id;
            const formData = new FormData();

            fields.forEach((field) => {
                const value = values[field];
                if (value !== undefined && value !== null) {
                    formData.append(field, String(value));
                }
            });

            formData.append("imageProduct", file);
            formData.append("imageRecordId", imageRecordId);

            const createProductRes = await createProductAction(formData);

            if(createProductRes.message){
                toast(createProductRes.message)
            }

            router.push("/admin/products");
        } catch (error) {
            catchImageKitError(error as Error)
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
                                <FormControl className="w-full">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Bonsai">Bonsai</SelectItem>
                                    <SelectItem value="Accessories">Accessecories</SelectItem>
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
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Bonsai Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Formal Upright">Formal Upright</SelectItem>
                                        <SelectItem value="Informal Upright">Informal Upright</SelectItem>
                                        <SelectItem value="Slanting">Slanting</SelectItem>
                                        <SelectItem value="Cascade">Cascade</SelectItem>
                                        <SelectItem value="Semi-Cascade">Semi-Cascade</SelectItem>
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
                                    <FormControl className="w-full">
                                        <SelectTrigger>
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
                                <FormControl className="w-full">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Bonsai care level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermmediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
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
                <Progress value={progress}/>

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