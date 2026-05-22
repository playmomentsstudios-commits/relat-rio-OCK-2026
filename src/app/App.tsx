import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap,
} from "recharts";
import { Eye, FileText, Home, Plus, Settings } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

const FUNDING = [
  { name: "Embaixada da Irlanda", value: 53181.07, color: "#D98B1F" },
  { name: "Edital Equidade Étnico-racial", value: 23578.93, color: "#8C4E1D" },
];

type Lancamento = {
  id: number; categoria: string; nome: string; descricao: string; valor_total: number; valor_pago: number;
  valor_compensado: number; parcela: string; status_financeiro: "pago" | "compensado" | "parcial";
  referencia_compensacao: string; observacao_financeira: string; mes: string; tipo: string; comprovante_link: string;
};

const lancamentosIniciais: Lancamento[] = [
  { id: 1, categoria: "Materiais", nome: "Camisetas 3ª edição", descricao: "Produção gráfica e confecção", valor_total: 4650, valor_pago: 2275, valor_compensado: 2375, parcela: "Única", status_financeiro: "compensado", referencia_compensacao: "rubrica_materiais_pedagogicos", observacao_financeira: "O valor restante foi executado dentro da rubrica de materiais pedagógicos e apoio às atividades comunitárias.", mes: "Março", tipo: "Despesa", comprovante_link: "https://drive.google.com/file/d/FILE_ID/view" },
  { id: 2, categoria: "Materiais", nome: "Materiais pedagógicos, mobilidade e apoio", descricao: "Passagens, kits e apoio comunitário", valor_total: 8600, valor_pago: 8600, valor_compensado: 0, parcela: "Única", status_financeiro: "pago", referencia_compensacao: "", observacao_financeira: "Rubrica absorveu compensação de camisetas", mes: "Abril", tipo: "Despesa", comprovante_link: "" },
  { id: 3, categoria: "Coordenação", nome: "Coordenação geral", descricao: "Coordenação pedagógica", valor_total: 7500, valor_pago: 7500, valor_compensado: 0, parcela: "3 parcelas", status_financeiro: "pago", referencia_compensacao: "", observacao_financeira: "", mes: "Fev/Mar/Abr", tipo: "RH", comprovante_link: "" },
  { id: 4, categoria: "Comunicação", nome: "Assessoria imprensa", descricao: "Comunicação institucional", valor_total: 3000, valor_pago: 3000, valor_compensado: 0, parcela: "3 parcelas", status_financeiro: "pago", referencia_compensacao: "", observacao_financeira: "", mes: "Fev/Mar/Abr", tipo: "RH", comprovante_link: "" },
];

const totalProjeto = 76760;
const meses = ["Fevereiro", "Março", "Abril"];

const driveMeta = (link: string) => {
  const match = link.match(/\/d\/([^/]+)/);
  if (!match) return null;
  const id = match[1];
  return {
    preview: `https://drive.google.com/file/d/${id}/preview`,
    embed: `https://drive.google.com/file/d/${id}/preview`,
    download: `https://drive.google.com/uc?export=download&id=${id}`,
  };
};

