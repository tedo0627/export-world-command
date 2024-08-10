const {processAnvil} = require("./anvil-format")

document.getElementById('file').addEventListener('change', handleFileSelect, false)

function handleFileSelect(event) {
    clearTable()

    const files = event.target.files
    for (let i = 0; i < files.length; i++) {
        const f = files[i]
        const reader = new FileReader()

        reader.readAsArrayBuffer(f)

        // ファイルが読み込まれた後の処理
        reader.onload = (function(file) {
            return function(e) {
                const data = new DataView(e.target.result)
                processAnvil(data)
            }
        })(f)

    }
}

/**
 * テーブルの内容を削除する
 */
function clearTable() {
    const table = document.getElementById("resultTable")
    table.innerHTML = ""
}
