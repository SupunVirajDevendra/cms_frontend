import api from "./api";
import type { Request, RequestType } from "../types/request";
import type { PaginatedResponse } from "./cardService";

export async function getRequests(page: number = 0, size: number = 10): Promise<PaginatedResponse<Request>> {
    const response = await api.get<PaginatedResponse<Request>>("/api/card-requests/paginated", {
        params: { page, size }
    });
    return response.data;
}
export async function getRequestById(id: number | string): Promise<Request> {
    const response = await api.get<Request>(`/api/card-requests/${id}`);
    return response.data;
}

export async function processRequest(id: number | string, approve: boolean): Promise<Request> {
    const response = await api.put<Request>(`/api/card-requests/${id}/process`, { approve });
    return response.data;
}

export async function createRequest(
    maskId: string,
    type: RequestType
): Promise<any> {
    const response = await api.post("/api/card-requests", {
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

