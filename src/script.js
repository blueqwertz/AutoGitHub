function dropClick() {
    document.getElementById("drop").classList.toggle("show")
}

const fs = require("fs")

var settings

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

var settingsArr = ["private", "issues", "wiki"]

for (let id of settingsArr) {
    document.getElementById(id).oninput = () => {
        settings["settings"][id] = document.getElementById(id).checked
        saveSettings()
    }
}

const remote = require("electron").remote
const win = remote.getCurrentWindow()

document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        fs.readFile("src/settings.json", (err, data) => {
            if (err) throw err
            settings = JSON.parse(data)
            document.getElementById("selected-file").innerHTML = `Project Folder: ${settings["path"]}`
            handleWindowControls()
            for (let id of settingsArr) {
                document.getElementById(id).checked = settings["settings"][id]
            }
        })
    }
}

function saveSettings() {
    fs.writeFile("src/settings.json", JSON.stringify(settings), function (err) {
        if (err) throw err
    })
}

function handleWindowControls() {
    if (settings["path"].length > 0) {
        document.getElementById("main-content").classList.remove("hide")
        document.getElementById("folder").classList.add("hide")
        document.getElementById("info").classList.add("hide")
    } else {
        document.getElementById("folder").classList.remove("hide")
    }

    document.getElementById("min-button").addEventListener("click", (event) => {
        win.minimize()
    })

    document.getElementById("close-button").addEventListener("click", async (event) => {
        win.close()
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
                document.getElementById("selected-file").innerHTML = `Project Folder: ${result.filePaths[0]}`
                settings["path"] = result.filePaths[0]
                saveSettings()
            }
        })
}

document.getElementById("folder").onclick = () => {
    dialog
        .showOpenDialog({
            properties: ["openDirectory"],
        })
        .then((result) => {
            if (!result.canceled) {
                document.getElementById("main-content").classList.remove("hide")
                document.getElementById("folder").classList.add("hide")
                document.getElementById("info").classList.add("hide")
                document.getElementById("selected-file").innerHTML = `Project Folder: ${result.filePaths[0]}`
                settings["path"] = result.filePaths[0]
                saveSettings()
            }
        })
}

document.getElementById("create").onclick = () => {
    let input = document.getElementById("projname")
    console.log(input, input.value)
    if (fs.existsSync(settings["path"] + "/" + input.value)) {
        input.value = ""
    } else if (input.value.length > 0) {
        let private = settings["settings"]["private"] ? "--private" : "--public"
        cmd(`cd "${settings["path"]}" & mkdir ${input.value} & cd ${input.value} & echo # ${input.value}>"README.md" & git init & gh repo create ${input.value} ${private} --confirm=true --enable-wiki=${settings["settings"]["wiki"]} --enable-issues=${settings["settings"]["issues"]} & git add . & git commit -m "init" & git push -u origin master & code .`)
        input.value = ""
    }
}

const { exec } = require("child_process")

function cmd(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`)
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
        }
        console.log(`stdout: ${stdout}`)
    })
}
