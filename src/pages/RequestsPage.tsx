import { useEffect, useState } from "react";
import type { Request, RequestStatus } from "../types/request";
import {
    getRequests,
    processRequest,
} from "../services/requestService";
import RequestTable from "../components/request/RequestTable";
import ConfirmModal from "../components/common/ConfirmModal";
import toast from "react-hot-toast";
import { ClipboardCheck, List, Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react";

type TabKey = "ALL" | RequestStatus;

const TABS: { key: TabKey; label: string; icon: typeof List }[] = [
    { key: "ALL", label: "Registry", icon: List },
    { key: "PENDING", label: "Queue", icon: Clock },
    { key: "APPROVED", label: "Released", icon: CheckCircle },
    { key: "REJECTED", label: "Denied", icon: XCircle },
];

export default function RequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [processingId, setProcessingId] = useState<string | number | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        action: "approve" | "reject" | null;
        request: Request | null;
    }>({ isOpen: false, action: null, request: null });

    useEffect(() => {
        loadRequests();
    }, [currentPage]);

    const loadRequests = () => {
        setIsLoading(true);
        getRequests(currentPage - 1, 10).then((data) => {
            setRequests(data.content || []);
            setTotalElements(data.totalElements || 0);
            setIsLoading(false);
        }).catch(err => {
            console.error("Failed to fetch requests", err);
            setIsLoading(false);
        });
    };

    const filtered =
        activeTab === "ALL"
            ? requests
            : requests.filter((r) => r.statusCode === activeTab);

    const handleConfirm = async () => {
        if (!confirmModal.request || !confirmModal.action) return;
        const { request, action } = confirmModal;
        setProcessingId(request.requestId);
        setModalError(null);

        try {
            await processRequest(request.requestId, action === "approve");
            if (action === "approve") {
                toast.success("Transaction authorized.");
            } else {
                toast.success("Transaction denied.");
            }

            loadRequests();
            setConfirmModal({ isOpen: false, action: null, request: null });
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Security validation failed.";
            setModalError(message);
        } finally {
            setProcessingId(null);
        }
    };

    const pendingCount = requests.filter((r) => r.statusCode === "PENDING").length;

    return (
        <div className="page">
            <div className="page-header flex items-center gap-4">
                <div>
                    <p className="page-subtitle text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">
                        Authorization Engine — {pendingCount} PENDING ACTION{pendingCount !== 1 ? "S" : ""}
                    </p>
                </div>
            </div>

            <div>
                <div className="mb-8 flex overflow-x-auto overflow-y-hidden border-b border-slate-200">
                    {TABS.map(({ key, label, icon: Icon }) => {
                        const count = key === "ALL" ? requests.length : requests.filter((r) => r.statusCode === key).length;
                        const isActive = activeTab === key;
                        return (
                            <button
                                key={key}
                                className={`group flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all border-b-2 -mb-[1px] whitespace-nowrap ${isActive ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
                                    }`}
                                onClick={() => setActiveTab(key)}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-300 group-hover:text-slate-400"}`} />
                                {label}
                                <span className={`flex h-5 min-w-[24px] items-center justify-center rounded-full px-1.5 text-[10px] font-black tracking-tighter shadow-inner transition-colors ${isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
                <RequestTable
                    requests={filtered}
                    isLoading={isLoading}
                    processingId={processingId}
                    onApprove={(req) => setConfirmModal({ isOpen: true, action: "approve", request: req })}
                    onReject={(req) => setConfirmModal({ isOpen: true, action: "reject", request: req })}
                />
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Registry Index: {totalElements} Transactions
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        className="btn btn-outline btn-sm px-4 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || isLoading}
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Prev
                    </button>
                    <button
                        className="btn btn-outline btn-sm px-4 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"
                        onClick={() => setCurrentPage((p) => Math.min(Math.ceil(totalElements / 10), p + 1))}
                        disabled={currentPage >= Math.ceil(totalElements / 10) || isLoading}
                    >
                        Next
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.action === "approve" ? "Authorize Transaction" : "Deny Request"}
                message={
                    confirmModal.action === "approve"
                        ? "Are you sure you want to authorize this operation? The card status will be updated immediately in the core registry."
                        : "Are you sure you want to deny this request? This action is irreversible and will be logged for audit."
                }
                confirmLabel={confirmModal.action === "approve" ? "Confirm Authorization" : "Deny Request"}
                confirmClass={confirmModal.action === "approve" ? "btn btn-success" : "btn btn-danger"}
                isLoading={processingId !== null}
                error={modalError}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmModal({ isOpen: false, action: null, request: null })}
            />
        </div>
    );
}
