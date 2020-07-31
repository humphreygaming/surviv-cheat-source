var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "aimbot"
        this.UI = {
            name: "Aim Bot 2.0",
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
        ]
        this.lastAim = {
            x: 0,
            y: 0,
        }
        this.date = Date.now()
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
        var e = data
            .getEnemies(this.option("object"))
            .sort((a, b) => {
                if (this.option("mouse")) {
                    let posA = scope[obfuscate.camera].pointToScreen(a.pos)
                    let posB = scope[obfuscate.camera].pointToScreen(b.pos)

                    let distA = this.calcDistance(
                        posA.x,
                        posA.y,
                        input.mouse.x,
                        input.mouse.y
                    )
                    let distB = this.calcDistance(
                        posB.x,
                        posB.y,
                        input.mouse.x,
                        input.mouse.y
                    )

                    return distA - distB
                }

                let p = scope[obfuscate.camera].pointToScreen(player.pos)

                let enp1 = scope[obfuscate.camera].pointToScreen(a.pos)
                let enp2 = scope[obfuscate.camera].pointToScreen(b.pos)

                let ena1 = this.calcDistance(p.x, p.y, enp1.x, enp1.y)
                let ena2 = this.calcDistance(p.x, p.y, enp2.x, enp2.y)

                return Math.abs(ena1) - Math.abs(ena2)
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
                              let lp = scope[obfuscate.camera].pointToScreen(
                                  player.pos
                              )
                              let le = scope[obfuscate.camera].pointToScreen(
                                  enemy.pos
                              )
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
                        ? data.melee[player[obfuscate.netData].weapType].attack
                              .rad || 1
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
                    localData[obfuscate.weapons][localData[obfuscate.weapIdx]]
                        .ammo > 0
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

        this.date = Date.now()
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

    findWeap(me, game, obfuscate) {
        var weap = me[obfuscate.netData].weapType
        return weap && game.guns[weap] ? game.guns[weap] : false
    }

    findBullet(curWeapon, game) {
        return !!curWeapon ? game.bullets[curWeapon.bulletType] : false
    }

    posCalc(enemy, curPlayer, scope, obfuscate, data) {
        if (!enemy) return

        if (!enemy.posOld || !enemy.posOldOld || !curPlayer.posOldOld)
            return scope[obfuscate.camera].pointToScreen({
                x: enemy.pos.x,
                y: enemy.pos.y,
            })

        let curWeap = this.findWeap(curPlayer, data, obfuscate)
        let curBullet = this.findBullet(curWeap, data)

        let FPS = (Date.now() - this.date) * 1.6

        let bulletSpeed = curBullet ? curBullet.speed / FPS : 1000

        var distance = this.calcDistance(
            enemy.pos.x,
            enemy.pos.y,
            curPlayer.pos.x,
            curPlayer.pos.y
        )

        var userX = curPlayer.pos.x
        var userY = curPlayer.pos.y

        var enemyDirX = enemy.pos.x - enemy.posOldOld.x
        var enemyDirY = enemy.pos.y - enemy.posOldOld.y

        var diffX = enemy.pos.x - userX
        var diffY = enemy.pos.y - userY

        var a =
            enemyDirX * enemyDirX +
            enemyDirY * enemyDirY -
            bulletSpeed * bulletSpeed
        var b = diffX * enemyDirX + diffY * enemyDirY
        var c = diffX * diffX + diffY * diffY

        var d = b * b - a * c
        if (d < 0) {
            return
        }

        d = Math.sqrt(d)
        var t = -(b + d) / a

        var bulletAngle = Math.atan2(
            diffY + enemyDirY + enemyDirY * t,
            diffX + enemyDirX + enemyDirX * t
        )

        var pos = {
            x: curPlayer.pos.x + Math.cos(bulletAngle) * distance,
            y: curPlayer.pos.y + Math.sin(bulletAngle) * distance,
        }

        return scope[obfuscate.camera].pointToScreen(pos)
    }
}

module.exports = new Plugin()
