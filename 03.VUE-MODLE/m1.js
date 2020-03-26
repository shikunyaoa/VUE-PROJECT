let a = 10;

let b = 20;

let d = 29;

function show() {
    console.log("xixixi");
}

//按需导出
export let s1 = 100;

export let s2 = 1000;

export function say() {
    console.log("xxxx");
}

//默认导出
export default {
    a,
    b,
    show
}