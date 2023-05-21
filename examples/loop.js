const { Save, Block, Connection, BlockId } = require("cm2js")

const length = 8
const blockId = BlockId.Or

const save = new Save()

for (let i = 0; i < length; i++) {
    const block = save.addBlock(new Block(blockId, i, 0, 0))

    if (i > 0) {
        save.addConnection(new Connection(save.blocks[i - 1], block))
    }
}

const saveString = save.export()
console.log(saveString)