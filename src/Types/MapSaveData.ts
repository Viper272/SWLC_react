import { point } from "./SectorTypes";

export class MapSaveData {
    mapSize: number;
    sectors: SectorSaveData[]
    connections: SectorConnectionData[]
    constructor() {
        this.mapSize = 0;
        this.sectors = [];
        this.connections = [];
    }
}

export class SectorSaveData {
    id: number;
    name: string;
    abbr: string;
    position: point;
    unitIconLocation: point;

    constructor() {
        this.id = -1;
        this.name = "";
        this.abbr = "";
        this.position = {X:0, Y:0}
        this.unitIconLocation = {X:0, Y:0}
    }
}
export class SectorConnectionData {
    id: number;
    sectorIDs: number[]
    constructor() {
        this.id = -1;
        this.sectorIDs = [];
    }
}