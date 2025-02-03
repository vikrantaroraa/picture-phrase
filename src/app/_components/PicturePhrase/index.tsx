// "use client";
// import { useState } from "react";
// import html2canvas from "html2canvas";
// import { removeBackground } from "@imgly/background-removal";
// import Image from "next/image";

// export default function PicturePhrase() {
//   const [originalImage, setOriginalImage] = useState(null);
//   const [processedImage, setProcessedImage] = useState(null);
//   const [text, setText] = useState("Your Text Here");
//   const [textSettings, setTextSettings] = useState({
//     size: 30,
//     color: "#FFFFFF",
//     top: 50,
//     left: 50,
//   });
//   const [imageDimensions, setImageDimensions] = useState({
//     width: 600,
//     height: 400,
//   });

//   const previewWidth = 600; // Fixed preview width
//   const previewHeight = 400; // Fixed preview height

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setOriginalImage(imageUrl);

//       // Set up the image dimensions based on the uploaded image
//       const img = new window.Image();
//       img.src = imageUrl;
//       img.onload = async () => {
//         setImageDimensions({ width: img.width, height: img.height });
//         await setupImage(imageUrl);
//       };
//     }
//   };

//   const setupImage = async (imageUrl: string) => {
//     try {
//       const imageBlob = await removeBackground(imageUrl);
//       const url = URL.createObjectURL(imageBlob);
//       setProcessedImage(url);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleTextSettingChange = (field, value) => {
//     setTextSettings({ ...textSettings, [field]: value });
//   };

//   const handleDownload = async () => {
//     const offscreenCanvas = document.createElement("canvas");
//     offscreenCanvas.width = imageDimensions.width;
//     offscreenCanvas.height = imageDimensions.height;
//     const ctx = offscreenCanvas.getContext("2d");

//     const imageElement = new window.Image();
//     imageElement.src = originalImage;

//     imageElement.onload = () => {
//       // Draw the original image
//       ctx.drawImage(
//         imageElement,
//         0,
//         0,
//         imageDimensions.width,
//         imageDimensions.height,
//       );

//       // Calculate scale factors
//       const scaleX = imageDimensions.width / previewWidth;
//       const scaleY = imageDimensions.height / previewHeight;

//       // Draw the text on the image with scaling applied
//       ctx.font = `${textSettings.size * scaleX}px Arial`;
//       ctx.fillStyle = textSettings.color;
//       ctx.textAlign = "center";
//       ctx.fillText(
//         text,
//         (textSettings.left / 100) * imageDimensions.width,
//         (textSettings.top / 100) * imageDimensions.height,
//       );

//       // Convert canvas to an image and trigger download
//       const link = document.createElement("a");
//       link.href = offscreenCanvas.toDataURL("image/png");
//       link.download = "customized-image.png";
//       link.click();
//     };
//   };

//   return (
//     <div className="flex flex-col items-center p-6">
//       <h1 className="mb-6 text-3xl font-semibold">
//         PicturePhrase - Text Behind Image
//       </h1>

//       <div className="flex w-full max-w-6xl gap-10">
//         {/* Image Preview Section */}
//         <div
//           id="preview"
//           className="relative overflow-hidden border border-gray-300 bg-gray-100"
//           style={{
//             width: `${previewWidth}px`, // Fixed width for consistency
//             height: `${previewHeight}px`, // Fixed height for consistency
//           }}
//         >
//           {originalImage && (
//             <Image
//               src={originalImage}
//               alt="Original"
//               className="absolute left-0 top-0 z-0 object-contain"
//               style={{ opacity: 1 }}
//               fill
//             />
//           )}
//           {/* Text Layer - Behind Processed Image */}
//           <div
//             style={{
//               top: `${textSettings.top}%`,
//               left: `${textSettings.left}%`,
//               fontSize: `${textSettings.size}px`,
//               color: textSettings.color,
//             }}
//             className="absolute z-0 -translate-x-1/2 -translate-y-1/2 transform whitespace-pre-wrap text-center"
//           >
//             {text}
//           </div>
//           {/* Render Processed Image */}
//           {processedImage && (
//             <Image
//               src={processedImage}
//               alt="Subject with Background Removed"
//               className="absolute left-0 top-0 z-10 object-contain"
//               style={{ opacity: 1 }}
//               fill
//             />
//           )}
//         </div>

