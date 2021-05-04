function dropClick() {
    document.getElementById("drop").classList.toggle("show")
    console.log(1)
}

window.onclick = function (event) {
    if (!event.target.closest(".select")) {
        var dropdowns = document.getElementsByClassName("dropdown-content")
        var i
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i]
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show")
            }
        }
    }
}

const remote = require("electron").remote
const path = require("path")
const win = remote.getCurrentWindow()

const Store = require("electron-store")
const store = new Store()

document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls()
        if (store.get("path")) {
            alert(store.get("path"))
        }
    }
}

function handleWindowControls() {
    document.getElementById("min-button").addEventListener("click", (event) => {
        win.minimize()
    })

    document.getElementById("close-button").addEventListener("click", async (event) => {
        win.close()
    })

    document.getElementById("restore-button").addEventListener("click", (event) => {
        win.unmaximize()
    })

    toggleMaxRestoreButtons()
    win.on("maximize", toggleMaxRestoreButtons)
    win.on("unmaximize", toggleMaxRestoreButtons)

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.body.classList.add("maximized")
        } else {
            document.body.classList.remove("maximized")
        }
    }
}

const { dialog } = require("electron").remote
document.getElementById("select-file").onclick = () => {
    dialog
        .showOpenDialog({
            properties: ["openDirectory"],
        })
        .then((result) => {
            if (!result.canceled) {
                store.set("path", result.filePaths[0])
                document.getElementById("selected-file").innerHTML = `Project Folder: ${store.get("path")}`
            }
        })
}
