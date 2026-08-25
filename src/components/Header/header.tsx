//import "./Header.css";

function Header({
    online = true,
    initials = "JD",
    terminal = "Terminal 01",
    username = "Cashier"
}) {
const TOKENS = {
  ink: "#f1f1f1",
  inkSoft: "#25352D",
  paper: "#1b1b1b",
  paperDim: "#EEEAE0",
  brass: "#C9A227",
  brassDeep: "#A9860F",
  leaf: "#2F6B4F",
  rust: "#B5482D",
  slate: "#5B6660",
  line: "rgba(22,36,31,0.12)",
};

const FONT_DISPLAY = "'Fraunces', serif";

const FONT_MONO = "'IBM Plex Mono', monospace";

    return (
       <div className="shadow"
          style={{
            background: TOKENS.ink,
            color: TOKENS.paper,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22 }}>
              Masterpiece
            </span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10.5,
                color: "rgba(247,245,239,0.55)",
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              {terminal}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: FONT_MONO,
                fontSize: 11.5,
                letterSpacing: 0.5,
                background: "rgba(47,107,79,0.22)",
                border: "1px solid rgba(28, 180, 112, 0.4)",
                color: "#8FD6AF",
                padding: "5px 10px 5px 8px",
                borderRadius: 100,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#4CDE8B",
                  boxShadow: "0 0 0 3px rgba(76,222,139,0.18)",
                  display: "inline-block",
                }}
              />
              {online ? "Online" : "Offline"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: TOKENS.brass,
                  color: TOKENS.ink,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_MONO,
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {initials}
              </div>
              <span>{username}</span>
            </div>
          </div>
        </div>
    );

}

export default Header;