//         {/* Customization Panel */}
//         <div className="flex w-2/5 flex-col gap-4">
//           <div>
//             <label className="font-semibold">Upload Image</label>
//             <input
//               type="file"
//               onChange={handleImageUpload}
//               className="mt-2 block w-full rounded border p-2"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Text</label>
//             <textarea
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               className="mt-2 block h-20 w-full resize-none rounded border p-2"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Font Size</label>
//             <input
//               type="range"
//               min={10}
//               max={500}
//               step={1}
//               value={textSettings.size}
//               onChange={(e) => handleTextSettingChange("size", e.target.value)}
//               className="mt-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Font Color</label>
//             <input
//               type="color"
//               value={textSettings.color}
//               onChange={(e) => handleTextSettingChange("color", e.target.value)}
//               className="mt-2 block w-12 border p-[2px]"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Position Top (%)</label>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={textSettings.top}
//               onChange={(e) => handleTextSettingChange("top", e.target.value)}
//               className="mt-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Position Left (%)</label>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={textSettings.left}
//               onChange={(e) => handleTextSettingChange("left", e.target.value)}
//               className="mt-2 w-full"
//             />
//           </div>

//           <button
//             onClick={handleDownload}
//             className="mt-4 rounded bg-blue-600 px-4 py-2 text-white shadow"
//           >
//             Download Image
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";
// import html2canvas from "html2canvas";
// import { removeBackground } from "@imgly/background-removal";
// import Image from "next/image";

// export default function PicturePhrase() {
//   const [originalImage, setOriginalImage] = useState(null);
//   const [processedImage, setProcessedImage] = useState(null);
//   const [text, setText] = useState("Your Text Here");
//   const [textSettings, setTextSettings] = useState({
//     size: 30,
//     color: "#FFFFFF",
//     top: 50,
//     left: 50,
//   });

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setOriginalImage(imageUrl);
//       await setupImage(imageUrl);
//     }
//   };

//   const setupImage = async (imageUrl: string) => {
//     try {
//       const imageBlob = await removeBackground(imageUrl);
//       const url = URL.createObjectURL(imageBlob);
//       setProcessedImage(url);
//       console.log("ye hai processed image: ", url);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleTextSettingChange = (field, value) => {
//     setTextSettings({ ...textSettings, [field]: value });
//   };

//   const handleDownload = async () => {
//     const element = document.getElementById("preview");
//     const canvas = await html2canvas(element);
//     const link = document.createElement("a");
//     link.href = canvas.toDataURL("image/png");
//     link.download = "customized-image.png";
//     link.click();
//   };

//   return (
//     <div className="flex flex-col items-center p-6">
//       <h1 className="mb-6 text-3xl font-semibold">
//         PicturePhrase - Text Behind Image
//       </h1>

//       <div className="flex w-full max-w-6xl gap-10">
//         {/* Image Preview Section */}
//         <div
//           id="preview"
//           className="relative h-[600px] w-3/5 overflow-hidden border border-gray-300 bg-gray-100"
//         >
//           {originalImage && (
//             <Image
//               src={originalImage}
//               alt="Original"
//               className="absolute left-0 top-0 z-0 object-contain"
//               style={{ opacity: 1 }}
//               fill
//             />
//           )}
//           {/* Text Layer - Behind Processed Image */}
//           <div
//             style={{
//               top: `${textSettings.top}%`,
//               left: `${textSettings.left}%`,
//               fontSize: `${textSettings.size}px`,
//               color: textSettings.color,
//             }}
//             className="absolute z-0 -translate-x-1/2 -translate-y-1/2 transform whitespace-pre-wrap text-center"
//           >
//             {text}
//           </div>
//           {/* Render Processed Image */}
//           {processedImage && (
//             <Image
//               src={processedImage}
//               alt="Subject with Background Removed"
//               className="absolute left-0 top-0 z-10 object-contain"
//               style={{ opacity: 1 }}
//               fill // This allows the image to fill the container while maintaining responsive scaling
//             />
//           )}
//         </div>

