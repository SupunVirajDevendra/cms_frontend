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

const CARDS_ENDPOINT = import.meta.env.VITE_API_CARDS || "/api/cards";

export async function getCards(page: number = 0, size: number = 5): Promise<PaginatedResponse<Card>> {
    console.log("Fetching cards...", { page, size });
    try {
        const response = await api.get<PaginatedResponse<Card>>(`${CARDS_ENDPOINT}/paginated`, {
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
    const response = await api.get<Card>(`${CARDS_ENDPOINT}/${maskId}`);
    return response.data;
}

export async function createCard(data: CardFormData): Promise<Card> {
    const response = await api.post<Card>(CARDS_ENDPOINT, data);
    return response.data;
}

export async function updateCard(
    maskId: string,
    data: Partial<CardFormData>
): Promise<Card> {
    const response = await api.put<Card>(`${CARDS_ENDPOINT}/${maskId}`, data);
    return response.data;
}

export async function updateCardStatus(
    maskId: string,
    status: Card["statusCode"]
): Promise<Card> {
    const response = await api.put<Card>(`${CARDS_ENDPOINT}/${maskId}/status`, { status });
    return response.data;
}

export async function submitCardRequest(maskId: string, reasonCode: "ACTI" | "CDCL"): Promise<{ requestId: number }> {
    const REQUESTS_ENDPOINT = import.meta.env.VITE_API_CARD_REQUESTS || "/api/card-requests";
    const response = await api.post(REQUESTS_ENDPOINT, {
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

