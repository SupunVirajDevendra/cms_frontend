export type CardStatus = "IACT" | "CACT" | "DACT";

export interface Card {
    maskId: string;
    cardNumber: string;
    statusCode: CardStatus;
    creditLimit: number;
    cashLimit: number;
    availableCreditLimit: number;
    availableCashLimit: number;
    expiryDate: string;
    lastUpdateTime: string;
}

export interface CardFormData {
    cardNumber: string;
    expiryDate: string;
    creditLimit: number;
    cashLimit: number;
}
