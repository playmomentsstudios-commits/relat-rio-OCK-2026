import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  FileText,
  Filter,
  Home,
  Users,
  Wallet,
  X,
  Eye,
  TrendingUp,
  Layers,
  Activity,
  Search,
  ChevronDown,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoOficina from "@/imports/logo_oficina.png";
import logoEmbaixada from "@/imports/Logo_Embaixada.png";
import logoEquidade from "@/imports/Logo_Equidade__tnico_Racial.png";
import logoRedeKalunga from "@/imports/Logo_Rede_Kalunga.png";

// ─── Real data from CSV ───────────────────────────────────────────────────────

const monthlyData = [
  { month: "Fevereiro", value: 9200, comprovantes: 7 },
  { month: "Março", value: 18875, comprovantes: 13 },
  { month: "Abril", value: 48685, comprovantes: 24 },
];

// Values grouped by type, summing to R$ 76.760
const categoryData = [
  { name: "Formação e Capacitação", value: 26100, color: "#D98B1F" },
  { name: "Materiais e Alimentação", value: 20325, color: "#B8731A" },
  { name: "Comunicação e Marketing", value: 10700, color: "#8C4E1D" },
  { name: "Produção e Registro", value: 8710, color: "#C9A84C" },
  { name: "Logística e Operações", value: 7925, color: "#A0522D" },
  { name: "Gestão Financeira", value: 3000, color: "#E7D2B0" },
];

