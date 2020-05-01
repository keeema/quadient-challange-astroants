import * as b from "bobril";
import * as bs from "bobrilstrap";
import { initGlobalization } from "bobril-g11n";
import { observable } from "bobx";
import { api } from "./api/api";
import { log } from "./log/log";
import { IAssignment } from "./api/iApi";
import { Graph } from "./model/graph";
import { Runner } from "./runner/runner";
import { svg } from "./components/svg";
import { edge, IEdgeData } from "./components/edge";
import { path, IPathData } from "./components/path";

class AppCtx extends b.BobrilCtx<never> {
  runner: Runner = new Runner(api, log);
  @observable.ref matrixCache?: b.IBobrilNode[];
  @observable loadingCache: boolean = false;
  @observable showAllPaths: boolean = false;
}

export const app = b.createVirtualComponent({
  ctxClass: AppCtx,
  render(appCtx: AppCtx, me: b.IBobrilNode) {
    me.children = bs.Container({ style: bs.typography.textCenter }, [
      bs.H1({}, "Quadient - Astroants by Tomáš Růt"),
      bs.Textarea({
        value: log.get().join("\n"),
        rows: 20,
        fixedSize: true,
        readonly: true,
      }),
      bs.Row(
        {},
        bs.Button({
          disabled: !api.isAvailable(),
          label: "START",
          option: bs.ButtonOption.Primary,
          onClick: () => {
            appCtx.showAllPaths = false;
            appCtx.matrixCache = undefined;
            appCtx.runner.run();
          },
          style: containerItemStyle,
        })
      ),
      bs.Row(
        {},
        bs.Button({
          disabled:
            !api.isAvailable() ||
            appCtx.showAllPaths ||
            appCtx.runner.foundPath === undefined,
          label: "SHOW PATHS",
          option: bs.ButtonOption.Info,
          onClick: () => (appCtx.showAllPaths = true),
          style: containerItemStyle,
        })
      ),
      !appCtx.runner.running && bs.Row({}, getMatrix(appCtx)),
    ]);
  },
});

const containerItemStyle = b.styleDef({ marginTop: 5 });

function getMatrix(appCtx: AppCtx) {
  if (appCtx.runner.running || appCtx.runner.foundPath === undefined)
    return undefined;

  if (appCtx.showAllPaths && appCtx.matrixCache === undefined) {
    appCtx.loadingCache = true;
    setTimeout(() => {
      const cache = [];

      for (const row of appCtx.runner.graph.verticies) {
        for (const vertex of row) {
          for (const edgeFrom of vertex.edgesFrom) {
            if (edgeFrom.isDuplicated) continue;
            cache.push(
              edge({
                x1: edgeFrom.from.x,
                y1: edgeFrom.from.y,
                x2: edgeFrom.to.x,
                y2: edgeFrom.to.y,
              })
            );
          }
        }
      }
      appCtx.loadingCache = false;
      appCtx.matrixCache = cache;
    });
  }

  let content: b.IBobrilChildren = [
    path({ points: appCtx.runner.foundPath.verticies, isHighlited: true }),
  ];
  if (appCtx.showAllPaths) content = [...appCtx.matrixCache, content];
  else
    content.unshift(
      path({
        points: [
          { x: 0, y: 0 },
          { x: 0, y: 300 },
          { x: 300, y: 300 },
          { x: 300, y: 0 },
          { x: 0, y: 0 },
        ],
        isHighlited: false,
      })
    );

  return b.style(svg({}, content), containerItemStyle);
}
