if (replaceVar1 == 3) {
    var IsSingleFireWeaponEquipped = () => {
        var retVal = false;
        try {
            var currentPlayer = sjs.dataAccessor.GetCurrentPlayer();
            var weapIdx = sjs.dataAccessor.GetPlayerWeapIdx(currentPlayer);
            var weapName = sjs.dataAccessor.GetPlayerWeapons(currentPlayer)[weapIdx].type;
            var weap = sjs.data.items[weapName];
            retVal = weap.fireMode == "single";
        }
        catch(ex) {
            console.error("IsSingleFireWeaponEquipped: Failed to check weapon",ex);
        }
        return retVal;
    };
    replaceVar2.inputs = replaceVar2.inputs.concat(sjs.inputs);
    var currentPlayer = sjs.dataAccessor.GetCurrentPlayer();
    if (
        (sjs.input.leftMouse &&
            sjs.plugins.bump &&
            sjs.plugins.bump.enabled &&
            currentPlayer &&
            (sjs.dataAccessor.GetPlayerWeapIdx(currentPlayer) == 2 
                || IsSingleFireWeaponEquipped())) ||
        replaceVar2.inputs.includes(4)
    ) {
        replaceVar2.shootHold = false
        replaceVar2.shootStart = true
    }
    sjs.shootStart = replaceVar2.shootStart

    if(sjs.input.moveAngleOv || sjs.input.moveAngle) {
        replaceVar2.touchMoveActive = true;
        replaceVar2.touchMoveDir = {
            x: Math.cos(sjs.input.moveAngleOv || sjs.input.moveAngle),
            y: Math.sin(sjs.input.moveAngleOv || sjs.input.moveAngle),
        };
    }

    if(sjs.UI.showing) {
        replaceVar2.shootStart = false;
        replaceVar2.inputs = replaceVar2.inputs.filter(function (jhg) {
            return jhg == 17 || jhg == 18 ? false : true
        });
    }
} 
else if (replaceVar1 == 1) {
    if(sjs.plugins.autoloot && sjs.plugins.autoloot.enabled) {
        replaceVar2.isMobile = true
        replaceVar2.useTouch = true
    }
}