const reportData = [
  { id: 1,  categoria: "Coordenação Geral",             responsavel: "Tales Damascena de Lima",              descricao: "Coordenação geral, pedagógica e acompanhamento das atividades formativas", valor: 7500,  parcela: "3 parcelas",  mes: "Fev / Mar / Abr", comprovantes: "01, 08, 21" },
  { id: 2,  categoria: "Oficineiro(a) 1",               responsavel: "Tales Damascena de Lima",              descricao: "Oficina de comunicação ancestral e produção de podcast",                  valor: 3000,  parcela: "2 parcelas",  mes: "Mar / Abr",       comprovantes: "09, 22" },
  { id: 3,  categoria: "Oficineiro(a) 2",               responsavel: "Hígor de Torres Costa",               descricao: "Oficina de comunicação comunitária e narrativas territoriais",            valor: 3000,  parcela: "2 parcelas",  mes: "Mar / Abr",       comprovantes: "10, 23" },
  { id: 4,  categoria: "Oficineiro(a) 3",               responsavel: "Daniella Teles Maia",                 descricao: "Oficina de comunicação ancestral e estratégias de comunicação",           valor: 3000,  parcela: "2 parcelas",  mes: "Mar / Abr",       comprovantes: "11, 24" },
  { id: 5,  categoria: "Oficineiro(a) 4",               responsavel: "Isabelle de Almeida Batista",         descricao: "Oficina de fotografia e registro visual comunitário",                    valor: 3000,  parcela: "2 parcelas",  mes: "Mar / Abr",       comprovantes: "12, 25" },
  { id: 6,  categoria: "Oficineiro(a) 5",               responsavel: "Alciléia Conceição Cesário de Torres",descricao: "Oficina de audiovisual no celular e produção de conteúdo",               valor: 3000,  parcela: "2 parcelas",  mes: "Mar / Abr",       comprovantes: "13, 26" },
  { id: 7,  categoria: "Palestrante 1",                 responsavel: "Felipe da Costa Souza",               descricao: "Palestra sobre letramento digital e tecnologias",                        valor: 1200,  parcela: "Única",       mes: "Abril",           comprovantes: "27" },
  { id: 8,  categoria: "Palestrante 2",                 responsavel: "Ligia Lie Taakara Ishikawa",          descricao: "Palestra sobre educação ginecológica e saúde física",                    valor: 1200,  parcela: "Única",       mes: "Abril",           comprovantes: "28" },
  { id: 9,  categoria: "Palestrante 3",                 responsavel: "Emanuely de Oliveira",                descricao: "Palestra sobre saúde mental e cuidado coletivo",                        valor: 1200,  parcela: "Única",       mes: "Abril",           comprovantes: "29" },
  { id: 10, categoria: "Monitor Escolar 1",             responsavel: "Lourdes Fernandes de Souza",          descricao: "Apoio pedagógico, mobilização e acompanhamento das oficinas",            valor: 1200,  parcela: "Única",       mes: "Abril",           comprovantes: "30" },
  { id: 11, categoria: "Monitor Escolar 2",             responsavel: "Clarici Fernandes de Souza",          descricao: "Apoio pedagógico, mobilização e acompanhamento das oficinas",            valor: 1200,  parcela: "Única",       mes: "Abril",           comprovantes: "31" },
  { id: 12, categoria: "Monitor Escolar 3",             responsavel: "Quitiane Fernandes de Souza",         descricao: "Apoio pedagógico, mobilização e acompanhamento das oficinas",            valor: 1200,  parcela: "Única",       mes: "Abril",           comprovantes: "32" },
  { id: 13, categoria: "Gestora de Redes Sociais",      responsavel: "Alciléia Conceição Cesário de Torres",descricao: "Cobertura audiovisual e produção de conteúdo para redes sociais",        valor: 3000,  parcela: "3 parcelas",  mes: "Fev / Mar / Abr", comprovantes: "02, 14, 33" },
  { id: 14, categoria: "Assessora de Imprensa",         responsavel: "Hígor de Torres Costa",               descricao: "Assessoria de imprensa, comunicação institucional e divulgação",         valor: 3000,  parcela: "3 parcelas",  mes: "Fev / Mar / Abr", comprovantes: "03, 15, 34" },
  { id: 15, categoria: "Marketing Digital",             responsavel: "Daniella Teles Maia",                 descricao: "Marketing digital, planejamento e comunicação do projeto",                valor: 3000,  parcela: "3 parcelas",  mes: "Fev / Mar / Abr", comprovantes: "04, 16, 35" },
  { id: 16, categoria: "Designer Gráfico",              responsavel: "Felipe da Costa Souza",               descricao: "Criação das artes gráficas e identidade visual do projeto",              valor: 1700,  parcela: "1ª parcela",  mes: "Fevereiro",       comprovantes: "05" },
  { id: 17, categoria: "Fotógrafa",                     responsavel: "Isabelle de Almeida Batista",         descricao: "Cobertura fotográfica das ações, atividades, equipe e participantes",    valor: 2000,  parcela: "Única",       mes: "Abril",           comprovantes: "36" },
  { id: 18, categoria: "Assistente de Produção Cultural",responsavel: "Tainam Malta Souza",                 descricao: "Assistência de produção artística, cenografia, decoração e desfile",    valor: 3200,  parcela: "2 parcelas",  mes: "Mar / Abr",       comprovantes: "17, 37" },
  { id: 19, categoria: "Assistente de Logística",       responsavel: "Cleiberson dos Santos Paulino",       descricao: "Operação logística, apoio estrutural e acompanhamento das atividades",   valor: 3000,  parcela: "3 parcelas",  mes: "Fev / Mar / Abr", comprovantes: "06, 18, 38" },
  { id: 20, categoria: "Materiais Pedagógicos",         responsavel: "Tales Damascena de Lima",              descricao: "Passagens, cadernetas, materiais de papelaria, kits dos participantes", valor: 8600,  parcela: "Única",       mes: "Abril",           comprovantes: "39" },
  { id: 21, categoria: "Alimentação e Logística",       responsavel: "Tales Damascena de Lima",              descricao: "Alimentação, supermercado, transporte e apoio logístico operacional",   valor: 8125,  parcela: "Única",       mes: "Abril",           comprovantes: "40" },
  { id: 22, categoria: "Hospedagem Comunitária",        responsavel: "Quita de Souza Ribeiro",               descricao: "Hospedagem comunitária dos oficineiros e palestrantes",                 valor: 1500,  parcela: "Única",       mes: "Abril",           comprovantes: "41" },
  { id: 23, categoria: "Alimentação Coletiva",          responsavel: "Quita de Souza Ribeiro",               descricao: "Alimentação coletiva distribuída entre 3 cozinheiras da comunidade",   valor: 3600,  parcela: "Única",       mes: "Abril",           comprovantes: "42" },
  { id: 24, categoria: "Camisetas 3ª Edição",           responsavel: "Izael Ferreira de Freitas",            descricao: "Produção gráfica e confecção das camisetas do projeto",                 valor: 4550,  parcela: "1ª parcela",  mes: "Março",           comprovantes: "19" },
  { id: 25, categoria: "Gráfica, Banners e Comunicação Visual",responsavel: "Tainam Malta Souza / Paulo Guedes",descricao: "Produção de banner e estrutura de comunicação visual",             valor: 1060,  parcela: "Única",       mes: "Abril",           comprovantes: "43" },
  { id: 26, categoria: "Prestação de Contas",           responsavel: "Nãnan da Silva Souza Matos",           descricao: "Organização financeira, relatório e prestação de contas do projeto",   valor: 3000,  parcela: "3 parcelas",  mes: "Fev / Mar / Abr", comprovantes: "07, 20, 44" },
];

