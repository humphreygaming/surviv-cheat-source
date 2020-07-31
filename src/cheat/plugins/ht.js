var random = require("../random")
var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "teamjoin"
        this.UI = {
            name: "Team Joiner™ (press x)",
            description: "Finds teams to join and let's others join you",
        }
        this._options = []
    }

    option(o) {
        let op
        try {
            op = this._options.filter(k => k.name === o)[0].value
        } catch (e) {
            op = false
        }
        return op
    }

    setOption(o, v) {
        try {
            this._options.filter(k => k.name === o)[0].value = v
        } catch (e) {}
    }

    get enabled() {
        return this._enabled
    }

    set enabled(t) {
        if (t && !document.getElementById("tfeed")) {
            var element = document.createElement("div")
            element.innerHTML = `<div class="twrapper">
			<h2>Play with other cheaters! <small>'x' close, 'r' refresh</small></h2>
	<ul class="tfeed" id="tfeed">
	</ul>
</div>`
            document.body.appendChild(element)

            element.style.display =
                element.style.display == "none" ? "block" : "none"

            var refresh = function () {
                document.getElementById("tfeed").style.cursor = "wait"
                var int = setInterval(function () {
                    var code = document.getElementById("team-code").innerText
                    var data = JSON.parse(localStorage.surviv_config)
                    fetch(
                        code == ""
                            ? "https://ih-tracker.glitch.me/"
                            : "https://ih-tracker.glitch.me/queueing",
                        {
                            method: "POST",
                            headers: {
                                "content-type": "application/json",
                            },
                            body: JSON.stringify({
                                username: data.playerName,
                                joinCode: code,
                                region: $("#team-server-select")[0]
                                    .selectedOptions[0].value,
                            }),
                        }
                    ).then(async function (e) {
                        let json = await e.json()
                        document.getElementById("tfeed").innerHTML = ""
                        json.forEach(function (e) {
                            if (code == "" || code !== e.joinCode) {
                                console.log("dev")
                                let elem = document.createElement("div")
                                elem.innerHTML = `<li class="titem"><span class="feed-name">${e.username}</span> <span class="feed-name" style="margin-left: 30px;color: yellow;text-transform: uppercase;">${e.region}</span> <a class="tjoin" href="#${e.joinCode}">Join Game</a></li>`
                                document
                                    .getElementById("tfeed")
                                    .appendChild(elem)
                            }
                        })
                        document.getElementById("tfeed").style.cursor =
                            "default"
                    })
                    clearInterval(int)
                }, 500)
            }

            window.onkeyup = k => {
                var x = window[random()]
                if (x.scope && x.scope.initialized) return

                switch (k.key) {
                    case "x":
                        element.style.display =
                            element.style.display == "none" ? "block" : "none"
                        break
                    case "r":
                        refresh()
                        break
                }
            }

            setInterval(refresh.bind(this), 30 * 1000)

            document
                .getElementById("btn-create-team")
                .addEventListener("click", refresh.bind(this))

            window.addEventListener("unload", function (e) {
                navigator.sendBeacon(
                    "https://ih-tracker.glitch.me/queueingdel",
                    document.getElementById("team-code").innerText
                )
            })
            document
                .getElementById("btn-team-leave")
                .addEventListener("click", function () {
                    navigator.sendBeacon(
                        "https://ih-tracker.glitch.me/queueingdel",
                        document.getElementById("team-code").innerText
                    )
                    ;``
                })

            refresh()
        }
        this._enabled = t
    }
}

module.exports = new Plugin()
