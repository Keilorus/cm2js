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
    constructor (blocks = [], connections = [], buildings = []) {
        this.blocks = blocks
        this.connections = connections
        this.buildings = buildings
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

    addBuilding(building) {
        this.buildings.push(building)
        return building
    }

    removeBlock(block) {
        this.blocks.splice(this.blocks.findIndex(findBlock => findBlock === block), 1)
    }

    removeConnection(connection) {
        this.connections.splice(this.connections.findIndex(findConnection => findConnection === connection), 1)
    }

    removeBuilding(building) {
        this.buildings.splice(this.buildings.findIndex(findBuilding => findBuilding === building), 1)
    }

    export() {
        let saveString = ""

        const blocksStrings = []

        for (const block of this.blocks) {
            blocksStrings.push(`${block.id},${+ block.state},${block.x},${block.y},${block.z},${block.properties.join("+")}`)
        }

        saveString += blocksStrings.join(";") + "?"

        const connectionStrings = []

        for (const connection of this.connections) {
            connectionStrings.push(
                this.blocks.findIndex(block => block === connection.source) + 1 + "," +
                this.blocks.findIndex(block => block === connection.target) + 1
            )
        }

        saveString += connectionStrings.join(";") + "?"

        const buildingStrings = []

        for (const building of this.buildings) {
            buildingStrings.push(`${building.name},${building.cframe.join(",")},${building.connections.map(
                connection => connection ? `${+ connection.sending}${this.blocks.findIndex(block => block === connection.block) + 1}` : ""
            ).join(",")}`)
        }

        saveString += buildingStrings.join(";") + "?"

        return saveString
    }

    import(saveString) {
        const [ blocks, connections, buildings ] = saveString.split("?")
        const blockPool = []

        if (blocks) {
            for (const blockString of blocks.split(";")) {
                const [ id, state, x, y, z, props ] = blockString.split(",")

                blockPool.push(this.addBlock(new Block(id, x, y, z, state, props.split("+"))))
            }
        }

        if (connections) {
            for (const connectionString of connections.split(";")) {
                const [ source, target ] = connectionString.split(",")
                this.addConnection(new Connection(blockPool[source - 1], blockPool[target - 1]))
            }
        }

        if (buildings) {
            for (const buildingString of buildings.split(";")) {
                const [
                    name,
                    x, y, z,
                    r00, r01, r02,
                    r10, r11, r12,
                    r20, r21, r22,
                    ...connectionString
                ] = buildingString.split(",")

                this.addBuilding(new Building(name, [
                    x, y, z,
                    r00, r01, r02,
                    r10, r11, r12,
                    r20, r21, r22
                ], connectionString.map(connection => connection ? ({
                    sending: !! Number(connection.substring(0, 1)),
                    block: blockPool[connection.substring(1) - 1]
                }) : null )))
            }
        }
    }
}

class Block {
    constructor (id, x, y, z, state = false, properties = []) {
        this.id = parseInt(id)
        this.x = Number(x)
        this.y = Number(y)
        this.z = Number(z)
        this.state = !! Number(state)
        this.properties = properties.map(prop => Number(prop))
    }
}

class Connection {
    constructor (source, target) {
        this.source = source
        this.target = target
    }
}

class Building {
    constructor (name, cframe, connections) {
        this.name = name
        this.cframe = cframe.map(number => Number(number))
        this.connections = connections
    }
}

export { Save, Block, Connection, Building, BlockId }