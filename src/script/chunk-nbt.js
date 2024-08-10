const {NBT} = require("prismarine-nbt")

/**
 * チャンクのNBTの処理
 * @param {NBT} tag
 */
exports.processChunkNbt = function processChunkNbt(tag) {
    if (!("value" in tag)) return
    tag = tag.value

    if (!("block_entities" in tag)) return
    tag = tag.block_entities

    if (!("value" in tag)) return
    tag = tag.value

    if (!("value" in tag)) return
    tag = tag.value

    if (!Array.isArray(tag)) return
    for (let i = 0; i < tag.length; i++) {
        let blockEntityTag = tag[i]

        if (!("id" in blockEntityTag)) return
        const idTag = blockEntityTag.id

        if (!("value" in idTag)) return
        const blockEntityName = idTag.value
        if (blockEntityName === "minecraft:command_block") {
            commandBlock(blockEntityTag)
        } else if (blockEntityName === "minecraft:sign") {
            sign(blockEntityTag)
        }
    }
}

function commandBlock(tag) {
    let command = ""
    let x = 0
    let y = 0
    let z = 0

    if ("Command" in tag && "value" in tag.Command) {
        command = tag.Command.value
    }
    if (!command) return

    if ("x" in tag && "value" in tag.x) x = tag.x.value
    if ("y" in tag && "value" in tag.y) y = tag.y.value
    if ("z" in tag && "value" in tag.z) z = tag.z.value

    addTable("command", x, y, z, command)
}

/**
 *
 * @param tag
 */
function sign(tag) {
    const commands = []

    if ("back_text" in tag && "value" in tag.back_text) {
        const backTextTag = tag.back_text.value
        if ("messages" in backTextTag && "value" in backTextTag.messages && "value" in backTextTag.messages.value) {
            const messages = backTextTag.messages.value.value

            if (Array.isArray(messages)) {
                for (let i = 0; i < messages.length; i++) {
                    const message = messages[i]
                    const command = extractSignCommand(message)
                    if (command) {
                        commands.push(command)
                    }
                }
            }
        }
    }

    if ("front_text" in tag && "value" in tag.front_text) {
        const frontTextTag = tag.front_text.value
        if ("messages" in frontTextTag && "value" in frontTextTag.messages && "value" in frontTextTag.messages.value) {
            const messages = frontTextTag.messages.value.value

            if (Array.isArray(messages)) {
                for (let i = 0; i < messages.length; i++) {
                    const message = messages[i]
                    const command = extractSignCommand(message)
                    if (command) {
                        commands.push(command)
                    }
                }
            }
        }
    }

    let x = 0
    let y = 0
    let z = 0
    if ("x" in tag && "value" in tag.x) x = tag.x.value
    if ("y" in tag && "value" in tag.y) y = tag.y.value
    if ("z" in tag && "value" in tag.z) z = tag.z.value

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i]
        addTable("sign", x, y, z, command)
    }
}

/**
 * テーブルに値を追加する
 * @param {string} block
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {string} command
 */
function addTable(block, x, y, z, command) {
    const table = document.getElementById("resultTable")
    const tr = document.createElement("tr")

    const blockTd = document.createElement("td")
    blockTd.innerHTML = block
    const xTd = document.createElement("td")
    xTd.innerHTML = x
    const yTd = document.createElement("td")
    yTd.innerHTML = y
    const zTd = document.createElement("td")
    zTd.innerHTML = z
    const commandTd = document.createElement("td")
    commandTd.innerHTML = command

    tr.appendChild(blockTd)
    tr.appendChild(xTd)
    tr.appendChild(yTd)
    tr.appendChild(zTd)
    tr.appendChild(commandTd)

    table.appendChild(tr)
}

/**
 * 看板の文字からコマンドを抽出する
 * @param {string} text
 */
function extractSignCommand(text) {
    const obj = JSON.parse(text)
    if (!obj) return null
    if (!(obj instanceof Object)) return null

    if (!("clickEvent" in obj)) return null
    const clickEvent = obj.clickEvent

    if (!("action" in clickEvent)) return null
    if (clickEvent.action !== "run_command") return null

    if (!("value" in clickEvent)) return null
    return clickEvent.value
}
