import * as b from 'bobril';
import * as constants from './constants';

export interface IPathData {
    points: { x: number; y: number }[];
    isHighlited: boolean;
}

interface IPathCtx extends b.IBobrilCtx {
    data: IPathData;
}

const baseStyle = b.styleDef({ strokeWidth: 1, fill: 'none' });
const normalStyle = b.styleDefEx(baseStyle, { stroke: '#e6e6e6' });
const highlightStyle = b.styleDefEx(baseStyle, { stroke: '#0000ff' });

export const path = b.createVirtualComponent<IPathData>({
    id: 'path',
    render(ctx: IPathCtx, me: b.IBobrilNode) {
        me.tag = 'path';

        let pathStr = '';

        for (let point of ctx.data.points) {
            const flag = point === ctx.data.points[0] ? 'M' : 'L';
            pathStr += ` ${flag}${point.x * constants.lineLength} ${point.y * constants.lineLength}`;
        }

        me.attrs = {
            d: pathStr
        };
        b.style(me, baseStyle, ctx.data.isHighlited ? highlightStyle : normalStyle);
    }
});