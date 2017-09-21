import * as b from 'bobril';

export const svg = b.createVirtualComponent({
    id: 'svg',
    render(ctx: b.IBobrilCtx, me: b.IBobrilNode) {
        me.tag = 'svg';
        me.children = ctx.data.children;
        me.attrs = { width: 900, height: 900 };
    }
});