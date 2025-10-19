import type { ServiceDTO } from "./chatTypes";


export interface BookingItem {
    tripItemId: number;
    service: ServiceDTO;
    startTime: string; // ISO string format for LocalDateTime
    endTime: string; // ISO string format for LocalDateTime
    noOfUnits: number;
    numberOfAdults: number;
    numberOfChildren: number;
    status: "CONFIRMED" | "CANCELLED" | "PENDING" | "PAYMENT_FAILED" | "NOT_AVAILABLE";
    totalPrice: number;
    paidAmount: number;
    dueAmount: number;
    depositAmount: number;
    bookingDate: string; // ISO string format for LocalDateTime
}