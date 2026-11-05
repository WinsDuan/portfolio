import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Menu, X, Maximize2 } from "lucide-react";
import AgentLab from "./components/AgentLab";

const links = [["#lab", "实验室"], ["#projects", "项目"], ["#about", "关于"], ["#experience", "经历"], ["#contact", "联系"]];

const projects = [
  {
    number: "01", category: "QUANTITATIVE RESEARCH / 2026—", title: "多智能体量化投资决策", english: "MULTI-AGENT INVESTING", type: "独立设计 · 持续迭代",
    intro: "让不同角色的智能体协作分析、决策与风控，探索大语言模型在量化投资决策中的应用。",
    details: ["独立设计多 Agent 协作框架，构建分析、决策与风控角色，并设计消息传递和协商机制。", "集成 OpenAI、DeepSeek 等模型 API，搭建分析、决策与回测链路；项目已完成中期搭建，仍在迭代。", "研究关注协作决策与传统量化因子方案之间的比较，结果有待进一步验证。"],
    tags: ["Multi-Agent", "LLM API", "量化研究", "回测"],
  },
  {
    number: "02", category: "TRAFFIC SYSTEMS / 2026—", title: "多路口交通信号协同优化", english: "COOPERATIVE SIGNAL CONTROL", type: "研究参与 · 模型与开发",
    intro: "结合组合优化与合作博弈，研究拥堵路况下相邻路口的动态协调方法。",
    details: ["根据车辆行驶路线动态选择 3—8 个相关信号控制器，联合搜索配时方案，并结合全网收益和成员耗时变化判断是否形成联盟。", "基于 OpenStreetMap 路网和 SUMO，构建北京化工大学朝阳校区周边交通仿真场景，对比固定配时、逐灯优化与联合优化。", "参与整体设计与开发，完成数学模型、算法实现和地图适配，并开展不同交通场景的实验与结果分析。"],
    tags: ["合作博弈", "组合优化", "SUMO", "OpenStreetMap"],
  },
  {
    number: "03", category: "FINANCIAL ANALYSIS / RESEARCH", title: "宁德时代经营与价值研究", english: "BUSINESS & VALUATION", type: "财务分析 · 研究报告",
    intro: "从财务报表到现金流折现，用数据和模型理解企业经营与价值。",
    details: ["基于 2018—2025 年报与 CSMAR 数据，分析财务趋势、盈利能力、营运能力和现金流，并与同行指标比较。", "梳理两阶段现金流折现模型，开展折现率与永续增长率敏感性分析，讨论现金流口径和模型假设。"],
    tags: ["财务分析", "CSMAR", "DCF", "敏感性分析"],
  },
  {
    number: "04", category: "OPEN SOURCE / RESEARCH TOOLS", title: "Codex for Zotero", english: "TOOLS FOR THOUGHT", type: "开源项目 · 工具开发",
    intro: "面向 Zotero 文献阅读工作流，连接本机 Codex，辅助论文对话与研究材料处理。",
    details: ["围绕论文阅读与文献比较构建工具，探索 AI 如何融入研究工作流。", "项目代码公开在 GitHub。"],
    tags: ["Zotero", "Codex", "开源", "研究工具"], href: "https://github.com/WinsDuan/codex-for-zotero",
  },
];

const experiences = [
  { date: "2025.09 —", title: "北京化工大学课题组", role: "本科研究参与", text: "参与课题组研究与讨论，协助 COCOA 2026 学术会议的网站搭建、运营与维护。" },
  { date: "2025.09 —", title: "北京化工大学新媒体视频部", role: "常任干事", text: "参与校内摄影和视频制作，在多任务协作中积累视觉表达经验。" },
  { date: "2024.09 —", title: "独立摄影实践", role: "摄影与影像", text: "独立完成从沟通、拍摄执行到后期交付的流程，记录人物与生活。" },
];

