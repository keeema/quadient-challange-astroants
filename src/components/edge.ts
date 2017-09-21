import * as b from 'bobril';
import * as constants from './constants';

export interface IEdgeData {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

interface IEdgeCtx extends b.IBobrilCtx {
    data: IEdgeData;
}

const baseStyle = b.styleDef({ strokeWidth: 1, stroke: '#e6e6e6' });

export const edge = b.createVirtualComponent<IEdgeData>({
    id: 'edge',
    render(ctx: IEdgeCtx, me: b.IBobrilNode) {
        me.tag = 'line';
        me.attrs = {
            x1: ctx.data.x1 * constants.lineLength,
            y1: ctx.data.y1 * constants.lineLength,
            x2: ctx.data.x2 * constants.lineLength,
            y2: ctx.data.y2 * constants.lineLength,
        };
        b.style(me, baseStyle);
    }
});