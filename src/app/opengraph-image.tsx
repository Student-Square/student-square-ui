import { ImageResponse } from "next/og";

export const alt =
  "Student Square — counselling, advocacy, and community programs for students in Bangladesh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 88px",
          background: "linear-gradient(135deg, #071a14 0%, #0d3b2c 55%, #12221c 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#e11d2a" }}>STUDENT</span>
          <span style={{ color: "#22c55e", marginLeft: 18 }}>SQUARE</span>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 32,
            lineHeight: 1.35,
            color: "#d8eee3",
            maxWidth: 920,
          }}
        >
          Counselling, advocacy, and community programs helping students and
          families thrive.
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 22,
            color: "#86efac",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          studentsquare.org
        </div>
      </div>
    ),
    { ...size },
  );
}
