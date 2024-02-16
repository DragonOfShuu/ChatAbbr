/* global chrome */

// window.alert("Hello World!")

console.log("Script was injected.")

// window.addEventListener("load", )
document.addEventListener("keydown", (e) => {
    if (e.key!==" ") return;
    console.log("Script ran")

    let x = document.activeElement;

    if (x instanceof HTMLTextAreaElement||x instanceof HTMLInputElement||x instanceof HTMLDivElement) {
        x.style.backgroundColor = "blue"
    }
}, {capture: true})

export {}