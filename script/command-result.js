
class CommandResult {

    /** @type {string} */
    type
    /** @type {number} */
    x
    /** @type {number} */
    y
    /** @type {number} */
    z
    /** @type {string} */
    command

    /**
     * @param {string} type
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {string} command
     */
    constructor(type, x, y, z, command) {
        this.type = type
        this.x = x
        this.y = y
        this.z = z
        this.command = command
    }
}

exports.CommandResult = CommandResult