export interface IApi {
    getAssignment(): Promise<IAssignment>;
    sendPath(id: string, path: string): Promise<ICheck>;
    isAvailable(): boolean;
}

export interface ICheck {
    valid: boolean;
    inTime: boolean;
    message: string;
}

export interface IMap {
    areas: string[];
}

export interface IPosition {
    x: number;
    y: number;
}

export interface IAssignment {
    id: string;
    startedTimestamp: number;
    map: IMap;
    astroants: IPosition;
    sugar: IPosition;
}