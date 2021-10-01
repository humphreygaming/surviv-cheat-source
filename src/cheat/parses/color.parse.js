try{
    var colors = {
        container_06: 14934793,
        barn_02: 14934793,
        stone_02: 1654658,
        tree_03: 16777215,
        stone_04: 0xeb175a,
        stone_05: 0xeb175a,
        bunker_storm_01: 14934793,
    },
    sizes = {
        stone_02: 4,
        tree_03: 2,
        stone_04: 2,
        stone_05: 2,
    }
colors[$2.obj.type] && ($2.shapes[$4].color = colors[$2.obj.type]),
    sizes[$2.obj.type] && ($2.shapes[$4].scale *= sizes[$2.obj.type])
}
catch(e) {
    console.error("COLOR ERROR", e);
}
