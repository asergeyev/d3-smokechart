import { ScaleLinear } from "d3-scale";
export declare type SmokeProbeList = number[];
export declare type SmokeData = SmokeProbeList[];
export interface SmokechartProps {
    scaleX?: ScaleLinear<number, number>;
    scaleY?: ScaleLinear<number, number>;
}
export interface SmokechartArgs {
    mode?: "smoke" | "flame";
    bands?: 0 | 1 | 2 | 3 | 4 | 5;
    errors?: boolean;
}
export declare const calculateSmokeBands: (v: SmokeProbeList, bands: 0 | 1 | 2 | 3 | 4 | 5) => [number, number][];
export declare const Smokechart: (smokeData?: SmokeData | Partial<SmokechartProps> | undefined, opts?: Partial<SmokechartProps> | undefined) => {
    (smokeData?: SmokeData | Partial<SmokechartProps> | undefined, opts?: Partial<SmokechartProps> | undefined): any;
    data(smokeData?: SmokeData | undefined): SmokeData | any;
    adjustScaleRange(): any | undefined;
    scaleX(newScale?: ScaleLinear<number, number> | undefined): ScaleLinear<number, number> | any | undefined;
    scaleY(newScale?: ScaleLinear<number, number> | undefined): ScaleLinear<number, number> | any | undefined;
    line(q?: number): (string | null)[];
    smokeBands(bCount?: 1 | 2 | 3 | 4 | 5): string[];
    countErrors(probeCount?: number): {
        x: number;
        errPos: number;
    }[];
    chart(selection: any, args?: SmokechartArgs | undefined): void;
};