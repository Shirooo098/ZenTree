import z from "zod";

export const productSchema = z.object({
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
    imageProduct: z.instanceof(File, {
        error: "Please select an image."
    }).refine(file => file.size > 0, "File cannot be empty")

})

export type ProductSchema = z.infer<typeof productSchema>;
