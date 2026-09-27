export interface Customer {
  id?: number;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  address: string;
  sync_status?: "pending" | "synced";
}

export type CreateCustomerPayload = Omit<
  Customer,
  "id" | "sync_status"
>;