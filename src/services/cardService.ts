import api from "./api";
import type { Card, CardFormData } from "../types/card";

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    first: boolean;
    last: boolean;
}

export async function getCards(page: number = 0, size: number = 5): Promise<PaginatedResponse<Card>> {
    console.log("Fetching cards...", { page, size });
    try {
        const response = await api.get<PaginatedResponse<Card>>("/api/cards/paginated", {
            params: { page, size },
        });
        console.log("Cards fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching cards:", error);
        throw error;
    }
}

export async function getCardById(maskId: string): Promise<Card> {
    const response = await api.get<Card>(`/api/cards/${maskId}`);
    return response.data;
}

export async function createCard(data: CardFormData): Promise<Card> {
    const response = await api.post<Card>("/api/cards", data);
    return response.data;
}

export async function updateCard(
    maskId: string,
    data: Partial<CardFormData>
): Promise<Card> {
    const response = await api.put<Card>(`/api/cards/${maskId}`, data);
    return response.data;
}

export async function updateCardStatus(
    maskId: string,
    status: Card["statusCode"]
): Promise<Card> {
    const response = await api.put<Card>(`/api/cards/${maskId}/status`, { status });
    return response.data;
}

export async function submitCardRequest(maskId: string, reasonCode: "ACTI" | "CDCL"): Promise<any> {
    const response = await api.post("/api/card-requests", {
        cardIdentifier: maskId,
        requestReasonCode: reasonCode
    });
    return response.data;
}

export async function getCardStats() {
    try {
        const data = await getCards(0, 1000);
        const total = data.totalElements;
        const active = data.content.filter(c => c.statusCode === "CACT").length;
        const inactive = data.content.filter(c => c.statusCode === "IACT").length;
        return { total, active, inactive };
    } catch {
        return { total: 0, active: 0, inactive: 0 };
    }
}

