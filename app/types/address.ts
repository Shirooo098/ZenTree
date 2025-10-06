export interface AddressState {
  errors?: Record<string, string[]>;
  message?: string | null;
}

export interface AddAddressState {
  errors?: {
    addressLine1?: string[];
    addressLine2?: string[];
    city?: string[];
    province?: string[];
    postalCode?: string[];
  };
  message?: string | null;
}
