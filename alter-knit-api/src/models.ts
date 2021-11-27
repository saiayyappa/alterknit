interface AddressInfo {
    firstName: string;
    lastName: string;
    address: string;
    companyName: string;
    city: string;
    state: string;
    zipcode: string;
    phone: string;
    email: string;
    isBillingAddressSame?: boolean;
    buildingType?: number;
    pickUpDate?: string;
    pickUpTime?: string;
}

interface Garment {
    serviceNeeded: string[];
    brand: string;
    color: string;
    ageOfGarment: number;
    noOfHoles: number;
    briefDescription: string;
    isDryCleaned: boolean;
    isCleaned: boolean;
}

export interface Order {
    id?: number;
    orderMethod: string;
    garments: Garment[];
    addressInfo: AddressInfo;
    billingAddressInfo?: AddressInfo;
    deliverySpeed: string;
    createdAt: string;
}

export interface FedexTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}
export interface Details {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
}