var Plugin = class {
    constructor() {
        this._enabled = false
        this.name = "follow"
        this.UI = {
            name: "FollowBot™",
            description: "Follows anyone on the team who is not named 'bot'",
        }
        this._options = [
            {
                value: true,
                name: "fists",
                UI: {
                    name: "Always Fists",
                },
            },
        ]
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
        this._enabled = t
    }

    calcDistance(c, e) {
        return Math.sqrt(Math.pow(c.x - e.x, 2) + Math.pow(c.y - e.y, 2))
    }

    calcAngle(c, e) {
        let dy = e.y - c.y
        let dx = e.x - c.x
        let theta = Math.atan2(dy, dx) // range (-PI, PI]
        // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        // if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta
    }

    loop(obfuscate, scope, player, input, data, plugins) {
        var teamates = data
            .getObjects()
            .filter(
                p =>
                    p &&
                    p.__type === 1 &&
                    !p[obfuscate.netData].dead &&
                    !scope.player[obfuscate.netData].downed &&
                    data.isTeam(p.__id) &&
                    !p.nameText._text.match(/bot/gi)
            )
            .sort((a, b) => {
                let p = scope[obfuscate.camera].pointToScreen(player.pos)

                let enp1 = scope[obfuscate.camera].pointToScreen(a.pos)
                let enp2 = scope[obfuscate.camera].pointToScreen(b.pos)

                let ena1 = this.calcDistance(p.x, p.y, enp1.x, enp1.y)
                let ena2 = this.calcDistance(p.x, p.y, enp2.x, enp2.y)

                return Math.abs(ena1) - Math.abs(ena2)
            })

        if (
            this.option("fists") &&
            !data.selectedEnemy[0] &&
            player[obfuscate.localData].weapIdx !== 2
        ) {
            input.addInput("EquipMelee")
        }

        if (teamates.length > 0) {
            return (input.moveAngle =
                this.calcAngle(teamates[0].pos, player.pos) + Math.PI)
        } else {
            input.moveAnlge = false
        }
    }
}

module.exports = new Plugin()
