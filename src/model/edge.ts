import { Vertex } from './area';

export class Edge {
    from: Vertex;
    to: Vertex;
    value: number;
    isDuplicated: boolean;

    constructor(from: Vertex, to: Vertex, value: number, isDuplicate?: boolean) {
        this.from = from;
        this.to = to;
        this.value = value;
        this.isDuplicated = isDuplicate === true;
    }
} 