//         {/* Customization Panel */}
//         <div className="flex w-2/5 flex-col gap-4">
//           <div>
//             <label className="font-semibold">Upload Image</label>
//             <input
//               type="file"
//               onChange={handleImageUpload}
//               className="mt-2 block w-full rounded border p-2"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Text</label>
//             <textarea
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               className="mt-2 block h-20 w-full resize-none rounded border p-2"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Font Size</label>
//             <input
//               type="range"
//               min={10}
//               max={500}
//               step={1}
//               value={textSettings.size}
//               onChange={(e) => handleTextSettingChange("size", e.target.value)}
//               className="mt-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Font Color</label>
//             <input
//               type="color"
//               value={textSettings.color}
//               onChange={(e) => handleTextSettingChange("color", e.target.value)}
//               className="mt-2 block w-12 border p-[2px]"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Position Top (%)</label>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={textSettings.top}
//               onChange={(e) => handleTextSettingChange("top", e.target.value)}
//               className="mt-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Position Left (%)</label>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={textSettings.left}
//               onChange={(e) => handleTextSettingChange("left", e.target.value)}
//               className="mt-2 w-full"
//             />
//           </div>

//           <button
//             onClick={handleDownload}
//             className="mt-4 rounded bg-blue-600 px-4 py-2 text-white shadow"
//           >
//             Download Image
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";
// import html2canvas from "html2canvas";
// import { removeBackground } from "@imgly/background-removal";
// import Image from "next/image";

// export default function PicturePhrase() {
//   const [originalImage, setOriginalImage] = useState(null);
//   const [originalDimensions, setOriginalDimensions] = useState({
//     width: 668,
//     height: 600,
//   });
//   const [processedImage, setProcessedImage] = useState(null);
//   const [text, setText] = useState("Your Text Here");
//   const [textSettings, setTextSettings] = useState({
//     size: 30,
//     color: "#FFFFFF",
//     top: 50,
//     left: 50,
//   });

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);

//       const img = document.createElement("img");
//       img.src = imageUrl;
//       img.onload = () => {
//         setOriginalDimensions({ width: img.width, height: img.height });
//         setOriginalImage(imageUrl);
//       };

//       await setupImage(imageUrl);
//     }
//   };

//   const setupImage = async (imageUrl: string) => {
//     try {
//       const imageBlob = await removeBackground(imageUrl);
//       const url = URL.createObjectURL(imageBlob);
//       setProcessedImage(url);
//       console.log("ye hai processed image: ", url);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleTextSettingChange = (field, value) => {
//     setTextSettings({ ...textSettings, [field]: value });
//   };

//   // const handleDownload = async () => {
//   //   const element = document.getElementById("preview");

//   //   // Set the original dimensions to match the uploaded image
//   //   const { width, height } = originalDimensions;

//   //   // const canvas = await html2canvas(element, {
//   //   //   width: originalDimensions.width,
//   //   //   height: originalDimensions.height,
//   //   //   scale: originalDimensions.width / element.offsetWidth,
//   //   // });

//   //   // Capture the element using html2canvas with the specified dimensions
//   //   const canvas = await html2canvas(element, {
//   //     width, // Set canvas width to the original image width
//   //     height, // Set canvas height to the original image height
//   //     scale: 1, // Prevent any scaling to ensure exact dimensions
//   //     useCORS: true, // Enable cross-origin resource sharing
//   //   });
//   //   const link = document.createElement("a");
//   //   link.href = canvas.toDataURL("image/png");
//   //   link.download = "customized-image.png";
//   //   link.click();
//   // };

//   // const handleDownload = async () => {
//   //   const element = document.getElementById("preview");

//   //   const { width, height } = originalDimensions;

//   //   const canvas = await html2canvas(element, {
//   //     width, // Match the canvas width to the uploaded image width
//   //     height, // Match the canvas height to the uploaded image height
//   //     scale: 1, // Keep the scale at 1 to prevent unwanted resizing
//   //     useCORS: true,
//   //   });

//   //   const link = document.createElement("a");
//   //   link.href = canvas.toDataURL("image/png");
//   //   link.download = "customized-image.png";
//   //   link.click();
//   // };

//   // const handleDownload = async () => {
//   //   const element = document.getElementById("preview");

//   //   const { width, height } = originalDimensions;

//   //   const canvas = await html2canvas(element, {
//   //     width,
//   //     height,
//   //     scale: 1, // Ensures the downloaded image has the correct scale
//   //     useCORS: true,
//   //     backgroundColor: null, // Ensures no background color interferes with the canvas
//   //   });

