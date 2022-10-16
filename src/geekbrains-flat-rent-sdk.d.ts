import { SearchFilter } from "./store/domain/search-filter";

declare module flatRentSdk {
    export interface iHotelInfo {
        id: string;
        title: string;
        details: string;
        photos: string[];
        coordinates: number[];
        bookedDates: [];
        price: number;
    }

    export interface iParameters {
        city: string;
        checkInDate: Date;
        checkOutDate: Date;
        priceLimit: number;
    }

    export const database: iHotelInfo[]

    export function cloneDate(date: Date): Date

    export function addDays(date: Date, days: number): Date

    export const backendPort: number
    export const localStorageKey: string

    export class FlatRentSdk {
        constructor()
        /**
         * Get flat by ID.
         * 
         * @param {string} id Flat ID.
         * @returns {Promise<Object|null>} Flat.
         */
        get(id: string): Promise<Object | null>

        /**
         * Search for flats.
         * 
         * @param {Object} parameters Search parameters
         * @param {string}parameters.city City name
         * @param {Date} parameters.checkInDate Check-in date
         * @param {Date} parameters.checkOutDate Check-out date
         * @param {number} [parameters.priceLimit] Max price for a night
         * @returns {Object[]} List of suitable flats.
         */
        search(parameters: SearchFilter): Promise<Object | null>

        /**
         * Book flat.
         * 
         * @param {number} flatId 
         * @param {Date} checkInDate 
         * @param {Date} checkOutDate
         * @returns {number}
         */
        book(flatId: number, checkInDate: Date, checkOutDate: Date): number

        _assertDatesAreCorrect(checkInDate: Date, checkOutDate: Date): Error

        _resetTime(date: Date): void

        _calculateDifferenceInDays(startDate: Date, endDate: Date): number

        _generateDateRange(from: Date, to: Date): Date[]

        _generateTransactionId(): number

        _areAllDatesAvailable(flat: iHotelInfo[], dateRange: []): boolean

        _formatFlatObject(flat: iHotelInfo[], nightNumber: number): string | object

        _readDatabase(): string | object

        _writeDatabase(database: iHotelInfo[]): void

        _syncDatabase(database: iHotelInfo[]): void
    }

}
export = flatRentSdk;