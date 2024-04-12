import ObjectDetection from "../../components/ObjectDetection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen p-8 items-center">
      <h1 className="gradient-text font-extrabold text-3xl md:text-6xl lg:text-8xl tracking-tighter md:px-6  text-center">Thief Detection Alarm</h1>
      <ObjectDetection />
    </main>
  );
}
