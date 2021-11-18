interface ShippingInfo {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    phone: string;
    email: string;
    isBillingAddress: boolean;
}

interface PickUpInfo {
    firstName: string;
    lastName: string;
    buildingType: number;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    phone: string;
    email: string;
    pickUpDate: string;
    pickUpTime: string;
    isBillingAddress: boolean;
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
    addressInfo: ShippingInfo | PickUpInfo;
    billingAddressInfo: ShippingInfo;
    deliverySpeed: string;
    createdAt: string;
}