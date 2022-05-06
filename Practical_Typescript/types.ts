import { Request } from "express";

export interface PhoneData {
    subscriberNumber: string;
    countryCode: string;
    id?: number;
    mno: string;
    country: string;
}

export type NewPhoneData = Omit<PhoneData, "id">;

export interface ApikeyData {
    apiKey: string;
    id?: number;
}

export type NewApikeyData = Omit<ApikeyData, "id">;

export interface mysqlConfigType {
    host: string,
    user: string,
    password: string,
}

export interface LoggerRequest extends Request {
    path: string;
}

export interface CustonRateLimitRequest extends Request {
    query: { api_key: string };
}

export interface Msisdn {
    id?: number;
    api_id: number,
    weight: number,
    time: number
}