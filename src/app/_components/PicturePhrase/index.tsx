"use client";
import { useState } from "react";
import html2canvas from "html2canvas";
import { removeBackground } from "@imgly/background-removal";
import Image from "next/image";

export default function PicturePhrase() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [text, setText] = useState("Your Text Here");
  const [textSettings, setTextSettings] = useState({
    size: 30,
    color: "#FFFFFF",
    top: 50,
    left: 50,
  });
  const [imageDimensions, setImageDimensions] = useState({
    width: 600,
    height: 400,
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);

      const img = new window.Image();
      img.src = imageUrl;
      img.onload = async () => {
        setImageDimensions({ width: img.width, height: img.height });
        await setupImage(imageUrl);
      };
    }
  };

  const setupImage = async (imageUrl) => {
    try {
      const imageBlob = await removeBackground(imageUrl);
      const url = URL.createObjectURL(imageBlob);
      setProcessedImage(url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTextSettingChange = (field, value) => {
    setTextSettings({ ...textSettings, [field]: value });
  };

  // const handleDownload = async () => {
  //   const offscreenCanvas = document.createElement("canvas");
  //   offscreenCanvas.width = imageDimensions.width;
  //   offscreenCanvas.height = imageDimensions.height;
  //   const ctx = offscreenCanvas.getContext("2d");

  //   const originalImageElement = new window.Image();
  //   originalImageElement.src = originalImage;

  //   originalImageElement.onload = () => {
  //     // Draw the original image first (bottom layer)
  //     ctx.drawImage(
  //       originalImageElement,
  //       0,
  //       0,
  //       imageDimensions.width,
  //       imageDimensions.height,
  //     );

  //     // Add text on top of original image (middle layer)
  //     ctx.font = `${textSettings.size}px Arial`;
  //     ctx.fillStyle = textSettings.color;
  //     ctx.textAlign = "center";
  //     ctx.fillText(
  //       text,
  //       (textSettings.left / 100) * imageDimensions.width,
  //       (textSettings.top / 100) * imageDimensions.height,
  //     );

  //     // If processed image exists, draw it last (top layer)
  //     if (processedImage) {
  //       const processedImageElement = new window.Image();
  //       processedImageElement.src = processedImage;
  //       processedImageElement.onload = () => {
  //         ctx.drawImage(
  //           processedImageElement,
  //           0,
  //           0,
  //           imageDimensions.width,
  //           imageDimensions.height,
  //         );

  //         // Create download link
  //         const link = document.createElement("a");
  //         link.href = offscreenCanvas.toDataURL("image/png");
  //         link.download = "customized-image.png";
  //         link.click();
  //       };
  //     } else {
  //       // Create download link if no processed image
  //       const link = document.createElement("a");
  //       link.href = offscreenCanvas.toDataURL("image/png");
  //       link.download = "customized-image.png";
  //       link.click();
  //     }
  //   };
  // };

  const handleDownload = async () => {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = imageDimensions.width;
    offscreenCanvas.height = imageDimensions.height;
    const ctx = offscreenCanvas.getContext("2d");

    const originalImageElement = new window.Image();
    originalImageElement.src = originalImage;

    originalImageElement.onload = () => {
      // Draw the original image first (bottom layer)
      ctx.drawImage(
        originalImageElement,
        0,
        0,
        imageDimensions.width,
        imageDimensions.height,
      );

      // Precise text positioning calculations
      const xPosition = (imageDimensions.width * textSettings.left) / 100;
      const yPosition = (imageDimensions.height * textSettings.top) / 100;

      // Add text on top of original image (middle layer)
      ctx.font = `${textSettings.size}px Arial`;
      ctx.fillStyle = textSettings.color;
      ctx.textBaseline = "middle"; // Align vertically
      ctx.textAlign = "center"; // Align horizontally

      // Measure text width to center precisely
      const textWidth = ctx.measureText(text).width;

      ctx.fillText(text, xPosition, yPosition);

      // If processed image exists, draw it last (top layer)
      if (processedImage) {
        const processedImageElement = new window.Image();
        processedImageElement.src = processedImage;
        processedImageElement.onload = () => {
          ctx.drawImage(
            processedImageElement,
            0,
            0,
            imageDimensions.width,
            imageDimensions.height,
          );

          // Create download link
          const link = document.createElement("a");
          link.href = offscreenCanvas.toDataURL("image/png");
          link.download = "customized-image.png";
          link.click();
        };
      } else {
        // Create download link if no processed image
        const link = document.createElement("a");
        link.href = offscreenCanvas.toDataURL("image/png");
        link.download = "customized-image.png";
        link.click();
      }
    };
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="mb-6 text-3xl font-semibold">
        PicturePhrase - Text Behind Image
      </h1>

      <div className="flex w-full max-w-6xl gap-10">
        <div
          id="preview"
          className="relative overflow-hidden border border-gray-300 bg-gray-100"
          style={{
            width: "600px", // Keeps preview at a consistent size
            height: "400px",
          }}
        >
          {originalImage && (
            <Image
              src={originalImage}
              alt="Original"
              className="absolute left-0 top-0 z-0 object-contain"
              style={{ opacity: 1 }}
              fill
            />
          )}
          <div
            style={{
              top: `${textSettings.top}%`,
              left: `${textSettings.left}%`,
              fontSize: `${textSettings.size}px`,
              color: textSettings.color,
            }}
            className="absolute z-0 -translate-x-1/2 -translate-y-1/2 transform whitespace-pre-wrap text-center"
          >
            {text}
          </div>
          {processedImage && (
            <Image
              src={processedImage}
              alt="Subject with Background Removed"
              className="absolute left-0 top-0 z-10 object-contain"
              style={{ opacity: 1 }}
              fill
            />
          )}
        </div>

        <div className="flex w-2/5 flex-col gap-4">
          <label className="font-semibold">Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="mt-2 block w-full rounded border p-2"
          />
          <label className="font-semibold">Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-2 block h-20 w-full resize-none rounded border p-2"
          />
          <label className="font-semibold">Font Size</label>
          <input
            type="range"
            min={10}
            max={500}
            step={1}
            value={textSettings.size}
            onChange={(e) => handleTextSettingChange("size", e.target.value)}
            className="mt-2 w-full"
          />
          <label className="font-semibold">Font Color</label>
          <input
            type="color"
            value={textSettings.color}
            onChange={(e) => handleTextSettingChange("color", e.target.value)}
            className="mt-2 block w-12 border p-[2px]"
          />
          <label className="font-semibold">Position Top (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={textSettings.top}
            onChange={(e) => handleTextSettingChange("top", e.target.value)}
            className="mt-2 w-full"
          />
          <label className="font-semibold">Position Left (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={textSettings.left}
            onChange={(e) => handleTextSettingChange("left", e.target.value)}
            className="mt-2 w-full"
          />
          <button
            onClick={handleDownload}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white shadow"
          >
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
}
