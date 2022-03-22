import {
  getCurrentInstance,
  inject,
  onBeforeUpdate,
  provide,
  reactive,
  ref,
  unref,
} from "vue";

let current = 0;

// 生成随机id
const useId = (): string => {
  const instance = getCurrentInstance();
  const { name = "unknown" } = instance?.type || {};

  return `${name}-${++current}`;
};

// 获取当前dom的ref
const useRefs = () => {
  const refs = ref([]) as any;
  onBeforeUpdate(() => {
    refs.value = [];
  });

  const setRefs = (index: number) => (el: any) => {
    refs.value[index] = el;
  };

  return [refs, setRefs] as const;
};

// 获取当前dom的clineRect
const useClinetRect = (elementInfo: any) => {
  const element = unref(elementInfo);
  // eslint-disable-next-line no-void
  if (element == null ? void 0 : element.getBoundingClientRect()) {
    return element?.getBoundingClientRect();
  }
};

// 使用inject
const useParent = (key: string) => {
  const parnet: any = inject(key);
  if (parnet) {
    const instance = getCurrentInstance();
    const { link } = parnet;
    link(instance);
  }
};

// 使用privide
const useChildren = (key: string) => {
  const publicChildren = reactive([] as any);
  const linkChildren = () => {
    const link = (child: any) => {
      child.proxy && publicChildren.push(child.proxy);
    };
    provide(key, {
      link,
      children: publicChildren,
    });
  };
  return {
    children: publicChildren,
    linkChildren,
  };
};

// 获取scrollTop
const getScrollTop = (el: any): number => {
  const top = "scrollTop" in el ? el.scrollTop : el.pageYOffset;
  return Math.max(top, 0);
};

// // 滚动到指定位置
const scrollTopTo = (to: number, tabHeight: any, callback: () => void) => {

  window.scrollTo({
    top: to,
    behavior: 'smooth',
  });

  // 滚动到指定位置，调用回掉函数
  window.onscroll= () => {
    const target = window.pageYOffset;
    if (to === target) {
      callback();
    }
  }
};

export {
  useId,
  useParent,
  useChildren,
  useRefs,
  useClinetRect,
  getScrollTop,
  scrollTopTo,
};
