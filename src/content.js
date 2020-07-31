console.log(
    atob(
        "CiAvJCQkJCQkICAgICAgICAgICAgICAgICAgICAgLyQkICAgLyQkICAgICAgICAgICAgICAgICAgICAgLyQkICAgICAgICAgICAgICAgIAp8XyAgJCRfLyAgICAgICAgICAgICAgICAgICAgfCAkJCAgfCAkJCAgICAgICAgICAgICAgICAgICAgfCAkJCAgICAgICAgICAgICAgICAKICB8ICQkICAgIC8kJCQkJCQkICAvJCQkJCQkIHwgJCQgIHwgJCQgIC8kJCQkJCQgICAvJCQkJCQkJHwgJCQgICAvJCQgIC8kJCQkJCQkCiAgfCAkJCAgIC8kJF9fX19fLyAvJCRfXyAgJCR8ICQkJCQkJCQkIHxfX19fICAkJCAvJCRfX19fXy98ICQkICAvJCQvIC8kJF9fX19fLwogIHwgJCQgIHwgJCQgICAgICB8ICQkJCQkJCQkfCAkJF9fICAkJCAgLyQkJCQkJCR8ICQkICAgICAgfCAkJCQkJCQvIHwgICQkJCQkJCAKICB8ICQkICB8ICQkICAgICAgfCAkJF9fX19fL3wgJCQgIHwgJCQgLyQkX18gICQkfCAkJCAgICAgIHwgJCRfICAkJCAgXF9fX18gICQkCiAvJCQkJCQkfCAgJCQkJCQkJHwgICQkJCQkJCR8ICQkICB8ICQkfCAgJCQkJCQkJHwgICQkJCQkJCR8ICQkIFwgICQkIC8kJCQkJCQkLwp8X19fX19fLyBcX19fX19fXy8gXF9fX19fX18vfF9fLyAgfF9fLyBcX19fX19fXy8gXF9fX19fX18vfF9fLyAgXF9fL3xfX19fX19fLyAK"
    )
)
function stylesheetAdd(name) {
    document
        .getElementsByTagName("head")[0]
        .insertAdjacentHTML(
            "beforeend",
            '<link rel="stylesheet" href="' +
                chrome.runtime.getURL(`/file/${name}.css`) +
                '" />'
        )
}
document.addEventListener("DOMContentLoaded", function () {
    stylesheetAdd("team")
})
