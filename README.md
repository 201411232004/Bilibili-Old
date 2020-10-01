# Bilibili 旧播放页
---
![Windows 8](https://img.shields.io/badge/Microsoft_Windows_8-compatible-green.svg?longCache=true) ![Chrome 85](https://img.shields.io/badge/Google_Chrome_85-compatible-green.svg?longCache=true) ![Firefox 79](https://img.shields.io/badge/Mozilla_Firefox_79-uncompatible-red.svg?longCache=true) ![Tampermonkey 4.10](https://img.shields.io/badge/Tampermonkey_4.10-compatible-green.svg?longCache=true)
- [Tampermonkey](https://www.tampermonkey.net/)（chrome）脚本，通过重写网页框架的方式切换到原生旧版页面
- 默认启用了部分附加功能，可在设置中选择关闭
- 与部分脚本及扩展不兼容，详见兼容数据条目
- B站改版时间轴
   + 2019年12月09日：放弃旧版av、Bangumi
   + 2019年12月24日：放弃旧版稍后再看
   + 2020年03月23日：启用BV代替av
   + 2020年04月04日：放弃旧版主页
   + 2020年04月23日：开启4K灰度测试
   + 2020年04月28日：放弃播单
   + 2020年05月21日：启用proto弹幕
   + 2020年07月13日：启用收藏式稍后再看
   + 2020年07月29日：启用新播放器加载图
   + 2020年08月25日：旧版番剧信息被风控

---
### 脚本实现
- 重写 (基于旧版网页框架)
   + 主页：[www.bilibili.com](https://www.bilibili.com)
   + av(BV)：[av50619577](https://www.bilibili.com/video/av50619577 "Brambly Boundaries")、[BV1w4411b7ph](https://www.bilibili.com/video/BV1w4411b7ph "Brambly Boundaries")
   + Bangumi(ss/ep)：[ss3398](https://www.bilibili.com/bangumi/play/ss3398 "冰菓") 、 [ep84776](https://www.bilibili.com/bangumi/play/ep84776 "深具传统的古典文学部之重生") 、 [ss12116](https://www.bilibili.com/bangumi/play/ss12116/ "声之形")
   + 稍后再看：[watchlater/#/list](https://www.bilibili.com/watchlater/#/list "播放列表")、[medialist/play/watchlater](https://www.bilibili.com/medialist/play/watchlater "播放全部")
   + 播单：[playlist/video/pl769](https://www.bilibili.com/playlist/video/pl769 "bilibili moe 2018 日本动画场应援")
   + 收藏：[medialist/play/ml182603655](https://www.bilibili.com/medialist/play/ml182603655 "bilibili moe 2018 日本动画场应援")
   + 嵌入：[blackboard](https://www.bilibili.com/blackboard/topic/activity-2020bangumiQ1_web.html "bilibili 2020 一月新番导视")、[campus](https://campus.bilibili.com/index.html "哔哩哔哩校园招聘")、[biligame](https://www.biligame.com/detail/?id=101644 "魔法纪录  魔法少女小圆外传")、[moegirl](https://zh.moegirl.org/%E4%B8%9C%E6%96%B9M-1%E6%BC%AB%E6%89%8D "东方M-1漫才")、[mylist](https://www.bilibili.com/mylist4#4 "各种神弹幕")
- 修改 (部分需在设置里启用)
   + 替换 全局顶栏和底栏
   + 启用 av并在进入BV时跳转到av
   + 添加 显示番剧分集播放数和弹幕数
   + 添加 旧版播放页点赞功能
   + 添加 下载视频功能
   + 移除 付费预览提示框
   + 添加 个人空间显示注册时间
   + 修复 评论楼层号 并 添加 楼中楼层号
   + 修复 收藏和频道里的失效视频封面和标题
   + 添加 屏蔽直播及轮播视频的功能
   + 添加 旧版播放器支持新版弹幕
   + 添加 历史记录只显示视频播放历史功能
   + 修复 旧版播放器实时弹幕

---
### 效果预览
![binguo.png](https://i.loli.net/2020/08/09/dStpanmQZYAJce6.png)

---
### 关于设置
- 设置入口在页面右下角2-3厘米处贴边，鼠标移动到位置会自动浮现，点击即可出现设置面板。
- 所有设置选项可通过对应按钮选择启用还是关闭，鼠标移动到对应选项会出现简短提示。
- 大部分设置都不会及时生效，需要刷新页面，部分设置之间可能相互依赖。
- 如果实在不会操作，[这个动图](https://s1.ax1x.com/2020/04/07/GgUKUS.gif "设置参考示例") 应该能解决一些问题。

---
### 下载视频
![dash](https://i.loli.net/2020/08/16/Y4GzOdmqtZshH3b.png)
播放器画面上右键选择下载视频就会出现如图所示下载面板，右键选择保存为即可。  
**脚本只提供下载链接，不负责下载**，那样太消耗内存，容易导致浏览器崩溃  
下面是附加说明：
   - 不要直接左键点击，因为浏览器同源策略左键并不会调用下载。
   - 不要直接复制链接，因为B站防盗链会检查`refer`和`user agent`，如果实在要复制，请配置`refer`为B站域名（*.bilibili.com）且设置任意有效的`user agent`。
   - mp4最高画质只有1080P，因为B站只提供了一档画质。
   - avc/hev/aac是DASH格式，音视频分离：avc/hev是视频流，aac是音频流，视频流二选一 + 音频流 = 完整视频。
   - flv历史原因可能会切分成多段，但是近年来的新视频已经不分段了。
   - 能播放才能下载，脚本所做的只是把播放器获取到的链接展示出来而已。
   - 在脚本设置里启用新版弹幕后，提供的就是新版proto弹幕的xml文件。
   - 文件大小未知不代表获取不到，获取不到就不会展示。

---
### 已知问题
以下问题这里可能处于并将长期处于无法解决状态，请多担待！  
1. 由于实现机制做不到在浏览器访问新版页面之前启用旧版页面，所以旧版页面载入比较慢且新版页面可能一闪而过。Firefox 79及后续版本无法良好支持旧版播放页面，原因暂时不得而知，猜测可能与vue有关。
2. 旧版播放器已失去官方维护，版本停留在`2019-10-31 07:38:36`，所以新版播放器互动视频、全景视频、高能进度条等功能是不支持的，互动视频脚本已主动忽略不会启用旧版，全景视频无法移动视角，CC字幕有[Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)提供第三方支持。
3. 主页内容改版极大，旧版很多接口已出现问题，脚本已将被废弃的广告区替换为资讯区的内容，但B站并不提供资讯区的排行所以右边排行榜无法获取。推荐视频不再提供三日/昨日/一周分类，已屏蔽对应的切换按钮。直播推荐及排行已通过`xhr hook`方式修复。
4. 旧版播放页面的充电接口是失效的，为避免财产损失请不要使用，新版播放页面也不提供充电入口，需要给UP主充电请移步对应的空间。
5. 替换嵌入播放器后顶层页面对于播放器的控制将失效，脚本也无暇去一一适配，不过涉及的页面也不多，已知的只有拜年祭2020专题页面。
6. 播单相关的页面直接被B站404，而404指令会限制对页面的修改，只能使用重定向的方式恢复播单的播放页面。
7. 收藏列表的播放页面并不存在对应的旧版，脚本使用重定向到av页并载入稍后再看列表进行模拟，但并不完美，请尽量不要在播放列表太大时启用。已知稍后再看列表上限是100，用来模拟容量为999的收藏列表极为卡顿。
8. 恢复评论楼层号时一并添加了楼中楼的楼层号，当楼中楼的当前页码大于2且第一条评论是@回复别人时，那页楼中楼的所有评论楼层号将无法获取。
9. 页面载入异常时请先尝试刷新，硬刷新更佳(`Shift + F5`或`Ctrl + Shift + R`)。部分功能由于脚本无法在浏览器读取缓存前注入而失效，同样只能靠硬刷新缓解。

---
### 兼容数据
>
> Microsoft Windows 8 (Build 6.2.9200.0) （64 位）  
> Google Chrome 85.0.4183.102 (正式版本) （64 位） (cohort: Stable)  
> Tampermonkey BETA 4.10.6120
>

- 只在最新版chrome + Tampermonkey上通过测试
- **Firefox最新版(79及之后)旧版框架启用失败**，之前的版本没问题   
- 旧版页面不得已使用的`document.write()`方法严重影响其他脚本及扩展：
   - DOM的数据被覆盖
   - DOM的回调失效：如`addEventListener`、`document.onclick`
   - `GM_setValue()`方法失效
   - 只针对同样以`run-at document-start`注入的脚本
   - 只针对启用了旧版框架的页面

附上测试结果：
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)
   - `GM_setValue`失效，在旧版页面无法修改设置
   - “简化主页”冲突，使旧版主页布局紊乱
   - 旧版番剧页面“批量下载”报错：“获取番剧数据失败: 无法找到 Season ID”
   - 快捷键拓展未适配，在旧版页面部分快捷键无效
- [解除B站区域限制](https://greasyfork.org/scripts/25718)
   - 旧版UI未适配，无法在旧版页面调出设置
   - **若要同时使用请关闭本脚本“区域限制”选项！**
- [Bilibili 修车插件](https://greasyfork.org/scripts/374449)
   - 推荐以`run-at document-start`注入
   - 推荐只在需要时启用该脚本
- [IDM Integration Module](http://www.internetdownloadmanager.com)：下载浮动条失效
- [smoothscroll](http://iamdustan.com/smoothscroll/)：平滑滚动失效
- [Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)：正常
- [Bilibili直播间挂机助手3](https://github.com/SeaLoong/Bilibili-LRHH)：正常
- [Bilibili - Whose Bullets](https://greasyfork.org/zh-CN/scripts/40341)：正常

- [pakku.js](https://chrome.google.com/webstore/detail/jklfcpboamajpiikgkbjcnnnnooefbhh)：正常

---
### 隐私相关
- 脚本会读取您的部分信息
   - cookies：与B站后端进行交互时识别用户身份
      - DedeUserID：判断是否登录
      - bili_jct：与B站后端进行操作验证
- 脚本申请了`GM_xmlhttpRequest`跨域权限，`@connect`元数据如下
   - [BiliPlus](https://www.biliplus.com/)：获取失效视频信息
   - [Bilibilijj](https://www.jijidown.com/)：获取失效视频信息
   - [bilibili](https://www.bilibili.com)：用于获取无[CROS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS "Cross-origin resource sharing")权限B站数据
- 脚本引用了部分公开库
   - [protobuf](https://github.com/protobufjs/protobuf.js)：解码新版proto弹幕

---
### 参考致谢
- [protobuf (License: BSD 3-Clause)](https://github.com/protobufjs/protobuf.js)：protobuf.js库
- [Wayback Machine](https://archive.org/web/)：B站旧版网页源代码
- [indefined](https://github.com/indefined/)：脚本原型及指导
- [BiliPlus](https://www.biliplus.com/)/[Bilibilijj](https://www.jijidown.com/)：第三方数据接口
- [哔哩哔哩注册时间查询助手](https://greasyfork.org/zh-CN/scripts/382542)：注册时间样式参考
- [mcfx](https://www.zhihu.com/question/381784377/answer/1099438784)：av/BV转化算法的python源码
- [Bilibili番剧显示单集信息](https://greasyfork.org/scripts/37970)：番剧分集信息接口
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)：兼容问题启发及部分实现参考
- [Bilibili\_video\_download](https://github.com/Henryhaohao/Bilibili_video_download)：playurl接口算法
- [解除B站区域限制](https://greasyfork.org/scripts/25718)：BPplayurl接口参考
- [YouTube Links](https://greasyfork.org/zh-CN/scripts/5566)：下载面板参考
- [MD5_百度百科](https://baike.baidu.com/item/MD5/212708?fr=aladdin#6_4)：md5哈希算法

---
### 版本历史
- 2020-10-02
   + 修正部分纪录片不显示集数的问题（[ss28333](https://www.bilibili.com/bangumi/play/ss28333)）
- 2020-09-23
   + 修复视频下载功能
- 2020-09-21
   + 修复旧版Bangumi追番数据
   + 修复部分节点误伤
- 2020-09-20
   + 修复一个正则表达式错误
   + 优化调试数据
- 2020-09-14
   + 优化样式添加方式：使用异步方法
   + 重构av页\_\_INITIAL\_STATE\_\_以规避网页中未内嵌\_\_INITIAL\_STATE\_\_的情况
- 2020-09-13
   + 修复旧版顶栏图片高分辨率适配问题
- 2020-09-12
   + 修复换P后没有切换到对应的实时弹幕服务器
- 2020-09-11
   + 修复旧版主页分区排行：电影、电视剧、纪录片
- 2020-09-06
   + 修复旧版播放器实时弹幕
- 2020-08-26
   + 改进旧版播放器设置维护
   + 下载视频主动获取flv格式
- 2020-08-25
   + 重构Bangumi的\_\_INITIAL\_STATE\_\_以绕开B站风控
   + 修复嵌入播放器替换失败的问题
- 2020-08-23
   + 不再预隐藏av页播放器，以优化Firefox79体验(未根本解决)
- 2020-08-18
   + 修复4k画质初始化播放器
- 2020-08-16
   + xhrhook选项调整为只控制send(open因为太多功能依赖默认开启)
   + 修改话题、活动主页顶栏类型
   + 添加跳过充电鸣谢功能
- 2020-08-14
   + 补全下载清晰度信息
- 2020-08-11
   + 提供xhrhook关闭选项，关闭后部分依赖功能将一并被关闭
   + 下载就算左键误点也将在新标签页打开
- 2020-08-10
   + 下载视频支持弹幕、封面等
- 2020-08-09
   + 精确获取评论楼中楼层号
   + 更新最新的分区信息
   + 修复不含音频的dash导致下载出错
- 2020-08-08
   + 支持修复评论楼中楼的楼层号
- 2020-08-07
   + 修复bv超链接
   + 优化收藏列表模拟，排序、加快载入速度
- 2020-08-06
   + 添加历史记录只显示视频播放历史的功能
   + 更新bangumi框架以处理页面部分请求重复的问题
- 2020-08-05
   + 下载面板flv类型也显示画质
   + 优化脚本结构和注释便于维护
- 2020-08-04
   + 实现旧版播放器支持新版弹幕 (感谢wly5556)
- 2020-08-03
   + 修复点赞功能
- [……更多……](https://github.com/MotooriKashin/Bilibili-Old/blob/master/history.md)
