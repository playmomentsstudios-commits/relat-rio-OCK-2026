create table if not exists lancamentos (
  id bigint generated always as identity primary key,
  categoria text not null,
  nome text not null,
  descricao text,
  valor_total numeric(12,2) not null default 0,
  valor_pago numeric(12,2) not null default 0,
  valor_compensado numeric(12,2) not null default 0,
  parcela text,
  status_financeiro text not null default 'parcial',
  referencia_compensacao text,
  observacao_financeira text,
  mes text,
  tipo text,
  comprovante_link text,
  created_at timestamptz not null default now()
);

create table if not exists configuracoes (
  id bigint generated always as identity primary key,
  logo_principal text,
  logo_embaixada text,
  logo_equidade text,
  logo_rede_kalunga text,
  cor_primaria text default '#D98B1F',
  cor_secundaria text default '#8C4E1D',
  textos jsonb default '{}'::jsonb
);

create table if not exists usuarios (
  id bigint generated always as identity primary key,
  email text unique not null,
  senha text not null,
  role text not null default 'admin'
);
