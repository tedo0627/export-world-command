const {CommandResult} = require("./command-result");

/**
 * 看板に埋め込まれているコマンドを解析する
 * @param {Object} tag
 * @return {Array.<CommandResult>}
 */
exports.parseSign = function parseSign(tag) {
    const commands = []

    // 1.20以上
    let commandResults = parseDoubleSideText("front_text", tag)
    if (commandResults.length !== 0) commands.push(commandResults)
    commandResults = parseDoubleSideText("back_text", tag)
    if (commandResults.length !== 0) commands.push(commandResults)

    // 1.20未満
    let commandResult = parseLineText("Text1", tag)
    if (commandResult) commands.push(commandResult)
    commandResult = parseLineText("Text2", tag)
    if (commandResult) commands.push(commandResult)
    commandResult = parseLineText("Text3", tag)
    if (commandResult) commands.push(commandResult)
    commandResult = parseLineText("Text4", tag)
    if (commandResult) commands.push(commandResult)

    let x = 0
    let y = 0
    let z = 0
    if ("x" in tag && "value" in tag.x) x = tag.x.value
    if ("y" in tag && "value" in tag.y) y = tag.y.value
    if ("z" in tag && "value" in tag.z) z = tag.z.value

    const results = []
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i]
        results.push(new CommandResult("sign", x, y, z, command))
    }

    return results
}

/**
 * 1.20以上の解析
 * @param {string} tagName
 * @param {Object} tag
 * @return {string[]}
 */
function parseDoubleSideText(tagName, tag) {
    const commands = []

    if (tagName in tag && "value" in tag[tagName]) {
        const textTag = tag[tagName].value
        if ("messages" in textTag && "value" in textTag.messages && "value" in textTag.messages.value) {
            const messages = textTag.messages.value.value

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

    return commands
}

/**
 * 1.20未満の解析
 * @param {string} tagName
 * @param {Object} tag
 * @return {string[]}
 */
function parseLineText(tagName, tag) {
    if (tagName in tag && "value" in tag[tagName]) {
        const message = tag[tagName].value
        return extractSignCommand(message)
    }

    return null
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