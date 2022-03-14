import React from "react";
import type { NextPage } from "next";
import { LandingHero } from "../components/landing-hero";

const Home: NextPage = () => {
  return (
    <main className="flex flex-1 flex-col">
      <LandingHero />
    </main>
  );
};

export default Home;