const toolkit = [
  { number: "01", label: "数理与金融", en: "MATHEMATICS / FINANCE", title: "从数理基础出发，理解真实问题。", text: "金融数学的学习连接了数学方法与金融问题，也让我逐渐形成从数据、假设和模型出发的分析习惯。", groups: [["数学", "数学分析 · 高等代数与几何 · 概率与数理统计 · 常微分方程"], ["金融", "金融经济学 · 证券投资与分析 · 财务管理 · 会计学"]] },
  { number: "02", label: "数据与编程", en: "DATA / ENGINEERING", title: "让数据从资料变成可分析的东西。", text: "使用 Python 处理数据、搭建研究原型，关注数据来源、清洗和不同口径之间的关系。", groups: [["编程工具", "Python · C 语言 · LaTeX · Office"], ["数据来源", "CSMAR · 东方财富 · 公司年报"]] },
  { number: "03", label: "AI 与智能体", en: "AI / AGENTS", title: "让 AI 成为研究与开发的搭档。", text: "熟练运用 Codex 与 Claude 辅助编程、项目搭建和研究，结合工具调用与多智能体协作，将想法逐步变成可运行的原型。", groups: [["方法", "Prompt Engineering · Tool Use · MCP · Multi-Agent"], ["工具", "Codex · Claude · DeepSeek Harness · ChatGPT · Gemini · Grok"]] },
  { number: "04", label: "摄影与内容", en: "VISUAL / CREATION", title: "用画面观察，也用画面表达。", text: "从前期沟通、拍摄执行到后期交付，独立完成摄影实践；也参与校园摄影与视频制作。", groups: [["创作", "摄影 · 后期处理 · 视频制作"], ["实践", "独立摄影 · 校园新媒体 · 内容创作"]] },
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 30 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function SectionLabel({ number, children }) {
  return <div className="section-label"><span>{number} /</span><span>{children}</span></div>;
}

function ProjectIllustration({ number }) {
  const labels = { "01": ["分析", "协作", "风控"], "02": ["路口 A", "协调", "路口 B"], "03": ["报表", "模型", "假设"], "04": ["文献", "Codex", "阅读"] };
  return <div className={`project-visual visual-${number}`} aria-label="项目概念示意，不代表真实运行结果"><div className="visual-grid" aria-hidden="true"/><div className="visual-connection" aria-hidden="true"/><div className="visual-points">{labels[number].map((label, index) => <span key={label} className={`visual-point point-${index}`}><i/>{label}</span>)}</div><span className="visual-caption">CONCEPTUAL VISUAL / 概念示意</span></div>;
}

function StoryIndex() {
  const chapters = [
    { number: "01", en: "THINK", title: "用数学理解世界", note: "金融 · 数据 · 模型", href: "#experience", image: "story-study.webp" },
    { number: "02", en: "MAKE", title: "让想法运行起来", note: "智能体 · 路网 · 工具", href: "#projects" },
    { number: "03", en: "OBSERVE", title: "用镜头记录世界", note: "摄影 · 视频 · 创作", href: "#visual-story", image: "section-bg.jpg" },
    { number: "04", en: "REMEMBER", title: "一起走过的时刻", note: "2026 / 数学建模", href: "#award", image: "mcm-2026.jpg" },
  ];
  return <section className="story-index wrap" aria-labelledby="story-index-title"><div className="story-index-top"><div><p>章节导览</p><h2 id="story-index-title">选择一条路径，<br/>走进我的世界<span>。</span></h2></div><span>四个章节<br/>选择感兴趣的方向</span></div><div className="chapter-grid">{chapters.map((item) => <a className={`chapter-card chapter-card-${item.number}`} href={item.href} key={item.number} style={item.image ? { "--chapter-image": `url("${import.meta.env.BASE_URL}${item.image}")` } : undefined}><div className="chapter-background" aria-hidden="true"/><div className="chapter-top"><span>{item.number} / {item.en}</span><ArrowUpRight size={17}/></div><div className="chapter-content"><h3>{item.title}</h3><p>{item.note}</p></div>{item.number === "01" && <span className="chapter-concept">概念画面</span>}</a>)}</div></section>;
}

function ProjectExplorer() {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const project = projects[selected];
  const selectRelative = (delta) => setSelected((current) => (current + delta + projects.length) % projects.length);

  return <div className="explorer">
    <div className="explorer-index" aria-label="选择项目">
      <p className="explorer-caption">项目索引 <span> / 选择一个项目</span></p>
      <div className="explorer-options">{projects.map((item, index) => <button key={item.number} type="button" aria-pressed={selected === index} className={selected === index ? "explorer-option selected" : "explorer-option"} onClick={() => setSelected(index)}><span>{item.number}</span><strong>{item.title}</strong><ArrowUpRight size={15} aria-hidden="true" /></button>)}</div>
      <div className="explorer-controls"><span>探索项目 {project.number} / 04</span><div><button type="button" aria-label="上一个项目" onClick={() => selectRelative(-1)}><ArrowLeft size={18}/></button><button type="button" aria-label="下一个项目" onClick={() => selectRelative(1)}><ArrowRight size={18}/></button></div></div>
    </div>
    <div className="explorer-stage" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait" initial={false}>
        <motion.article key={project.number} initial={reduce ? false : { opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -14 }} transition={{ duration: 0.26, ease: "easeOut" }}>
          <div className="stage-top"><span>{project.category}</span><span>✳</span></div>
          <div className="stage-title"><span className="stage-number" aria-hidden="true">{project.number}</span><p>{project.type}</p><h3>{project.title}</h3><div className="stage-english">{project.english}</div></div>
          <p className="stage-intro">{project.intro}</p>
          <ProjectIllustration number={project.number} />
          <div className="stage-details">{project.details.map((detail, i) => <p key={detail}><span>0{i + 1}</span>{detail}</p>)}</div>
          <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          {project.href && <a className="project-external" href={project.href} target="_blank" rel="noopener noreferrer">查看 GitHub 项目 <ArrowUpRight size={15} /></a>}
        </motion.article>
      </AnimatePresence>
    </div>
  </div>;
}

const visualFrames = [
  { image: "bg.jpg", title: "窗前", caption: "留一点时间，看看远方。", type: "现有图片 / 暂作展示", alt: "一人站在窗前眺望远方" },
  { image: "section-bg.jpg", title: "暮色", caption: "光线变化的时候，记下一种心情。", type: "现有图片 / 暂作展示", alt: "暮色中的人物侧影" },
  { image: "story-study.webp", title: "一张书桌的想象", caption: "把数理、技术与影像放在同一个空间里。", type: "AI 生成 / 概念画面", alt: "夜幕下有书本、相机与电脑的虚构书桌概念图" },
];

function VisualJournal() {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const frame = visualFrames[selected];
  const step = (direction) => setSelected((value) => (value + direction + visualFrames.length) % visualFrames.length);
  return <section className="visual-journal wrap" aria-labelledby="journal-title"><div className="journal-header"><div><p>影像手记</p><h2 id="journal-title">有些故事，<br/><span>适合用画面来说。</span></h2></div><span>影像集<br/>01 — 03</span></div><div className="journal-layout"><div className="journal-image" aria-live="polite"><AnimatePresence mode="wait" initial={false}><motion.img key={frame.image} src={`${import.meta.env.BASE_URL}${frame.image}`} alt={frame.alt} initial={reduce ? false : { opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: .3 }}/></AnimatePresence><span>{frame.type}</span></div><div className="journal-copy"><div className="journal-count">0{selected + 1} / 0{visualFrames.length}</div><div><p className="journal-label">影像记录</p><h3>{frame.title}</h3><p>{frame.caption}</p></div><div className="journal-footer"><p>目前先用已有图片和概念画面占位，未来可以替换成摄影作品。</p><div><button type="button" onClick={() => step(-1)} aria-label="上一张影像"><ArrowLeft size={18}/></button><button type="button" onClick={() => step(1)} aria-label="下一张影像"><ArrowRight size={18}/></button></div></div></div></div></section>;
}

function Toolkit() {
  const [active, setActive] = useState(0);
  const item = toolkit[active];
  const reduce = useReducedMotion();
  return <div className="toolkit-layout">
    <div className="toolkit-menu" aria-label="选择能力方向">{toolkit.map((topic, index) => <button className={index === active ? "toolkit-choice active" : "toolkit-choice"} key={topic.number} type="button" aria-pressed={index === active} onClick={() => setActive(index)}><span>{topic.number}</span><strong>{topic.label}</strong><span aria-hidden="true">↗</span></button>)}</div>
    <div className="toolkit-stage" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.article key={item.number} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .2 }}><div className="toolkit-top"><span>{item.en}</span><span>{item.number} / 04</span></div><h3>{item.title}</h3><p>{item.text}</p><div className="toolkit-groups">{item.groups.map(([name, detail]) => <div key={name}><span>{name}</span><p>{detail}</p></div>)}</div></motion.article></AnimatePresence></div>
  </div>;
}

