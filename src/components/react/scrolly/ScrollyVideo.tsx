import {
  forwardRef,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
} from "react";
import ScrollyVideo from "./ScrollyVideo.ts";

type ScrollVideoProps = {
  src: string;
  transitionSpeed?: number;
  frameThreshold?: number;
  cover?: boolean;
  sticky?: boolean;
  full?: boolean;
  trackScroll?: boolean;
  lockScroll?: boolean;
  useWebCodecs?: boolean;
  videoPercentage?: number;
  debug?: boolean;
  onReady?: () => void;
  onChange?: (percentage: number) => void;
};

type SetVideoPercentageHandle = {
  setVideoPercentage: (percentage: number) => void;
};

const ScrollyVideoComponent = forwardRef<
  SetVideoPercentageHandle,
  ScrollVideoProps
>(function ScrollyVideoComponent(
  {
    src,
    transitionSpeed,
    frameThreshold,
    cover,
    sticky,
    full,
    trackScroll,
    lockScroll,
    useWebCodecs,
    videoPercentage,
    debug,
    onReady,
    onChange,
  },
  ref,
) {
  const containerElement = useRef(null);
  const scrollyVideoRef = useRef<ScrollyVideo | null>(null);
  const [instance, setInstance] = useState<ScrollyVideo | null>(null);

  const videoPercentageRef = useRef(videoPercentage);
  videoPercentageRef.current = videoPercentage;

  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // effect for destroy and recreate on props change (except video percentage)
  useEffect(() => {
    if (!containerElement.current) return;

    // if scrollyVideo already exists and any parameter is updated, destroy and recreate.
    if (scrollyVideoRef.current && scrollyVideoRef.current.destroy) {
      scrollyVideoRef.current.destroy();
    }

    const scrollyVideo = new ScrollyVideo({
      scrollyVideoContainer: containerElement.current,
      src,
      transitionSpeed,
      frameThreshold,
      cover,
      sticky,
      full,
      trackScroll,
      lockScroll,
      useWebCodecs,
      debug,
      onReady: onReadyRef.current,
      onChange: onChangeRef.current,
      // videoPercentage: videoPercentageRef.current,
    });

    setInstance(scrollyVideo);
    scrollyVideoRef.current = scrollyVideo;
  }, [
    src,
    transitionSpeed,
    frameThreshold,
    cover,
    sticky,
    full,
    trackScroll,
    lockScroll,
    useWebCodecs,
    debug,
  ]);

  // effect for video percentage change
  useEffect(() => {
    // If we need to update the target time percent
    if (
      scrollyVideoRef.current &&
      typeof videoPercentage === "number" &&
      videoPercentage >= 0 &&
      videoPercentage <= 1
    ) {
      scrollyVideoRef.current.setVideoPercentage(videoPercentage);
    }
  }, [videoPercentage]);

  // effect for unmount
  useEffect(
    () => () => {
      if (scrollyVideoRef.current && scrollyVideoRef.current.destroy) {
        scrollyVideoRef.current.destroy();
      }
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      setVideoPercentage: scrollyVideoRef.current
        ? scrollyVideoRef.current.setVideoPercentage.bind(instance)
        : () => {},
    }),
    [instance],
  );

  return <div ref={containerElement} data-scrolly-container />;
});

export default ScrollyVideoComponent;
