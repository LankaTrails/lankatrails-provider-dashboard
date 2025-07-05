// types/service.ts
export interface ImageFile {
    id: string;
    file: File;
    url: string;
}

export interface TabData {
    id: string;
    heading: string;
    description: string;
    isExpanded: boolean;
}

export interface PolicyData {
    id: string;
    heading: string;
    description: string;
    isExpanded: boolean;
}

export interface ServiceFormData {
    serviceName: string;
    location: string;
    description: string;
    category: string;
    price: string;
    duration: string;
    capacity: string;
    contactPhone: string;
    contactEmail: string;
    website: string;
    startDate: string;
    endDate: string;
    features: string[];
    notes: string;
    latitude?: number;
    longitude?: number;
}

export interface LocationData {
    address: string;
    latitude: number;
    longitude: number;
}