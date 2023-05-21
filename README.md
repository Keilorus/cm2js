# cm2js
Circuit Maker 2 save generation and manipulation package

This is a js version of [cm2py](https://github.com/QEStudios/cm2py) made by [SKM GEEK](https://github.com/QEStudios)

## Installation
Use the package manager [npm](https://www.npmjs.com/) to install cm2js.

```bash
npm install cm2js
```

## Usage
Basic program to generate a line of 8 looping OR blocks:

```js
import { Save, Block, Connection, BlockId } from "cm2js"

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
```
(from the [loop.js](examples/loop.js) example)

## Contributing
Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)