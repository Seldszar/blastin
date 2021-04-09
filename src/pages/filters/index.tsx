import { useRouter } from "next/router";
import { useEffect } from "react";

import { LayoutPage } from "@/types";
import { useStore } from "@/stores";

const FilterIndexPage: LayoutPage = () => {
  const router = useRouter();
  const store = useStore();

  useEffect(() => {
    router.push("/filters/[id]", `/filters/${store.filters[0].id}`);
  });

  return null;
};

export default FilterIndexPage;
