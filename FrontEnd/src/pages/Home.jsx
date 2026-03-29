import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import JobSearchPage from "../components/JobSearchPage";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <JobSearchPage />
    </div>
  );
}

export default Home;
