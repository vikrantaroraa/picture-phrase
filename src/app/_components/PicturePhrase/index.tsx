"use client";
import { useState } from "react";
import html2canvas from "html2canvas";

export default function PicturePhrase() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("Your Text Here");
  const [textSettings, setTextSettings] = useState({
    size: 30,
    color: "#000000",
    opacity: 1,
    fontWeight: "normal",
    top: 50,
    left: 50,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTextSettingChange = (field, value) => {
    setTextSettings({ ...textSettings, [field]: value });
  };

  const handleDownload = async () => {
    const element = document.getElementById("preview");
    const canvas = await html2canvas(element);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "customized-image.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="mb-6 text-3xl font-semibold">PicturePhrase</h1>

      <div className="flex w-full max-w-6xl gap-10">
        {/* Image Preview Section */}
        <div
          id="preview"
          className="relative h-[600px] w-3/5 overflow-hidden border border-gray-300 bg-gray-100"
        >
          {image && (
            <img
              src={image}
              alt="Uploaded"
              className="h-full w-full object-cover"
            />
          )}
          <div
            style={{
              top: `${textSettings.top}%`,
              left: `${textSettings.left}%`,
              fontSize: `${textSettings.size}px`,
              color: textSettings.color,
              opacity: textSettings.opacity,
              fontWeight: textSettings.fontWeight,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 transform whitespace-pre-wrap text-center"
          >
            {text}
          </div>
        </div>

        {/* Customization Panel */}
        <div className="flex w-2/5 flex-col gap-4">
          <div>
            <label className="font-semibold">Upload Image</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="mt-2 block w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="font-semibold">Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-2 block h-20 w-full resize-none rounded border p-2"
            />
          </div>

          <div>
            <label className="font-semibold">Font Size</label>
            <input
              type="range"
              min="10"
              max="100"
              value={textSettings.size}
              onChange={(e) => handleTextSettingChange("size", e.target.value)}
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="font-semibold">Font Color</label>
            <input
              type="color"
              value={textSettings.color}
              onChange={(e) => handleTextSettingChange("color", e.target.value)}
              className="mt-2 block w-12 border p-[2px]"
            />
          </div>

          <div>
            <label className="font-semibold">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={textSettings.opacity}
              onChange={(e) =>
                handleTextSettingChange("opacity", e.target.value)
              }
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="font-semibold">Font Weight</label>
            <select
              value={textSettings.fontWeight}
              onChange={(e) =>
                handleTextSettingChange("fontWeight", e.target.value)
              }
              className="mt-2 block w-full rounded border p-2"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Lighter</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Position Top (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={textSettings.top}
              onChange={(e) => handleTextSettingChange("top", e.target.value)}
              className="mt-2 w-full"
            />
          </div>

          <div>
            <label className="font-semibold">Position Left (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={textSettings.left}
              onChange={(e) => handleTextSettingChange("left", e.target.value)}
              className="mt-2 w-full"
            />
          </div>

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
