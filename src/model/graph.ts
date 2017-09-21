import { Vertex } from './area';
import { Edge } from './edge';
import { IMap, IPosition } from '../api/iApi';

export interface IPathResult {
    verticies: Vertex[];
    edges: Edge[];
    directions: string[];
}

export class Graph {
    size: number = 0;
    edges: Edge[] = [];
    verticies: Vertex[][] = [];

    constructor(map: IMap) {
        this.size = Math.sqrt(map.areas.length);

        for (let i = 0; i < this.size; i++) {
            this.verticies.push([]);
        }

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const area = this.resolveArea(map, x, y);

                if (area.right) {
                    this.assignVerticies(area, this.resolveArea(map, x + 1, y));
                }

                if (area.down) {
                    this.assignVerticies(area, this.resolveArea(map, x, y + 1));
                }
            }
        }
    }

    getMinimalPath(startPosition: IPosition, endPosition: IPosition): Promise<IPathResult> {
        const startArea = this.verticies[startPosition.y][startPosition.x];
        const endArea = this.verticies[endPosition.y][endPosition.x];

        return new Promise<IPathResult>((resolve) => {
            setTimeout(() => {
                this.ratePaths(endArea);
                resolve(this.constructPath(startArea, endArea));
            });
        });
    }

    private ratePaths(vertex: Vertex) {
        vertex.pathValue = 0;

        const edgesToRate: Edge[] = [...vertex.edgesTo];

        while (edgesToRate.length > 0) {
            const edge = edgesToRate.shift();
            const nextPathValue = edge.to.pathValue + edge.value;
            if (edge.from.pathValue === undefined || edge.from.pathValue > nextPathValue) {
                edge.from.pathValue = nextPathValue;
                edgesToRate.push(...edge.from.edgesTo);
            }
        }
    }

    private constructPath(startVertex: Vertex, endVertex: Vertex): IPathResult {
        const result: IPathResult = {
            verticies: [],
            directions: [],
            edges: []
        };
        let currentVertex: Vertex = startVertex;
        do {
            result.verticies.push(currentVertex);
            const nextEdge = currentVertex.edgesFrom.filter(edge => edge.to.pathValue === currentVertex.pathValue - edge.value)[0];
            result.directions.push(this.getDirection(currentVertex, nextEdge.to));
            result.edges.push(nextEdge);
            currentVertex = nextEdge.to;
        } while (currentVertex !== endVertex);

        return result;
    }

    private getDirection(first: IPosition, second: IPosition): string {
        if (first.y === second.y) {
            return first.x < second.x ? 'R' : 'L';
        } else {
            return first.y < second.y ? 'D' : 'U';
        }
    }

    private assignVerticies(firstArea: Vertex, secondArea: Vertex) {
        const firstAreaVertex = new Edge(firstArea, secondArea, secondArea.value);
        const secondAreaVertex = new Edge(secondArea, firstArea, firstArea.value, true);
        firstArea.edgesFrom.push(firstAreaVertex);
        firstArea.edgesTo.push(secondAreaVertex);
        secondArea.edgesFrom.push(secondAreaVertex);
        secondArea.edgesTo.push(firstAreaVertex);
        this.edges.push(firstAreaVertex, secondAreaVertex);
    }

    private resolveArea(map: IMap, x: number, y: number) {
        let area = this.verticies[y][x];
        if (area !== undefined)
            return area;

        const index = y * this.size + x;
        area = new Vertex(map.areas[index], index, x, y);
        return this.verticies[y][x] = area;
    }
}