export default function App() {
  const [page, setPage] = useState<"dashboard" | "relatorio" | "admin">("dashboard");
  const [lancamentos, setLancamentos] = useState(lancamentosIniciais);
  const [selected, setSelected] = useState<Lancamento | null>(null);

  const kpis = useMemo(() => {
    const totalPago = lancamentos.reduce((a, b) => a + b.valor_pago, 0);
    const totalComp = lancamentos.reduce((a, b) => a + b.valor_compensado, 0);
    const compCount = lancamentos.filter((l) => l.status_financeiro === "compensado").length;
    return { totalPago, totalComp, exec: ((totalPago + totalComp) / totalProjeto) * 100, comprovantes: lancamentos.filter((l) => l.comprovante_link).length, compCount };
  }, [lancamentos]);

  const porCategoria = useMemo(() => {
    const map = new Map<string, number>();
    lancamentos.forEach((l) => map.set(l.categoria, (map.get(l.categoria) ?? 0) + l.valor_total));
    return Array.from(map.entries()).map(([name, value], i) => ({ name, value, fill: ["#D98B1F", "#B8731A", "#8C4E1D", "#E7D2B0"][i % 4] }));
  }, [lancamentos]);

  return <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] p-4 md:p-8 space-y-6">
    <header className="flex gap-2">{["dashboard", "relatorio", "admin"].map((p) => <button key={p} onClick={() => setPage(p as any)} className={`px-4 py-2 rounded-xl ${page === p ? "bg-[#D98B1F] text-black" : "bg-[#161616]"}`}>{p === "dashboard" ? <Home className="inline w-4" /> : p === "relatorio" ? <FileText className="inline w-4" /> : <Settings className="inline w-4" />} <span className="ml-2 capitalize">{p}</span></button>)}</header>

    {page === "dashboard" && <section className="grid lg:grid-cols-2 gap-4">
      <Card title="KPIs institucionais">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <K label="Valor total" value={`R$ ${totalProjeto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
          <K label="% executado" value={`${kpis.exec.toFixed(1)}%`} />
          <K label="Total pago" value={`R$ ${kpis.totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
          <K label="Total compensado" value={`R$ ${kpis.totalComp.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
          <K label="Comprovantes" value={String(kpis.comprovantes)} />
          <K label="Compensações" value={String(kpis.compCount)} />
        </div>
      </Card>
      <Card title="Origem dos recursos (Donut)"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={FUNDING} dataKey="value" innerRadius={60} outerRadius={95}>{FUNDING.map((f) => <Cell key={f.name} fill={f.color} />)}</Pie><Tooltip formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} /></PieChart></ResponsiveContainer></Card>
      <Card title="Execução por mês (Bar)"><ResponsiveContainer width="100%" height={260}><BarChart data={meses.map((m, i) => ({ month: m, value: [9200, 18875, 48685][i] }))}><CartesianGrid stroke="#ffffff14" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#D98B1F" /></BarChart></ResponsiveContainer></Card>
      <Card title="Distribuição por categoria (Treemap)"><ResponsiveContainer width="100%" height={260}><Treemap data={porCategoria} dataKey="value" stroke="#0B0B0B" fill="#D98B1F" /></ResponsiveContainer></Card>
    </section>}

    {page === "relatorio" && <Card title="Relatório financeiro completo"><div className="overflow-auto"><table className="w-full text-sm"><thead><tr className="text-left text-[#E7D2B0]"><th>Categoria</th><th>Responsável</th><th>Valor</th><th>Status</th><th>Pago</th><th>Compensado</th><th>Comprovante</th><th></th></tr></thead><tbody>{lancamentos.map((l) => <tr key={l.id} className="border-t border-white/10"><td>{l.categoria}</td><td>{l.nome}</td><td>R$ {l.valor_total.toFixed(2)}</td><td>{l.status_financeiro}</td><td>{l.valor_pago}</td><td>{l.valor_compensado}</td><td>{l.comprovante_link ? "Sim" : "-"}</td><td><button onClick={() => setSelected(l)}><Eye className="w-4" /></button></td></tr>)}</tbody></table></div></Card>}

    {page === "admin" && <Admin lancamentos={lancamentos} setLancamentos={setLancamentos} />}

    <Dialog.Root open={!!selected} onOpenChange={() => setSelected(null)}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 bg-black/80" /><Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#121212] p-5 rounded-2xl w-[90vw] max-w-xl border border-[#D98B1F]/30">{selected && <div className="space-y-2"><h3 className="text-[#D98B1F] text-lg">{selected.nome}</h3><p>{selected.descricao}</p><p>Status: {selected.status_financeiro}</p><p>Obs: {selected.observacao_financeira}</p>{selected.comprovante_link && (() => {const gm = driveMeta(selected.comprovante_link); return gm ? <iframe title="preview" src={gm.preview} className="w-full h-56 rounded-lg" /> : <a href={selected.comprovante_link} target="_blank">Abrir comprovante</a>;})()} </div>}</Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>;
}

function Admin({ lancamentos, setLancamentos }: { lancamentos: Lancamento[]; setLancamentos: React.Dispatch<React.SetStateAction<Lancamento[]>> }) {
  const add = () => setLancamentos((prev) => [...prev, { id: Date.now(), categoria: "Nova categoria", nome: "Novo lançamento", descricao: "", valor_total: 0, valor_pago: 0, valor_compensado: 0, parcela: "Única", status_financeiro: "parcial", referencia_compensacao: "", observacao_financeira: "", mes: "Abril", tipo: "Despesa", comprovante_link: "" }]);
  return <Card title="Painel administrativo (1 administrador)"><button onClick={add} className="mb-3 bg-[#D98B1F] text-black px-3 py-2 rounded-lg"><Plus className="inline w-4" /> Novo lançamento</button><p className="text-sm text-[#E7D2B0]">CRUD disponível para edição local de lançamentos, campos financeiros, vínculo de compensação e comprovantes.</p><div className="mt-3 space-y-2">{lancamentos.map((l) => <div key={l.id} className="bg-black/30 border border-white/10 p-2 rounded-lg text-xs">{l.nome} · {l.status_financeiro} · ref: {l.referencia_compensacao || "-"}</div>)}</div></Card>;
}

const Card = ({ title, children }: any) => <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141414]/90 border border-[#D98B1F]/20 rounded-2xl p-4"><h2 className="text-[#D98B1F] mb-3 font-semibold">{title}</h2>{children}</motion.div>;
const K = ({ label, value }: { label: string; value: string }) => <div className="bg-black/20 p-2 rounded-lg"><div className="text-[#E7D2B0] text-xs">{label}</div><div className="text-[#F5F5F5] font-semibold">{value}</div></div>;
