const nbt = require("prismarine-nbt")
const pako = require("pako")
const {processChunkNbt} = require("./chunk-nbt");

/**
 * anvilフォーマットの処理
 * @param {DataView} dataView
 */
exports.processAnvil = function processAnvil(dataView) {
    let offset = 0

    const chunkOffsets = []
    for (let chunkX = 0; chunkX < 32; chunkX++) {
        const chunkOffset = []
        for (let chunkZ = 0; chunkZ < 32; chunkZ++) {
            chunkOffset.push(getUint24(dataView, offset, false))
            offset += 3

            // セクター数はいらないから飛ばす
            offset += 1
        }
        chunkOffsets.push(chunkOffset)
    }

    // タイムスタンプはいらないから飛ばす
    offset += 32 * 32 * 4

    for (let chunkX = 0; chunkX < 32; chunkX++) {
        for (let chunkZ = 0; chunkZ < 32; chunkZ++) {
            offset = chunkOffsets[chunkX][chunkZ]
            if (offset === 0) continue

            offset *= 4096
            const length = dataView.getInt32(offset)
            offset += 4
            const compressionType = dataView.getInt8(offset)
            offset += 1

            if (compressionType !== 2) continue // zlib

            const buffer = getArrayBuffer(dataView, offset, length - 1)
            const decompressedBuffer = pako.inflate(buffer)
            nbt.parse(Buffer.from(decompressedBuffer))
                .then(r2 => {
                    processChunkNbt(r2.parsed)
                })
                .catch(() => {})
        }
    }
}

/**
 * DataViewから 3Byte 値を取得する
 * @param {DataView} dataView
 * @param {number} byteOffset
 * @param {boolean} littleEndian
 * @returns {number}
 */
function getUint24(dataView, byteOffset, littleEndian = false) {
    const byte1 = dataView.getUint8(byteOffset)
    const byte2 = dataView.getUint8(byteOffset + 1)
    const byte3 = dataView.getUint8(byteOffset + 2)

    if (littleEndian) {
        return (byte3 << 16) | (byte2 << 8) | byte1
    } else {
        return (byte1 << 16) | (byte2 << 8) | byte3
    }
}

/**
 * DataViewから指定した範囲の buffer を切り抜く
 * @param {DataView} dataView
 * @param {number} offset
 * @param {number} length
 * @returns {ArrayBuffer}
 */
function getArrayBuffer(dataView, offset, length) {
    const buffer = new ArrayBuffer(length)

    const targetArray = new Uint8Array(buffer)
    const sourceArray = new Uint8Array(dataView.buffer, offset, length)

    targetArray.set(sourceArray, 0)

    return buffer
}
