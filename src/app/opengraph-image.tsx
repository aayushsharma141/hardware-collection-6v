import { ImageResponse } from "next/og";

export const alt = "Hardware Collection — Flagship Architectural Hardware Showroom in Sakchi, Jamshedpur";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1a1017",
          padding: "64px 72px",
          color: "#fbf5ea",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle accent border at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #8b1a42, #c8a96e, #8b1a42)",
          }}
        />

        {/* Top Header / Kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#c8a96e",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#c8a96e",
                fontWeight: 600,
              }}
            >
              Sakchi · Jamshedpur
            </span>
          </div>
          <span
            style={{
              fontSize: "13px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(251, 245, 234, 0.6)",
            }}
          >
            20+ Authorized Brands
          </span>
        </div>

        {/* Hero Title & Identity */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              margin: 0,
              color: "#fbf5ea",
              textTransform: "uppercase",
            }}
          >
            Hardware Collection
          </h1>
          <p
            style={{
              fontSize: "24px",
              fontWeight: 300,
              lineHeight: 1.4,
              color: "rgba(251, 245, 234, 0.85)",
              maxWidth: "850px",
              margin: 0,
            }}
          >
            Architectural hardware, luxury digital locks, modular kitchen & wardrobe systems from Hafele, Dorset, Yale, Godrej & Blum.
          </p>
        </div>

        {/* Bottom Trust Strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(251, 245, 234, 0.15)",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              color: "#c8a96e",
              letterSpacing: "0.08em",
              fontWeight: 500,
            }}
          >
            hardwarecollection.co
          </span>
          <span
            style={{
              fontSize: "15px",
              color: "rgba(251, 245, 234, 0.65)",
            }}
          >
            Physical Flagship Showroom · Kashidih, Sakchi
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
