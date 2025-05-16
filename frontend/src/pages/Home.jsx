import React from "react";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import Cities from "../components/Cities";
import CTA from "../components/CTA";
import useScrollToTop from "../hooks/useScrollToTop";

const Home = () => {
  useScrollToTop();
  return (
    <>
      <Hero />
      <Feature />
      <Cities />
      <CTA />
    </>
  );
};

export default Home;
