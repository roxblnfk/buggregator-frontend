import { ProfilerCost } from "~/config/types";

export type TNode = {
  data: {
    id: string,
    name: string,
    cost?: ProfilerCost,
    color?: string,
    textColor?: string
  }
}

export type TEdge = {
  data: {
    id?: string,
    source: string,
    target: string,
    label?: string,
    color?: string,
  }
}
