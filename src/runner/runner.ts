import { ILog } from '../log/log';
import { IApi, IAssignment } from '../api/iApi';
import { Graph, IPathResult } from '../model/graph';

export class Runner {
    graph?: Graph;
    foundPath?: IPathResult;
    running: boolean = false;
    private _api: IApi;
    private _log: ILog;

    constructor(api: IApi, log: ILog) {
        this._api = api;
        this._log = log;
    }

    async run() {
        this.running = true;
        this._log.clear();
        this._log.write('Start loading...');
        this.foundPath = this.graph = undefined;
        try {
            const assignment = await this._api.getAssignment();
            this._log.write('Data loaded. Creating graph...');
            await this.performComputing(assignment);
        } catch {
            this._log.write('Some problem occured.');
        } finally {
            this.running = false;
        }
    }

    private async performComputing(assignment: IAssignment) {
        this.graph = new Graph(assignment.map);
        const start = Date.now();
        this.foundPath = await this.graph.getMinimalPath(assignment.astroants, assignment.sugar);

        const end = Date.now();
        const directions = this.foundPath.directions.join('');
        this._log.write(`Path computed in time ${end - start}ms. Result: ${directions}`);
        this._log.write('Sending to check....');
        const result = await this._api.sendPath(assignment.id, directions);
        this._log.write(`In-time: ${result.inTime.toString()}, Valid: ${result.valid.toString()}, Info: ${result.message.toString()}`);
    }
}