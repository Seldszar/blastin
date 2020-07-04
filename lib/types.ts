import { NextPage } from "next";
import { ReactNode } from "react";

export type LayoutPage<P = unknown, IP = P> = NextPage<P, IP> & {
  Layout?: ReactNode;
};
