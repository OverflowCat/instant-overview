const InstantOverview = //require("../src/exec.js")
  require("../single/index.js");
const publish = InstantOverview.publish;
publish({
  article: {
    "url": "https://mp.weixin.qq.com/s/UzfoxEd_RtyasbQydlxYRw",
    "title": "点赞动画还可以做得那么飘逸！",
    "desc": "",
    "content": `<sr-read-content><blockquote><p>本文由 <a href="http://ksria.com/simpread/">简悦 SimpRead</a> 转码， 原文地址 <a href="https://mp.weixin.qq.com/s/UzfoxEd_RtyasbQydlxYRw">mp.weixin.qq.com</a></p>
    </blockquote>
    <h2 id="-1-"><strong>1. 前言</strong></h2>
    <p>以前在看微信视频号直播的时候，经常点击右下角的点赞按钮。看着它的数字慢慢从一位数变成五位数，还是挺有氛围感的。特别是长按的时候，有个手机震动的反馈，很带感。</p>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_gif/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3CnZAVNKXV6pohRgZHxYe68hicnejt0jqiaJQ4Dr9FLdJFJicb199s9RcOrQ/640?wx_fmt=gif" alt=""></p>
    <p>虽然之前很好奇这些飘动的点赞动效是怎么实现的，但没有特别去钻研。直到前阵子投入腾讯课堂 H5 直播间的需求，需要自己去实现一个这样的效果时，才开始摸索。</p>
    <p>先看看最后的效果：</p>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_gif/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3CnNYSbDhHmnWxASR45B7zGmFbnRjsiaolyCEXj9trb2XI35UzMNlibbZpg/640?wx_fmt=gif" alt=""></p>
    <p>相比视频号的点赞动效，轨迹复杂了很多。可以看到课堂直播间的这一段点赞动效，大概分为这么三个阶段：  </p>
    <ol>
    <li><p>从无到有，在上升过程中<strong>放大</strong>成正常大小</p>
    </li>
    <li><p>上升过程中<strong>左右摇曳</strong>，且<strong>摇曳的幅度随机</strong></p>
    </li>
    <li><p>左右摇曳上升的过程中，<strong>渐隐并缩小</strong></p>
    </li>
    </ol>
    <p>在动手之前，我先想到了使用 <strong>CSS animation</strong> 去实现这种运动轨迹。在完成之后，又用 <strong>Canvas</strong> 重构了一版，优化了性能。</p>
    <p>接下来我们分别来看看这两种实现方式。</p>
    <p>公众号</p>
    <h2 id="-2-css-"><strong>2. CSS 实现点赞动效</strong></h2>
    <h3 id="-2-1-"><strong>2.1 轨迹分析</strong></h3>
    <p>由于点赞动画是在一个二维平面上的，我们可以将它的运动轨迹拆分为 <strong>x 轴</strong> 和 <strong>y 轴</strong> 上的两段。</p>
    <p>在 <strong>y 轴</strong> 上非常简单，我们的点赞图标会做一段垂直上升的匀速运动，从容器底部上升到容器顶部。</p>
    <p>而 <strong>x 轴</strong> 上是左右摇曳的，用数学的角度说，是一段简谐运动。</p>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_png/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3Cn2ZYgnv2KkzoW2WoNHFD5PSDsaAiabyfxA6qK8MwRfyWWL1U0Ab8M0Ow/640?wx_fmt=png" alt=""></p>
    <p>但用 css 实现的时候，其实不用这么精细。为了简化计算，我们可以用几个关键帧来串联这段运动轨迹，例如：</p>
    <pre><code>@keyframes bubble_swing {  <span class="hljs-number">0</span>% {    中间  }  <span class="hljs-number">25</span>% {    最左  }  <span class="hljs-number">75</span>% {    最右  }  <span class="hljs-number">100</span>% {    中间  }}
    </code></pre><h3 id="-2-2-"><strong>2.2 轨迹设计</strong></h3>
    <p>根据上面的分析，我们可以设计一段相同的上升轨迹，以及几段不同的左右摇曳轨迹。</p>
    <p>上升轨迹很简单，同时我们还可以加上透明度（opacity）、大小（transform）的变化，如下：</p>
    <pre><code>@<span class="hljs-keyword">keyframes</span> bubble_y {  0% {    <span class="hljs-attribute">transform</span>: <span class="hljs-built_in">scale</span>(1);    <span class="hljs-attribute">margin-bottom</span>: <span class="hljs-number">0</span>;    <span class="hljs-attribute">opacity</span>: <span class="hljs-number">0</span>;  }  5% {    <span class="hljs-attribute">transform</span>: <span class="hljs-built_in">scale</span>(1.5);    <span class="hljs-attribute">opacity</span>: <span class="hljs-number">1</span>;  }  80% {    <span class="hljs-attribute">transform</span>: <span class="hljs-built_in">scale</span>(1);    <span class="hljs-attribute">opacity</span>: <span class="hljs-number">1</span>;  }  100% {    <span class="hljs-attribute">margin-bottom</span>: <span class="hljs-built_in">var</span>(--cntHeight);    <span class="hljs-attribute">transform</span>: <span class="hljs-built_in">scale</span>(0.8);    <span class="hljs-attribute">opacity</span>: <span class="hljs-number">0</span>;  }}
    </code></pre><p>其中，--cntHeight 指的是容器的高度。也就是说，我们通过让 margin-bottom 不断增大，来控制点赞图标从容器底部上升到容器顶部。</p>
    <p>而对于横向运动的轨迹，为了增加运动轨迹的多样性，我们可以设计多段左右摇曳的轨迹，比如说一段 “中间 -&gt; 最左 -&gt; 中间 -&gt; 最右” 的轨迹：</p>
    <pre><code>@keyframes bubble_swing_1 {  <span class="hljs-number">0</span>% {    // 中间    margin-left: <span class="hljs-number">0</span>;  }  <span class="hljs-number">25</span>% {    // 最左    margin-left: -<span class="hljs-number">12</span>px;  }  <span class="hljs-number">75</span>% {    // 最右    margin-left: <span class="hljs-number">12</span>px;  }  <span class="hljs-number">100</span>% {    margin-left: <span class="hljs-number">0</span>;  }}
    </code></pre><p>这里同样使用 margin 来控制图标的左右移动。类似的，我们还可以设计几段别的轨迹：</p>
    <pre><code>// 任意轨迹@keyframes bubble_swing_2 {  <span class="hljs-number">0</span>% {    // 中间    margin-left: <span class="hljs-number">0</span>;  }  <span class="hljs-number">33</span>% {    // 最左    margin-left: -<span class="hljs-number">12</span>px;  }  <span class="hljs-number">100</span>% {    // 随机位置    margin-left: <span class="hljs-number">6</span>px;  }}// 简谐反向@keyframes bubble_swing_3 {  <span class="hljs-number">0</span>% {    // 中间    margin-left: <span class="hljs-number">0</span>;  }  <span class="hljs-number">25</span>% {    // 最右    margin-left: <span class="hljs-number">12</span>px;  }  <span class="hljs-number">75</span>% {    // 最左    margin-left: -<span class="hljs-number">12</span>px;  }  <span class="hljs-number">100</span>% {    margin-left: <span class="hljs-number">0</span>;  }}
    </code></pre><p>接下来我们把 <strong>x 轴</strong> 和 <strong>y 轴</strong> 的轨迹（@keyframes）结合起来，并设置一个随机的动画时间，比如说：</p>
    <pre><code>@<span class="hljs-keyword">for</span>$i from <span class="hljs-number">1</span> through <span class="hljs-number">3</span> {  @for$j from <span class="hljs-number">1</span> through <span class="hljs-number">2</span> {    .bl<span class="hljs-number">_</span>#{$i}<span class="hljs-number">_</span>#{$j} {      animation: bubble_y calc(<span class="hljs-number">1.5</span>s + $j * <span class="hljs-number">0</span>.<span class="hljs-number">5</span>s) linear <span class="hljs-number">1</span> forwards,        bubble_swing<span class="hljs-number">_</span>#{$i} calc(<span class="hljs-number">1.5</span>s + $j * <span class="hljs-number">0</span>.<span class="hljs-number">5</span>s) linear <span class="hljs-number">1</span> forwards;    }  }}
    </code></pre><p>这里生成了 3 * 2 = 6 种不同的轨迹。针对这类重复的选择器，用 SCSS 中的循环语法，可以少写很多代码。</p>
    <h3 id="-2-3-"><strong>2.3 随机选择图片（雪碧图）</strong></h3>
    <p>我们每次点赞会出现不同的图标，于是这里设计了一系列选择器给不同的图标，让它们呈现不同的图片。首先我们要准备一张雪碧图，保持所有图标的大小一致，然后同样使用 SCSS 的循环语法：</p>
    <pre><code>@<span class="hljs-keyword">for</span>$i from <span class="hljs-number">0</span> through <span class="hljs-number">7</span> {  .b#{$i} {    background: url(<span class="hljs-string">'../../images/like_sprites.png'</span>) calc(#{$i} * -<span class="hljs-number">24</span>px) <span class="hljs-number">0</span>;  }}
    </code></pre><p>像上面生成了 8 个选择器，我们在程序执行时就可以随机给图标赋予一个选择器。</p>
    <h3 id="-2-4-"><strong>2.4 生成一个点赞图标</strong></h3>
    <p>CSS 的部分差不多了，我们现在来看 JS 是怎么执行的。我们需要有一个容器 div，让它来装载要生成的点赞图标。以及一个按钮来绑定点击事件：</p>
    <pre><code><span class="hljs-keyword">const</span> cacheRef = useRef&lt;LikeCache&gt;<span class="hljs-function">(<span class="hljs-params">{    bubbleCnt: <span class="hljs-literal">null</span>,    likeIcon: <span class="hljs-literal">null</span>,    bubbleIndex: <span class="hljs-number">0</span>,    timer: <span class="hljs-literal">null</span>,}</span>);<span class="hljs-params">useEffect</span>(<span class="hljs-params">(</span>) =&gt;</span> {    cacheRef.current.bubbleCnt = <span class="hljs-built_in">document</span>.getElementById(<span class="hljs-string">'like-bubble-cnt'</span>);    cacheRef.current.likeIcon = <span class="hljs-built_in">document</span>.getElementById(<span class="hljs-string">'like-icon'</span>);}, []);
    </code></pre><p>在点击事件中，生成一个新的 div 元素，并为它设置 className。接着将它 append 到容器下，最后在一段时间后销毁这个点赞图标元素。如下：</p>
    <pre><code><span class="hljs-comment"><span class="markdown">/<span class="hljs-emphasis">** *</span> 添加 bubble */</span></span><span class="hljs-keyword">const</span> addBubble = () =&gt; {  <span class="hljs-keyword">const</span> { bubbleCnt } = cacheRef.current;  cacheRef.current.bubbleIndex %= maxBubble;  <span class="hljs-keyword">const</span> d = <span class="hljs-built_in">document</span>.createElement(<span class="hljs-string">'div'</span>);  <span class="hljs-comment">// 图片类 b0 - b7  // 随机动画类 bl_1_1 - bl_3_2  const swing = Math.floor(Math.random() * 3) + 1;  const speed = Math.floor(Math.random() * 2) + 1;  d.className = ` + "`like-bubble b${cacheRef.current.bubbleIndex} bl_${swing}_${speed}`" + `;  bubbleCnt?.appendChild(d);  cacheRef.current.bubbleIndex++;  // 动画结束后销毁元素  setTimeout(() =&gt; {    bubbleCnt?.removeChild(d);  }, 2600);};</span>
    </code></pre><p>到这里，我们就实现得差不多了。不过，我们还可以给点击的图标加点动画，让它有一个被按压后弹起的效果：</p>
    <pre><code><span class="hljs-comment">/** * 点击“喜欢” */</span>const onClick = () =&gt; {  const { <span class="hljs-built_in">timer</span>, likeIcon } = cacheRef.current;  <span class="hljs-keyword">if</span> (!likeIcon) {    <span class="hljs-built_in">return</span>;  }  <span class="hljs-keyword">if</span> (<span class="hljs-built_in">timer</span>) {    clearTimeout(<span class="hljs-built_in">timer</span>);    cacheRef.current.<span class="hljs-built_in">timer</span> = null;  }  likeIcon.classList.<span class="hljs-built_in">remove</span>('bounce-click');  // 删除并重新添加类，需要延迟添加  setTimeout(() =&gt; {    likeIcon.classList.add('bounce-click');  }, <span class="hljs-number">0</span>);  cacheRef.current.<span class="hljs-built_in">timer</span> = window.setTimeout(() =&gt; {    likeIcon.classList.<span class="hljs-built_in">remove</span>('bounce-click');    clearTimeout(<span class="hljs-built_in">timer</span>!);    cacheRef.current.<span class="hljs-built_in">timer</span> = null;  }, <span class="hljs-number">300</span>);  addBubble();};
    </code></pre><h3 id="-2-5-"><strong>2.5 最终效果</strong></h3>
    <p>最后来看看效果吧！</p>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_gif/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3CnKMM9EDicGnPXbFbLpMNpr4JMGcT53f2hbKZjW68KbtSACvXxibu3gI3g/640?wx_fmt=gif" alt=""></p>
    <p><strong>3. Canvas 实现点赞动效</strong>  </p>
    <hr>
    <p>我们都知道 Canvas 的绘制更流畅一些，能够带来更好的体验。但苦于编码比较复杂，也有一定的学习成本，实现起来要比 CSS 复杂不少。</p>
    <p>接下来我们看看基于 Canvas 的点赞动效实现。</p>
    <h3 id="-3-1-"><strong>3.1 画布创建</strong></h3>
    <p>首先我们读取一个 Canvas 元素的 id，并通过 getContext 获取它的上下文。除此之外，还传入了一个 canvasScale，指的是画布放大的比例，这个在之后会用到：</p>
    <pre><code><span class="hljs-keyword">constructor</span>(canvasId: string, canvasScale: number) {  const canvas = document.getElementById(canvasId) <span class="hljs-keyword">as</span> HTMLCanvasElement;  <span class="hljs-keyword">this</span>.context = canvas.getContext(<span class="hljs-string">'2d'</span>)!;  <span class="hljs-keyword">this</span>.width = canvas.width;  <span class="hljs-keyword">this</span>.height = canvas.height;  <span class="hljs-keyword">this</span>.canvasScale = canvasScale;  <span class="hljs-keyword">this</span>.img = <span class="hljs-literal">null</span>;  <span class="hljs-keyword">this</span>.loadImages();}
    </code></pre><h3 id="-3-2-"><strong>3.2 预加载图片（雪碧图）</strong></h3>
    <p>在 constructor 这里，我们还通过 loadImages 这个函数，预加载了雪碧图：</p>
    <pre><code><span class="hljs-keyword">import</span> likeSprites <span class="hljs-keyword">from</span><span class="hljs-string">'../../images/like_sprites.png'</span>;<span class="hljs-comment">/** * 预加载图片 */</span>loadImages = <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> {  <span class="hljs-keyword">const</span> p = newPromise(<span class="hljs-function">(<span class="hljs-params">resolve: (image: HTMLImageElement</span>) =&gt;</span> <span class="hljs-keyword">void</span>) =&gt; {    <span class="hljs-keyword">const</span> img = <span class="hljs-keyword">new</span> Image();    img.onerror = <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> resolve(img);    img.onload = <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> resolve(img);    img.src = likeSprites;  });  p.then(<span class="hljs-function">(<span class="hljs-params">img</span>) =&gt;</span> {    <span class="hljs-keyword">if</span> (img &amp;&amp; img.width &gt; <span class="hljs-number">0</span>) {      <span class="hljs-keyword">this</span>.img = img;    } <span class="hljs-keyword">else</span> {      <span class="hljs-comment">// error('[live-connect]预加载喜欢动效图片失败');    }  });};</span>
    </code></pre><h3 id="-3-3-"><strong>3.3 轨迹拆解</strong></h3>
    <p>同样的，我们需要从 Canvas 的视角来拆解点赞图标的运动轨迹。  </p>
    <p><strong>y 轴</strong> 的运动和 CSS 一样，我们知道起始位置和终止位置就可以得出。</p>
    <p><strong>x 轴</strong> 的运动可以好好推敲。由于 Canvas 是逐帧绘制的，我们可以模拟出一个比较逼真的简谐运动。这里要来讲一讲大家耳熟能详的初中数学了，下面是我们要使用的一条正弦函数的公式：</p>
    <pre><code><span class="hljs-attr">y</span> = A sin(Bx + C) + D
    </code></pre><p>参数说明：</p>
    <ul>
    <li><p>振幅是 <strong>A</strong></p>
    </li>
    <li><p>周期是 <strong>2π/B</strong></p>
    </li>
    <li><p>相移是 <strong>−C/B</strong></p>
    </li>
    <li><p>垂直移位是 <strong>D</strong></p>
    </li>
    </ul>
    <p>套入点赞动效：</p>
    <ul>
    <li><p>赋予图标元素随机的振幅 A。</p>
    </li>
    <li><p>赋予图标元素随机的周期，即 B 是随机的。</p>
    </li>
    <li><p>取 C = 0，即相移为 0。</p>
    </li>
    <li><p>取 D = 0，即不需要垂直移位。</p>
    </li>
    </ul>
    <pre><code><span class="hljs-attr">y</span> = A sinBx。
    </code></pre><h3 id="-3-4-"><strong>3.4 横竖位移计算</strong></h3>
    <p>确定位移轨迹之后，我们先定义一些常量，如下：</p>
    <pre><code><span class="hljs-comment"><span class="markdown">/<span class="hljs-emphasis">** 图片显示宽高 *</span>/</span></span><span class="hljs-keyword">const</span> IMAGE_WIDTH = <span class="hljs-number">30</span>;<span class="hljs-comment"><span class="markdown">/<span class="hljs-emphasis">** 图片原始宽高 *</span>/</span></span><span class="hljs-keyword">const</span> SOURCE_IMAGE_WIDTH = <span class="hljs-number">144</span>;<span class="hljs-comment"><span class="markdown">/<span class="hljs-emphasis">** 图片数量 *</span>/</span></span><span class="hljs-keyword">const</span> IMG_NUM = <span class="hljs-number">8</span>;<span class="hljs-comment"><span class="markdown">/<span class="hljs-emphasis">** 放大阶段（百分比）*</span>/</span></span><span class="hljs-keyword">const</span> ENLARGE_STAGE = <span class="hljs-number">0.1</span>;<span class="hljs-comment"><span class="markdown">/<span class="hljs-emphasis">** 收缩渐隐阶段（百分比）*</span>/</span></span><span class="hljs-keyword">const</span> FADE_OUT_STAGE = <span class="hljs-number">0.8</span>;
    </code></pre><p>首先我们可以设计 <strong>x 轴</strong> 和 <strong>y 轴</strong> 两个方向上的位移计算函数，函数参数 progress 是 0 到 1 之间的数值，表示一个过程量（0 -&gt; 1）。</p>
    <pre><code>// 起始位置const basicX = this.<span class="hljs-built_in">width</span> / <span class="hljs-number">2</span>;// 正弦频率const frequency = <span class="hljs-built_in">random</span>(<span class="hljs-number">2</span>, <span class="hljs-number">10</span>);// 正弦振幅const amplitude = <span class="hljs-built_in">random</span>(<span class="hljs-number">5</span>, <span class="hljs-number">20</span>) * (<span class="hljs-built_in">random</span>(<span class="hljs-number">0</span>, <span class="hljs-number">1</span>) ? <span class="hljs-number">1</span> : -<span class="hljs-number">1</span>) * this.canvasScale;<span class="hljs-comment">/** * 获取横向位移（x轴） */</span>const getTranslateX = (progress: number) =&gt; {  <span class="hljs-keyword">if</span> (progress &lt; ENLARGE_STAGE) {    // 放大期间，不进行摇摆位移    <span class="hljs-built_in">return</span> basicX;  }  <span class="hljs-built_in">return</span> basicX + amplitude * Math.<span class="hljs-built_in">sin</span>(frequency * (progress - ENLARGE_STAGE));};<span class="hljs-comment">/** * 获取竖向位移（y轴） */</span>const getTranslateY = (progress: number) =&gt; {  <span class="hljs-built_in">return</span> IMAGE_WIDTH / <span class="hljs-number">2</span> + (this.<span class="hljs-built_in">height</span> - IMAGE_WIDTH / <span class="hljs-number">2</span>) * (<span class="hljs-number">1</span> - progress);};
    </code></pre><h3 id="-3-5-"><strong>3.5 大小和透明度计算</strong></h3>
    <p>要绘制的图标大小怎么控制呢？在 Canvas 中，其实就是计算一个 scale，表示放缩的比例。</p>
    <p>我们根据放大 / 收缩阶段的过程常量和 progress 变量来调节它的大小。起始阶段先线性放大至 1，最后阶段再线性缩小至 0。</p>
    <p>透明度同理，在消失之前都是返回 1，其余时刻线性缩小。</p>
    <pre><code>/** * 获取放缩比例 */const getScale = (<span class="hljs-built_in">progress</span>: number) =&gt; {  <span class="hljs-keyword">let</span> r = <span class="hljs-number">1</span>;  <span class="hljs-keyword">if</span> (<span class="hljs-built_in">progress</span> &lt; ENLARGE_STAGE) {    // 放大    r = <span class="hljs-built_in">progress</span> / ENLARGE_STAGE;  } elseif (<span class="hljs-built_in">progress</span> &gt; FADE_OUT_STAGE) {    // 缩小    r = (<span class="hljs-number">1</span> - <span class="hljs-built_in">progress</span>) / (<span class="hljs-number">1</span> - FADE_OUT_STAGE);  }  <span class="hljs-keyword">return</span> r;};/** * 获取透明度 */const getAlpha = (<span class="hljs-built_in">progress</span>: number) =&gt; {  <span class="hljs-keyword">if</span> (<span class="hljs-built_in">progress</span> &lt; FADE_OUT_STAGE) {    <span class="hljs-keyword">return</span> <span class="hljs-number">1</span>;  }  <span class="hljs-keyword">return</span> <span class="hljs-number">1</span> - (<span class="hljs-built_in">progress</span> - FADE_OUT_STAGE) / (<span class="hljs-number">1</span> - FADE_OUT_STAGE);};
    </code></pre><h3 id="-3-6-canvas-"><strong>3.6 Canvas 绘制</strong></h3>
    <p>绘制时，我们先挑选一张图片。如下：</p>
    <pre><code><span class="hljs-regexp">//</span> 按顺序读取图片const { curImgIndex } = <span class="hljs-keyword">this</span>;<span class="hljs-regexp">//</span> 更新顺序<span class="hljs-keyword">this</span>.curImgIndex = ++<span class="hljs-keyword">this</span>.curImgIndex % IMG_NUM;
    </code></pre><h4 id="-3-6-1-"><strong>3.6.1 画布元素清晰度</strong></h4>
    <p>接下来需要用到我们之前提到的 canvasScale 了：</p>
    <pre><code>const <span class="hljs-keyword">new</span><span class="hljs-type">Width</span> = IMAGE_WIDTH * <span class="hljs-built_in">this</span>.canvasScale;
    </code></pre><p>为什么这里要乘以一个 canvasScale 呢？因为 Canvas 是<strong>位图模式</strong>的，它会根据设备的 <strong>dpi</strong> 来渲染图片。</p>
    <p>首先先介绍一下高分屏的概念：</p>
    <blockquote>
    <p>高分屏：在同样大小的屏幕面积上显示更多的像素点，也就是更多的可视信息。常见的就是 SXGA（1400 <em> 1050），UXGA（1600 </em> 1200）。1024 * 768 分辨率的屏幕叫普通屏，也就是 XGA 的屏幕，这个分辨率以上的屏幕叫高分屏。</p>
    </blockquote>
    <p>在高分屏上，每平方英寸会有更多的像素。原来在普通屏上绘制的 1 个像素，为了适应高分屏，被迫放大，变成了 4 个像素或者更多。</p>
    <p><strong>可以想象成，一张清晰度正常的普通图片为了布满整个背景被强行放大 n 倍，所以看起来模糊了</strong>。  </p>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_png/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3CnbPNrjWlfSpuw7eSdysHUzPsroUKbjBBCf0f6Ik4MAkF99lOAqf1gRw/640?wx_fmt=png" alt=""></p>
    <p>为了解决这个问题，就需要我们将绘制的图片放大。同时还要控制 Canvas 画布在 CSS 中的宽高。做到绘制内容变大的同时，画布依然呈现原来的大小。这样一来，图片就会因为绘制了更多的内容，而在高分屏上变得清晰且细腻。  </p>
    <h4 id="-3-6-2-"><strong>3.6.2 绘制元素</strong></h4>
    <p>绘制我们用到了 drawImage。在调用它之前，我们需要根据计算出的 translateX 和 translateY，调整绘制的起点。并且调整放缩比例和透明度，即 <code>context.scale()</code> 和 <code>context.globalAlpha</code>。如下：</p>
    <pre><code><span class="hljs-built_in">return</span>(progress: number) =&gt; {  // 动画过程 <span class="hljs-number">0</span> -&gt; <span class="hljs-number">1</span>  <span class="hljs-keyword">if</span> (progress &gt;= <span class="hljs-number">1</span>) <span class="hljs-built_in">return</span> <span class="hljs-literal">true</span>;  <span class="hljs-built_in">context</span>.<span class="hljs-built_in">save</span>();  const <span class="hljs-built_in">scale</span> = getScale(progress);  const translateX = getTranslateX(progress);  const translateY = getTranslateY(progress);  <span class="hljs-built_in">context</span>.<span class="hljs-built_in">translate</span>(translateX, translateY);  <span class="hljs-built_in">context</span>.<span class="hljs-built_in">scale</span>(<span class="hljs-built_in">scale</span>, <span class="hljs-built_in">scale</span>);  <span class="hljs-built_in">context</span>.globalAlpha = getAlpha(progress);  <span class="hljs-built_in">context</span>.drawImage(    this.img!,    SOURCE_IMAGE_WIDTH * curImgIndex,    <span class="hljs-number">0</span>,    SOURCE_IMAGE_WIDTH,    SOURCE_IMAGE_WIDTH,    -newWidth / <span class="hljs-number">2</span>,    -newWidth / <span class="hljs-number">2</span>,    newWidth,    newWidth,  );  <span class="hljs-built_in">context</span>.restore();  <span class="hljs-built_in">return</span> <span class="hljs-literal">false</span>;};
    </code></pre><h4 id="-3-6-3-"><strong>3.6.3 创建绘制实例</strong></h4>
    <p>我们用一个 start 函数来生成点赞动画，每当调用它时，都会创建一个 render 方法，并塞入一个 renderList。renderList 中存放的就是当前所有点赞图标的绘制任务。如下：</p>
    <pre><code>start = () =&gt; {  const render = <span class="hljs-keyword">this</span>.createRender();  const duration = random(<span class="hljs-number">2100</span>, <span class="hljs-number">2600</span>);  <span class="hljs-keyword">if</span> (!render) {    <span class="hljs-keyword">return</span>;  }  <span class="hljs-keyword">this</span>.renderList.push({    render,    duration,    timestamp: Date.now(),  });  <span class="hljs-keyword">if</span> (!<span class="hljs-keyword">this</span>.scanning) {    <span class="hljs-keyword">this</span>.scanning = <span class="hljs-literal">true</span>;    requestAnimationFrame(<span class="hljs-keyword">this</span>.scan);  }  <span class="hljs-keyword">return</span> <span class="hljs-keyword">this</span>;};
    </code></pre><h4 id="-3-6-4-"><strong>3.6.4 实时绘制</strong></h4>
    <p>知道了需要绘制哪些对象之后，就需要通过下面的 scan 方法，让 Canvas 在每一帧都去绘制内容。</p>
    <p>每次绘制分为这么几个过程：</p>
    <ol>
    <li><p>清空画布为透明。</p>
    </li>
    <li><p>从绘制列表中取出一个点赞图标的 render 方法，并调用它。</p>
    </li>
    <li><p>假如它返回了 true，代表点赞图标已经完整经历了整个动效的过程，需要将它从绘制列表中剔除出去。</p>
    </li>
    <li><p>重复 2、3 过程，直至列表中没有任务需要执行。</p>
    </li>
    <li><p>通过 <code>requestAnimationFrame</code> 调用 scan 方法自身，等待下一帧重新调用 scan 绘制内容。</p>
    </li>
    </ol>
    <pre><code>scan = () =&gt; {  <span class="hljs-keyword">this</span>.context.clearRect(<span class="hljs-number">0</span>, <span class="hljs-number">0</span>, <span class="hljs-keyword">this</span>.width, <span class="hljs-keyword">this</span>.height);  let index = <span class="hljs-number">0</span>;  let { length } = <span class="hljs-keyword">this</span>.renderList;  <span class="hljs-keyword">if</span> (length &gt; <span class="hljs-number">0</span>) {    requestAnimationFrame(<span class="hljs-keyword">this</span>.scan);    <span class="hljs-keyword">this</span>.scanning = <span class="hljs-literal">true</span>;  } <span class="hljs-keyword">else</span> {    <span class="hljs-keyword">this</span>.scanning = <span class="hljs-literal">false</span>;  }  <span class="hljs-keyword">while</span> (index &lt; length) {    const child = <span class="hljs-keyword">this</span>.renderList[index];    <span class="hljs-keyword">if</span> (!child || !child.render || child.render.call(<span class="hljs-literal">null</span>, (Date.now() - child.timestamp) / child.duration)) {      <span class="hljs-comment">// 结束了，删除该动画      this.renderList.splice(index, 1);      length--;    } else {      index++;    }  }};</span>
    </code></pre><h3 id="-3-7-"><strong>3.7 调用</strong></h3>
    <p>接下来我们只需要在点击的时候，调用一下 <code>start</code> 方法即可。</p>
    <pre><code>/** * 点击“喜欢” */const onClick = () =&gt; {  cacheRef.current.LikeAni?.start?.();};return (  <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">{cn(</span>'<span class="hljs-attr">like-wrap</span>', <span class="hljs-attr">className</span>)}&gt;</span>    <span class="hljs-tag">&lt;<span class="hljs-name">canvas</span> <span class="hljs-attr">id</span>=<span class="hljs-string">{CANVAS_ID}</span> <span class="hljs-attr">width</span>=<span class="hljs-string">{CANVAS_WIDTH}</span> <span class="hljs-attr">height</span>=<span class="hljs-string">{CANVAS_HEIGHT}</span> <span class="hljs-attr">class</span> /&gt;</span>    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">{cn(</span>'<span class="hljs-attr">like-icon-cnt</span>', <span class="hljs-attr">className</span>)} <span class="hljs-attr">onClick</span>=<span class="hljs-string">{onClick}</span>&gt;</span>      <span class="hljs-tag">&lt;<span class="hljs-name">i</span> <span class="hljs-attr">id</span>=<span class="hljs-string">"like-icon"</span> <span class="hljs-attr">class</span> /&gt;</span>    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>);
    </code></pre><p>在直播场景下，还有很多不同的触发方式。除了自己点击，我们还可以接受来自其他用户的反馈（网络请求）来触发 <code>start</code> 方法。或者根据在线人数，多次调用 <code>start</code> 方法来生成一定数量的点赞图标。</p>
    <h3 id="-3-8-"><strong>3.8 最终效果</strong></h3>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_gif/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3CnYP7LBJLR62gxgcnGSICWb4VWTXCy1PFJEvticiaLXO5TWh19eA5M2xZQ/640?wx_fmt=gif" alt=""></p>
    <p><strong>4. 性能比较</strong>  </p>
    <hr>
    <p>以下内容是在 MacBook Pro 16 的屏幕上测试的。</p>
    <h3 id="-4-1-frame-rendering-stats-"><strong>4.1 Frame Rendering Stats</strong></h3>
    <p>在 chrome devtools 中，有两个小功能可以来观察我们绘制的性能情况：</p>
    <ul>
    <li><p><strong>Paint flashing</strong>：可以高亮当前发生重绘的区域。</p>
    </li>
    <li><p><strong>Frame Rendering Stats</strong>，可以观察动画的 fps 和 GPU 使用情况。我们分别来看看 CSS 和 Canvas 两种实现方式的性能情况。</p>
    </li>
    </ul>
    <p>这两个功能，可以在 chrome devtools 中使用快捷键 Command + Shift + P，呼起命令搜索的 Panel 来搜索到。</p>
    <h4 id="-css-"><strong>CSS 性能</strong></h4>
    <p>我们可以看到高亮区域在频繁闪动，以及 GPU 内存的使用比率较高，这是因为 CSS 的实现方式是不断生成新的元素（并在随后销毁），会消耗更多的内存。</p>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_gif/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3Cn61PuKHuVcJY64I0ciaw5Yib7aKR0QeczWS6w7Vov2EtcKhruOHEXIuAw/640?wx_fmt=gif" alt=""></p>
    <h4 id="-canvas-"><strong>Canvas 性能</strong></h4>
    <p>相反，Canvas 是集中在画布上绘制并输出的，不会反复创建和销毁元素。会比 CSS 的实现更加流畅，性能更好一点。</p>
    <p>除了流畅以外，Canvas 还能够放大画布和画布元素，这也是一个非常重要的优势。这意味着 Canvas 能够绘制出更清晰的内容，生成出来的点赞图标更加细腻。</p>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_gif/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3CneXgmLZDgbvcd17KZ2etPibicNN9GTMoSaib6cFxiaHuCRAlrB4tkvuibrLw/640?wx_fmt=gif" alt=""></p>
    <h3 id="-4-2-performance-"><strong>4.2 Performance</strong></h3>
    <p>在 chrome devtools 中切换到 Performance 面板，还可以观察动画绘制过程中，页面的一些性能指标。</p>
    <h4 id="-css-"><strong>CSS 性能</strong></h4>
    <p>CSS 的实现之所以看起比较卡顿，主要是因为绘制任务太频繁。</p>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_png/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3CnUB3NiciafG8nmTuKibbRQ4OKZVeJicHbvMxclwKsmicZ6k6jQwumiaFCb9Wg/640?wx_fmt=png" alt=""></p>
    <p>具体到每一帧，我们可以观察到 LayoutShift 的警告。  </p>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_png/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3Cnh2hVHf4azOrrBKM4A1mHibNyeGI0x6ad3ze5OtdPuPBZuBQ5ogzfYaw/640?wx_fmt=png" alt=""></p>
    <p>每次可视元素在两次渲染帧中的起始位置不同时，就说是发生了 LS（Layout Shift）。<strong>改变了起始位置的元素被认为是不稳定元素</strong>。  </p>
    <h4 id="-canvas-"><strong>Canvas 性能</strong></h4>
    <p>Canvas 实现的性能情况看起来就比较正常，即使绘制清晰一些的图片也不在话下。</p>
    <p><img src="https://mmbiz.qpic.cn/mmbiz_png/xsw6Lt5pDCvGbVh9zOW0l3yibU3vLq3CnKibqyoXGwzYP3IPzDj3bfosticSBNhal4Nr1rrz5HjibvRDqsJ1kHT5iag/640?wx_fmt=png" alt=""></p>    <p><strong>5. 相关</strong>  </p>    <hr>    <p>实现参考：<a href="https://github.com/antiter/praise-animation">https://github.com/antiter/praise-animation</a></p>
    <p>公众号</p></sr-read-content>
    `
  }
}).then(function (result) {
  console.log("测试20220118-4:", result);
});