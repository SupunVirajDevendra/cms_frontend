import api from "./api";
import type { Request, RequestType } from "../types/request";
import type { PaginatedResponse } from "./cardService";

const REQUESTS_ENDPOINT = import.meta.env.VITE_API_CARD_REQUESTS || "/api/card-requests";

export async function getRequests(page: number = 0, size: number = 10): Promise<PaginatedResponse<Request>> {
    const response = await api.get<PaginatedResponse<Request>>(`${REQUESTS_ENDPOINT}/paginated`, {
        params: { page, size }
    });
    return response.data;
}
export async function getRequestById(id: number | string): Promise<Request> {
    const response = await api.get<Request>(`${REQUESTS_ENDPOINT}/${id}`);
    return response.data;
}

export async function processRequest(id: number | string, approve: boolean): Promise<Request> {
    const response = await api.put<Request>(`${REQUESTS_ENDPOINT}/${id}/process`, { approve });
    return response.data;
}

export async function createRequest(
    maskId: string,
    type: RequestType
): Promise<any> {
    const response = await api.post(REQUESTS_ENDPOINT, {
        cardIdentifier: maskId,
        requestReasonCode: type,
    });
    return response.data;
}

export async function getPendingCount(): Promise<number> {
    try {
        const response = await getRequests(0, 100);
        return response.content.filter((r: Request) => r.statusCode === "PENDING").length;
    } catch {
        return 0;
    }
}

