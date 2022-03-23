import {
  CSSProperties,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import Sticky from "@/components/co-sticky";
import {
  useChildren,
  useRefs,
  useClinetRect,
  getScrollTop,
  scrollTopTo,
} from "@/utils/useUtils";
import "@/styles/tabs.less";

const tabsProps = {};

export default defineComponent({
  name: "co-tabs",

  props: tabsProps,

  setup(props, { slots }) {
    const wrapRef = ref<HTMLElement>();

    const state = reactive({
      currIndex: 0,
      lineStyle: {} as CSSProperties,
    });

    let tabHeight: number;
    let lockScroll: boolean;

    const [navRefs, setNavRefs] = useRefs();

    const { children, linkChildren } = useChildren("TABS_KEY");

    linkChildren();

    // #region 处理headerNav
    // 处理tabnav
    const renderNav = () =>
      children.map((item: any, index: number) => (
        <span
          ref={setNavRefs(index)}
          onClick={() => onClickNav(item, index)}
          onKeydown={() => onClickNav(item, index)}
          role="presentation"
          style={{ color: index === state.currIndex ? "#000" : "" }}
          class="navContent"
        >
          {item.title}
        </span>
      ));

    // 处理tabHeader
    const renderHeader = () => (
      <div ref={wrapRef} class="navStyle">
        {renderNav()}
        <div style={state.lineStyle} class="navLine"></div>
      </div>
    );

    // 设置下划线
    const setLine = (init?: boolean) => {
      nextTick(async () => {
        const navs = navRefs.value;
        const nav = navs[state.currIndex];
        // 计算到 下划线滚地的位置
        const left = nav.offsetLeft + nav.offsetWidth / 2;
        state.lineStyle = {
          transform: `translateX(${left}px) translateX(-50%)`,
        };
        // 初始化时，不执行动画；因为会从0 移动到指定位置，难看
        if (!init) {
            state.lineStyle.transitionDuration = "0.5s";
        }
      });
    };

    // 点击nav
    const onClickNav = (item: any, index: number) => {
      state.currIndex = index;
      setLine();
      scrolltoCurrContent();
    };
    // #endregion

    // 设置页面到指定位置
    const scrolltoCurrContent = () => {
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

    // 获取滚动位置的下标
    const getCurrIndexOnScroll = () => {
      for (let index = 0; index < children.length; index++) {
        const { top } = useClinetRect(children[index].$el);
        if (top > tabHeight) {
          return index === 0 ? 0 : index - 1;
        }
      }
      return children.length - 1;
    };

    // 滚动页面
    const onScroll = () => {
      if (!lockScroll) {
        const index = getCurrIndexOnScroll();
        state.currIndex = index;
        setLine();
      }
    };

    onMounted(() => {
      setLine(true);
      tabHeight = useClinetRect(wrapRef.value).height;
      window.addEventListener("scroll", onScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", onScroll);
    });

    return () => (
      <div>
        <Sticky>{renderHeader}</Sticky>
        <div>{slots.default?.()}</div>
      </div>
    );
  },
});
