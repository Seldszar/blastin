import { LayoutPage } from "@/types";

import FilterDetails from "@/components/filter-details";
import DashboardLayout from "@/layouts/dashboard-layout";

const FilterPage: LayoutPage = () => <FilterDetails />;

FilterPage.Layout = DashboardLayout;

export default FilterPage;
