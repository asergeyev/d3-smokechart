// import * from "../../src/index.ts";
import {Smokechart} from "https://cdn.jsdelivr.net/gh/asergeyev/d3-smokechart@f4849d8e/umd/d3-smokechart.min.js";

let smokeData = []
// smokeData = [ 46, 47, 48, 49, 50, 51, 52, 53, 54]
smokeData = [33.2,32.7,32.6,33.5,47.7,33.3,33,34,32.5,33.3,31.9,33.4,32.8,33.1,32.9,32.1,32.3,33.7,34.4,33.1,33.2,40.5,33,33.3,34.6,34.2,32.3,32.1,33.4,31.9,32.3,33.4,32.4,32.4,39.7,32.2,32.3,33.7,33.1,32.8,33.3,32.7,32.7,33.3,33,32.1,41.3,33,37.9,32.6,33.6,33.3,35.8,33.4,33.3,32.2,33.2,32.7,32.8,33,32.6,33.4,32.1,33,32.2,34,41.2,35,39.2,31.7,33.5,32,32.9,32.6,32,32.6,42.7,33,32.2,32.4,32.8,32.9,32.4,33.2,34,32.2,33.3,32.7,33.4,33.2,33.1,32.4,32.1,32.3,32.7,32.9,32.2,33.4,32.5,32.2,33.2,33.1,37.2,32.6,32.3,32.8,32.8,32.8,32.9,33.4,33,32.6,33,32.2,33.2,32.3,32.3,33.1,31.3,33.5]


const bands = d3.calculateSmokeBands(smokeData, 1)
console.log(bands)


const smoker = Smokechart({ scaleX, scaleY }).data(smokeData).adjustScaleRange()

console.log(smoker)