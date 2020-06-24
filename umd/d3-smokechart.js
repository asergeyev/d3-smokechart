(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-scale'), require('d3-shape')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-scale', 'd3-shape'], factory) :
    (global = global || self, factory(global.d3 = global.d3 || {}, global.d3, global.d3));
}(this, (function (exports, d3Scale, d3Shape) { 'use strict';

    const quantile = (probes, q) => {
        if (q < 0 || q > 1 || isNaN(q))
            throw new Error(`Unable to calculate ${q} quantile`);
        var alq = (probes.length - 1) * q;
        var idx = Math.floor(alq);
        var diff = alq - idx;
        return diff < 0.001 ? probes[idx] : Math.floor(probes[idx] * (1 - diff) + probes[idx + 1] * diff + 0.5);
    };
    const smokeAreaConfig = [
        [],
        [[0, 1]],
        [[0, 1], [.25, .75]],
        [[0, 1], [.15, .85], [.3, .7]],
        [[0, 1], [.1, .9], [.2, .8], [.3, .7]],
        [[0, 1], [.1, .9], [.2, .8], [.3, .7], [.4, .6]]
    ];
    const calculateSmokeBands = (v, bands) => {
        const bandKind = smokeAreaConfig[bands];
        return bandKind.map(([from, to]) => [quantile(v, from), quantile(v, to)]);
    };
    const Smokechart = (smokeData, opts) => {
        const props = {
            scaleX: d3Scale.scaleLinear(),
            scaleY: d3Scale.scaleLinear(),
        };
        let data = [];
        let classSuffix = Math.floor(Math.random() * 100000);
        const smoke = (smokeData, opts) => {
            if (smokeData && !Array.isArray(smokeData)) {
                opts = smokeData;
                smokeData = undefined;
            }
            if (opts)
                Object.assign(props, opts);
            if (smokeData)
                smoke.data(smokeData);
            classSuffix = Math.floor(Math.random() * 100000);
            return smoke;
        };
        smoke.data = (smokeData) => {
            if (smokeData) {
                data = smokeData.map(arr => [...arr.filter(n => !isNaN(n))].sort((a, b) => a - b));
                return smoke;
            }
            return data;
        };
        smoke.adjustScaleRange = () => {
            if (props.scaleX)
                props.scaleX.domain([0, data.length]);
            if (!props.scaleY)
                return;
            let minY = Infinity;
            let maxY = -Infinity;
            data.forEach(arr => {
                if (arr.length) {
                    if (arr[0] < minY)
                        minY = arr[0];
                    if (arr[arr.length - 1] > maxY)
                        maxY = arr[arr.length - 1];
                }
            });
            props.scaleY.domain([minY, maxY]);
            return smoke;
        };
        smoke.scaleX = (newScale) => {
            if (newScale) {
                props.scaleX = newScale;
                return smoke;
            }
            return props.scaleX;
        };
        smoke.scaleY = (newScale) => {
            if (newScale) {
                props.scaleY = newScale;
                return smoke;
            }
            return props.scaleY;
        };
        smoke.line = (q = 0.5) => {
            const l = d3Shape.line()
                .x(d => (props.scaleX ? props.scaleX(d[0]) : d[0]))
                .y(d => (props.scaleY ? props.scaleY(d[1]) : d[1]));
            const quantileData = data.reduce((reslt, values, idx) => {
                const p = quantile(values, q);
                return [...reslt, [idx - 0.5, p], [idx + 0.5, p]];
            }, []);
            return [l(quantileData)];
        };
        smoke.smokeBands = (bCount = 2) => {
            const l = d3Shape.line()
                .x(d => (props.scaleX ? props.scaleX(d[0]) : d[0]))
                .y(d => (props.scaleY ? props.scaleY(d[1]) : d[1]));
            const bands = data.reduce((reslt, values, idx) => {
                const bandData = calculateSmokeBands(values, bCount);
                const x = idx - 0.5;
                const bandLines = bandData.map(([y0, y1]) => l([
                    [x, y0],
                    [x, y1],
                    [x + 1, y1],
                    [x + 1, y0],
                ]) || "");
                return [...reslt, bandLines];
            }, []);
            return bands[0].map((_, columnIdx) => bands.map(row => row[columnIdx]).join(""));
        };
        smoke.countErrors = (probeCount = -1) => {
            const values = data.map(list => list.length);
            const desired = probeCount >= 0 ? probeCount : Math.max(...values);
            const underCount = values.map(ln => (desired > ln ? desired - ln : 0));
            return underCount.reduce((ret, under, idx) => {
                if (under > 0) {
                    const elems = [];
                    const x = props.scaleX ? props.scaleX(idx) : idx;
                    for (let errPos = 0; errPos < under; errPos++)
                        elems.push({ x, errPos });
                    return [...ret, ...elems];
                }
                return ret;
            }, []);
        };
        smoke.chart = (selection, args) => {
            if (args === null || args === void 0 ? void 0 : args.bands) {
                selection
                    .selectAll("path.smokechart-band" + classSuffix)
                    .data(smoke.smokeBands(args === null || args === void 0 ? void 0 : args.bands))
                    .enter()
                    .append("path")
                    .classed("smokechart-band", true)
                    .attr("fill", "rgba(0,0,0,0.18)")
                    .attr("d", (d) => d);
            }
            selection
                .selectAll("path.smokechart-line" + classSuffix)
                .data(smoke.line(0.5))
                .enter()
                .append("path")
                .classed("smokechart-line", true)
                .attr("stroke", "#ff0000")
                .attr("stroke-width", 1.1)
                .attr("fill", "transparent")
                .attr("d", (d) => d);
            if (args === null || args === void 0 ? void 0 : args.errors) {
                const errors = smoke.countErrors() || [];
                if (errors.length) {
                    let r = props.scaleX(0.25) - props.scaleX(0);
                    if (r < 2) {
                        r = 2;
                    }
                    selection
                        .selectAll("circle.smokechart-baseline" + classSuffix)
                        .data(errors)
                        .enter()
                        .append("circle")
                        .attr("cx", (d) => d.x)
                        .attr("cy", (d) => r + d.errPos * r * 2.2)
                        .attr("r", r)
                        .attr("fill", "#f30");
                }
            }
        };
        return smoke(smokeData, opts);
    };

    exports.Smokechart = Smokechart;
    exports.calculateSmokeBands = calculateSmokeBands;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=d3-smokechart.js.map
