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
    <div className="flex flex-1 flex-col bg-yellow-50">
      <main className="flex flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
      <Footer />
    </div>
  </div>
);
