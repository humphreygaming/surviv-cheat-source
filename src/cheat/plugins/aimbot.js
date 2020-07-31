var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "aimbot"
        this.UI = {
            name: "Aim Bot",
            description: "Aims for you",
        }
        this._options = [
            {
                value: "autoaim",
                opts: ["autoaim", "on shoot", "inverted aim"],
                name: "type",
                UI: {
                    name: "Type",
                },
            },
            {
                value: false,
                name: "col",
                UI: {
                    name: "Use Collisions",
                },
            },
            {
                value: true,
                name: "mouse",
                UI: {
                    name: "Aim with Mouse",
                },
            },
            {
                value: true,
                name: "attack",
                UI: {
                    name: "AutoAttack™",
                },
            },
            {
                value: true,
                name: "shoot",
                UI: {
                    name: "AutoShoot™",
                },
            },
            {
                value: false,
                name: "down",
                UI: {
                    name: "Aim at Downed",
                },
            },
            {
                value: false,
                name: "object",
                UI: {
                    name: "Aim at Objects",
                },
            },
            {
                value: false,
                name: "move",
                UI: {
                    name: "MobileMovement™",
                },
            },
            {
                value: false,
                name: "legit",
                UI: {
                    name: "LegitMode™",
                },
            },
            {
                value: 0,
                int: 1,
                name: "fov",
                UI: {
                    name: "Aim FOV (0 = off)",
                },
                min: 0,
                max: 180,
            },
            {
                value: 1.3,
                int: 0.1,
                name: "velocity",
                UI: {
                    name: "Velocity Mult",
                },
                min: 0.1,
                max: 3,
            },
        ]
        this.lastAim = {
            x: 0,
            y: 0,
        }
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
        } catch (e) { }
    }

    get enabled() {
        return this._enabled
    }

    set enabled(t) {
        this._enabled = t
    }

    loop(obfuscate, scope, player, input, data, plugins) {
        try {
            var e = data
                .getEnemies(this.option("object"))
                .sort((a, b) => {
                    let posA = scope[obfuscate.camera].pointToScreen(a.pos)
                    let posB = scope[obfuscate.camera].pointToScreen(b.pos)
                    if (this.option("mouse")) {
                        return this.calcDistance(
                            posA.x,
                            posA.y,
                            input.mouse.x,
                            input.mouse.y
                        ) - this.calcDistance(
                            posB.x,
                            posB.y,
                            input.mouse.x,
                            input.mouse.y
                        )
                    }

                    let p = scope[obfuscate.camera].pointToScreen(player.pos)

                    return Math.abs(this.calcDistance(p.x, p.y, posA.x, posA.y)) - Math.abs(this.calcDistance(p.x, p.y, posB.x, posA.y))
                })
                .filter(enemy => {
                    return (
                        enemy.layer === player.layer &&
                        (this.option("col")
                            ? enemy.__type == 2
                                ? true
                                : data.cantCollide(enemy)
                            : true) &&
                        (this.option("fov") > 0
                            ? (() => {
                                let lp = scope[
                                    obfuscate.camera
                                ].pointToScreen(player.pos)
                                let le = scope[
                                    obfuscate.camera
                                ].pointToScreen(enemy.pos)
                                let mouseVec = {
                                    x: input.mouse.x - lp.x,
                                    y: input.mouse.y - lp.y,
                                }
                                let enemyDir = {
                                    x: le.x - lp.x,
                                    y: le.y - lp.y,
                                }
                                let angleDif = Math.abs(
                                    Math.atan2(enemyDir.y, enemyDir.x) -
                                    Math.atan2(mouseVec.y, mouseVec.x)
                                )
                                return (
                                    angleDif <
                                    this.option("fov") * (Math.PI / 180)
                                )
                            })()
                            : true) &&
                        (this.option("down")
                            ? true
                            : enemy[obfuscate.netData]
                                ? !enemy[obfuscate.netData].downed
                                : true)
                    )
                })
            data.selectedEnemy = e
            this.aim = false

            // Mobile Movement
            if (this.option("move")) {
                input.moveAngle =
                    this.calcAngle(
                        {
                            x: input.mouse.x - window.innerWidth / 2,
                            y: window.innerHeight / 2 - input.mouse.y,
                        },
                        {
                            x: 0,
                            y: 0,
                        }
                    ) + Math.PI
            }

            if (e.length > 0) {
                if (
                    this.option("type") == "autoaim"
                        ? !plugins.binds.test("aimbot")
                        : this.option("type") == "on shoot"
                            ? input.leftMouse
                            : this.option("type") == "inverted aim"
                                ? plugins.binds.test("aimbot")
                                : false
                ) {
                    this.aim = true
                    var v = data.cantCollide(e[0])
                    var pos = this.posCalc(e[0], player, scope, obfuscate, data)

                    this.lastAim.x = this.option("legit")
                        ? this.lerp(this.lastAim.x, pos.x, 0.8)
                        : pos.x
                    this.lastAim.y = this.option("legit")
                        ? this.lerp(this.lastAim.y, pos.y, 0.8)
                        : pos.y

                    input.aim(this.lastAim)

                    // Auto Attack
                    var eRad = e[0].rad
                        ? e[0].rad
                        : e[0].collider
                            ? e[0].collider.rad || 4
                            : 4
                    var wRad =
                        (data.melee[player[obfuscate.netData].weapType]
                            ? data.melee[player[obfuscate.netData].weapType]
                                .attack.rad || 1
                            : 1) * 2
                    data.autoAttack = false
                    if (this.option("attack")) {
                        var d = this.calcDistance(
                            e[0].pos.x,
                            e[0].pos.y,
                            player.pos.x,
                            player.pos.y
                        )
                        if (d <= 8) {
                            data.autoAttack = true
                            input.moveAngle =
                                this.calcAngle(e[0].pos, player.pos) + Math.PI
                            if (d < eRad + wRad) {
                                input.addInput("EquipMelee")
                                input.addInput("Fire")
                            }
                        }
                    }
                    // Auto Shoot
                    let localData = player[obfuscate.localData]
                    if (
                        this.option("shoot") &&
                        v &&
                        localData[obfuscate.weapons][
                            localData[obfuscate.weapIdx]
                        ].ammo > 0
                    )
                        input.addInput("Fire")
                }
            }
            if (e.length < 1 || !this.aim) {
                this.lastAim.x = this.option("legit")
                    ? this.lerp(this.lastAim.x, input.mouse.x, 0.2)
                    : input.mouse.x
                this.lastAim.y = this.option("legit")
                    ? this.lerp(this.lastAim.y, input.mouse.y, 0.2)
                    : input.mouse.y

                input.aim(this.lastAim)
            }
            e = null
        } catch (e) {
            console.log(e, e.stack)
        }
    }

    /**
     * Math
     */

    lerp(x, x2, i) {
        return x * (1.0 - i) + x2 * i
    }

    calcAngle(c, e) {
        let dy = e.y - c.y
        let dx = e.x - c.x
        let theta = Math.atan2(dy, dx)
        return theta
    }

    calcDistance(cx, cy, ex, ey) {
        return Math.sqrt(Math.pow(cx - ex, 2) + Math.pow(cy - ey, 2))
    }

    getSecondsElapsed(time) {
        return (window.performance.now() - time) / 1000
    }

    posCalc(enemy, curPlayer, scope, obfuscate, data) {
        if (!enemy) return

        let curBullet =
            curPlayer[obfuscate.netData].weapType &&
                data.guns[curPlayer[obfuscate.netData].weapType]
                ? data.bullets[
                data.guns[curPlayer[obfuscate.netData].weapType]
                    .bulletType
                ]
                : { speed: 10000 }

        this.getPlayerSpeed(enemy, 0.5)

        let bulletReachTime =
            this.calcDistance(
                curPlayer.pos.x,
                curPlayer.pos.y,
                enemy.pos.x,
                enemy.pos.y
            ) / curBullet.speed

        let range = bulletReachTime * (enemy.speed * this.option("velocity"))

        let prediction = {
            x: 0,
            y: 0,
        }

        if (enemy.direction) {
            prediction = {
                x: enemy.direction.x * range,
                y: enemy.direction.y * range,
            }
        }

        let predInert = 0.5

        prediction.x =
            prediction.x * (1.0 - predInert) + enemy.prediction.x * predInert
        prediction.y =
            prediction.y * (1.0 - predInert) + enemy.prediction.y * predInert

        enemy.prediction = prediction
        enemy.range = range

        const pred = enemy.prediction ? enemy.prediction : { x: 0, y: 0 }
        const pos = enemy.pos

        return scope[obfuscate.camera].pointToScreen({
            x: pos.x + pred.x,
            y: pos.y + pred.y,
        })
    }

    getPlayerSpeed(player, inertia) {
        if (!player) return

        let curPosData = {
            pos: player.pos,
            time: window.performance.now(),
        }

        if (
            !player.posData ||
            this.getSecondsElapsed(player.posData[0].time) > 0.19
        ) {
            player.posData = [curPosData]
            player.prediction = { x: 0.0, y: 0.0 }
            player.speed = 0.0
            player.distance = 0.0
            player.direction = null

            return
        }

        let lastPosData = player.posData[0]

        let distance = this.calcDistance(
            curPosData.pos.x,
            curPosData.pos.y,
            lastPosData.pos.x,
            lastPosData.pos.y
        )

        if (distance > 0.0001) {
            player.direction = {
                x: (curPosData.pos.x - lastPosData.pos.x) / distance,
                y: (curPosData.pos.y - lastPosData.pos.y) / distance,
            }
        } else {
            player.direction = null
        }

        let speed = distance / this.getSecondsElapsed(lastPosData.time)

        player.speed = speed
        player.distance = distance
        player.posData.push(curPosData)

        while (player.posData.length > 5) {
            player.posData.shift()
        }
    }
}

module.exports = new Plugin()
