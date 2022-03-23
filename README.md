## 介绍
### 1.功能

标签滚动导航。效果如下：

    1.导航栏到顶部时，会吸顶。
    2.点击导航栏的标签，滚动导航到对应内容。
    3.滚动内容，导航栏滑动到对应标签。

![Doraemon.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/980c45704d2c443c9c98c61eee6b48d9~tplv-k3u1fbpfcp-watermark.image?)

### 2.思路

分为3步，吸顶，导航栏，页面滚动。具体如下：

    1.吸顶功能。
    2.点击导航栏的标签。
      (1).页面内容滚动到指定为位置。
      (2).滑动标签下面的下划线，修改标签字体样式。
    3.滑动页面，导航栏的标签下划线滑动，修改标签字体样式。
    
### 3.实现

#### 1.吸顶

核心：标签栏到视口的顶部的距离小于0时，设置`position:fixed`。使用`$el.getBoundingClientRect().top`获取到视口顶部距离。

#### 2.点击导航栏的标签

1.设置下划线，获取点击标签的`dom`元素，计算移动的下标的距离。

```js
 // 计算到 下划线滚地的位置,nav就是点击标签的dom
const left = nav.offsetLeft + nav.offsetWidth / 2;
state.lineStyle = {
  transform: `translateX(${left}px) translateX(-50%)`,
};
// 初始化时，不执行动画；因为会从0 移动到指定位置，难看
if (!init) {
    state.lineStyle.transitionDuration = "0.5s";
}
```

2.页面滚动到指定位置。获取需要滚动到内容的`dom`元素。

```js
// 设置页面到指定位置
const scrolltoCurrContent = () => {
  // target 就是需要滚动的内容的dom
  const target = children[state.currIndex].$el;
  const el = document.documentElement || document.body;
  if (target) {
    // 点击时，锁定防止页面滚动影响下划线
    lockScroll = true;
    // 获取当前元素的Y轴位置，到视口顶部距离top + 卷起来的高度 - tabBar的高度
    const to = useClinetRect(target).top + getScrollTop(el) - tabHeight;
    // 滚动方法
    scrollTopTo(to, () => {
      lockScroll = false; // 滚动到指定位置时，解锁
    });
  }
};

// 滚动到指定位置
const scrollTopTo = (to: number, callback: () => void) => {

  window.scrollTo({
    top: to,
    behavior: "smooth",
  });

  // 滚动到指定位置，调用回掉函数
  window.onscroll = () => {
    
    const el = document.documentElement || document.body;

    // 滑动到指定位置 或 元素滚动是否到底：元素全部内容高度 - 滚动上去的高度 = 可视区域高度
    if (to === el.scrollTop || el.scrollHeight - el.scrollTop === el.clientHeight) {
      callback();
    }
  };
};
```
`scrollTopTo`核心，滚动到指定位置时，打开调用回掉函数`callback`打开`lockScroll=false`

#### 3.滚动页面

1.移动导航栏的下标（在`lockScroll===true`时执行）
```js
// 滚动页面
const onScroll = () => {
  if (!lockScroll) {
    const index = getCurrIndexOnScroll();
    state.currIndex = index;
    setLine();
  }
};
```

2.获取当前内容的`index`。通过获取所有内容的`dom`，遍历获取视口顶部距离，当`top < 导航栏的高度时`返回`index`
```js
// 获取滚动位置的下标
const getCurrIndexOnScroll = () => {
  // children获取内容dom,useClinetRect获取到视口顶部距离
  for (let index = 0; index < children.length; index++) {
    const { top } = useClinetRect(children[index].$el);
    if (top > tabHeight) {
      return index === 0 ? 0 : index - 1;
    }
  }
  return children.length - 1;
};
```


### Project setup
```
pnpm install
```

### Compiles and hot-reloads for development
```
pnpm run serve
```

### Compiles and minifies for production
```
pnpm run build
```

    

