import { ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError } from "@imagekit/next";

export const imageUploadAuthenticator = async () => {
    try {
        // Perform the request to the upload authentication endpoint.
        const response = await fetch("/api/admin/upload-auth");
        if (!response.ok) {
            // If the server response is not successful, extract the error text for debugging.
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        // Parse and destructure the response JSON for upload credentials.
        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        // Log the original error for debugging before rethrowing a new error.
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};

export function catchImageKitError(error: Error) {
    if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error);
    } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error);
    } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error);
    } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error);
    } else {
        console.error("Upload error:", error);
    }
}