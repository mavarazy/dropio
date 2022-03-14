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
    <main className="flex flex-1">
      <div className="flex flex-1 flex-col max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
    <Footer />
  </div>
);
