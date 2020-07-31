var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "switch"
        this.UI = {
            name: "AutoSwitch",
            description: "",
        }
        this._options = [
            {
                value: "SniperSwitch™",
                opts: ["SniperSwitch™", "SmartSwitch™"],
                name: "mode",
                UI: {
                    name: "Mode",
                },
            },
            {
                value: true,
                name: "auto",
                UI: {
                    name: "Ignore Auto Weapons",
                },
            },
            {
                value: true,
                name: "melee",
                UI: {
                    name: "Equip Melee",
                },
            },
            {
                value: 45,
                int: 1,
                name: "speed",
                UI: {
                    name: "Min. Fire Delay",
                },
                min: 0,
                max: 100,
            },
        ]
        this.ammo = [
            {
                name: "",
                ammo: 0,
            },
            {
                name: "",
                ammo: 0,
            },
            {
                name: "",
                ammo: 0,
            },
            {
                name: "",
                ammo: 0,
            },
        ]
        this.keys = null
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

    loop(obfuscate, scope, player, input, data, plugins) {
        if (plugins.binds.test("switch")) return

        var curWeapIdx = player[obfuscate.localData][obfuscate.weapIdx],
            weaps = player[obfuscate.localData][obfuscate.weapons],
            curWeap = weaps[curWeapIdx]
        var sniper = () => {
            var shouldSwitch = gun => {
                var s = false
                try {
                    s =
                        (this.option("sniper")
                            ? data.guns[gun].fireMode === "single" ||
                              data.guns[gun].fireMode === "burst"
                            : true) &&
                        data.guns[gun].fireDelay >=
                            (typeof this.option("speed") == "number"
                                ? this.option("speed") / 100
                                : 0.45)
                } catch (e) {}
                return s
            }

            this.keys = [
                weaps["1"].type !== "" && shouldSwitch(weaps["1"].type)
                    ? "EquipOtherGun"
                    : this.option("melee")
                    ? "EquipMelee"
                    : "EquipOtherGun",
                weaps["0"].type !== "" && shouldSwitch(weaps["0"].type)
                    ? "EquipOtherGun"
                    : this.option("melee")
                    ? "EquipMelee"
                    : "EquipOtherGun",
                "EquipMelee",
                "EquipMelee",
            ]

            if (curWeap.ammo !== this.ammo[curWeapIdx].ammo) {
                if (
                    curWeap.ammo < this.ammo[curWeapIdx].ammo &&
                    shouldSwitch(curWeap.type) &&
                    curWeap.type == this.ammo[curWeapIdx].type
                )
                    input.addInput(this.keys[curWeapIdx])
                this.ammo[curWeapIdx].ammo = curWeap.ammo
                this.ammo[curWeapIdx].type = curWeap.type
            }
        }

        if (this.option("mode") == "SniperSwitch™") {
            sniper()
        } else if (this.option("mode") == "SmartSwitch™") {
            let choices = []

            if (data.autoAttack) return

            for (let i = 0; i < 2; i++) {
                let enemy = data.selectedEnemy[0],
                    gun = data.guns[weaps[i].type],
                    bullet
                if (gun) {
                    bullet = data.bullets[gun.bulletType]
                }
                if (!enemy || !bullet) break
                let distance = this.calcDistance(
                    enemy.pos.x,
                    enemy.pos.y,
                    player.pos.x,
                    player.pos.y
                )
                choices.push({
                    dps:
                        ((1 / gun.fireDelay) *
                            bullet.damage *
                            (gun.burstCount || 1) *
                            gun.bulletCount *
                            (1 - bullet.falloff)) ^
                        distance,
                    hittable: distance < bullet.distance,
                    hasAmmo: weaps[i].ammo > 0,
                    key: i,
                    gun,
                })
            }

            if (choices.length == 2) {
                choices = choices.filter(function (e) {
                    return e.hittable && e.hasAmmo
                })
                choices = choices.sort(function (a, b) {
                    return b.dps - a.dps
                })

                if (!choices[0]) return

                input.addInput(
                    choices[0].key == 0 ? "EquipPrimary" : "EquipSecondary"
                )
            }
        }
    }

    calcDistance(cx, cy, ex, ey) {
        return Math.sqrt(Math.pow(cx - ex, 2) + Math.pow(cy - ey, 2))
    }
}

module.exports = new Plugin()
