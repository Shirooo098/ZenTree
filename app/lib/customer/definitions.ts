// definitions.ts
export type EmailState = {
  errors: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    contact?: string[];
    message?: string[];
  };
  errorMessage: string | null;
};
