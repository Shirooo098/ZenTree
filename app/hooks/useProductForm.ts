import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { upload } from "@imagekit/next";
import { catchImageKitError, imageUploadAuthenticator } from "@/app/actions/product/image-authenticator.action";
import { createProductAction } from "@/app/actions/product/create-product.action";
import { ProductSchema, productSchema } from "@/app/types/schema";
import { ProductProps } from "../types/definition";
import { editProductAction } from "../actions/product/edit-product.action";

interface UseProductFormProps {
    mode: 'add' | 'edit';
    productId?: number;
    productData?: ProductProps
    initialData?: ProductSchema;
}

export const useProductForm = ({ mode, productId, productData, initialData }: UseProductFormProps) => {
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
        defaultValues: initialData || {
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
    });


    const validateImageInput = (): File | null => {
        const fileInput = fileInputRef.current;
        
        if (mode === 'add' && (!fileInput || !fileInput.files || fileInput.files.length === 0)) {
            toast.error("Please select a file to upload.");
            return null;
        }

        return fileInput && fileInput.files && fileInput.files.length > 0 
            ? fileInput.files[0] 
            : null;
    };


    const handleImageUpload = async (file: File): Promise<string | null> => {
        try {
            setProgress(0);
            
            const authParams = await imageUploadAuthenticator();
            const { signature, expire, token, publicKey } = authParams;

            const uploadResponse = await upload({
                 // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,// Optionally set a custom file name
                // Progress callback to update upload progress state       
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
            });

            const saveMetadataRes = await fetch("/api/admin/save-metadata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    fileId: uploadResponse.fileId, 
                    url: uploadResponse.url 
                })
            });

            const saveMetadata = await saveMetadataRes.json();
            
            if (!saveMetadata.success) {
                console.error("Failed to save metadata");
                toast.error("Failed to save image metadata.");
                return null;
            }

            setProgress(100);
            return saveMetadata.id;
        } catch (error) {
            console.error("Failed to upload image:", error);
            catchImageKitError(error as Error);
            setProgress(0);
            return null;
        }
    };

    const prepareFormData = (
        values: ProductSchema, 
        imageFile: File | null, 
        imageRecordId: string | null
    ): FormData => {
        const formData = new FormData();

        fields.forEach((field) => {
            const value = values[field];
            if (value !== undefined && value !== null) {
                formData.append(field, String(value));
            }
        });

        if (imageFile) {
            formData.append("imageProduct", imageFile);
        }
        
        if (imageRecordId) {
            formData.append("imageRecordId", imageRecordId);
        }

        // Add product ID for edit mode
        if (mode === 'edit' && productId) {
            formData.append("productId", String(productId));
        }

        return formData;
    };


    const submitFormData = async (formData: FormData) => {
        try {
            let result;
            if (mode === 'add') {
                result = await createProductAction(formData);
            } else {
                // You'll need to create an updateProductAction
                // result = await updateProductAction(formData);
                // For now, using the same action - you may need to modify this
                result = await editProductAction(formData);
            }

            if (result.message) {
                toast.success(result.message);
            }

            router.push("/admin/products");
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An error occurred while saving the product.");
            throw error;
        }
    };


    const onSubmit = async (values: ProductSchema) => {
        try {
            
            const imageFile = validateImageInput();
            if (mode === 'add' && !imageFile) return;

            
            let imageRecordId: string | null = null;
            if (imageFile) {
                imageRecordId = await handleImageUpload(imageFile);
                if (imageFile && !imageRecordId) return; 
            }

           
            const formData = prepareFormData(values, imageFile, imageRecordId);
            await submitFormData(formData);

        } catch (error) {
            console.error("Unexpected error in form submission:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        if (e.target.files?.[0]) {
            field.onChange(e.target.files[0]);
            setProgress(0); 
        }
    };

    return {
        form,
        onSubmit,
        handleImageChange,
        fileInputRef,
        progress,
        isSubmitting: form.formState.isSubmitting
    };
};