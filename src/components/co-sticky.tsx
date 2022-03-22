import {
  computed,
  CSSProperties,
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  reactive,
  ref,
} from "vue";
import { useClinetRect } from "@/utils/useUtils";

const stickyProps = {
  container: Object as PropType<Element>,
  styleInfo: Object,
};

export default defineComponent({
  name: "coSticky",

  props: stickyProps,

  setup(props, { slots }) {
    const root = ref<HTMLElement | null>(null);
    const state = reactive({
      fixed: false,
      width: 0,
    });

    const onScroll = () => {
      if (!root.value) return false;

      const rootClinetRect = useClinetRect(root);

      state.fixed = rootClinetRect.top < 0;

      if (state.fixed) {
        state.width = rootClinetRect.width;
      }
    };

    onMounted(() => {
      window.addEventListener("scroll", onScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", onScroll);
    });
    const stickyStyle = computed<CSSProperties | undefined>((): any => {
      if (state.fixed) {
        return { position: "fixed", width: state.width + 'px' };
      }
    });

    return () => (
      <div ref={root} style="height: 48px">
        <div class="stickyClass" style={stickyStyle.value}>
          {slots.default?.()}
        </div>
      </div>
    );
  },
});
