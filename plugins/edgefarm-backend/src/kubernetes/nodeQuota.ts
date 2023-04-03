export interface ResourceQuota {
    allocatable?: QuotaValues;
    limit: QuotaValues;
    request: QuotaValues;
}
export interface QuotaValues{
    raw?: number;
    unit?: string;
    value?: number;
}

export interface NodeQuota {
    cpu: ResourceQuota;
    memory: ResourceQuota;
}

export interface NodeQuotaSingleItem {
    limits?: {
        cpu: string;
        memory: string;
    };
    requests?: {
        cpu: string;
        memory: string;
    };
}
