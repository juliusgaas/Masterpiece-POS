
import { db, type Quotation, type QuotationStatus } from "../database/dexie";

// Get all quotations
export async function getQuotations(): Promise<Quotation[]> {
    return db.table("quotations").orderBy("id").reverse().toArray();
}

// Get quotation by ID
export async function getQuotationById(
    id: number
): Promise<Quotation | undefined> {
    return db.table("quotations").get(id);
}

// Add quotation
export async function addQuotation(
    quotation: Omit<Quotation, "id">
): Promise<number> {
    return db.table<Quotation, number>("quotations").add(quotation);
}

// Update quotation
export async function updateQuotation(
    id: number,
    changes: Partial<Quotation>
): Promise<number> {
    const updated = await db.table("quotations").update(id, {
        ...changes,
        updated_at: new Date().toISOString(),
    });

    if (updated === 0) {
        throw new Error(`Quotation ${id} not found.`);
    }

    return updated;
}

// Update quotation status
export async function updateQuotationStatus(
    id: number,
    status: QuotationStatus
): Promise<number> {
    return updateQuotation(id, { status });
}

// Delete quotation
export async function deleteQuotation(id: number): Promise<void> {
    await db.table("quotations").delete(id);
}

// Search quotations
export async function searchQuotations(
    keyword: string
): Promise<Quotation[]> {
    const query = keyword.trim().toLowerCase();

    const quotations = await getQuotations();

    if (!query) return quotations;

    return quotations.filter((quotation) =>
        [
            quotation.number,
            quotation.customer,
            quotation.reference ?? "",
        ].some((value) => value.toLowerCase().includes(query))
    );
}
