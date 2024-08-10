const {processAnvil} = require("./anvil-format")

// ボタン
const file = document.getElementById("file")
file.addEventListener('change', handleFileInput, false)

// inputのボタンと結びつける
document.getElementById("fileButton")
    .addEventListener("click", (_) => {
        file.click()
    })

// ドラッグアンドドロップ
const drop = document.getElementById("dropArea")
drop.addEventListener("drop", handleFileDrop, false)
drop.addEventListener("dragover", (e) => {
    e.preventDefault()
}, false)

/**
 * inputのファイルの処理
 * @param {Event} event
 */
function handleFileInput(event) {
    event.preventDefault()

    const files = event.target.files
    if (typeof files[0] === "undefined") return

    handleFiles(files)
}

/**
 * ドラッグアンドドロップのファイルの処理
 * @param {DragEvent} event
 */
function handleFileDrop(event) {
    event.preventDefault()

    const files = event.dataTransfer.files
    if (typeof files[0] === "undefined") return

    handleFiles(files)
}

/**
 * ファイルの処理
 * @param {FileList} files
 */
function handleFiles(files) {
    clearTable()

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)

        // ファイルが読み込まれた後の処理
        reader.onload = (function() {
            return function(e) {
                const data = new DataView(e.target.result)
                processAnvil(data)
            }
        })(file)
    }
}

/**
 * テーブルの内容を削除する
 */
function clearTable() {
    const table = document.getElementById("resultTable")
    table.innerHTML = ""
}
