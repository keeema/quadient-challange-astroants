
import { Edge } from './edge';

export class Vertex {
    pathValue: number;
    index: number;
    x: number;
    y: number;
    value: number;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    edgesFrom: Edge[] = [];
    edgesTo: Edge[] = [];

    constructor(def: string, index: number, x: number, y: number) {
        this.index = index;
        this.x = x;
        this.y = y;
        const parts = def.split('-');
        this.value = parseInt(parts[0], 10);
        for (let direction of parts[1]) {
            switch (direction) {
                case 'L':
                    this.left = true;
                    break;
                case 'R':
                    this.right = true;
                    break;
                case 'U':
                    this.up = true;
                    break;
                case 'D':
                    this.down = true;
                    break;
            }
        }
    }
}