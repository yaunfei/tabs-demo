import { defineComponent } from "vue";
import { useId, useParent } from "@/utils/useUtils";

const tabProps = {
  title: String,
};

export default defineComponent({
  name: "co-tab",

  props: tabProps,

  setup(props, { slots }) {
    useParent("TABS_KEY");
    const id = useId();

    return () => <div id={id}>{slots.default?.()}</div>;
  },
});
