export function CampaignHero() {
  return (
    <section id="top" className="campaign-hero relative min-h-screen overflow-hidden">
      <img
        className="campaign-bg"
        src="/images/niu-hero-bg-clean.png"
        alt="牛昕宇 AIGC 影视作品集主视觉背景"
      />
      <div className="campaign-vignette" aria-hidden="true" />

      <div className="campaign-nav">
        <a href="#top" className="campaign-brand">
          Niu Xinyu
        </a>
        <div className="campaign-links">
          <a href="#works">Works</a>
          <a href="#method">Method</a>
          <a href="#profile">Profile</a>
          <a href="#social">Channels</a>
        </div>
      </div>

      <div className="campaign-copy">
        <p className="campaign-kicker">AIGC Film</p>
        <h1 className="campaign-title">
          <span>Visual</span>
          <span>Storytelling</span>
        </h1>
        <p className="campaign-cn-name">牛昕宇</p>
        <p className="campaign-subtitle">
          把故事、角色与情绪，转译成可执行的 AI 影像生产流程。
        </p>
      </div>

      <div className="campaign-side-note campaign-side-note-left">
        <span>Personal</span>
        <span>AIGC Portfolio</span>
      </div>
      <div className="campaign-side-note campaign-side-note-right">
        <span>Film Project</span>
        <span>Lead / 2026</span>
      </div>

      <div className="campaign-floating-meta">
        <span>Portfolio 2026</span>
        <span>AIGC Film Project Lead</span>
      </div>

      <a className="campaign-scroll-cue" href="#works" aria-label="查看作品">
        Works
      </a>
    </section>
  );
}
