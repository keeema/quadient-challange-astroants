import { observable } from 'bobx';
import { f } from 'bobril-g11n';

export interface ILog {
    write(messege: string): void;
    get(): string[];
    clear(): void;
}

export interface IMessage {
    time: Date;
    text: string;
}

class Log {
    @observable.shallow messages: IMessage[] = [];

    write(message: string) {
        this.messages.push({ time: new Date(Date.now()), text: message });
    }

    get(): string[] {
        return this.messages.map(msg => f('{time,date, custom, format:{HH:mm:ss.SSS}}: {text}', msg));
    }

    clear() {
        this.messages = [];
    }
};

export const log: ILog = new Log();