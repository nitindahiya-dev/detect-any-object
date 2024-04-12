"use client";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocossdload } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

export default function ObjectDetection() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  let detectInterval;

  const runCoco = async () => {
    setIsLoading(true);
    await tf.ready(); // Ensure TensorFlow.js is loaded
    const net = await cocossdload();
    setIsLoading(false);
    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 10);
  };

  const runObjectDetection = async (net) => {
    if (canvasRef.current && webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      canvasRef.current.width = myVideoWidth;
      canvasRef.current.height = myVideoHeight;

      const detectedObjects = await net.detect(webcamRef.current.video);

      const context = canvasRef.current.getContext('2d');
      renderPredictions(detectedObjects, context);
    }
  };

  const renderPredictions = (predictions, context) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    // Font options.
    const font = '16px sans-serif black';
    context.font = font;
    context.textBaseline = 'top';
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      context.strokeStyle = '#000';
      context.lineWidth = 2;
      context.strokeRect(x, y, width, height);
      // Draw the label background.
      context.fillStyle = '#fff';
      const textWidth = context.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      context.fillRect(x, y, textWidth + 4, textHeight + 4);
    });
  };

  const showMyVideo = () => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };

  useEffect(() => {
    runCoco();
    showMyVideo();
    return () => clearInterval(detectInterval);
  }, []);

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="gradient-text">loading AI Modal</div>
      ) : (
        <div className="flex gradient justify-between relative items-center p-1.5 rounded-md">
          <Webcam ref={webcamRef} className="rounded-md w-full lg:h-[500px]" muted />
          <canvas ref={canvasRef} className="absolute top-0 left-0 z-9999 w-full lg:h-[500px]" />
        </div>
      )}
    </div>
  );
}
