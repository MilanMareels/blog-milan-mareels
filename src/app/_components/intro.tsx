export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">Blog.</h1>

      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        A personal blog by{" "}
        <a href="https://milanmareels.be" className="underline hover:text-blue-600 duration-200 transition-colors">
          Milan Mareels
        </a>
        . Here I share my projects, insights, and my unvarnished opinions on tech.{" "}
      </h4>
    </section>
  );
}
export default Intro;
