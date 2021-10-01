module.exports = () => {
    return btoa(
        (
            (new Date().getDate() + new Date().getMonth()) *
            Math.pow(new Date().getFullYear(), 2)
        ).toString(32)
    ).replace(/[^a-zA-Z]/g, "")
}
