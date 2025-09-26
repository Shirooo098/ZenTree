// types/schema.ts

import { z } from "zod";

export const productSchema = z.object({
    productCategory: z.string().min(1, "Product category is required"),
    productName: z.string().min(1, "Product name is required"),
    size: z.string().optional(),
    bonsaiCategory: z.string().optional(),
    bonsaiAge: z.string().optional(), 
    bonsaiCareLevel: z.string().optional(),
    productPrice: z.number().min(0, "Price must be non-negative"),
    stock: z.number().min(0, "Stock must be non-negative"),
    productDescription: z.string().min(1, "Description is required"),
    imageProduct: z.instanceof(File).optional(), // Made optional
});

export type ProductSchema = z.infer<typeof productSchema>;
