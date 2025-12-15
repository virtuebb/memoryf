import { useState } from "react";
import "./BgmPlayer.css";

function BgmPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="bgm-player">
      <div
        className={`lp ${playing ? "playing" : ""}`}
        onClick={() => setPlaying(!playing)}
      >
        <div className="lp-pulse" />
        <div className="lp-disc" />
        <div className="lp-center" />
      </div>

      <div className="bgm-info">
        <div className="status">
          {playing ? "Now Playing" : "Paused"}
        </div>
        <div className="title">Dreamy Nights · Lo-fi Beats</div>
      </div>
    </div>
  );
}

export default BgmPlayer;
