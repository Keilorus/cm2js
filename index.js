#!/usr/bin/env node
const BlockId = {
    Nor: 0,
    And: 1,
    Or: 2,
    Xor: 3,
    Button: 4,
    TFlipFlop: 5,
    Led: 6,
    Sound: 7,
    Conductor: 8,
    Custom: 9,
    Xand: 10,
    Xnor: 11
}

class Save {
    constructor (blocks = [], connections = []) {
        this.blocks = blocks
        this.connections = connections
    }

    addBlock(block, checkDuplicate = false) {
        if (checkDuplicate && this.blocks.find(findBlock =>
            findBlock.x == block.x &&
            findBlock.y == block.y &&
            findBlock.z == block.z)) return;

        this.blocks.push(block)
        return block
    }

    addConnection(connection) {
        this.connections.push(connection)
        return connection
    }

    removeBlock(block) {
        this.blocks.splice(this.blocks.findIndex(findBlock => findBlock === block), 1)
    }

    removeConnection(connection) {
        this.connections.splice(this.connections.findIndex(findConnection => findConnection === connection), 1)
    }

    export() {
        let saveString = ""

        if (this.blocks.length > 0) {
            for (const block of this.blocks) {
                saveString += `${block.id},${+ block.state},${block.x},${block.y},${block.z},;`
            }

            saveString = saveString.slice(0, saveString.length - 1)
        }

        saveString += "?"

        if (this.connections.length > 0) {
            for (const connection of this.connections) {
                saveString += this.blocks.findIndex(block => block === connection.source) + 1 + ","
                saveString += this.blocks.findIndex(block => block === connection.target) + 1 + ";"
            }

            saveString = saveString.slice(0, saveString.length - 1)
        }

        saveString += "?"

        return saveString
    }
}

class Block {
    constructor (id, x, y, z, state = false) {
        this.id = id
        this.x = x
        this.y = y
        this.z = z
        this.state = state
    }
}

class Connection {
    constructor (source, target) {
        this.source = source
        this.target = target
    }
}

export { Save, Block, Connection, BlockId }