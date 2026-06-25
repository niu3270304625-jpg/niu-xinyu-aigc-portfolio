import { WorkGallery } from "./components/WorkGallery";
import { AmbientSound } from "./components/AmbientSound";
import { SiteLoader } from "./components/SiteLoader";
import { CampaignHero } from "./components/CampaignHero";

const works = [
  {
    title: "星仔战队之灵宠奇遇记",
    label: "轻写实奇幻 / 角色一致性",
    src: "/videos-publish/spirit-pet-trailer.mp4",
    poster: "/images/works/spirit-pet-trailer.png",
    orientation: "landscape",
    summary:
      "围绕灵宠角色、少年战队、家庭情绪与奇幻冒险建立视觉规则，强调角色连续性、世界观边界与长期生产稳定度。",
  },
  {
    title: "虚拟花期",
    label: "视觉诗意 / 概念影像",
    src: "/videos-publish/virtual-flowering.mp4",
    poster: "/images/works/virtual-flowering.png",
    orientation: "landscape",
    summary:
      "以虚拟花期、人物情绪和镜头色彩为核心，将抽象主题转化为可生成、可筛选、可迭代的 AIGC 影像表达。",
  },
  {
    title: "放课后乌鸦不叫",
    label: "校园悬疑 / 青春寓言",
    src: "/videos-publish/after-school-crow.mp4",
    poster: "/images/works/after-school-crow-new.jpg",
    orientation: "landscape",
    summary:
      "围绕放课后时间感、乌鸦意象、校园空间和少年关系建立镜头资产，强调青春题材的悬疑氛围和连续叙事。",
  },
  {
    title: "逢人不说人间事 第一集",
    label: "现实情绪 / 竖屏叙事",
    src: "/videos-publish/human-world-episode-01.mp4",
    poster: "/images/works/human-world-episode-01.png",
    orientation: "portrait",
    summary:
      "现实感、克制情绪与生活化场景的 AI 影像表达，重在故事气质、人物状态与画面分寸。",
  },
  {
    title: "红妆锁心",
    label: "古装情感 / 横版预告",
    src: "/videos-publish/costume-trailer.mp4",
    poster: "/images/works/red-dress-lock-heart.png",
    orientation: "landscape",
    summary:
      "以红装、错嫁、情感纠葛和人物关系为核心组织镜头资产，服务古装情感短剧的节奏与视觉记忆点。",
  },
  {
    title: "狐嫁惊梦",
    label: "东方玄幻 / 狐族意象",
    src: "/videos-publish/qingqiu.mp4",
    poster: "/images/works/lonely-fox-dream.png",
    orientation: "landscape",
    summary:
      "以狐族人物、祠堂禁祭和千年梦境为视觉核心，强化东方玄幻题材的人物气场、光影仪式感和世界观辨识度。",
  },
  {
    title: "尼斯湖水怪 横屏版",
    label: "奇幻概念 / 横屏短片",
    src: "/videos-publish/loch-ness-landscape.mp4",
    poster: "/images/works/loch-ness-landscape.png",
    orientation: "landscape",
    summary:
      "面向奇幻题材的概念影像尝试，在生物意象、悬念氛围和镜头节奏之间建立可执行方案。",
  },
  {
    title: "尼斯湖水怪 竖屏版",
    label: "奇幻概念 / 竖屏短片",
    src: "/videos-publish/loch-ness-monster.mp4",
    poster: "/images/works/loch-ness-portrait.png",
    orientation: "portrait",
    summary:
      "保留手机竖屏叙事的完整画幅，以水怪传说、湖面压迫感和近景悬念强化短视频观看节奏。",
  },
];

const methods = [
  "剧本拆解",
  "角色设定",
  "分镜提示词",
  "风格基准",
  "角色一致性",
  "素材筛选",
  "版本迭代",
  "质量验收",
];

const experience = [
  ["2025.05 - 2026.06", "准心影视", "AI 项目主管"],
  ["2020 - 2024", "保丽金康物业管理集团", "物业经理"],
  ["2016 - 2020", "日本务工经历", "海外工作"],
  ["2014 - 2015", "山东石化泰山石油", "软件开发运维"],
];

const socialLinks = [
  {
    name: "Bilibili",
    value: "B站主页",
    href: "https://space.bilibili.com/2120834879",
  },
  {
    name: "抖音",
    value: "这有一只大白 · zheyouzhidabai24",
    href: null,
  },
  {
    name: "LibTV",
    value: "牛大师",
    href: null,
  },
];

