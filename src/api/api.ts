import { observable } from 'bobx';
import { IApi, IAssignment, ICheck } from './iApi';

class Api {
    @observable private timeoutId: number = 0;
    async getAssignment() {
        return this.sendCommand<IAssignment>('GET');
    }
    async sendPath(id: string, path: string) {
        return this.sendCommand<ICheck>('PUT', `/${id}`, { path });
    }
    isAvailable() {
        return this.timeoutId === 0;
    }

    private sendCommand<TResult>(type: string, additionalParam?: string, dataObj?: Object) {
        this.startUsingApi();
        return new Promise<TResult>((resolve, reject) => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                this.startDelay();
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    resolve(JSON.parse(xhttp.responseText));
                }
            };
            xhttp.onerror = () => {
                this.stopUsingApi();
                reject();
            };
            xhttp.open(type, 'http://tasks-rad.quadient.com:8080/task' + (additionalParam || ''), true);
            if (dataObj !== undefined)
                xhttp.setRequestHeader('Content-Type', 'application/json');

            xhttp.send(dataObj ? JSON.stringify(dataObj) : undefined);
        });
    }

    private startUsingApi() {
        this.timeoutId = -1;
    }

    private stopUsingApi() {
        if (this.timeoutId > 0)
            window.clearTimeout(this.timeoutId);
        this.timeoutId = 0;
    }

    private startDelay() {
        this.stopUsingApi();

        this.timeoutId = window.setTimeout(() => this.stopUsingApi(), 2000);
    }
}

export const api: IApi = new Api();