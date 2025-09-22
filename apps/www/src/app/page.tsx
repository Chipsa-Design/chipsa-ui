import MyImgSequence from "@/components/MyImgSequence";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl space-y-8">
        <h1 className="text-2xl font-semibold text-foreground text-center">
          ImgSequence Demo
        </h1>

        <div className="w-1/3 aspect-square">
          <MyImgSequence />
        </div>
      </main>
    </div>
  );
}