export default function Home() {
  return (
    <main className="relative isolate min-h-screen bg-[#fbfcf2] text-[#172719]">
      <SiteLoader />
      <div className="scroll-progress" />
      <AmbientSound />
      <img
        src="/overlays/rain-alpha-preview.png"
        alt=""
        className="global-rain-alpha"
        aria-hidden="true"
      />
      <CampaignHero />

      <section id="works" className="section-shell editorial-section px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-8 border-b border-[#dbe8d4] pb-10 md:grid-cols-[0.86fr_1.14fr] md:items-end">
            <div>
              <p className="eyebrow">Selected Works</p>
              <h2 className="display-title text-[#172719]">影像作品</h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#5a6a56]">
              视频按原始横竖比例展示，不再强行裁切。横版作品以宽画幅呈现，竖屏作品保留手机电影画幅，
              让画面完整、干净、可观看。
            </p>
          </div>

          <WorkGallery works={works} />
        </div>
      </section>

      <section id="method" className="section-shell editorial-section px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="eyebrow">Method</p>
            <h2 className="method-title">
              <span>简约不是</span>
              <span>减少信息，</span>
              <span>而是建立秩序。</span>
            </h2>
          </div>
          <div>
            <p className="max-w-3xl text-xl leading-9 text-[#4f604c]">
              工作重点不是单点工具操作，而是把故事文本拆解成可排期、可协作、可验收、
              可复盘的影像生产任务；让 AI 生成结果服务叙事、人物和镜头连续性。
            </p>
            <div className="mt-10 grid grid-cols-2 border-t border-[#cfdcc8] sm:grid-cols-4">
              {methods.map((item) => (
                <div
                  key={item}
                  className="method-item border-b border-[#cfdcc8] py-5 text-sm font-medium text-[#172719]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="profile" className="section-shell editorial-section px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.62fr_1.38fr]">
          <div>
            <img
              src="/images/virtual-character.png"
              alt="牛昕宇原创虚拟人物形象"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Profile</p>
            <h2 className="display-title text-[#172719]">AIGC 影视项目主管</h2>
            <p className="mt-8 max-w-3xl text-lg leading-9 text-[#5a6a56]">
              2024 年起系统转型 AIGC 影视内容方向，参与或主导《虚拟花期》《逢人不提人间事》
              《放课后乌鸦不飞》《星仔奇遇之灵宠双生记》等项目。过往软件运维、海外工作与
              物业集团管理经历，形成技术理解、现场推进、服务意识与复杂项目协同能力。
            </p>

            <div className="mt-12 border-t border-[#dbe8d4]">
              {experience.map(([period, company, title]) => (
                <div
                  key={`${period}-${company}`}
                  className="grid gap-3 border-b border-[#dbe8d4] py-5 text-sm md:grid-cols-[12rem_1fr_12rem]"
                >
                  <span className="text-[#6f9d5f]">{period}</span>
                  <span>{company}</span>
                  <span className="text-[#66745f] md:text-right">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="social" className="section-shell editorial-section border-t border-[#dbe8d4] px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="eyebrow">Channels</p>
            <h2 className="display-title text-[#172719]">作品发布与社交入口</h2>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-[#5a6a56]">
              B 站用于作品展示与视频发布，抖音用于短视频内容和 AIGC/AI 影视培训入口，
              LibTV 使用名称“牛大师”。
            </p>
            <div className="mt-10 border-t border-[#dbe8d4]">
              {socialLinks.map((item) => (
                <div
                  key={item.name}
                  className="grid gap-3 border-b border-[#dbe8d4] py-5 text-sm md:grid-cols-[9rem_1fr]"
                >
                  <span className="text-[#6f9d5f]">{item.name}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#172719] underline decoration-[#c7d8bd] underline-offset-4 hover:text-[#6f9d5f]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="font-medium text-[#172719]">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#102217] p-5 shadow-[0_24px_80px_rgba(36,69,45,0.14)]">
            <img
              src="/images/social/douyin-qr.jpg"
              alt="抖音二维码：这有一只大白"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#dbe8d4] px-6 py-14 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-[#5a6a56] md:flex-row md:items-center md:justify-between">
          <p>牛昕宇 · AIGC Film Project Lead</p>
          <div className="flex flex-col gap-2 md:flex-row md:gap-8">
            <a href="tel:17664501318" className="hover:text-[#6f9d5f]">
              17664501318
            </a>
            <a href="mailto:niu3270304625@gmail.com" className="hover:text-[#6f9d5f]">
              niu3270304625@gmail.com
            </a>
            <a
              href="https://space.bilibili.com/2120834879"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#6f9d5f]"
            >
              B站主页
            </a>
            <span>抖音：这有一只大白</span>
            <span>LibTV：牛大师</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
