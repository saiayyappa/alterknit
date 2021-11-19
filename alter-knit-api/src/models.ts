interface AddressInfo {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    phone: string;
    email: string;
    isBillingAddress: boolean;
    buildingType: number;
    pickUpDate: string;
    pickUpTime: string;
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
    billingAddressInfo: AddressInfo;
    deliverySpeed: string;
    createdAt: string;
}