import { IApi, IAssignment, ICheck } from '../src/api/iApi';

const assignment: IAssignment = JSON.parse(`{
    "id": "2727",
    "startedTimestamp": 1503929807498, 
    "map": { 
        "areas": ["5-R", "1-RDL", "10-DL", "2-RD", "1-UL", "1-UD", "2-RU", "1-RL", "2-UL"] 
    },
    "astroants": {"x": 1, "y": 0 },
    "sugar": { "x" : 2, "y": 1 }
}`);

export const apiMock: IApi = {
    getAssignment() {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(assignment));
        });
    },
    sendPath(id: string, path: string) {
        return new Promise<ICheck>((resolve, reject) => {
            setTimeout(() => resolve({
                inTime: true,
                valid: path === 'DLDRRU',
                message: 'Some message'
            }));
        });
    },
    isAvailable(): boolean { return true; }
};