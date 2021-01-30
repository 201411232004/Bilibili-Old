/*
 * @module "debug.js"
 * @description 调试模块，以debug对象挂在在BLOD下，基本同console，其中debug.msg发送旧版播放器通知框
 * @method debug/debug.log || debug.error || debug.warn || debug.debug || debug.msg
 * --------------------------------------------------------------------------------
 * 
 * @description 使用原生JavaScript实现[toastr]的功能
 * @url https://github.com/CodeSeven/toastr/ MIT license
 * @method toast/toast.info || toast.success || toast.warning || toast.error
 */
(function () {
    const BLOD = window.BLOD;

    class Debug {
        constructor() {
            console.debug('import module "debug.js"');
        }
        log(...msg) {
            console.log("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        error(...msg) {
            console.error("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        warn(...msg) {
            console.warn("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        debug(...msg) {
            console.debug("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        msg(...msg) {
            let node = document.getElementsByClassName("bilibili-player-video-toast-bottom")[0];
            let time = 1 * msg[2] || 3000;
            if (!node) {
                this.log(...msg);
                return;
            }
            msg.forEach((d) => { d = typeof d == "object" ? "" : d });
            msg[2] = 1 * msg[2] ? "" : msg[2];
            let item = document.createElement("div");
            node.children[0] ? node.children[0].replaceWith(item) : node.appendChild(item);
            item.setAttribute("class", "bilibili-player-video-toast-item bilibili-player-video-toast-pay");
            item.innerHTML = '<div class="bilibili-player-video-toast-item-text"><span class="video-float-hint-text"></span><span class="video-float-hint-btn hint-red"></span><span class="video-float-hint-btn"></span></div>';
            msg[0] ? item.children[0].children[0].innerHTML = msg[0] : "";
            msg[1] ? item.children[0].children[1].innerHTML = msg[1] : "";
            msg[2] ? item.children[0].children[2].innerHTML = msg[2] : item.children[0].children[2].remove();
            setTimeout(() => item.remove(), time);
        }
    }

    const debug = () => {
        let debug = new Debug();
        function makeExports(type) {
            return function (...msg) {
                return debug[type](...msg);
            }
        }
        let method = makeExports("log");
        method.log = makeExports("log");
        method.error = makeExports("error");
        method.warn = makeExports("warn");
        method.debug = makeExports("debug");
        method.msg = makeExports("msg");
        return method;
    }
    BLOD.debug = debug();

    // @url https://github.com/CodeSeven/toastr/
    class Toast {
        constructor() {
            BLOD.addCss(BLOD.getResourceText("toast"))
            this.timeout = 4; // 通知显示时间，单位/秒
            this.step = 250; // 通知间的最小间隔，单位/毫秒
            this.count = 0; // 未显示的通知数
            this.container = document.createElement("div");
            this.container.setAttribute("id", "toast-container");
            this.container.setAttribute("class", "toast-top-right");
        }
        show(type, ...msg) {
            if (!document.body) return;
            if (!document.querySelector("#toast-container")) document.body.appendChild(this.container);
            this.box = document.querySelector("#toast-container");
            let item = document.createElement("div");
            item.setAttribute("class", "toast toast-" + type);
            item.setAttribute("aria-live", "assertive");
            item.setAttribute("style", "opacity: 0.0");
            setTimeout(() => {
                if (this.count > 0) this.count--;
                item = this.box.insertBefore(item, this.box.firstChild);
                item.appendChild(this.msg(...msg));
                this.come(item);
                setTimeout(() => this.quit(item), this.timeout * 1000);
            }, this.count * this.step);
            this.count++;
        }
        come(item, i = 0) {
            let timer = setInterval(() => {
                i++;
                item.setAttribute("style", "opacity: ." + i);
                if (i === 8) {
                    clearInterval(timer);
                    item.removeAttribute("style");
                }
            }, 50)
        }
        quit(item, i = 8) {
            let timer = setInterval(() => {
                i--;
                item.setAttribute("style", "opacity: ." + i);
                if (i === 0) {
                    clearInterval(timer);
                    item.remove();
                    if (!this.box.firstChild) this.box.remove();
                }
            }, 50)
        }
        msg(...msg) {
            let div = document.createElement("div");
            div.setAttribute("class", "toast-message");
            div.innerHTML = "";
            msg.forEach(d => {
                d = d || "";
                d = String(d);
                div.innerHTML = div.innerHTML ? div.innerHTML + "<br />" + d : div.innerHTML + d;
            });
            return div;
        }
    }

    const toast = () => {
        let toast = new Toast();
        function makeExports(type) {
            return function (...msg) {
                switch (type) {
                    case "info": BLOD.debug.debug(...msg);
                        break;
                    case "error": BLOD.debug.error(...msg);
                        break;
                    case "success": BLOD.debug(...msg);
                        break;
                    case "warning": BLOD.debug.warn(...msg);
                        break;
                }
                return toast.show(type, ...msg);
            }
        }
        let method = makeExports("info");
        method.info = makeExports("info");
        method.error = makeExports("error");
        method.success = makeExports("success");
        method.warning = makeExports("warning");
        return method;
    }
    BLOD.toast = toast();

})()