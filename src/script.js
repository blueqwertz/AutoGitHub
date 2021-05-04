function dropClick() {
    document.getElementById("drop").classList.toggle("show")
    console.log(1)
}

window.onclick = function (event) {
    console.log(event.target.closest(".select"))
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

const fs = require("fs")
fs.readFile("src/index.css", (data) => {
    console.log(data)
})
