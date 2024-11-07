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
    <div style={styles.container}>
      <h1 style={styles.header}>PicturePhrase</h1>

      <div style={styles.appContent}>
        {/* Image Preview Section */}
        <div id="preview" style={styles.preview}>
          {image && (
            <img src={image} alt="Uploaded" style={styles.uploadedImage} />
          )}
          <div
            style={{
              ...styles.overlayText,
              top: `${textSettings.top}%`,
              left: `${textSettings.left}%`,
              fontSize: `${textSettings.size}px`,
              color: textSettings.color,
              opacity: textSettings.opacity,
              fontWeight: textSettings.fontWeight,
            }}
          >
            {text}
          </div>
        </div>

        {/* Customization Panel */}
        <div style={styles.controls}>
          <label style={styles.label}>Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            style={styles.input}
          />

          <label style={styles.label}>Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ ...styles.input, height: "50px", resize: "none" }}
          />

          <label style={styles.label}>Font Size</label>
          <input
            type="range"
            min="10"
            max="100"
            value={textSettings.size}
            onChange={(e) => handleTextSettingChange("size", e.target.value)}
            style={styles.rangeInput}
          />

          <label style={styles.label}>Font Color</label>
          <input
            type="color"
            value={textSettings.color}
            onChange={(e) => handleTextSettingChange("color", e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={textSettings.opacity}
            onChange={(e) => handleTextSettingChange("opacity", e.target.value)}
            style={styles.rangeInput}
          />

          <label style={styles.label}>Font Weight</label>
          <select
            value={textSettings.fontWeight}
            onChange={(e) =>
              handleTextSettingChange("fontWeight", e.target.value)
            }
            style={styles.input}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
          </select>

          <label style={styles.label}>Position Top (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={textSettings.top}
            onChange={(e) => handleTextSettingChange("top", e.target.value)}
            style={styles.rangeInput}
          />

          <label style={styles.label}>Position Left (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={textSettings.left}
            onChange={(e) => handleTextSettingChange("left", e.target.value)}
            style={styles.rangeInput}
          />

          <button onClick={handleDownload} style={styles.button}>
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  appContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  preview: {
    width: "60%",
    height: "600px",
    position: "relative",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlayText: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    whiteSpace: "pre-wrap",
    textAlign: "center",
  },
  controls: {
    width: "35%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontWeight: "bold",
    fontSize: "0.9rem",
    marginBottom: "5px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  rangeInput: {
    width: "100%",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
