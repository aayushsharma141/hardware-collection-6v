import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1017",
          border: "4px solid #8b1a42",
          borderRadius: "36px",
          color: "#fbf5ea",
        }}
      >
        <span
          style={{
            fontSize: "64px",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#c8a96e",
            lineHeight: 1,
          }}
        >
          HC
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#fbf5ea",
            marginTop: "6px",
          }}
        >
          Sakchi
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
