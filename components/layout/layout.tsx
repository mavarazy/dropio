import React, { ReactElement } from "react";
import { Navigation } from "./navigation";
import { Footer } from "./footer";

export const Layout = ({
  children,
}: {
  children: JSX.Element;
}): ReactElement => (
  <div className="flex flex-col min-h-screen">
    <Navigation />
    {children}
    <Footer />
  </div>
);
