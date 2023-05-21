#!/usr/bin/env node
// This code generates a sphere with a specified radius, resolution and block type.
import { Save, Block, BlockId } from "cm2js"

const radius = 10
const resolution = 10
const blockId = BlockId.Or

const save = new Save()

function sphericalToCartesian(radius, inc, azimuth) {
    return [
        radius * Math.sin(inc) * Math.cos(azimuth),
        radius * Math.cos(inc),
        radius * Math.sin(inc) * Math.sin(azimuth)
    ]
}

for (let incRes = 0; incRes < resolution; incRes++) {
    for (let aziRes = 0; aziRes < resolution; aziRes++) {
        const [ x, y, z ] = sphericalToCartesian(radius, incRes / resolution * Math.PI, aziRes / resolution * Math.PI * 2)
        save.addBlock(new Block(blockId, x, y + radius, z), true)
    }
}

const saveString = save.export()
console.log(saveString)