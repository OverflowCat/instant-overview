const InstantOverview = require("../src/exec.js")
//require("../single/index.js");
const publish = InstantOverview.publish;
const raw = `<blockquote>
<p>本文由 <a href="http://ksria.com/simpread/">简悦 SimpRead</a> 转码， 原文地址 <a href="https://mp.weixin.qq.com/s?src=11×tamp=1642675819&amp;ver=3570&amp;signature=GFObtEdO37YTMO3-5WijDMzOnpMBLcARZy-R1jZwnEvyFU2xla4V3fQDIv7I3CnKyIcGJp2oYlCIPV78*TEAxoLETDmUR-Hn1AMLvzAMqx1-W7EHjIepDFrM0jcRHvf-&amp;new=1">mp.weixin.qq.com</a></p>
<p>原文作者：Xiaoru &quot;Leo&quot; Li ，翻译内容载自 New Frontend </p>
</blockquote>
<p>总想了解下 Svelte（web 开发的下一次革命）但是一直没时间？  </p>
<p>这份十条推文组成的旋风教程正是为你准备的！</p>
<p>（剧透警告：Svelte 是如此直观易用，以至于你可能感觉这些你都已经知道了！)</p>
<p> <strong>1</strong> </p>
<p>Svelte 的工作机制：</p>
<ul>
<li><p>编译器：并不会分发一个 Svelte 「库」给用户，而是在构建阶段编译出优化的纯 JS 代码</p>
</li>
<li><p>组件：应用由可组合的 UI 元素组成</p>
</li>
<li><p>响应式：事件 / 用户交互触发一系列状态改变，自动更新整个应用的组件</p>
</li>
</ul>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0Kt0FibdiaKibuoI3kHYB851p5ib9P03y1sOeNKtABw29QsAzk4BzxibZzjhg/640?wx_fmt=jpeg" alt="图片"></p>
<p> <strong>2</strong> </p>
<p>用户界面是组件树。组件定义了应用应当如何解释一些抽象的「状态」值，以便在浏览器中转换为 DOM 元素，并最终转换为屏幕上的像素。</p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0KBn9UyP8gjwJx3CEylyjuSVcUxWpUOFfs4YKgpGjF7hwtu19GcicbicVA/640?wx_fmt=jpeg" alt="图片"></p>
<p> <strong>3</strong> </p>
<p>每个 .svelte 文件包含一个组件，由三部分组成：</p>
<ul>
<li><p><code>&lt;stript&gt;</code> 是 JS 编写的组件逻辑</p>
</li>
<li><p><code>&lt;style&gt;</code>  是 CSS 样式，作用域和应用范围仅限于当前组件</p>
</li>
<li><p>Svelte 模板，以 HTML 基础，加上一些定制组件和内嵌逻辑（类似 JSX）</p>
</li>
</ul>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0KH9Eib5rWdLJdrqaeJKWYyFLLo12lAEA7UWDT2zYOo7MdILd6oscsia5w/640?wx_fmt=jpeg" alt="图片"></p>
<p> <strong>4</strong> </p>
<p>除了 HTML 元素外，Svelte 模板中还可以使用自定义组件。在不会引起歧义的情况下，在模板中引入自定义组件时可以省略  .svelte 文件扩展名，但是自定义组件的首字母 <strong>必须</strong> 大写。</p>
<p>花括号中可以使用 JS 表达式。</p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0K8TqzvvBW92cRzZFFJjHda4lnXE65gUK2ZZv3ZHTPzfweW22PXL7QnQ/640?wx_fmt=jpeg" alt="图片"></p>
<p> <strong>5</strong> </p>
<p>「控制」子组件行为的常见做法是将数据作为属性（ <code>props</code>）传入。</p>
<p>使用 export 暴露属性变量。注意赋值时使用 let 而不是 const ，因为  const 无法重新赋值。</p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0KxfeMrZj8tiaEMCD9hCF0IY4bULZLb9s9wLUftZicttibnUmJ4iaryeicTxA/640?wx_fmt=jpeg" alt="图片"></p>
<p> <strong>6</strong> </p>
<p>用户动作会触发事件。我们使用 on: 监听事件并运行函数以更新状态。用户界面会随着状态的更新自动更新。</p>
<p>一般来说数据从上往下流动，但我们可以使用  bind:  开放双向数据流动以简化状态更新逻辑。</p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0Kw3B27ddoVqYVZjzic8MWOiaRMMF8rPBFrL1m6r9pDp0XLskuiaStibthCQ/640?wx_fmt=jpeg" alt="图片"></p>
<p> <strong>7</strong> </p>
<p><code>$:</code>开头的语句是「响应式语句」。</p>
<p>Svelte 会分析响应式语句依赖的变量。任意依赖变量的值改变时，会重新执行相应的响应式语句。声明衍生状态或触发「副作用」时这个特性十分好用。</p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0KYgbSr8iboYLEnia7LfMBmc1sgib9kxoDskhhuw7eayQuyWNRc9AD0npiaA/640?wx_fmt=jpeg" alt="图片">  </p>
<p> <strong>8</strong> </p>
<p>响应式「store」方便在组件之间共享状态。store 放在单独的 JS 文件里，只需用<code>writable</code>封装一个值就可以创建。</p>
<p>在组件中引用（读写）时，store 名称带上  $ 前缀。编译器真奇妙！</p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0Klj07eMWa1avRTuRNDOAk3BqINt5bsC9MumKiblFOJFXHDAiagJOa6Pqg/640?wx_fmt=jpeg" alt="图片"></p>
<p> <strong>9</strong> </p>
<p>在 Svelte 模板中，使用  {#if} 可以实现有条件地渲染组件（ {#if}  有一个可选的 <code>{:else}</code>分支）。</p>
<p>使用 {#each}  渲染列表中的每个成员。</p>
<p>别忘了总是使用 {/if}  或 {/each} 收尾。</p>
<p>（下面的例子中其实应该使用 <code>&lt;ol&gt;</code> ，我用 <code>&lt;ul&gt;</code> 是为了演示如何访问数组索引）。</p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0KkMpzpNN6qcic9L2lmktZ3H524SHhLgicYKW0ndQguFrsicXXiafHYjcQYA/640?wx_fmt=jpeg" alt="图片"></p>
<p> <strong>10</strong> </p>
<p>Svelte 下进行 API 请求之类的异步操作非常容易。</p>
<p>我们可以直接 {#await} Promise 完成，在结果就绪前显示「加载中」。</p>
<p>注意 {#await} 关键字只适用于模板部分，无法在 <code>&lt;script&gt;</code> 中使用。</p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0KrUnsSZsdiayVL24zND8juKibwvsfqiaqBP0ykCQtx9PzCuqtWicmosqebQ/640?wx_fmt=jpeg" alt="图片"></p>
<p>Svelte 自带精美的动画变换效果。试着给你的组件加上 transition:fly 属性！还可以尝试下其他类型的动画效果，比如 fade（淡入淡出） 和 slide（滑动）。你还能使用 in:、out: 分别为出现和消失指定不同的效果。</p>
<p>传入参数可以进一步微调动画效果。</p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_gif/JicvOFVvHEe8cPY0ibvXkSNvhLrDufYA0K3TKKXGWJOesPy57XEojuPEmAx0JtfDOZgu0yR0z0iamo4l3zvlGbu9g/640?wx_fmt=gif" alt="图片"></p>
<p>好了，这就是上手 Svelte 前需要了解的所有内容。</p>
<p>开发愉快！</p>
<p>（这篇旋风教程的形式借鉴了 Chris Achard 写的 React 超短入门教程）  </p>
<p>end</p>
<p>LeanCloud，领先的 BaaS 提供商，为移动开发提供强有力的后端支持。更多内容请关注「LeanCloud 通讯」  </p>
<p><img src="https://mmbiz.qpic.cn/mmbiz_png/JicvOFVvHEeicvQicptxdY7icpmiciaEhMAe2T5GhAmu2VXuImaXzmCyDR6eOTibicoFsicMaIMficwaWeSX3qR0iciah1E52A/640?wx_fmt=png" alt="图片"></p>
`
publish({
  test: {
    imguploadlimit: 0,
    weixinpicproxy: true
  },
  article: {
    "url": "https://mp.weixin.qq.com/s?src=11×tamp=1642675819&amp;ver=3570&amp;signature=GFObtEdO37YTMO3-5WijDMzOnpMBLcARZy-R1jZwnEvyFU2xla4V3fQDIv7I3CnKyIcGJp2oYlCIPV78*TEAxoLETDmUR-Hn1AMLvzAMqx1-W7EHjIepDFrM0jcRHvf-&amp;new=1",
    "title": "微信文章图片代理测试",
    "desc": "",
    "tags": "wechat, javascript",
    "content": `
    <sr-read-content>${raw}</sr-read-content>`
  }
}).then(function (result) {
  console.log("测试20220120:", result);
});