function Certificate() {
  const dialogRef = useRef(null);
  const image = `${import.meta.env.BASE_URL}mcm-2026.jpg`;
  return <figure className="award-figure"><button className="award-frame award-open" type="button" onClick={() => dialogRef.current?.showModal()} aria-label="放大查看 2026 年美赛获奖照片"><img src={image} alt="2026 年美国大学生数学建模竞赛 Meritorious Winner 团队获奖证书照片" loading="lazy" /><span className="award-zoom"><Maximize2 size={15} /> 查看大图</span></button><figcaption><span>MATHEMATICAL CONTEST IN MODELING</span><span>2026 / MCM</span></figcaption><dialog className="photo-dialog" ref={dialogRef} aria-label="美赛获奖证书照片" onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}><button type="button" className="photo-close" onClick={() => dialogRef.current?.close()} aria-label="关闭大图"><X size={22} /></button><img src={image} alt="2026 年美国大学生数学建模竞赛 Meritorious Winner 团队获奖证书" /><p>2026 MCM / MERITORIOUS WINNER</p></dialog></figure>;
}

function Stars() {
  return <div className="hero-stars" aria-hidden="true">{["one", "two", "three", "four", "five", "six", "seven"].map((name) => <span className={`star star-${name}`} key={name}>✦</span>)}</div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "18%"]);

  useEffect(() => {
    function onKeyDown(event) { if (event.key === "Escape") setMenuOpen(false); }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <>
    <a className="skip-link" href="#main">跳转到主要内容</a>
    {!reduce && <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />}
    <header className="header">
      <a className="brand" href="#top" aria-label="Duan，返回首页">DUAN<span>.</span></a><span className="header-note">研究、技术与影像</span>
      <nav className="desktop-nav" aria-label="主导航">{links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
      {menuOpen && <nav className="mobile-nav" id="mobile-navigation" aria-label="移动端导航">{links.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={18}/></a>)}</nav>}
    </header>
    <main id="main">
      <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title">
        <motion.div className="hero-image" style={{ "--hero-image": `url("${import.meta.env.BASE_URL}bg.jpg")`, y: reduce ? 0 : heroY }} role="img" aria-label="一人站在窗前眺望远方" />
        <Stars />
        <div className="hero-content wrap">
          <div className="hero-topline"><span>DUAN WENXI</span><span>北京 · 中国</span></div>
          <div className="hero-copy">
            <Reveal><p className="eyebrow"><span className="dot"/> 段汶希 / 北京化工大学</p></Reveal>
            <Reveal delay={0.08}><h1 id="hero-title">用数理与 AI，<br /><span>探索真实问题</span></h1></Reveal>
            <Reveal delay={0.16}><p className="hero-description">金融数学专业学生，关注数据、智能体与影像。<br />从研究到创作，把想法变成可以体验的东西。</p><div className="hero-actions"><a className="hero-link" href="#lab">进入多智能体实验室 <ArrowDown size={17} aria-hidden="true" /></a><a className="hero-secondary" href="#projects">探索我的项目 <ArrowUpRight size={15}/></a></div></Reveal>
          </div>
          <nav className="hero-chapters" aria-label="探索章节"><span>浏览章节</span><a href="#lab"><i>01</i>实验室</a><a href="#projects"><i>02</i>项目</a><a href="#about"><i>03</i>关于我</a><a href="#award"><i>04</i>美赛</a></nav>
          <div className="hero-bottom"><span>金融数学 &nbsp; / &nbsp; AI &nbsp; / &nbsp; 影像</span><span>向下探索 ↓</span></div>
        </div>
      </section>

      <div className="path-band"><div className="wrap"><span>从问题出发，在实践中寻找答案</span><span>研究 · 构建 · 记录</span></div></div>

      <AgentLab />

      <StoryIndex />

      <section id="about" className="section about wrap">
        <Reveal><SectionLabel number="01">关于我</SectionLabel></Reveal>
        <div className="about-grid">
          <Reveal><h2>关于我<br /><span>研究、构建与记录</span></h2><p className="section-side-note">从数理基础出发<br />对不同领域保持好奇</p></Reveal>
          <Reveal className="about-copy" delay={0.08}><p className="lead">你好，我是段汶希。<br />我喜欢在不同的领域之间探索。</p><p>我在北京化工大学学习金融数学，关注证券市场，也热衷于用数据和 AI 理解复杂问题。我熟练运用 Codex 和 Claude 辅助编程、研究与项目搭建，从多智能体到交通仿真，把想法逐步变成可运行的东西。</p><p>镜头也是我认识世界的方式。学习与研究之外，我拍摄、制作视频，享受与不同背景的人交流。</p><a className="text-link" href="#experience">更多关于我的经历 <ArrowUpRight size={17} /></a></Reveal>
        </div>
        <div className="facts-grid" aria-label="个人经历概览">
          <Reveal className="fact"><strong>03<span> / 专业排名</span></strong><p>北京化工大学 · 金融数学</p></Reveal>
          <Reveal className="fact" delay={0.08}><strong>M<span> / 美赛</span></strong><p>2026 数学建模竞赛<br/>Meritorious Winner</p></Reveal>
          <Reveal className="fact" delay={0.16}><strong>04<span> / 项目方向</span></strong><p>量化 · 交通 · 金融 · 开源工具</p></Reveal>
        </div>
      </section>

      <section id="projects" className="section work wrap">
        <Reveal><SectionLabel number="02">项目与研究</SectionLabel><div className="work-heading"><div><h2>研究与作品<br /><span>从问题到实践</span></h2><p>选择一个项目，了解研究目标、方法和参与的工作。</p></div><span className="work-index">项目索引<br />01 — 04</span></div></Reveal>
        <Reveal><ProjectExplorer /></Reveal>
      </section>

      <section className="education" id="experience">
        <div className="wrap education-inner">
          <Reveal><SectionLabel number="03">学习与实践</SectionLabel><div className="education-heading"><h2>学习与实践<br /><span>把知识用起来</span></h2><p>从课堂到研究，从想法到行动。</p></div></Reveal>
          <Reveal className="education-detail"><div className="school"><p className="micro">EDUCATION / 2024.09 — 至今</p><h3>北京化工大学</h3><p>数理学院 · 金融数学本科</p><p className="school-english">BEIJING UNIVERSITY OF<br />CHEMICAL TECHNOLOGY</p></div><div className="education-notes"><div><span>01 / 学术基础</span><p>数学分析、数理统计、金融经济学、证券投资与分析、财务管理等。</p></div><div><span>02 / 技术与方法</span><p>Python、C、LaTeX；熟练运用 Codex 和 Claude 辅助开发，结合数据处理、MCP、Tool Use 与 Multi-Agent 协作。</p></div></div></Reveal>
          <div className="course-strip"><span>部分课程</span><p>数学分析 <i>✳</i> 数理统计 <i>✳</i> 金融经济学 <i>✳</i> 证券投资与分析 <i>✳</i> 财务管理</p></div>
          <div className="experience-list">{experiences.map((item,i) => <Reveal key={item.title} delay={i * 0.03}><article className="experience-row"><span className="experience-date">{item.date}</span><div><h3>{item.title}</h3><span>{item.role}</span></div><p>{item.text}</p></article></Reveal>)}</div>
        </div>
      </section>

      <section className="section toolkit-section wrap" id="toolkit"><Reveal><SectionLabel number="04">方法与工具</SectionLabel><div className="toolkit-heading"><div><h2>我的方法与工具</h2><p>数理、数据、AI 与影像，是我探索问题时经常使用的几种语言。</p></div><span>选择一个方向 ↘</span></div></Reveal><Reveal><Toolkit /></Reveal></section>

      <section className="section awards wrap" id="award"><Reveal><SectionLabel number="05">值得记住的时刻</SectionLabel><div className="award-feature"><div className="award-copy"><p className="award-kicker">2026 / MCM</p><h2>一起解题，<br /><span>一起向前</span></h2><p>2026 美国大学生数学建模竞赛<br />Meritorious Winner</p><div className="award-note"><span>✳</span> 一段值得珍藏的团队经历</div></div><Certificate /></div></Reveal></section>

      <section className="visual-story" id="visual-story" aria-label="影像与观察"><div className="visual-image" style={{ "--visual-image": `url("${import.meta.env.BASE_URL}section-bg.jpg")` }} role="img" aria-label="暮色中的人物侧影" /><Reveal className="visual-overlay wrap"><p className="micro">A DIFFERENT PERSPECTIVE / 影像与观察</p><p>换一个角度，<br />世界会有新的样子。</p><span>OBSERVE MORE. STAY CURIOUS.</span></Reveal></section>

      <VisualJournal />

      <section className="beyond wrap"><Reveal><SectionLabel number="06">影像与交流</SectionLabel><div className="beyond-heading"><h2>屏幕之外，<br/><span>还有值得记录的事</span></h2><p>研究与创作是不同的表达，也都是认识世界的方式。</p></div><div className="beyond-grid"><article><span>01 / THROUGH THE LENS</span><h3>摄影，从沟通开始</h3><p>从想法沟通到拍摄执行，再到后期与交付，摄影让我在技术之外，也学习观察和倾听。</p><div>独立摄影 / 校园影像</div></article><article><span>02 / STORIES IN MOTION</span><h3>用视频分享想法</h3><p>参与校园新媒体视频制作，也在业余时间尝试内容创作；此前全平台视频累计播放量超过 10 万。</p><div>视频制作 / 内容创作</div></article><article><span>03 / OPEN CONVERSATIONS</span><h3>在交流中发现新问题</h3><p>参与课题组讨论和学术会议，也喜欢接触不同背景的人，听他们分享正在探索的事。</p><div>学术交流 / 跨领域对话</div></article></div></Reveal></section>

      <section id="contact" className="contact wrap"><Reveal><SectionLabel number="07">联系</SectionLabel><div className="contact-main"><div><h2>有想法？<br /><span>聊聊吧</span></h2><p>很高兴认识不同背景的朋友，欢迎交流研究、创作或任何有意思的想法。</p></div><div><a className="mail-link" href="mailto:2359628970@qq.com"><span><small>写封邮件给我</small>2359628970@qq.com</span><ArrowUpRight size={26} aria-hidden="true" /></a><a className="contact-github" href="https://github.com/WinsDuan" target="_blank" rel="noopener noreferrer">GitHub / WinsDuan <ArrowUpRight size={15}/></a></div></div></Reveal></section>
    </main>
    <footer className="footer"><div className="wrap footer-inner"><a className="brand footer-brand" href="#top">DUAN<span>.</span></a><p>金融数学 · AI · 影像与创作</p><span>© {new Date().getFullYear()} DUAN WENXI</span><a href="#top">回到顶部 ↑</a></div></footer>
  </>;
}

export default App;
