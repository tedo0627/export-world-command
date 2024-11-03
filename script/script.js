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

const versions = [
    "1.7.10", "1.8.9", "1.9.4",
    "1.10.2", "1.11.2", "1.12.2",
    "1.13.2", "1.14.4", "1.15.2",
    "1.16.5", "1.17.1", "1.18.1",
    "1.18.2", "1.19.4", "1.20.1",
    "1.20.2", "1.20.4", "1.20.6",
    "1.21.1", "1.21.3"
]

// サンプルデータの処理
const sampleContainer = document.getElementById("sampleContainer")

for (let i = 0; i < versions.length; i++) {
    if (i % 6 === 0) {
        sampleContainer.appendChild(document.createElement("br"))
    }

    const version = versions[i]
    const button = document.createElement("button")
    button.textContent = version
    button.addEventListener("click", (_) => {
        inputSample(version)
    })

    sampleContainer.appendChild(button)
}

/**
 * サンプルデータの結果を表示する
 * @param {string} version
 */
function inputSample(version) {
    clearTable()

    const url = new URL("sample/" + version + ".mca", window.location.href)
    fetch(url.href)
        .then((r) => r.arrayBuffer())
        .then((buff) => {
            processAnvil(new DataView(buff))
        })
}
