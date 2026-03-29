import hero from "../assets/Screenshot 2026-03-12 125930.jpg";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">


        {/* Right Image */}
        <div className="flex justify-center mt-10 md:mt-0 w-full">
          <div className="relative w-full">
            <img
              src={hero}
              alt="hero"
              className="w-full h-auto object-cover rounded-lg"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/45 via-white/20 to-transparent rounded-b-lg" />
          </div>
        </div>


    </section>
  );
}

export default Hero;