type Page = "dashboard" | "relatorio";

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [selectedMonth, setSelectedMonth] = useState<string>("todos");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<(typeof reportData)[0] | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const filteredReport = reportData.filter((item) => {
    const monthOk =
      selectedMonth === "todos" ||
      item.mes.toLowerCase().includes(selectedMonth.toLowerCase());
    const catOk =
      selectedCategory === "todas" ||
      item.categoria.toLowerCase().includes(selectedCategory.toLowerCase());
    return monthOk && catOk;
  });

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0B0B0B]/85 border-b border-[#D98B1F]/20">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
              <ImageWithFallback src={logoOficina} alt="KALUNGA Oficina de Comunicação" className="h-8 w-auto object-contain" />
              <span className="text-[#E7D2B0]/60 text-sm font-light hidden md:block">Oficina de Comunicação</span>
            </motion.div>

            <div className="flex gap-1">
              {(["dashboard", "relatorio"] as Page[]).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    currentPage === page
                      ? "bg-[#D98B1F] text-[#0B0B0B] shadow-lg shadow-[#D98B1F]/25"
                      : "text-[#E7D2B0] hover:bg-[#D98B1F]/10"
                  }`}
                >
                  {page === "dashboard" ? <Home className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  {page === "dashboard" ? "Dashboard" : "Relatório Geral"}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 rounded-lg bg-[#D98B1F]/10 text-[#D98B1F] hover:bg-[#D98B1F]/20 transition-all flex items-center gap-2 text-sm"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:block">Filtros</span>
          </button>
        </div>
      </nav>

      {/* ── Filter Sidebar ── */}
      <motion.div
        initial={false}
        animate={{ x: showFilters ? 0 : 360 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed right-0 top-0 bottom-0 w-72 bg-[#111]/95 backdrop-blur-2xl border-l border-[#D98B1F]/20 z-50 p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-[#D98B1F]">Filtros</h3>
          <button onClick={() => setShowFilters(false)} className="p-1.5 hover:bg-[#D98B1F]/10 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <FilterGroup label="Mês" options={["todos", "Fevereiro", "Março", "Abril"]} value={selectedMonth} onChange={setSelectedMonth} />
        <FilterGroup
          label="Categoria"
          options={["todas", "Coordenação", "Oficineiro", "Palestrante", "Monitor", "Comunicação", "Marketing", "Produção", "Logística", "Materiais", "Alimentação", "Gestão"]}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </motion.div>

      {/* ── Main ── */}
      <main className="pt-20 pb-16 px-4 md:px-6">
        {currentPage === "dashboard" ? (
          <DashboardPage />
        ) : (
          <RelatorioPage data={filteredReport} onViewEntry={setSelectedEntry} />
        )}
      </main>

      {/* ── Entry Detail Modal ── */}
      <Dialog.Root open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-xl bg-[#141414] rounded-2xl border border-[#D98B1F]/25 shadow-2xl shadow-[#D98B1F]/10 z-50 overflow-hidden">
            <div className="p-5 border-b border-[#D98B1F]/20 flex items-center justify-between">
              <Dialog.Title className="font-bold text-[#D98B1F]">{selectedEntry?.categoria}</Dialog.Title>
              <Dialog.Close className="p-1.5 hover:bg-[#D98B1F]/10 rounded-lg transition-all">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>
            {selectedEntry && (
              <div className="p-6 space-y-4">
                <Row label="Responsável" value={selectedEntry.responsavel} />
                <Row label="Descrição" value={selectedEntry.descricao} />
                <Row label="Período" value={selectedEntry.mes} />
                <Row label="Parcela" value={selectedEntry.parcela} />
                <Row label="Comprovantes" value={selectedEntry.comprovantes} />
                <div className="pt-2 border-t border-[#D98B1F]/20">
                  <p className="text-xs text-[#8C4E1D] mb-1">Valor Total</p>
                  <p className="text-3xl font-bold text-[#D98B1F]">
                    R${" "}{selectedEntry.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// ─── Helper sub-components ────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#8C4E1D] mb-0.5">{label}</p>
      <p className="text-[#F5F5F5] text-sm">{value}</p>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-[#E7D2B0]/60 uppercase tracking-widest mb-3">{label}</p>
      <div className="space-y-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              value === opt
                ? "bg-[#D98B1F] text-[#0B0B0B] font-medium"
                : "text-[#E7D2B0] hover:bg-[#D98B1F]/10"
            }`}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8">

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-[#D98B1F]/20 p-8 md:p-14"
        style={{ background: "linear-gradient(135deg, #0B0B0B 0%, #141414 50%, #0B0B0B 100%)" }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D98B1F] opacity-[0.06] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8C4E1D] opacity-[0.08] blur-[80px] pointer-events-none" />

        {/* African geometric pattern */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M0 0L30 30L0 60M60 0L30 30L60 60M30 0L0 30L30 60L60 30Z" stroke="#D98B1F" strokeWidth="0.8" fill="none" />
                <rect x="22" y="22" width="16" height="16" stroke="#D98B1F" strokeWidth="0.6" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geo)" />
          </svg>
        </div>

        <div className="relative z-10 text-center space-y-6">
          {/* Main logo */}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }}>
            <div className="relative inline-block">
              <ImageWithFallback src={logoOficina} alt="KALUNGA" className="h-20 md:h-28 w-auto object-contain mx-auto" />
              <div className="absolute inset-0 blur-3xl bg-[#D98B1F] opacity-20 pointer-events-none" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-1">
            <h2 className="text-xl md:text-2xl font-medium text-[#E7D2B0]">Dashboard Interativo de Prestação de Contas</h2>
            <p className="text-sm text-[#8C4E1D]">Oficina de Comunicação Kalunga · Fevereiro – Abril 2024</p>
          </motion.div>

          {/* KPI */}
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }} className="inline-block">
            <div className="bg-[#D98B1F]/10 backdrop-blur-xl border border-[#D98B1F]/30 rounded-2xl px-10 py-6 shadow-2xl shadow-[#D98B1F]/10">
              <p className="text-xs font-semibold text-[#E7D2B0]/60 uppercase tracking-widest mb-1">Valor Total Executado</p>
              <p className="text-5xl md:text-6xl font-bold text-[#D98B1F] tracking-tight">R$ 76.760,00</p>
            </div>
          </motion.div>

          {/* Partner logos */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <PartnerLogo src={logoEmbaixada} alt="Embaixada da Irlanda no Brasil" />
            <PartnerLogo src={logoEquidade} alt="Edital Equidade Étnico-Racial" />
            <PartnerLogo src={logoRedeKalunga} alt="Rede Kalunga Comunicações" />
          </motion.div>
        </div>
      </motion.section>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<Wallet className="w-5 h-5" />}  label="Embaixada da Irlanda"           value="R$ 53.181,07" delay={0}   />
        <KpiCard icon={<TrendingUp className="w-5 h-5" />} label="Edital Equidade Étnico-racial" value="R$ 23.578,93" delay={0.08} />
        <KpiCard icon={<FileText className="w-5 h-5" />} label="Comprovantes"                  value="44"           delay={0.16} />
        <KpiCard icon={<Users className="w-5 h-5" />}   label="Oficinas Realizadas"            value="5"            delay={0.24} />
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Donut — category breakdown */}
        <ChartCard title="Distribuição dos Recursos" delay={0.3}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {categoryData.map((entry, i) => (
                  <Cell key={`pie-cell-${i}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(217,139,31,0.25)", borderRadius: "10px", color: "#F5F5F5", fontSize: "13px" }}
                formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((cat, i) => (
              <div key={`legend-${i}`} className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-[#E7D2B0] truncate">{cat.name}</span>
                <span className="text-xs text-[#8C4E1D] ml-auto shrink-0">
                  {Math.round((cat.value / 76760) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Bar — monthly execution */}
        <ChartCard title="Execução Mensal" delay={0.38}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D98B1F14" vertical={false} />
              <XAxis dataKey="month" stroke="#E7D2B060" tick={{ fontSize: 12, fill: "#E7D2B0" }} axisLine={false} tickLine={false} />
              <YAxis stroke="transparent" tick={{ fontSize: 11, fill: "#8C4E1D" }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(217,139,31,0.25)", borderRadius: "10px", color: "#F5F5F5", fontSize: "13px" }}
                formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "Executado"]}
                cursor={{ fill: "rgba(217,139,31,0.06)" }}
              />
              <Bar dataKey="value" fill="#D98B1F" radius={[6, 6, 0, 0]} maxBarSize={72} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4 justify-center">
            {monthlyData.map((m) => (
              <div key={m.month} className="text-center">
                <p className="text-xs text-[#8C4E1D]">{m.month.slice(0, 3)}</p>
                <p className="text-sm font-semibold text-[#D98B1F]">{m.comprovantes} comp.</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      {/* Horizontal bar — category detail */}
      <section>
        <ChartCard title="Detalhamento por Categoria" delay={0.46}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D98B1F14" horizontal={false} />
              <XAxis type="number" stroke="transparent" tick={{ fontSize: 11, fill: "#8C4E1D" }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11, fill: "#E7D2B0" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(217,139,31,0.25)", borderRadius: "10px", color: "#F5F5F5", fontSize: "13px" }}
                formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, ""]}
                cursor={{ fill: "rgba(217,139,31,0.06)" }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={32}>
                {categoryData.map((entry, i) => (
                  <Cell key={`hbar-cell-${i}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard icon={<Activity className="w-8 h-8" />} label="Palestras" value="3" delay={0.52} />
        <StatCard icon={<Calendar className="w-8 h-8" />} label="Meses de Execução" value="3" delay={0.58} />
        <StatCard icon={<Layers className="w-8 h-8" />} label="Categorias Ativas" value="6" delay={0.64} />
      </section>
    </div>
  );
}

// ─── Relatório Page ───────────────────────────────────────────────────────────

function RelatorioPage({
  data,
  onViewEntry,
}: {
  data: typeof reportData;
  onViewEntry: (entry: (typeof reportData)[0]) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = data.filter(
    (item) =>
      item.categoria.toLowerCase().includes(search.toLowerCase()) ||
      item.responsavel.toLowerCase().includes(search.toLowerCase()) ||
      item.mes.toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((acc, item) => acc + item.valor, 0);

  return (
    <div className="max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#D98B1F] mb-1">Relatório Geral</h1>
          <p className="text-sm text-[#8C4E1D]">Prestação de contas detalhada · {filtered.length} registros</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C4E1D]" />
          <input
            type="text"
            placeholder="Buscar por categoria, responsável..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 pl-9 pr-4 py-2 bg-[#141414]/70 border border-[#D98B1F]/20 rounded-xl text-sm text-[#F5F5F5] placeholder-[#8C4E1D] focus:outline-none focus:border-[#D98B1F]/50 transition-all"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#141414]/50 backdrop-blur-xl rounded-2xl border border-[#D98B1F]/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D98B1F]/15">
                {["#", "Categoria", "Responsável", "Período", "Parcela", "Valor", ""].map((h, i) => (
                  <th key={`th-${i}`} className="text-left px-4 py-3 text-xs font-semibold text-[#8C4E1D] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="border-b border-[#D98B1F]/08 hover:bg-[#D98B1F]/04 transition-colors group"
                >
                  <td className="px-4 py-3 text-xs text-[#8C4E1D] w-10">{item.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D98B1F] shrink-0" />
                      <span className="text-sm text-[#F5F5F5] font-medium leading-tight">{item.categoria}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#E7D2B0] max-w-[180px]">
                    <span className="truncate block">{item.responsavel}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#E7D2B0] whitespace-nowrap">{item.mes}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-[#D98B1F]/12 text-[#D98B1F]">{item.parcela}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#D98B1F] whitespace-nowrap">
                    R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewEntry(item)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D98B1F]/10 text-[#D98B1F] hover:bg-[#D98B1F] hover:text-[#0B0B0B] transition-all text-xs font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Detalhes
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-[#D98B1F]/04 border-t border-[#D98B1F]/15 flex items-center justify-between">
          <span className="text-sm text-[#E7D2B0]">
            <span className="font-semibold text-[#F5F5F5]">{filtered.length}</span> registros · {filtered.length} comprovantes
          </span>
          <div className="text-right">
            <p className="text-xs text-[#8C4E1D] mb-0.5">Total filtrado</p>
            <p className="text-2xl font-bold text-[#D98B1F]">
              R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Reusable components ──────────────────────────────────────────────────────

function PartnerLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="bg-white/95 rounded-xl px-4 py-2.5 flex items-center justify-center" style={{ minWidth: 120, maxWidth: 160 }}>
      <ImageWithFallback src={src} alt={alt} className="h-10 w-auto object-contain" />
    </div>
  );
}

function KpiCard({ icon, label, value, delay }: { icon: React.ReactNode; label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="group relative bg-[#141414]/60 backdrop-blur-xl rounded-2xl border border-[#D98B1F]/20 p-5 overflow-hidden transition-all hover:border-[#D98B1F]/40 hover:shadow-xl hover:shadow-[#D98B1F]/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#D98B1F]/0 to-[#D98B1F]/08 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="p-2 rounded-lg bg-[#D98B1F]/10 text-[#D98B1F] w-fit mb-4 group-hover:bg-[#D98B1F] group-hover:text-[#0B0B0B] transition-all">
          {icon}
        </div>
        <p className="text-xs text-[#8C4E1D] mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#F5F5F5]">{value}</p>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#141414]/50 backdrop-blur-xl rounded-2xl border border-[#D98B1F]/20 p-6"
    >
      <h3 className="text-base font-bold text-[#D98B1F] mb-5">{title}</h3>
      {children}
    </motion.div>
  );
}

function StatCard({ icon, label, value, delay }: { icon: React.ReactNode; label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-gradient-to-br from-[#D98B1F]/10 to-[#8C4E1D]/08 rounded-2xl border border-[#D98B1F]/20 p-8 text-center"
    >
      <div className="inline-flex p-4 rounded-2xl bg-[#D98B1F]/10 text-[#D98B1F] mb-4">{icon}</div>
      <p className="text-4xl font-bold text-[#F5F5F5] mb-1">{value}</p>
      <p className="text-sm text-[#E7D2B0]">{label}</p>
    </motion.div>
  );
}
