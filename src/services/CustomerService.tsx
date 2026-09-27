import { db } from "../database/dexie";
import type { CreateCustomerPayload, Customer } from "../types/customer";

const customerService = {
  async create(
    payload: CreateCustomerPayload
  ): Promise<Customer> {

    const customer: Customer = {
      ...payload,
      sync_status: "pending",
    };

    const id = await db.customers.add(customer);

    return {
      ...customer,
      id: Number(id),
    };
  },

  async getAll(): Promise<Customer[]> {
    return await db.customers.toArray();
  },

  async getById(id: number): Promise<Customer | undefined> {
    return await db.customers.get(String(id));
  },

  async search(keyword: string): Promise<Customer[]> {
    const search = keyword.toLowerCase().trim();

    if (!search) {
      return await db.customers.toArray();
    }

    return await db.customers
      .filter((customer) => {
        const fullName =
          `${customer.first_name} ${customer.last_name}`
            .toLowerCase();

        return (
          fullName.includes(search) ||
          customer.mobile.includes(search) ||
          customer.email.toLowerCase().includes(search)
        );
      })
      .toArray();
  },

  async update(
    id: number,
    payload: Partial<CreateCustomerPayload>
  ) {
    await db.customers.update(String(id), {
      ...payload,
      sync_status: "pending",
    });

    return await db.customers.get(String(id));
  },

  async delete(id: number) {
    await db.customers.delete(String(id));
  },
};

export default customerService;