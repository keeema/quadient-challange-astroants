import { apiMock } from './apiMock';
import { Graph } from '../src/model/graph';

describe('graph', () => {
    it('correctly computes the minimal path', async () => {
        const assignment = await apiMock.getAssignment();
        const graph = new Graph(assignment.map);
        const path = await graph.getMinimalPath(assignment.astroants, assignment.sugar);
        expect(path.directions.join('')).toEqual('DLDRRU');
    });
});