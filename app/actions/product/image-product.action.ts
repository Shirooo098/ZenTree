import { upload } from "@imagekit/next";
import { createProductAction } from "./create-product.action";
import { imageUploadAuthenticator } from "../image-authenticator.action";
import { ProductSchema } from "@/app/types/schema";

export async function uploadImage(file: File, abortSignal: AbortSignal, setProgress: (progress: number) => void) {
  const { signature, expire, token, publicKey } = await imageUploadAuthenticator();

  return await upload({
    expire,
    token,
    signature,
    publicKey,
    file,
    fileName: file.name,
    onProgress: (event) => {
      setProgress((event.loaded / event.total) * 100);
    },
    abortSignal,
  });
}

export async function saveImageMetadata(fileId: string, url: string) {
  const res = await fetch("/api/admin/save-metadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId, url }),
  });

  const data = await res.json();
  if (!data.success) throw new Error("Failed to save image metadata");

  return data.id as string;
}

export async function createProduct(values: ProductSchema, file: File, imageRecordId: string) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  formData.append("imageProduct", file);
  formData.append("imageRecordId", imageRecordId);

  return await createProductAction(formData);
}
