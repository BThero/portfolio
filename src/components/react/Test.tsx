import { useRef } from "react";
import ScrollyVideo from "./scrolly/ScrollyVideo.tsx";
import video from "../../../public/video.mp4";

export const Test = () => {
  const ref = useRef<HTMLElement>(null);
  return (
    <main className="relative h-[8000px]" ref={ref}>
      <ScrollyVideo
        src={video}
        // videoPercentage={scrollYProgress.get() / 100}
      />
      <div>
        <header className="flex h-20">Yo dude this is great</header>
      </div>
    </main>
  );
};
