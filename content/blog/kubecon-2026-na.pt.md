---
title: "A IA Migrou para o Kubernetes. Depois Superou o Pod: Tendências da KubeCon NA 2026"
excerpt: "Quatro mudanças extraídas de 30 pastas de sessões na KubeCon NA 2026: agendamento, confiança, custo e recuperação — com 458 afirmações auditadas em fontes públicas."
date: 2026-11-17
readTime: 12 min read
category: Cloud Native & AI
tags:
  - kubecon
  - kubernetes
  - ai-agents
  - mcp
  - platform-engineering
  - finops
featured: true
image: /assets/kubecon2026-og.png
presentationSlug: kubecon-2026
---

## Relatório Interativo de Pesquisa e Deck de Apresentação de 35 Passos

Este artigo acompanha o relatório interativo completo da KubeCon + CloudNativeCon North America 2026 e sua apresentação integrada de 35 passos:

- **[Abrir o Relatório Interativo da KubeCon NA 2026](/kubecon-2026)** — Explore a matriz de 30 pastas de sessões, popovers de citações com 54 fontes públicas datadas, a árvore de decisão em pirâmide e o checklist exportável de segunda-feira.
- **[Iniciar o Modo Apresentação de 35 Passos em Tela Cheia](/kubecon-2026#present)** — Apresente direto do navegador com enquetes ao vivo, transições de diff `From (−) / To (+)`, notas do apresentador (`N`), atalhos de teclado (`?`) e alternância de tema (`T`).

---

## A Resposta Central

Duas em cada três organizações que hospedam modelos de IA generativa já executam inferência no Kubernetes (**66%** na pesquisa da CNCF). Porém, os dois extremos da IA — **enxames de agentes ociosos** e **jobs em escala de fronteira** — não cabem mais no contrato tradicional do pod.

O valor está subindo para **quatro promessas acima do pod**, governadas por **duas fundações**:

1. **Scheduling — O que roda, e em qual tamanho?**
   - *De:* Um pod por workload, um Node por máquina.
   - *Para:* Agentes pausados e retomados em `< 500 ms` (Agent Substrate, GKE Agent Sandbox, kagent 1.0), grupos de pods agendados juntos (Workload e PodGroup APIs em beta no Kubernetes `1.37`) e control planes sem kubelet no caminho crítico.
2. **Trust — No que o agente pode tocar?**
   - *De:* Confiar no modelo; entregar segredos a cada aplicação.
   - *Para:* Sandboxes com `default-deny` (GKE, OpenShift 5, Akamai Wasm, Agent Substrate), agentes sem segredos e gateways com identidade por escopo. O risco agora mora em padrões permissivos como o modo `audit` do NVIDIA OpenShell.
3. **Cost — O que ele consome?**
   - *De:* Preço por token vezes requisições.
   - *Para:* Tokens vezes arquitetura — execução de ferramentas via código / Code Mode (`37–99%` menos tokens nos testes da Anthropic; ativo por padrão no OpenAI Codex `v0.169.0`), carregamento diferido de ferramentas e prompt caching (`$4.20 → $0.69` em uma sessão de 20 turnos).
4. **Recovery — Como ele falha e se recupera?**
   - *De:* Reiniciar na falha; tentar novamente até funcionar.
   - *Para:* Reinicializações em ondas, leituras limitadas no watch cache (etcd RangeStream beta no K8s `1.37`) e chaves de idempotência obrigatórias em ferramentas com efeitos colaterais (já que o MCP stateless de julho de 2026 faz `0` replays em streams interrompidos).
5. **Standards (A Ponte) — Quem escreve as regras?**
   - *De:* Uma fundação, anos do Sandbox até a graduação.
   - *Para:* Duas fundações — **CNCF** hospedando runtimes e agendamento (Agent Substrate, kagent, llm-d) e a **Agentic AI Foundation (AAIF)** hospedando protocolos e gateways (MCP, A2A, Agent Router).

Explore todas as 458 afirmações auditadas e o modo apresentação completo na **[Página Interativa da KubeCon NA 2026](/kubecon-2026)**.
