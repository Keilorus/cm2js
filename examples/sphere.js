#!/usr/bin/env node
// This code generates a sphere with a specified radius, resolution and block type.
import { Save, Block, Connection, BlockId } from "cm2js"

const radius = 10
const resolution = 20
const blockId = BlockId.Or

const save = new Save()

const TAU = Math.PI * 2
const resTau = resolution / TAU

for (let r = 0; i < Math.floor(resolution / 2); i++) {
    for (let i = 0; i < resolution; i++) {
        const x = Math.floor(Math.sin(i / resTau)) * radius * Math.cos(r / resTau)
        const y = Math.floor(Math.cos(i / resTau ) + 1) * radius
        const z = Math.floor(Math.sin(r / resTau)) * radius * Math.sin(i / resTau)
        save.addBlock(new Block(blockId, x, y, z))
    }
}

const saveString = save.export()
console.log(saveString)