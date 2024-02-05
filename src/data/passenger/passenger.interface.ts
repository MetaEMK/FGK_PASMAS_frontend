import type { Flight } from "../flight/flight.interface";

export interface Passenger {
    ID?: number;
    FirstName?: string;
    LastName?: string;
    Weight?: number;
    FlightID?: number;
    Flight?: Flight;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    DeletedAt?: Date;
}
