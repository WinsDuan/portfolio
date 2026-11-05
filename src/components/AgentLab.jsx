import { useEffect, useState } from "react";
import { ArrowRight, Pause, Play, RotateCcw } from "lucide-react";

// Prewritten examples demonstrate interaction only; they never call a model or market API.
const scenarios = [
  {
    id: "uncertainty", short: "信息不完整", title: "信息不完整时，团队如何决策？", question: "假设：一项研究只有部分财务资料，市场预期不一致。是否立刻给出判断？",
    turns: [
      { role: "分析", text: "先区分已知资料与待验证假设。仅凭部分财务资料，无法可靠判断趋势。" },
      { role: "质疑", text: "市场预期分歧可能来自不同时间范围和数据口径，需要检查比较基础。" },
      { role: "风控", text: "缺失信息会放大判断误差。建议暂缓结论，并列出必须补充的数据。" },
      { role: "决策", text: "先补齐资料，再开展情景分析；当前保留观点，不给出确定性判断。" },
    ], takeaway: "先界定不确定性，再决定下一步。",
  },
  {
    id: "volatility", short: "波动与风险", title: "波动放大时，先看什么？", question: "假设：一个模拟组合近期波动上升，但收益变化的原因尚不清楚。团队如何讨论？",
    turns: [
      { role: "分析", text: "先拆分组合波动的来源，检查资产之间的相关性与风险暴露。" },
      { role: "质疑", text: "短期波动不一定代表长期趋势。也要检查所用样本是否具有代表性。" },
      { role: "风控", text: "对不同压力情景进行测试，确认极端情况下的潜在损失与约束。" },
      { role: "决策", text: "在完成归因和压力测试前，避免只依据单一指标调整模拟策略。" },
    ], takeaway: "在行动之前，先理解风险从哪里来。",
  },
  {
    id: "data", short: "数据口径", title: "两个数据源给出不同结果？", question: "假设：两份模拟报表中的同一指标不一致，研究流程应该怎样继续？",
    turns: [
      { role: "分析", text: "核对统计区间、单位、合并范围与指标定义，定位差异出现在哪里。" },
      { role: "质疑", text: "还要检查修订版本和缺失数据，不能只因为数字相近就合并使用。" },
      { role: "风控", text: "在来源和口径确认之前，标记不确定性，避免把差异传递到后续结论。" },
      { role: "决策", text: "保留两份来源及核对记录，统一口径后再继续建模。" },
    ], takeaway: "可信的结论，始于可追溯的数据。",
  },
];

const roles = ["分析", "质疑", "风控", "决策"];

export default function AgentLab() {
  const [scenario, setScenario] = useState(0);
  const [shown, setShown] = useState(0);
  const [status, setStatus] = useState("idle");
  const example = scenarios[scenario];

  useEffect(() => {
    if (status !== "running") return;
    if (shown >= example.turns.length) { setStatus("complete"); return; }
    const timer = window.setTimeout(() => setShown((value) => value + 1), 1200);
    return () => window.clearTimeout(timer);
  }, [shown, status, example]);

  const choose = (index) => { setScenario(index); setShown(0); setStatus("idle"); };
  const run = () => {
    if (status === "running") { setStatus("paused"); return; }
    if (status === "complete") setShown(0);
    setStatus("running");
  };
  const reset = () => { setShown(0); setStatus("idle"); };
  const buttonLabel = status === "running" ? "暂停推演" : status === "paused" ? "继续推演" : status === "complete" ? "重新推演" : "开始推演";

  return <section id="lab" className="lab-section" aria-labelledby="lab-title">
    <div className="wrap lab-wrap">
      <div className="lab-heading"><div><div className="lab-kicker">互动实验 / 01</div><h2 id="lab-title">多智能体协作，<br/><em>一次决策推演</em></h2><p>选择一个问题，观察分析、质疑、风控和决策如何依次回应。</p></div><div className="lab-intro-note"><span>协作实验室</span><p>选择情境后开始，完整过程约 5 秒。</p></div></div>
      <div className="lab-interface">
        <div className="lab-toolbar"><div><span className="lab-status-dot"/> 协作推演</div><span>预设脚本 · 非实时模型</span></div>
        <div className="lab-body">
          <div className="lab-settings"><p className="lab-overline">选择情境</p><div className="scenario-list" aria-label="选择演示情境">{scenarios.map((item, index) => <button key={item.id} type="button" onClick={() => choose(index)} aria-pressed={index === scenario} className={index === scenario ? "scenario-button active" : "scenario-button"}><span>0{index + 1}</span><strong>{item.short}</strong><ArrowRight size={15}/></button>)}</div><div className="lab-question"><span>当前问题</span><h3>{example.title}</h3><p>{example.question}</p></div><div className="lab-actions"><button type="button" className="lab-run" onClick={run}>{status === "running" ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}{buttonLabel}</button><button type="button" className="lab-reset" onClick={reset} aria-label="重置演示"><RotateCcw size={17}/></button></div></div>
          <div className="lab-stage"><div className="lab-stage-top"><span>协作过程</span><span>{status === "idle" ? "准备就绪" : status === "paused" ? "已暂停" : status === "complete" ? "推演完成" : "推演中"}</span></div><div className="agent-rail" aria-label="参与的角色">{roles.map((role, i) => <div className={shown > i ? "agent-dot active" : "agent-dot"} key={role}><span>{String(i + 1).padStart(2,"0")}</span><strong>{role}</strong><i/></div>)}</div><div className="lab-log" aria-live="polite" aria-relevant="additions">{shown === 0 ? <div className="lab-empty"><span>01 — 04</span><p>选择情境，开始推演</p><small>{status === "paused" ? "点击“继续推演”，观察各角色的思考过程。" : "点击“开始推演”，观察各角色的思考过程。"}</small></div> : example.turns.slice(0,shown).map((turn,i) => <div className="lab-message" key={`${example.id}-${turn.role}`}><span className="message-number">0{i+1}</span><div><strong>{turn.role} <small> / {i===0 ? "ANALYST" : i===1 ? "CHALLENGER" : i===2 ? "RISK" : "DECISION"}</small></strong><p>{turn.text}</p></div></div>)}{status === "complete" && <div className="lab-result"><span>推演结语</span><strong>{example.takeaway}</strong></div>}</div><div className="lab-disclaimer">此处为预先编写的虚构情境，用于展示协作流程，不连接真实模型或市场数据。</div></div>
        </div>
      </div>
    </div>
  </section>;
}
