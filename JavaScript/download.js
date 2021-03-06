/**
 * @module download
 * @description 下载模块：获取下载链接，绘制下载面板
 * @author Motoori Kashin
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main */
    const toast = BLOD.toast; /** @see debug */

    class Ef2 {
        constructor() {
            BLOD.importModule("base64");
            this.pro = "ef2://";
            this.data = "";
        }
        /**
         * 下载对象键值对转ef2链接
         * @param {{}} obj 下载对象键值对
         * @returns {string} ef2链接字符串
         */
        encode(obj) {
            this.data = "";
            for (let key in obj) {
                if (obj[key]) {
                    if (typeof (obj[key]) == 'string') {
                        // 处理路径中潜在的空格
                        if (obj[key].includes(" ") && !obj[key].includes("\"")) obj[key] = "\"" + obj[key] + "\"";
                        // 处理保存目录可能错将反斜杠写成斜杠的情况
                        if (obj.o && obj.o.includes("/")) obj.o = obj.o.replace(/\//g, "\\");
                        // 处理保存目录时最后一级目录可能带了反斜杠将双引号转义了的情况
                        if (obj.o && obj.o[obj.o.length - 1] == "\"" && obj.o[obj.o.length - 2] == "\\") obj.o = obj.o.substr(0, obj.length - 2) + "\"";
                        // 处理以双斜杠开头的链接（IDM 需要协议头要么完整要么干脆不带）
                        if (obj.u && obj.u.startsWith("//")) obj.u = "https:" + obj.u;
                    }
                    switch (key) {
                        case "u": this.data = this.data + "-u " + obj[key] + " "; // 下载链接（URL）

                            break;
                        case "a": this.data = this.data + "-a " + obj[key] + " "; // user-agent

                            break;
                        case "c": this.data = this.data + "-c " + obj[key] + " "; // cookies

                            break;
                        case "d": this.data = this.data + "-d " + obj[key] + " "; // post 数据（如果使用 POST 方法）

                            break;
                        case "r": this.data = this.data + "-r " + obj[key] + " "; // referer

                            break;
                        case "U": this.data = this.data + "-u " + obj[key] + " "; // 账户名称（服务器鉴权——基本不可能用到）

                            break;
                        case "P": this.data = this.data + "-p " + obj[key] + " "; // 账户密钥（服务器鉴权——基本不可能用到）

                            break;
                        case "o": this.data = this.data + "-o " + obj[key] + " "; // 保存目录（由于反斜杠也是 JavaScript 的转义符，请使用双反斜杠输入！）

                            break;
                        case "s": this.data = this.data + "-s " + obj[key] + " "; // 文件名（包括推展名）

                            break;
                        case "f": this.data = this.data + "-f "; // 禁用 IDM 对话框，直接后台下载（键值请使用 true 或任何 js 认为的真值）

                            break;
                        case "q": this.data = this.data + "-q "; // 添加到队列而不立即下载（键值请使用 true 或任何 js 认为的真值）

                            break;

                        default:
                            break;
                    }
                }
            }
            if (this.data && this.data.endsWith(" ")) this.data = this.data.substr(0, this.data.length - 1);
            return this.pro + window.Base64.encode(this.data)
        }
        /**
         * ef2链接转对象键值对
         * @param {string} str ef2链接字符串
         * @returns {{}} 下载对象键值对
         */
        decode(str) {
            this.arr = [];
            this.obj = {};
            str = str.replace("ef2://", "");
            str = window.Base64.decode(str);
            if (!str.startsWith(" ")) str = " " + str;
            this.arr = str.split(" -");
            this.arr.forEach(d => {
                if (d && d.endsWith(" ")) d = d.substr(0, d.length - 1);
                if (d[0]) this.obj[d.substr(0, 1)] = d[2] ? d.substr(2, d.length - 2) : true;
            });
            return this.obj;
        }
        /**
         * 使用参数而不是对象键值对构造ef2
         * @param {string} u 下载链接（URL）
         * @param {string} [a] user-agent
         * @param {string} [c] cookies
         * @param {string} [d] post数据（如果使用 POST 方法）
         * @param {string} [r] referer
         * @param {string} [U] 账户名称（服务器鉴权——基本不可能用到）
         * @param {string} [P] 账户密钥（服务器鉴权——基本不可能用到）
         * @param {string} [o] 保存目录（由于反斜杠也是 JavaScript 的转义符，请使用双反斜杠输入！）
         * @param {string} [s] 文件名（包括推展名）
         * @param {boolean} [f] 禁用 IDM 对话框，直接后台下载（键值请使用 true 或任何 js 认为的真值）
         * @param {boolean} [q] 添加到队列而不立即下载（键值请使用 true 或任何 js 认为的真值）
         * @returns {string} ef2链接字符串
         */
        encodePara(u, a, c, d, r, U, P, o, s, f, q) {
            this.temp = { u, a, c, d, r, U, P, o, s, f, q }
            return this.encode(this.temp);
        }
    }
    BLOD.ef2 = new Ef2();

    class Download {
        constructor() {
            this.qua = { 208: "1080P", 192: "720P", 125: "HDR", 120: "4K", 116: "1080P60", 112: "1080P+", 80: "1080P", 74: "720P60", 64: "720P", 48: "720P", 32: "480P", 16: "360P", 15: "360P" };
            this.bps = { 30216: "64kbps", 30257: "64kbps", 30232: "128kbps", 30259: "128kbps", 30260: "320kbps", 30280: "320kbps" };
            this.config = BLOD.GM.getValue("download") || {};
            this.pn = this.getQuality();

            BLOD.download = url => this.setTable(url);
            BLOD.download.right = node => this.init(node);
        }
        /**
         * 添加播放器右键下载菜单
         * @param {HTMLElement} node 右键菜单节点
         */
        init(node) {
            let li = document.createElement("li");
            li.innerHTML = '<a id="BLOD-dl-content" class="context-menu-a js-action" href="javascript:void(0);">下载视频</a>';
            li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.firstChild.onclick = () => this.setTable();
            li.onmouseover = () => li.setAttribute("class", "context-line context-menu-function bili-old-download hover");
            li.onmouseout = () => li.setAttribute("class", "context-line context-menu-function bili-old-download");
            // 监听播放器右键菜单创建
            node.addEventListener("DOMNodeInserted", () => {
                if (this.add) return;
                this.add = setTimeout(() => {
                    if (node.querySelector(".context-menu-danmaku")) return;
                    if (node.contains(li)) return;
                    node.firstChild.appendChild(li);
                }, 100);
            });
            // 监听播放器右键菜单移除
            node.addEventListener("DOMNodeRemoved", () => {
                if (!this.add) return;
                this.add = undefined;
                if (node.contains(li)) li.remove();
            })
        }
        /**
         * 呼出下载面板
         */
        async setTable(url) {
            if (url) return this.custom(url);
            toast("正在获取视频下载地址...");
            let path = BLOD.__playinfo__ ? (BLOD.__playinfo__.data || (BLOD.__playinfo__.durl && BLOD.__playinfo__) || BLOD.__playinfo__.result) : {};
            if (!BLOD.mdf) {
                path = path || {}
                let pro = [this.geturl()];
                this.pn = this.getQuality();
                path && !path.durl && pro.push(this.geturl("flv", undefined, undefined, this.pn));
                path && !path.dash && pro.push(this.geturl("dash"));
                BLOD.mdf = {};
                BLOD.mdf.quee = BLOD.mdf.quee || await Promise.all(pro);
                this.quee(BLOD.mdf.quee);
                this.durl(path);
                this.dash(path);
            } else if (this.pn != this.getQuality()) {
                toast("清晰地切换，重新获取flv数据");
                this.pn = this.getQuality();
                let data = await this.geturl("flv", undefined, undefined, this.pn)
                data = data.data || (data.durl && data) || data.result || {}
                this.durl(data);
            }
            this.other();
            this.item();
        }
        /**
         * 自定义下载URL
         * @param {string} url 视频链接
         */
        async custom(url) {
            toast("正在解析链接：" + url);
            if (url && !url.includes("?")) url = "?" + url;
            if (this.data) this.data = undefined;
            let obj = BLOD.urlObj(url);
            BLOD.pgc = undefined;
            this.aid = url.match(/[aA][vV][0-9]+/) ? url.match(/[aA][vV][0-9]+/)[0].match(/\d+/)[0] : undefined;
            this.aid = this.aid || obj.aid || undefined;
            this.aid = this.aid || (/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/.test(url) ? BLOD.abv(url.match(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/)[0]) : undefined);
            this.aid = this.aid || (obj.bvid ? BLOD.abv(obj.bvid) : undefined);
            try {
                if (this.aid) {
                    this.cid = obj.cid || undefined;
                    if (!this.cid) {
                        this.p = obj.p || 1;
                        this.data = BLOD.jsonCheck(await BLOD.xhr(BLOD.objUrl("https://api.bilibili.com/x/player/pagelist", { "aid": this.aid }))).data[this.p - 1];
                        this.cid = this.data.cid;
                        toast("正在请求av视频数据", "分P名称：" + this.data.part);
                    }
                } else {
                    this.ssid = url.match(/[sS][sS][0-9]+/) ? url.match(/[sS][sS][0-9]+/)[0].match(/\d+/)[0] : undefined;
                    this.ssid = this.ssid || obj.season_id || undefined;
                    if (this.ssid) {
                        this.data = await BLOD.xhr(BLOD.objUrl("https://bangumi.bilibili.com/view/web_api/season", { season_id: this.ssid }));
                    } else {
                        this.epid = url.match(/[eE][pP][0-9]+/) ? url.match(/[eE][pP][0-9]+/)[0].match(/\d+/)[0] : undefined;
                        this.epid = this.epid || obj.ep_id || undefined;
                        if (this.epid) this.data = await BLOD.xhr(BLOD.objUrl("https://bangumi.bilibili.com/view/web_api/season", { ep_id: this.epid }));
                    }
                    if (this.data) {
                        this.data = BLOD.iniState.bangumi(this.data, this.epid);
                        this.aid = this.data.epInfo.aid;
                        this.cid = this.data.epInfo.cid;
                        BLOD.pgc = 1;
                        toast("正在请求Bangumi数据", "系列名称：" + this.data.mediaInfo.title, "分p名称：" + this.data.epInfo.index_title);
                    }
                }
                if (this.aid && this.cid) {
                    BLOD.mdf = {};
                    this.record = this.record || {};
                    this.record[this.cid] = this.record[this.cid] || await Promise.all([this.geturl("", this.aid, this.cid), this.geturl("flv", this.aid, this.cid), this.geturl("dash", this.aid, this.cid)]);
                    this.quee(this.record[this.cid]);
                    this.item();
                    BLOD.pgc = undefined;
                } else {
                    toast.warning("请输入有效的视频链接", "支持完整av/BV/bangumi链接，如https://www.bilibili.com/video/av50619577", "也支持视频关键参数，如aid、bvid、ssid、epid");
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("自定义下载", ...e); }

        }
        item() {
            let timer, top = document.getElementById("bili-old-download-table");
            if (top) {
                // 刷新下载面板
                top.remove();
                // 释放bolb残留
                if (BLOD.bloburl.xml) {
                    window.URL.revokeObjectURL(BLOD.bloburl.xml);
                    BLOD.bloburl.xml = "";
                }
            }
            if (!BLOD.mdf.mp4 && !BLOD.mdf.flv && !BLOD.mdf.dash && !BLOD.mdf.xml) return toast.warning("未找到任何视频链接 ಥ_ಥ");
            top = document.createElement("div");
            top.setAttribute("id", "bili-old-download-table");
            if (BLOD.mdf.mp4) this.addBox(top, BLOD.mdf.mp4, "mp4", "download-mp4");
            if (BLOD.mdf.dash) {
                if (BLOD.mdf.dash.avc) this.addBox(top, BLOD.mdf.dash.avc, "avc", "download-avc");
                if (BLOD.mdf.dash.hev) this.addBox(top, BLOD.mdf.dash.hev, "hev", "download-hev");
                if (BLOD.mdf.dash.aac) this.addBox(top, BLOD.mdf.dash.aac, "aac", "download-aac");
            }
            if (BLOD.mdf.flv) this.addBox(top, BLOD.mdf.flv, "flv", "download-flv");
            if (BLOD.mdf.xml) this.addBox(top, BLOD.mdf.xml, "其他", "download-xml", "360P");
            document.body.appendChild(top);
            top.onmouseover = () => window.clearTimeout(timer);
            top.onmouseout = () => {
                timer = window.setTimeout(() => {
                    top.remove();
                    if (BLOD.bloburl.xml) {
                        window.URL.revokeObjectURL(BLOD.bloburl.xml);
                        BLOD.bloburl.xml = "";
                    }
                }, 1000)
            }
            if (window.self == window.top && BLOD.config.reset.ef2) return toast.success("点击对应链接进入ef2下载面板", "没有 ef2 + IDM 请在设置里关闭ef2功能");
            return toast.success("请右键复制下载或者右键IDM下载链接", "直接复制链接无效！直接左键点击无效！", "下载 -403 可尝试在设置里启用 ef2 功能")
        }
        /**
         * 读取远程数据
         * @param {[{}]} path 远程函数的json数组，分发下载数据
         */
        quee(path) {
            path.forEach(d => {
                if (d) {
                    let data = d.data || (d.durl && d) || d.result || {};
                    this.durl(data);
                    this.dash(data);
                }
            })
        }
        /**
         * 读取DASH数据
         * @param {{}} path 原始json
         */
        dash(path) {
            if (!path.dash) return;
            BLOD.mdf.dash = BLOD.mdf.dash || {};
            if (path.dash.video) {
                for (let i = 0; i < path.dash.video.length; i++) {
                    // 随机抽取下载链接
                    if (!path.dash.video[i].baseUrl && path.dash.video[i].base_url) path.dash.video[i].baseUrl = path.dash.video[i].base_url;
                    if (!path.dash.video[i].backupUrl && path.dash.video[i].backup_url) path.dash.video[i].backupUrl = path.dash.video[i].backup_url;
                    if (path.dash.video[i].backupUrl && path.dash.video[i].backupUrl[0]) {
                        path.dash.video[i].backupUrl.push(path.dash.video[i].baseUrl);
                        path.dash.video[i].baseUrl = BLOD.randomArray(path.dash.video[i].backupUrl)[0];
                    }
                    if (path.dash.video[i].codecs) {
                        if (path.dash.video[i].codecs.startsWith("avc")) {
                            BLOD.mdf.dash.avc = BLOD.mdf.dash.avc || [];
                            BLOD.mdf.dash.avc.push([this.qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8) || "N/A", ".m4v"]);
                        } else {
                            BLOD.mdf.dash.hev = BLOD.mdf.dash.hev || [];
                            BLOD.mdf.dash.hev.push([this.qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8) || "N/A", ".m4v"]);
                        }
                    } else {
                        // 对于不提供编码信息的链接采取如下逻辑归类：判断其id与下一个文件id相同则取avc，不同取hev。
                        if (path.dash.video[i + 1] && path.dash.video[i + 1].id == path.dash.video[i].id) {
                            BLOD.mdf.dash.avc = BLOD.mdf.dash.avc || [];
                            BLOD.mdf.dash.avc.push([this.qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8) || "N/A", ".m4v"]);
                        } else {
                            BLOD.mdf.dash.hev = BLOD.mdf.dash.hev || [];
                            BLOD.mdf.dash.hev.push([this.qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8) || "N/A", ".m4v"]);
                        }
                    }
                }
            }
            if (path.dash.audio) {
                for (let i = 0; i < path.dash.audio.length; i++) {
                    if (!path.dash.audio[i].baseUrl && path.dash.audio[i].base_url) path.dash.audio[i].baseUrl = path.dash.audio[i].base_url;
                    if (!path.dash.audio[i].backupUrl && path.dash.audio[i].backup_url) path.dash.audio[i].backupUrl = path.dash.audio[i].backup_url;
                    if (path.dash.audio[i].backupUrl && path.dash.audio[i].backupUrl[0]) {
                        path.dash.audio[i].backupUrl.push(path.dash.audio[i].baseUrl);
                        path.dash.audio[i].baseUrl = BLOD.randomArray(path.dash.audio[i].backupUrl)[0];
                    }
                    BLOD.mdf.dash.aac = BLOD.mdf.dash.aac || [];
                    BLOD.mdf.dash.aac.push([path.dash.audio[i].id, path.dash.audio[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.audio[i].bandwidth * path.dash.duration / 8) || "N/A", ".m4a"]);
                }
                BLOD.mdf.dash.aac = BLOD.bubbleSort(BLOD.mdf.dash.aac).reverse();
                for (let i = 0; i < BLOD.mdf.dash.aac.length; i++) if (BLOD.mdf.dash.aac[i][0] in this.bps) BLOD.mdf.dash.aac[i][0] = this.bps[BLOD.mdf.dash.aac[i][0]];
            }
        }
        /**
         * 读取flv数据，可能包含mp4
         * @param {{}} path 原始json
         */
        durl(path) {
            if (!path.durl) return;
            if (path.durl[0]) {
                if (path.durl[0].url.includes("mp4?")) {
                    BLOD.mdf.mp4 = BLOD.mdf.mp4 || [];
                    BLOD.mdf.mp4.push([this.qua[path.quality], path.durl[0].url.replace("http:", ""), BLOD.sizeFormat(path.durl[0].size) || "N/A", ".mp4"]);
                } else {
                    BLOD.mdf.flv = [];
                    for (let i = 0; i < path.durl.length; i++) BLOD.mdf.flv.push([this.qua[path.durl[i].url.match(/[0-9]+\.flv/)[0].split(".")[0]], path.durl[i].url.replace("http:", ""), BLOD.sizeFormat(path.durl[i].size) || "N/A", ".flv"]);
                }
            }
        }
        /**
         * 读取其他数据：如弹幕、字幕、封面...
         */
        other() {
            if (!BLOD.config.reset.dlother) return;
            BLOD.mdf.xml = [];
            if (BLOD.xml) {
                let blob = new Blob([BLOD.xml]);
                BLOD.bloburl.xml = URL.createObjectURL(blob);
                BLOD.mdf.xml.push(["弹幕", BLOD.bloburl.xml, BLOD.sizeFormat(blob.size), ".xml"]);
            } else {
                BLOD.mdf.xml.push(["弹幕", "//api.bilibili.com/x/v1/dm/list.so?oid=" + BLOD.cid, BLOD.sizeFormat(), ".xml"]);
            }
            if (BLOD.__INITIAL_STATE__) {
                if (BLOD.__INITIAL_STATE__.videoData && BLOD.__INITIAL_STATE__.videoData.pic) BLOD.mdf.xml.push(["封面", BLOD.__INITIAL_STATE__.videoData.pic.replace("http:", ""), BLOD.sizeFormat(), ".jpg"]);
                if (BLOD.__INITIAL_STATE__.mediaInfo && BLOD.__INITIAL_STATE__.mediaInfo.cover) BLOD.mdf.xml.push(["封面", BLOD.__INITIAL_STATE__.mediaInfo.cover.replace("http:", ""), BLOD.sizeFormat(), ".jpg"]);
                if (BLOD.__INITIAL_STATE__.mediaInfo && BLOD.__INITIAL_STATE__.mediaInfo.bkg_cover) BLOD.mdf.xml.push(["海报", BLOD.__INITIAL_STATE__.mediaInfo.bkg_cover.replace("http:", ""), BLOD.sizeFormat(), ".jpg"]);
                if (BLOD.__INITIAL_STATE__.mediaInfo && BLOD.__INITIAL_STATE__.mediaInfo.specialCover) BLOD.mdf.xml.push(["海报", BLOD.__INITIAL_STATE__.mediaInfo.specialCover.replace("http:", ""), BLOD.sizeFormat(), ".jpg"]);
                if (BLOD.subtitle) BLOD.subtitle.forEach(d => BLOD.mdf.xml.push([d.lan_doc, d.subtitle_url.replace("http:", ""), BLOD.sizeFormat(), ".json"]))
            }
        }
        /**
         * 获取在线数据
         * @param  {...any} arg 直接传递给this.playurl
         */
        async geturl(...arg) {
            let url = await this.playurl(...arg);
            try {
                if (!url) throw url;
                let data = await BLOD.xhr.GM(url);
                return BLOD.jsonCheck(data);
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("下载拉取", ...e); }
        }
        /**
         * 构造在线数据url
         * @param {string} [type = mp4 | flv | dash | off] 视频格式
         * @param {number} [qn] 画质参数
         */
        async playurl(type, aid, cid, qn) {
            BLOD.aid = aid || BLOD.aid || window.aid;
            BLOD.cid = cid || BLOD.cid || window.cid;
            qn = qn || 125;
            type = type || "mp4";
            if (!BLOD.cid) return;
            switch (type) {
                case 'dash': if (BLOD.pgc) return BLOD.objUrl("https://api.bilibili.com/pgc/player/web/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 80 });
                else return BLOD.objUrl("https://api.bilibili.com/x/player/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 80 });
                    break;
                case 'flv': if (BLOD.pgc) return BLOD.objUrl("https://api.bilibili.com/pgc/player/web/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json' });
                else return BLOD.objUrl("https://api.bilibili.com/x/player/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json' });
                    break;
                case 'off': return BLOD.urlSign("https://interface.bilibili.com/v2/playurl", { cid: BLOD.cid, otype: 'json', qn: qn, quality: qn, type: '' });
                    break;
                case 'mp4': if (BLOD.pgc) return BLOD.urlSign("https://api.bilibili.com/pgc/player/api/playurlproj", { cid: BLOD.cid, otype: 'json', platform: 'android_i', qn: 208 });
                    return BLOD.urlSign("https://app.bilibili.com/v2/playurlproj", { cid: BLOD.cid, otype: 'json', platform: 'android_i', qn: 208 });
                    break;
                case 'tv': if (BLOD.pgc) return BLOD.urlSign("https://api.bilibili.com/pgc/player/api/playurltv", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 80, platform: "android", mobi_app: "android_tv_yst", build: 102801 });
                    return BLOD.objUrl("https://api.bilibili.com/x/tv/ugc/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 80, platform: "android", mobi_app: "android_tv_yst", build: 102801 });
                    break;
            }
        }
        /**
         * 绘制下载面板项目
         * @param {HTMLElement} top 下载面板节点
         * @param {{}} item 文件类型原始数据
         * @param {string} name 文件类型显示名称
         * @param {string} type 文件类型：className
         * @param {string} [quatily] 指定文件档次：影响该文件样式颜色
         */
        addBox(top, item, name, type, quatily) {
            let qua = quatily;
            let box = document.createElement("div");
            box.setAttribute("class", "download-box");
            box.innerHTML = '<div class="download-type ' + type + '">' + name + '</div>';
            top.appendChild(box);
            item.forEach(d => {
                switch (qua || d[0]) {
                    case "HDR": quatily = "quality-tops"; break;
                    case "4K": quatily = "quality-top"; break;
                    case "1080P60": quatily = "quality-highs"; break;
                    case "720P60": quatily = "quality-high"; break;
                    case "1080P+": quatily = "quality-1080ps"; break;
                    case "1080P": quatily = "quality-1080p"; break;
                    case "720P": quatily = "quality-720p"; break;
                    case "480P": quatily = "quality-480p"; break;
                    case "360P": quatily = "quality-360p"; break;
                    case "320kbps": quatily = "quality-720p"; break;
                    case "128kbps": quatily = "quality-480p"; break;
                    case "64kbps": quatily = "quality-360p"; break;
                    default: quatily = "quality-high";
                }
                let a = BLOD.addElement("a", {
                    download: "av" + BLOD.aid + d[3],
                    target: "_blank"
                }, box);
                a.href = d[1];
                a.innerHTML = '<div class="download-quality ' + quatily + '">' + d[0] + '</div><div class="download-size">' + d[2] + '</div>';
                if (window.self == window.top && BLOD.config.reset.ef2 && name != "其他") {
                    a.href = "javaScript:void(0);";
                    a.onclick = () => { this.ef2Set(name, d, this.config[name]); return false; }
                }
            })
        }
        /**
         * 绘制ef2面板
         * @param {string} name 文件编码格式：avc、hev、aac……
         * @param {[]} item 预先构造的下载数据：0，画质；1，URL；2，大小；3：拓展名
         * @param {{}} [para] 预配置的ef2参数：user-agent、referer……
         */
        ef2Set(mode, item, para = {}) {
            if (item[1].startsWith("//")) item[1] = "https:" + item[1];
            let ui = BLOD.addElement("div", { class: "BLOD-dl-settings", style: "top: " + (self.pageYOffset + window.screen.height * 0.1) + "px" });
            let title = BLOD.addElement("h1", {}, ui);
            let name = BLOD.addElement("h2", {}, ui);
            let d0 = BLOD.addElement("div", { class: "BLOD-dl-settings-item" }, ui);
            let d1 = BLOD.addElement("div", {}, d0);
            let d2 = BLOD.addElement("div", {}, d0);
            let d3 = BLOD.addElement("div", {}, d0);
            let d4 = BLOD.addElement("div", { class: "BLOD-dl-settings-item" }, ui);
            let d5 = BLOD.addElement("div", { class: "BLOD-dl-settings-item" }, ui);
            let d6 = BLOD.addElement("div", { class: "BLOD-dl-settings-item" }, ui);
            let d7 = BLOD.addElement("div", { class: "BLOD-dl-settings-item" }, ui);
            let d8 = BLOD.addElement("div", { class: "BLOD-dl-settings-item" }, ui);
            let d9 = BLOD.addElement("div", { class: "BLOD-dl-settings-item", title: "禁用IDM下载对话框" }, ui);
            let da = BLOD.addElement("div", { class: "BLOD-dl-settings-item", title: "添加到下载队列而开启下载" }, ui);
            let db = BLOD.addElement("div", { class: "final-dir" }, ui);
            let dc = BLOD.addElement("div", { class: "operations" }, ui);
            this.flash = () => {
                this.config.u = d4.value;
                this.config.a = d5.value;
                this.config.r = d6.value;
                this.config.o = d7.value;
                this.config.s = d8.value;
                if (para.hasOwnProperty("c")) this.config.c = para.c;
                let url = BLOD.ef2.encode(this.config);
                db.href = url;
                db.innerHTML = BLOD.ef2.data;
            }
            title.innerHTML = document.title.split("_哔哩")[0];
            name.innerHTML = "ef2参数[选填]";
            d1.innerHTML = "格式：" + mode;
            d2.innerHTML = "质量：" + item[0];
            d3.innerHTML = "大小：" + item[2];
            d4.innerHTML = 'URL<input type="text" placeholder="https://www.example.com" title="这里仍可以全选然后右键IDM下载" />';
            d4 = d4.children[0];
            d4.value = item[1];
            d4.readonly = "readonly";
            d5.innerHTML = 'User Agent<input type="text" placeholder="必须有效" title="一般输入浏览器UA即可" />';
            d5 = d5.children[0];
            d5.value = (para.a || this.config.a || navigator.userAgent).replace(/\"/g, "");
            d5.oninput = () => { this.flash() };
            d6.innerHTML = 'Referer<input type="text" placeholder="有时必须填又有时必须不填" title="不妨使用B站顶级域名" />';
            d6 = d6.children[0];
            d6.value = para.hasOwnProperty("r") ? para.r : (this.config.r || "https://www.bilibili.com/");
            d6.oninput = () => { this.flash() };
            d7.innerHTML = '保存位置<input type="text"  placeholder="Windows用的反斜杠地址，可以不填！" title="可以不填，后面IDM对话框操作更方便" />';
            d7 = d7.children[0];
            d7.value = (this.config.o || "").replace(/\"/g, "");
            d7.oninput = () => { this.flash() };
            d8.innerHTML = '文件名<input type="text"  placeholder="xxx.xxx" title="重命名文件，包括拓展名" />';
            d8 = d8.children[0];
            d8.value = title.textContent + item[3];
            d8.oninput = () => { this.flash() };
            d9.innerHTML = '静默下载<input type="checkbox" />';
            d9 = d9.children[0];
            d9.checked = this.config.f ? true : false;
            d9.onclick = () => {
                this.config.f = this.config.f ? false : true;
                this.flash();
            };
            da.innerHTML = '稍后下载<input type="checkbox" />';
            da = da.children[0];
            da.checked = this.config.q ? true : false;
            da.onclick = () => {
                this.config.q = this.config.q ? false : true;
                this.flash();
            };
            db.innerHTML = `ef2://<a href="${item[1]}"  title="直接左键点击就能下载"></a>`;
            db = db.children[0];
            dc.innerHTML = `<div class="button" title="左键点击调用IDM">开始下载</div><div class="button" title="退出">我点错了</div>`;
            this.flash();
            dc.children[0].onclick = () => {
                // 缺少拓展名主动补上默认拓展名
                if (d8.value && !d8.value.includes(".")) d8.value = d8.value + item[3];
                this.flash();
                BLOD.GM.setValue("download", {
                    a: d5.value,
                    r: d6.value,
                    o: d7.value
                })
                db.click();
                ui.remove();
            }
            dc.children[1].onclick = () => { ui.remove() }
        }
        /**
         * 读取本地清晰度数据
         * @returns {string} 清晰地数据字符串
         */
        getQuality() {
            let pn = JSON.parse(localStorage.getItem("bilibili_player_settings"));
            pn = (pn && pn.setting_config) ? pn.setting_config.defquality : 125;
            return pn;
        }
    }
    new Download();

})()