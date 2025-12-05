import { useState, useEffect } from "react";

const STORAGE_KEYS = {
  hideShorts: "hideShorts",
  hideRecommended: "hideRecommended",
  subsOnly: "subsOnly",
  turnOffComments: "turnOffComments",
};

function App() {
  const [hideShorts, setHideShorts] = useState(false);
  const [hideRecommended, setHideRecommended] = useState(false);
  const [subsOnly, setSubsOnly] = useState(false);
  const [turnOffComments, setTurnOffComments] = useState(false);

  // Load state on startup
  useEffect(() => {
    chrome.storage.local.get(
      [
        STORAGE_KEYS.hideShorts,
        STORAGE_KEYS.hideRecommended,
        STORAGE_KEYS.subsOnly,
        STORAGE_KEYS.turnOffComments,
      ],
      (result) => {
        setHideShorts(!!result[STORAGE_KEYS.hideShorts]);
        setHideRecommended(!!result[STORAGE_KEYS.hideRecommended]);
        setSubsOnly(!!result[STORAGE_KEYS.subsOnly]);
        setTurnOffComments(!!result[STORAGE_KEYS.turnOffComments]);
      }
    );
  }, []);

  // Generic toggle helper
  const toggleSetting = (key: keyof typeof STORAGE_KEYS) => {
    const storageKey = STORAGE_KEYS[key];

    let newValue = false;
    if (key === "hideShorts") {
      newValue = !hideShorts;
      setHideShorts(newValue);
    } else if (key === "hideRecommended") {
      newValue = !hideRecommended;
      setHideRecommended(newValue);
    } else if (key === "subsOnly") {
      newValue = !subsOnly;
      setSubsOnly(newValue);
    } else if (key === "turnOffComments") {
      newValue = !turnOffComments;
      setTurnOffComments(newValue);
    }

    chrome.storage.local.set({ [storageKey]: newValue });
  };

  const Toggle = ({
    label,
    description,
    active,
    onClick,
  }: {
    label: string;
    description: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#f9fafb",
            marginBottom: "2px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#9ca3af",
          }}
        >
          {description}
        </div>
      </div>

      {/* pill toggle */}
      <button
        onClick={onClick}
        style={{
          width: "48px",
          height: "24px",
          borderRadius: "999px",
          border: "none",
          background: active
            ? "linear-gradient(135deg, #22c55e, #16a34a)"
            : "rgba(55,65,81,0.8)",
          padding: "2px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: active ? "flex-end" : "flex-start",
          transition: "all 0.18s ease-out",
          boxShadow: active
            ? "0 0 8px rgba(34,197,94,0.6)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "999px",
            background: "#f9fafb",
          }}
        />
      </button>
    </div>
  );

  return (
    <div
      style={{
        width: "400px",
        padding: "16px 16px 18px",
        fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        background:
          "radial-gradient(circle at top left, #d81d1dff 0, #020617 42%)",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            ZenTube
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#9ca3af",
              marginTop: "2px",
            }}
          >
            Tune your YouTube to match your focus.
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Toggle
          label="Hide Shorts"
          description="Remove Shorts shelves from the feed."
          active={hideShorts}
          onClick={() => toggleSetting("hideShorts")}
        />

        <Toggle
          label="Hide Recommended"
          description="Hide ‘Up next’ recommendations."
          active={hideRecommended}
          onClick={() => toggleSetting("hideRecommended")}
        />

        <Toggle
          label="Subscriptions only"
          description="Keep only videos from channels you follow."
          active={subsOnly}
          onClick={() => toggleSetting("subsOnly")}
        />
        <Toggle
          label="Turn off Comments"
          description="Disable comments on all videos to avoid distractions."
          active={turnOffComments}
          onClick={() => toggleSetting("turnOffComments")}
        />
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "12px",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        Changes apply to open YouTube tabs. Refresh if something looks off.
      </div>
    </div>
  );
}

export default App;
