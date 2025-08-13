export type SignInState = {
    errors?: {
        email?: string,
        password?: string
    }
    message?: string | null
}