//   //   const link = document.createElement("a");
//   //   link.href = canvas.toDataURL("image/png");
//   //   link.download = "customized-image.png";
//   //   link.click();
//   // };

//   const handleDownload = async () => {
//     if (!originalImage) return;

//     // Load the image to get its dimensions
//     const img = new window.Image();
//     img.src = originalImage;

//     img.onload = async () => {
//       const { width, height } = img;

//       // Create an offscreen canvas matching the original image dimensions
//       const offscreenCanvas = document.createElement("canvas");
//       offscreenCanvas.width = width;
//       offscreenCanvas.height = height;

//       const ctx = offscreenCanvas.getContext("2d");

//       if (ctx) {
//         // Draw the original image
//         const originalImageElement = document.getElementById("preview");
//         await html2canvas(originalImageElement, {
//           canvas: offscreenCanvas,
//           width: width,
//           height: height,
//           useCORS: true,
//           backgroundColor: null,
//           scale: 1, // Prevents scaling issues
//         });

//         // Generate download link
//         const link = document.createElement("a");
//         link.href = offscreenCanvas.toDataURL("image/png");
//         link.download = "customized-image.png";
//         link.click();
//       }
//     };
//   };

//   return (
//     <div className="flex flex-col items-center p-6">
//       <h1 className="mb-6 text-3xl font-semibold">
//         PicturePhrase - Text Behind Image
//       </h1>

//       <div className="flex w-full max-w-6xl gap-10">
//         {/* Image Preview Section */}
//         <div
//           id="preview"
//           className="relative overflow-hidden border border-gray-300 bg-gray-100"
//           style={{
//             width: "600px",
//             height: "400px",
//           }}
//         >
//           {originalImage && (
//             <Image
//               src={originalImage}
//               alt="Original"
//               className="absolute left-0 top-0 z-0"
//               width={600}
//               height={400}
//               style={{ objectFit: "contain" }}
//             />
//           )}
//           {/* Text Layer - Behind Processed Image */}
//           <div
//             style={{
//               top: `${textSettings.top}%`,
//               left: `${textSettings.left}%`,
//               fontSize: `${textSettings.size}px`,
//               color: textSettings.color,
//             }}
//             className="absolute z-0 -translate-x-1/2 -translate-y-1/2 transform whitespace-pre-wrap text-center"
//           >
//             {text}
//           </div>

//           {processedImage && (
//             <Image
//               src={processedImage}
//               alt="Subject with Background Removed"
//               className="absolute left-0 top-0 z-10"
//               width={600}
//               height={400}
//               style={{ objectFit: "contain" }}
//             />
//           )}
//         </div>

//         {/* Customization Panel */}
//         <div className="flex w-2/5 flex-col gap-4">
//           <div>
//             <label className="font-semibold">Upload Image</label>
//             <input
//               type="file"
//               onChange={handleImageUpload}
//               className="mt-2 block w-full rounded border p-2"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Text</label>
//             <textarea
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               className="mt-2 block h-20 w-full resize-none rounded border p-2"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Font Size</label>
//             <input
//               type="range"
//               min={10}
//               max={500}
//               step={1}
//               value={textSettings.size}
//               onChange={(e) => handleTextSettingChange("size", e.target.value)}
//               className="mt-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Font Color</label>
//             <input
//               type="color"
//               value={textSettings.color}
//               onChange={(e) => handleTextSettingChange("color", e.target.value)}
//               className="mt-2 block w-12 border p-[2px]"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Position Top (%)</label>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={textSettings.top}
//               onChange={(e) => handleTextSettingChange("top", e.target.value)}
//               className="mt-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="font-semibold">Position Left (%)</label>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={textSettings.left}
//               onChange={(e) => handleTextSettingChange("left", e.target.value)}
//               className="mt-2 w-full"
//             />
//           </div>

//           <button
//             onClick={handleDownload}
//             className="mt-4 rounded bg-blue-600 px-4 py-2 text-white shadow"
//           >
//             Download Image
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

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

      // Add text on top of original image (middle layer)
      ctx.font = `${textSettings.size}px Arial`;
      ctx.fillStyle = textSettings.color;
      ctx.textAlign = "center";
      ctx.fillText(
        text,
        (textSettings.left / 100) * imageDimensions.width,
        (textSettings.top / 100) * imageDimensions.height,
      );

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
