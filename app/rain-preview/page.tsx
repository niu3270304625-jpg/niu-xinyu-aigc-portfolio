export default function RainPreview() {
  return (
    <main className="rain-preview-page">
      <img
        src="/images/niu-hero-bg-clean.png"
        alt=""
        className="rain-preview-bg"
      />
      <img
        src="/overlays/rain-alpha-preview.png"
        alt=""
        className="rain-alpha-video"
      />
      <div className="rain-preview-copy">
        <p>ALPHA OVERLAY / RAIN GLASS TEST</p>
        <h1>Alpha Rain Preview</h1>
        <span>透明序列贴片预览：看水珠光影、折射边和下滑痕</span>
      </div>
    </main>
  );
}
