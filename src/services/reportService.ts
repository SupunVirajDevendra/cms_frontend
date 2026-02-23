import api from "./api";
import type { Card } from "../types/card";
import type { Request } from "../types/request";

const REPORTS_ENDPOINT = import.meta.env.VITE_API_REPORTS || "/api/reports";

export interface ReportFilters {
    startDate: string;
    endDate: string;
    status?: string;
}

export async function getCardReportData(filters: ReportFilters): Promise<Card[]> {
    const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
    });
    if (filters.status) {
        params.append("status", filters.status);
    }
    const response = await api.get<Card[]>(`${REPORTS_ENDPOINT}/data/cards?${params}`);
    return response.data;
}

export async function getRequestReportData(filters: ReportFilters): Promise<Request[]> {
    const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
    });
    if (filters.status) {
        params.append("status", filters.status);
    }
    const response = await api.get<Request[]>(`${REPORTS_ENDPOINT}/data/requests?${params}`);
    return response.data;
}

export async function downloadCardReportCsv(filters: ReportFilters): Promise<Blob> {
    const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
    });
    if (filters.status) {
        params.append("status", filters.status);
    }
    const response = await api.get(`${REPORTS_ENDPOINT}/cards/csv?${params}`, {
        responseType: "blob",
    });
    return response.data;
}

export async function downloadCardReportPdf(filters: ReportFilters): Promise<Blob> {
    const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
    });
    if (filters.status) {
        params.append("status", filters.status);
    }
    const response = await api.get(`${REPORTS_ENDPOINT}/cards/pdf?${params}`, {
        responseType: "blob",
    });
    return response.data;
}

export async function downloadRequestReportCsv(filters: ReportFilters): Promise<Blob> {
    const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
    });
    if (filters.status) {
        params.append("status", filters.status);
    }
    const response = await api.get(`${REPORTS_ENDPOINT}/requests/csv?${params}`, {
        responseType: "blob",
    });
    return response.data;
}

export async function downloadRequestReportPdf(filters: ReportFilters): Promise<Blob> {
    const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
    });
    if (filters.status) {
        params.append("status", filters.status);
    }
    const response = await api.get(`${REPORTS_ENDPOINT}/requests/pdf?${params}`, {
        responseType: "blob",
    });
    return response.data;
}

function downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export function saveCardReportCsv(data: Blob, filename?: string): void {
    const defaultName = `card-report-${new Date().toISOString().split("T")[0]}.csv`;
    downloadBlob(data, filename || defaultName);
}

export function saveCardReportPdf(data: Blob, filename?: string): void {
    const defaultName = `card-report-${new Date().toISOString().split("T")[0]}.pdf`;
    downloadBlob(data, filename || defaultName);
}

export function saveRequestReportCsv(data: Blob, filename?: string): void {
    const defaultName = `request-report-${new Date().toISOString().split("T")[0]}.csv`;
    downloadBlob(data, filename || defaultName);
}

export function saveRequestReportPdf(data: Blob, filename?: string): void {
    const defaultName = `request-report-${new Date().toISOString().split("T")[0]}.pdf`;
    downloadBlob(data, filename || defaultName);
}
