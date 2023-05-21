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
                saveString += `${block.id},${+ block.state},${block.x},${block.y},${block.z},`
                if (block instanceof LedBlock) saveString += `${block.r}+${block.g}+${block.b}`;
                if (block instanceof SoundBlock) saveString += block.frequency
                saveString += ";"
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

    import(saveString) {
        const [ blocks, connections ] = saveString.split("?")
        const blockPool = []

        if (blocks) {
            for (const blockString of blocks.split(";")) {
                const [ id, numState, x, y, z, extra ] = blockString.split(",")
                const state = !! Number(numState)

                if (id == BlockId.Led) {
                    const [ r, g, b ] = extra.split("+")
                    blockPool.push(this.addBlock(new LedBlock(x, y, z, state, r, g, b)))
                    continue
                }

                if (id == BlockId.Sound) {
                    blockPool.push(this.addBlock(new SoundBlock(x, y, z, state, extra)))
                    continue
                }

                blockPool.push(this.addBlock(new Block(id, x, y, z, state)))
            }
        }

        if (connections) {
            for (const connectionString of connections.split(";")) {
                const [ source, target ] = connectionString.split(",")
                this.addConnection(new Connection(blockPool[source - 1], blockPool[target - 1]))
            }
        }
    }
}

class Block {
    constructor (id, x, y, z, state = false) {
        this.id = Number(id)
        this.x = Number(x)
        this.y = Number(y)
        this.z = Number(z)
        this.state = state
    }
}

class LedBlock extends Block {
    constructor (x, y, z, state = false, r = 127, g = 127, b = 127) {
        super(BlockId.Led, x, y, z, state)
        this.r = Number(r)
        this.g = Number(g)
        this.b = Number(b)
    }
}

class SoundBlock extends Block {
    constructor (x, y, z, state = false, frequency = 1567.98) {
        super(BlockId.Sound, x, y, z, state)
        this.frequency = Number(frequency)
    }
}

class Connection {
    constructor (source, target) {
        this.source = source
        this.target = target
    }
}

export { Save, Block, Connection, BlockId }