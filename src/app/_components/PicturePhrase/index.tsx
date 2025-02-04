"use client";
import { useState } from "react";
import html2canvas from "html2canvas";
import { removeBackground } from "@imgly/background-removal";
import Image from "next/image";

import {
  Merriweather,
  Pacifico,
  Abril_Fatface,
  Permanent_Marker,
  Caveat,
  Shadows_Into_Light,
  Comfortaa,
  Lobster,
  Indie_Flower,
  Righteous,
  Bebas_Neue,
  Great_Vibes,
  Press_Start_2P,
  Fredoka,
  Sacramento,
  Inter,
  Roboto,
  Playfair_Display,
  Oswald,
  Dancing_Script,
} from "next/font/google";

// Initialize fonts
const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });
const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });
const abrilFatface = Abril_Fatface({ weight: "400", subsets: ["latin"] });
const permanentMarker = Permanent_Marker({ weight: "400", subsets: ["latin"] });
const caveat = Caveat({ subsets: ["latin"] });
const shadowsIntoLight = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
});
const comfortaa = Comfortaa({ subsets: ["latin"] });
const lobster = Lobster({ weight: "400", subsets: ["latin"] });
const indieFlower = Indie_Flower({ weight: "400", subsets: ["latin"] });
const righteous = Righteous({ weight: "400", subsets: ["latin"] });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });
const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"] });
const fredoka = Fredoka({ subsets: ["latin"] });
const sacramento = Sacramento({ weight: "400", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });
const oswald = Oswald({ subsets: ["latin"] });
const dancingScript = Dancing_Script({ subsets: ["latin"] });

const fontOptions = [
  { name: "Merriweather", font: merriweather }, // Elegant serif
  { name: "Pacifico", font: pacifico }, // Playful script
  { name: "Abril Fatface", font: abrilFatface }, // Bold display
  { name: "Permanent Marker", font: permanentMarker }, // Marker/handwritten
  { name: "Caveat", font: caveat }, // Casual handwriting
  { name: "Shadows Into Light", font: shadowsIntoLight }, // Light handwriting
  { name: "Comfortaa", font: comfortaa }, // Round geometric
  { name: "Lobster", font: lobster }, // Thick script
  { name: "Indie Flower", font: indieFlower }, // Casual handwritten
  { name: "Righteous", font: righteous }, // Retro futuristic
  { name: "Bebas Neue", font: bebasNeue }, // Tall condensed
  { name: "Great Vibes", font: greatVibes }, // Elegant script
  { name: "Press Start 2P", font: pressStart2P }, // 8-bit pixel
  { name: "Fredoka", font: fredoka }, // Friendly rounded
  { name: "Sacramento", font: sacramento }, // Delicate script
  { name: "Inter", font: inter },
  { name: "Roboto", font: roboto },
  { name: "Playfair Display", font: playfair },
  { name: "Oswald", font: oswald },
  { name: "Dancing Script", font: dancingScript },
];

export default function PicturePhrase() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [text, setText] = useState("Your Text Here");
  const [textSettings, setTextSettings] = useState({
    size: 30,
    color: "#FFFFFF",
    top: 50,
    left: 50,
    opacity: 100, // Add opacity setting
    fontFamily: fontOptions[0]!.name,
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

  const handleDownload = async () => {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = imageDimensions.width;
    offscreenCanvas.height = imageDimensions.height;
    const ctx = offscreenCanvas.getContext("2d");

    const previewElement = document.getElementById("preview");
    const previewWidth = previewElement.offsetWidth;
    const previewHeight = previewElement.offsetHeight;

    const scaleFactor = Math.max(
      imageDimensions.width / previewWidth,
      imageDimensions.height / previewHeight,
    );

    const originalImageElement = new window.Image();
    originalImageElement.src = originalImage;

    originalImageElement.onload = async () => {
      ctx.drawImage(
        originalImageElement,
        0,
        0,
        imageDimensions.width,
        imageDimensions.height,
      );

      const scaledFontSize = textSettings.size * scaleFactor;

      // Update font string to include the selected font family
      const selectedFont = fontOptions.find(
        (f) => f.name === textSettings.fontFamily,
      );
      const fontFamily = selectedFont.font.style.fontFamily;

      ctx.font = `${scaledFontSize}px ${selectedFont ? fontFamily : "Arial"}`;
      ctx.fillStyle = textSettings.color;
      ctx.globalAlpha = textSettings.opacity / 100; // Add opacity to canvas
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      const xPosition = (imageDimensions.width * textSettings.left) / 100;
      const yPosition = (imageDimensions.height * textSettings.top) / 100;

      ctx.fillText(text, xPosition, yPosition);
      ctx.globalAlpha = 1; // Reset opacity for next draw

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

          const link = document.createElement("a");
          link.href = offscreenCanvas.toDataURL("image/png");
          link.download = "customized-image.png";
          link.click();
        };
      } else {
        const link = document.createElement("a");
        link.href = offscreenCanvas.toDataURL("image/png");
        link.download = "customized-image.png";
        link.click();
      }
    };
  };

  const resetValues = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setText("Your Text Here");
    setTextSettings({
      size: 30,
      color: "#FFFFFF",
      top: 50,
      left: 50,
      opacity: 100,
      fontFamily: fontOptions[0]!.name,
    });
  };

  // Get the current font object for the text preview
  const currentFont =
    fontOptions.find((f) => f.name === textSettings.fontFamily)?.font || inter;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="mb-6 rounded-lg bg-black px-4 py-2 text-3xl font-semibold text-white">
        Picture Phrase - Text Behind Image
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
              opacity: textSettings.opacity / 100,
              fontFamily: currentFont.style.fontFamily,
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
            accept=".jpg, .jpeg, .png"
            onChange={(e) => {
              resetValues();
              handleImageUpload(e);
            }}
            className="mt-2 block w-full rounded border p-2"
          />
          <label className="font-semibold">Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-2 block h-20 w-full resize-none rounded border p-2"
          />
          <label className="font-semibold">Font Family</label>
          <select
            value={textSettings.fontFamily}
            onChange={(e) =>
              handleTextSettingChange("fontFamily", e.target.value)
            }
            className="mt-2 block w-full rounded border p-2"
          >
            {fontOptions.map((font) => (
              <option
                key={font.name}
                value={font.name}
                style={{ fontFamily: font.font.style.fontFamily }}
              >
                {font.name}
              </option>
            ))}
          </select>
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
          <label className="font-semibold">Text Opacity (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={textSettings.opacity}
            onChange={(e) => handleTextSettingChange("opacity", e.target.value)}
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
