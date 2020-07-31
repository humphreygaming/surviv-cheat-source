var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "esp"
        this.UI = {
            name: "ESP",
            description: "Shows where players are at",
        }
        this._options = [
            {
                value: true,
                name: "laser",
                UI: {
                    name: "Flashlight",
                },
            },
            {
                value: true,
                name: "nade",
                UI: {
                    name: "Blast Radius",
                },
            },
            {
                value: 2,
                name: "width",
                UI: {
                    name: "Tracer Width",
                },
            }
        ]
        this.values = {
            pixi: null,
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

    get enabled() {
        return this._enabled
    }

    set enabled(t) {
        this._enabled = t
    }

    names(player, me, obfuscate) {
        if (!player) return
        if (
            !player.nameText._text ||
            player.nameText._text == "" ||
            player.nameText._text.length < 1
        )
            return

        player.nameText.tint = 0xff0000

        player.nameText.visible = true
    }

    draw(enemies, activePlayer, sjs, data) {
        if (!enemies) return
        if (!activePlayer) return

        let points = enemies.map(enemy => {
            return {
                x: (enemy.pos.x - activePlayer.pos.x) * 16,
                y: (activePlayer.pos.y - enemy.pos.y) * 16,
                img: enemy.img || false,
                type: enemy.__type,
                id: enemy.__id,
                layer: enemy.layer,
            }
        })

        let pixi = this.values.pixi

        if (!pixi) {
            pixi = new window.PIXI.Graphics()
            this.values.pixi = pixi
            activePlayer.container.addChild(pixi)
            activePlayer.container.setChildIndex(pixi, 0)
        }

        if (!pixi.graphicsData) return

        pixi.clear()

        points.forEach(point => {
            if (point.type == 2 && point.layer !== activePlayer.layer) return

            pixi.lineStyle(this.option("width"), 0xff0000, 0.5)
            if (point.layer !== activePlayer.layer) pixi.lineStyle(this.option("width"), 0xffffff, 0.5)
            if (point.type == 2) pixi.lineStyle(this.option("width"), 0xffff00, 0.5)
            pixi.moveTo(0, 0)
            pixi.lineTo(point.x, point.y)
        })

        if (data.aimPred) {
            pixi.lineStyle(2, 0xffffff, 0.5)

            pixi.moveTo(0, 0)
            pixi.lineTo(
                (data.aimPred.x - activePlayer.pos.x) * 16,
                (activePlayer.pos.y - data.aimPred.y) * 16
            )
        }

        enemies.forEach(n => {
            if (n.__type == 1) this.names(n, activePlayer, sjs)
        })

        pixi.lineStyle(0)
        if (this.option("nade")) {
            data.getObjects()
                .filter(obj => {
                    if (
                        obj.__type === data.data.Type.Projectile ||
                        (obj.img &&
                            obj.img.match(/barrel-/g) &&
                            obj.smokeEmitter &&
                            data.items[obj.type].explosion)
                    ) {
                        return true
                    }
                    return false
                })
                .forEach(obj => {
                    pixi.beginFill(0xff0000, 0.3)
                    pixi.drawCircle(
                        (obj.pos.x - activePlayer.pos.x) * 16,
                        (activePlayer.pos.y - obj.pos.y) * 16,
                        (data.explosions[
                            data.items[obj.type].explosionType ||
                            data.items[obj.type].explosion
                                ].rad.max +
                            1) *
                        16
                    )
                })
        }

        points = null
    }

    end() {
        this.values.pixi = null
        this.laser = null
    }

    findWeap(me, game, obfuscate) {
        var weap = me[obfuscate.netData].weapType
        return weap && game.guns[weap] ? game.guns[weap] : false
    }

    findBullet(curWeapon, game) {
        return !!curWeapon ? game.bullets[curWeapon.bulletType] : false
    }

    laserPointer(
        curBullet,
        curWeapon,
        curPlayer,
        acPlayer,
        color,
        opac,
        obfuscate
    ) {
        if (!curPlayer || !curPlayer.container) return

        this.laser = this.laser || {}

        var laser = this.laser
        var lasic = {}

        let isMoving =
            curPlayer.posOldOld &&
            (curPlayer.pos.x != curPlayer.posOldOld.x ||
                curPlayer.pos.y != curPlayer.posOldOld.y)

        if (curBullet) {
            lasic.active = true
            lasic.range = curBullet.distance * 16.25
            lasic.direction =
                Math.atan2(
                    curPlayer[obfuscate.netData].dir.x,
                    curPlayer[obfuscate.netData].dir.y
                ) -
                Math.PI / 2
            lasic.angle =
                ((curWeapon.shotSpread +
                    (isMoving ? curWeapon.moveSpread : 0)) *
                    0.01745329252) /
                2
        } else {
            lasic.active = false
        }

        var draw = laser.draw

        if (!draw) {
            draw = new window.PIXI.Graphics()

            laser.draw = draw
            curPlayer.container.addChildAt(draw, 0)
        }

        if (!draw.graphicsData) return

        if (!lasic.active) return

        var center = {
            x: (curPlayer.pos.x - acPlayer.pos.x) * 16,
            y: (acPlayer.pos.y - curPlayer.pos.y) * 16,
        }
        var radius = lasic.range
        var angleFrom = lasic.direction - lasic.angle
        var angleTo = lasic.direction + lasic.angle

        angleFrom =
            angleFrom > Math.PI * 2
                ? angleFrom - Math.PI * 2
                : angleFrom < 0
                ? angleFrom + Math.PI * 2
                : angleFrom
        angleTo =
            angleTo > Math.PI * 2
                ? angleTo - Math.PI * 2
                : angleTo < 0
                ? angleTo + Math.PI * 2
                : angleTo

        draw.beginFill(color || 0x0000ff, opac || 0.3)
        draw.moveTo(center.x, center.y)
        draw.arc(center.x, center.y, radius, angleFrom, angleTo)
        draw.lineTo(center.x, center.y)
        draw.endFill()
    }

    loop(obfuscate, scope, player, input, data, plugins) {
        var enemies = data
            .getEnemies(
                plugins["aimbot"] ? plugins["aimbot"].option("object") : false
            )
            .filter(p =>
                p && p[obfuscate.netData]
                    ? plugins["aimbot"] && plugins["aimbot"].option("down")
                    ? true
                    : !p[obfuscate.netData].downed
                    : true
            )
        this.draw(enemies, player, obfuscate, data)

        var curWeapon = this.findWeap(player, data, obfuscate)
        var curBullet = this.findBullet(curWeapon, data)

        if (this.laser && this.laser.draw) this.laser.draw.clear()
        if (!this.option("laser")) return

        this.laserPointer(
            curBullet,
            curWeapon,
            player,
            player,
            undefined,
            undefined,
            obfuscate
        )

        enemies
            .filter(n => n.__type == 1)
            .forEach(enemy => {
                var eW = this.findWeap(enemy, data, obfuscate)

                this.laserPointer(
                    this.findBullet(eW, data),
                    eW,
                    enemy,
                    player,
                    "0",
                    0.2,
                    obfuscate
                )
            })

        enemies = null
    }
}

module.exports = new Plugin()
