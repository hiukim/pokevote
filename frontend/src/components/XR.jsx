import React from "react";
import { useExternalScript } from "../hooks/use-external-script";

const model1 = new URL('../assets/bulbasaur.glb', import.meta.url).href;
const model2 = new URL('../assets/magikarp.glb', import.meta.url).href;
const model3 = new URL('../assets/minccino.glb', import.meta.url).href;
const modelURLs = [model1, model2, model3];

export const XR = () => {
  const scriptState = useExternalScript("https://ajax.googleapis.com/ajax/libs/model-viewer/3.0.1/model-viewer.min.js");

  const searchParams = new URLSearchParams(window.location.search);
  const modelId = searchParams.get("id");

  if (scriptState != "ready") {
    return <div>Loading...</div>
  }

  const modelURL = modelURLs[modelId];
  const scale = 0.5;

  return (
    <div style={{width: "100vw", height: "80vh"}}>
      <model-viewer
          style={{width: "100%", height: "100%"}}
          ar
          autoplay
          scale={scale+" "+scale+" "+scale}
          camera-controls
          touch-action="pan-y"
          src={modelURL}
      >
      </model-viewer>
    </div>
  )
}

export default XR;
