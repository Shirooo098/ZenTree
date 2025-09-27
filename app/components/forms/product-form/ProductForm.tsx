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
import React, { useCallback, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { useProductForm } from "@/app/hooks/useProductForm";
import { ProductProps } from "@/app/types/definition";
import { ProductSchema } from "@/app/types/schema";
import { Loader } from "../../loader/loader";

interface ProductFormProps {
    mode: 'add' | 'edit',
    productData?: ProductProps,
    productId?: number,
    isLoading?: boolean
}

export default function ProductForm({
    mode,
    productData,
    productId,
    isLoading = false
}: ProductFormProps){
    const getInitialFormData = useCallback((): ProductSchema | undefined => {
        if (!productData) return undefined;
        
        return {
            productCategory: productData.category || "",
            productName: productData.name || "",
            size: productData.size || "",
            bonsaiCategory: productData.bonsaiCategory || "",
            bonsaiAge: productData.bonsaiAge || "",
            bonsaiCareLevel: productData.bonsaiCareLevel || "",
            productPrice: productData.price || 0,
            stock: productData.stock || 0,
            productDescription: productData.description || "",
            imageProduct: undefined,
        };
    }, [productData]);

    const {
        form,
        onSubmit,
        handleImageChange,
        fileInputRef,
        progress,
        isSubmitting
    } = useProductForm({
        mode,
        productId,
        initialData: getInitialFormData()
    });


    useEffect(() => {
       if (mode === 'edit' && productData) {
            const formData = getInitialFormData();
            if (formData) {
                form.reset(formData);
            }
        }
    }, [form, getInitialFormData, mode, productData]);

    if(mode === "edit" && isLoading) {
        return (
            <div className="">
                <Loader/>
            </div>
        )
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
                                <Input 
                                placeholder="Product Name..." 
                                disabled={mode === "edit"}
                                {...field}/>
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
                                defaultValue={productData?.category}
                                disabled={mode === "edit"}>
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
                                        <SelectItem value="Young">Young</SelectItem>
                                        <SelectItem value="Aged">Aged</SelectItem>
                                        <SelectItem value="Mature">Mature</SelectItem>
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
                                    disabled={mode === "edit"}
                                    ref={fileInputRef}
                                    onChange={(e) => handleImageChange(e, field)}
                                />
                            </FormControl>
                            {mode === "edit" && productData?.image_url && (
                                <span className="text-sm text-gray-500">
                                    Current: {productData.image_url}
                                </span>
                            )}
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

                <Button disabled={isSubmitting} size="lg" type="submit" className="cursor-pointer float-right">
                    {isSubmitting ? <Loader /> : "Submit"}
                </Button>

            </form>
        </Form>
    )
}