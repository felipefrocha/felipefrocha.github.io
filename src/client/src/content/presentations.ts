import type { SupportedLanguage } from '@/lib/i18n';

export interface PresentationSection {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
}

export interface PresentationMetric {
  label: string;
  value: string;
  note: string;
}

export interface PresentationContent {
  title: string;
  subtitle: string;
  kicker: string;
  articleSlug: string;
  metrics: PresentationMetric[];
  sections: PresentationSection[];
  actionTitle: string;
  actionBody: string;
}

export interface Presentation {
  slug: string;
  accent: 'blue' | 'teal' | 'amber';
  translations: Record<SupportedLanguage, PresentationContent>;
}

export const presentations: Presentation[] = [
  {
    slug: 'production-ai-agents',
    accent: 'teal',
    translations: {
      en: {
        title: 'Architecting the Enterprise for Production AI Agents',
        subtitle: 'A board-level view of the infrastructure, governance, and measurement model required to move from AI-assisted work to governed autonomy.',
        kicker: 'Executive synthesis',
        articleSlug: 'production-ai-agents-executive-summary',
        metrics: [
          { label: 'Maturity frame', value: '5 stages', note: 'From ad hoc assistance to governed SDLC autonomy.' },
          { label: 'Core layers', value: '4', note: 'Context, memory, deterministic policy, and execution harness.' },
          { label: 'Primary risk', value: 'Context gaps', note: 'Agents fail when hidden knowledge stays outside the system.' },
        ],
        sections: [
          {
            eyebrow: '01 / Strategic shift',
            title: 'Model capability is no longer the bottleneck.',
            body: 'The limiting factor is the enterprise system around the model: context, state ownership, governance, validation, and measurement.',
            points: ['Move from prompt experiments to operating architecture.', 'Treat agent output as a controlled pipeline, not unmanaged improvisation.', 'Measure delivery reliability instead of output volume.'],
          },
          {
            eyebrow: '02 / Architecture stack',
            title: 'Production agents need infrastructure built for autonomy.',
            body: 'A reliable agentic SDLC requires contextual data, procedural memory, deterministic gates, and an execution harness that sequences mutations safely.',
            points: ['Context layers reduce tribal-knowledge gaps.', 'Policy gates bound probabilistic decisions.', 'Harnesses make agent execution auditable and reversible.'],
          },
          {
            eyebrow: '03 / Scorecard',
            title: 'Autonomy must be governed with operating metrics.',
            body: 'The useful scorecard tracks intervention rate, escaped defects, autonomy duration, and the bottlenecks that still require human judgment.',
            points: ['Define what remains permanently human.', 'Track where agents require structural correction.', 'Use metrics to decide which gate can safely expand next.'],
          },
        ],
        actionTitle: 'Secure the prompt-to-production path.',
        actionBody: 'Start by mapping the highest-risk SDLC bottlenecks, then design the smallest governed agent gate that can reduce them without increasing escaped defects.',
      },
      pt: {
        title: 'Arquitetando a Empresa para Agentes de IA em Producao',
        subtitle: 'Uma visao executiva da infraestrutura, governanca e medicao necessarias para sair do trabalho assistido por IA e chegar a autonomia governada.',
        kicker: 'Sintese executiva',
        articleSlug: 'production-ai-agents-executive-summary',
        metrics: [
          { label: 'Maturidade', value: '5 estagios', note: 'De assistencia ad hoc a autonomia governada no SDLC.' },
          { label: 'Camadas centrais', value: '4', note: 'Contexto, memoria, politica deterministica e harness de execucao.' },
          { label: 'Risco primario', value: 'Lacunas de contexto', note: 'Agentes falham quando conhecimento oculto fica fora do sistema.' },
        ],
        sections: [
          {
            eyebrow: '01 / Mudanca estrategica',
            title: 'Capacidade de modelo nao e mais o gargalo.',
            body: 'O fator limitante e o sistema corporativo ao redor do modelo: contexto, ownership de estado, governanca, validacao e medicao.',
            points: ['Sair de experimentos com prompts para arquitetura operacional.', 'Tratar output de agentes como pipeline controlado, nao improvisacao sem gestao.', 'Medir confiabilidade de entrega em vez de volume de output.'],
          },
          {
            eyebrow: '02 / Stack arquitetural',
            title: 'Agentes em producao precisam de infraestrutura feita para autonomia.',
            body: 'Um SDLC agentico confiavel exige dados contextuais, memoria procedural, gates deterministicos e um harness que sequencie mudancas com seguranca.',
            points: ['Camadas de contexto reduzem lacunas de conhecimento tacito.', 'Gates de politica limitam decisoes probabilisticas.', 'Harnesses tornam a execucao auditavel e reversivel.'],
          },
          {
            eyebrow: '03 / Scorecard',
            title: 'Autonomia precisa ser governada com metricas operacionais.',
            body: 'O scorecard util acompanha taxa de intervencao, defeitos escapados, duracao de autonomia e gargalos que ainda exigem julgamento humano.',
            points: ['Definir o que permanece humano por natureza.', 'Acompanhar onde agentes exigem correcao estrutural.', 'Usar metricas para decidir qual gate pode expandir com seguranca.'],
          },
        ],
        actionTitle: 'Proteja o caminho de prompt ate producao.',
        actionBody: 'Comece mapeando os gargalos de maior risco no SDLC, depois desenhe o menor gate governado que possa reduzi-los sem aumentar defeitos escapados.',
      },
      es: {
        title: 'Arquitectura Empresarial para Agentes de IA en Produccion',
        subtitle: 'Una vision ejecutiva de la infraestructura, gobernanza y medicion necesarias para pasar del trabajo asistido por IA a la autonomia gobernada.',
        kicker: 'Sintesis ejecutiva',
        articleSlug: 'production-ai-agents-executive-summary',
        metrics: [
          { label: 'Madurez', value: '5 etapas', note: 'De asistencia ad hoc a autonomia gobernada en el SDLC.' },
          { label: 'Capas centrales', value: '4', note: 'Contexto, memoria, politica deterministica y harness de ejecucion.' },
          { label: 'Riesgo primario', value: 'Brechas de contexto', note: 'Los agentes fallan cuando el conocimiento oculto queda fuera del sistema.' },
        ],
        sections: [
          {
            eyebrow: '01 / Cambio estrategico',
            title: 'La capacidad del modelo ya no es el cuello de botella.',
            body: 'El factor limitante es el sistema empresarial alrededor del modelo: contexto, ownership de estado, gobernanza, validacion y medicion.',
            points: ['Pasar de experimentos con prompts a arquitectura operativa.', 'Tratar el output de agentes como pipeline controlado, no improvisacion sin gestion.', 'Medir confiabilidad de entrega en vez de volumen de output.'],
          },
          {
            eyebrow: '02 / Stack arquitectonico',
            title: 'Los agentes en produccion necesitan infraestructura hecha para autonomia.',
            body: 'Un SDLC agentico confiable requiere datos contextuales, memoria procedural, gates deterministicos y un harness que secuencie cambios con seguridad.',
            points: ['Las capas de contexto reducen brechas de conocimiento tacito.', 'Los gates de politica acotan decisiones probabilisticas.', 'Los harnesses vuelven la ejecucion auditable y reversible.'],
          },
          {
            eyebrow: '03 / Scorecard',
            title: 'La autonomia debe gobernarse con metricas operativas.',
            body: 'El scorecard util sigue tasa de intervencion, defectos escapados, duracion de autonomia y cuellos de botella que aun requieren juicio humano.',
            points: ['Definir lo que permanece humano por naturaleza.', 'Seguir donde los agentes requieren correccion estructural.', 'Usar metricas para decidir que gate puede expandirse con seguridad.'],
          },
        ],
        actionTitle: 'Asegura el camino de prompt a produccion.',
        actionBody: 'Empieza mapeando los cuellos de botella de mayor riesgo en el SDLC, luego disena el gate gobernado mas pequeno que pueda reducirlos sin aumentar defectos escapados.',
      },
    },
  },
  {
    slug: 'agentic-metrics-stack',
    accent: 'blue',
    translations: {
      en: {
        title: 'Stop Counting Code. Start Measuring Leverage.',
        subtitle: 'A metric stack for agent-augmented engineering teams that need to prove quality, autonomy, and system-level throughput.',
        kicker: 'Agentic metrics stack',
        articleSlug: 'agentic-metrics-stack-executive-summary',
        metrics: [
          { label: 'Core signals', value: '5', note: 'Cycle time, toil, coverage, intervention, and delivery leverage.' },
          { label: 'Metric shift', value: 'Output -> control', note: 'Move from activity counting to operating-system feedback.' },
          { label: 'North star', value: 'Leverage', note: 'Reliable delivery coverage per developer.' },
        ],
        sections: [
          {
            eyebrow: '01 / Broken incentives',
            title: 'Output metrics reward the wrong behavior.',
            body: 'Lines, merged changes, and raw velocity become weaker signals when agents can generate volume faster than review and validation can absorb it.',
            points: ['Separate apparent activity from useful system movement.', 'Do not reward code volume when quality gates are saturated.', 'Make review load and rework visible.'],
          },
          {
            eyebrow: '02 / Control panel',
            title: 'The useful scorecard shows whether autonomy is compounding.',
            body: 'Measure PR cycle time, toil index, coverage movement, human intervention rate, and feature delivery coverage per developer as one operating view.',
            points: ['Baseline before rollout.', 'Track intervention reasons, not just counts.', 'Read trends by delivery context.'],
          },
          {
            eyebrow: '03 / Operating rhythm',
            title: 'Metrics should change decisions, not decorate reports.',
            body: 'The stack helps leaders decide whether to tighten context, extend shadow mode, flip a gate, or expand autonomy into the next workflow.',
            points: ['Use weekly trend reviews.', 'Escalate flat or rising intervention rates.', 'Expand only when quality signals stay stable.'],
          },
        ],
        actionTitle: 'Replace output theater with leverage management.',
        actionBody: 'The metric stack becomes valuable when it changes gate decisions, staffing focus, and the next automation target.',
      },
      pt: {
        title: 'Pare de Contar Codigo. Comece a Medir Alavancagem.',
        subtitle: 'Um stack de metricas para equipes de engenharia aumentadas por agentes que precisam provar qualidade, autonomia e throughput sistemico.',
        kicker: 'Stack de metricas agenticas',
        articleSlug: 'agentic-metrics-stack-executive-summary',
        metrics: [
          { label: 'Sinais centrais', value: '5', note: 'Tempo de ciclo, toil, cobertura, intervencao e alavancagem de entrega.' },
          { label: 'Mudanca de metrica', value: 'Output -> controle', note: 'Sair de contagem de atividade para feedback operacional.' },
          { label: 'North star', value: 'Alavancagem', note: 'Cobertura de entrega confiavel por pessoa desenvolvedora.' },
        ],
        sections: [
          {
            eyebrow: '01 / Incentivos quebrados',
            title: 'Metricas de output recompensam o comportamento errado.',
            body: 'Linhas, mudancas mergeadas e velocidade bruta viram sinais mais fracos quando agentes geram volume mais rapido do que revisao e validacao conseguem absorver.',
            points: ['Separar atividade aparente de movimento util do sistema.', 'Nao recompensar volume de codigo quando gates de qualidade estao saturados.', 'Tornar carga de revisao e retrabalho visiveis.'],
          },
          {
            eyebrow: '02 / Painel de controle',
            title: 'O scorecard util mostra se autonomia esta compondo.',
            body: 'Meça tempo de ciclo de PR, indice de toil, evolucao de cobertura, taxa de intervencao humana e cobertura de entrega por pessoa desenvolvedora como uma unica visao operacional.',
            points: ['Criar baseline antes do rollout.', 'Acompanhar razoes de intervencao, nao apenas contagens.', 'Ler tendencias por contexto de entrega.'],
          },
          {
            eyebrow: '03 / Ritmo operacional',
            title: 'Metricas devem mudar decisoes, nao decorar relatorios.',
            body: 'O stack ajuda liderancas a decidir se devem reforcar contexto, estender shadow mode, ativar um gate ou expandir autonomia para o proximo workflow.',
            points: ['Usar revisoes semanais de tendencia.', 'Escalar taxas de intervencao planas ou crescentes.', 'Expandir apenas quando sinais de qualidade permanecem estaveis.'],
          },
        ],
        actionTitle: 'Troque teatro de output por gestao de alavancagem.',
        actionBody: 'O stack de metricas se torna valioso quando muda decisoes de gate, foco de capacidade e o proximo alvo de automacao.',
      },
      es: {
        title: 'Deja de Contar Codigo. Empieza a Medir Apalancamiento.',
        subtitle: 'Un stack de metricas para equipos de ingenieria aumentados por agentes que necesitan probar calidad, autonomia y throughput sistemico.',
        kicker: 'Stack de metricas agenticas',
        articleSlug: 'agentic-metrics-stack-executive-summary',
        metrics: [
          { label: 'Senales centrales', value: '5', note: 'Tiempo de ciclo, toil, cobertura, intervencion y apalancamiento de entrega.' },
          { label: 'Cambio metrico', value: 'Output -> control', note: 'Pasar de contar actividad a feedback operativo.' },
          { label: 'North star', value: 'Apalancamiento', note: 'Cobertura de entrega confiable por persona desarrolladora.' },
        ],
        sections: [
          {
            eyebrow: '01 / Incentivos rotos',
            title: 'Las metricas de output recompensan el comportamiento equivocado.',
            body: 'Lineas, cambios mergeados y velocidad bruta se vuelven senales mas debiles cuando los agentes generan volumen mas rapido de lo que revision y validacion pueden absorber.',
            points: ['Separar actividad aparente de movimiento util del sistema.', 'No recompensar volumen de codigo cuando los gates de calidad estan saturados.', 'Hacer visible la carga de revision y el retrabajo.'],
          },
          {
            eyebrow: '02 / Panel de control',
            title: 'El scorecard util muestra si la autonomia esta componiendo.',
            body: 'Mide tiempo de ciclo de PR, indice de toil, evolucion de cobertura, tasa de intervencion humana y cobertura de entrega por persona desarrolladora como una sola vista operativa.',
            points: ['Crear linea base antes del rollout.', 'Seguir razones de intervencion, no solo conteos.', 'Leer tendencias por contexto de entrega.'],
          },
          {
            eyebrow: '03 / Ritmo operativo',
            title: 'Las metricas deben cambiar decisiones, no decorar reportes.',
            body: 'El stack ayuda a decidir si reforzar contexto, extender shadow mode, activar un gate o expandir autonomia al siguiente workflow.',
            points: ['Usar revisiones semanales de tendencia.', 'Escalar tasas de intervencion planas o crecientes.', 'Expandir solo cuando las senales de calidad siguen estables.'],
          },
        ],
        actionTitle: 'Cambia teatro de output por gestion de apalancamiento.',
        actionBody: 'El stack de metricas es valioso cuando cambia decisiones de gate, foco de capacidad y el siguiente objetivo de automatizacion.',
      },
    },
  },
  {
    slug: 'agentic-dev-team-tactics',
    accent: 'amber',
    translations: {
      en: {
        title: 'Operationalizing the Agentic Dev Team',
        subtitle: 'A 90-day execution model for supervised agent gates, context loading, divergence tracking, and team-level operating standards.',
        kicker: 'Tactical operating model',
        articleSlug: 'agentic-dev-team-tactics-executive-summary',
        metrics: [
          { label: 'Timeline', value: '90 days', note: 'Foundation, first gate execution, stabilization, and scale.' },
          { label: 'Contexts', value: '2', note: 'Separate brownfield and greenfield gates.' },
          { label: 'Gate rule', value: '< 20%', note: 'Target divergence before flipping from shadow mode.' },
        ],
        sections: [
          {
            eyebrow: '01 / Days 1-30',
            title: 'Build the map before the mission.',
            body: 'Align the team, audit project contexts, capture baselines, select the first gates, and define what correct agent output means.',
            points: ['Create a shared mental model.', 'Map context debt and spec quality.', 'Assign gate supervisors.'],
          },
          {
            eyebrow: '02 / Days 31-60',
            title: 'Run the first gates in shadow mode before flipping.',
            body: 'Observe divergence, refine context, improve specs, and flip only when the gate has criteria-based confidence.',
            points: ['Log what the agent missed.', 'Calibrate context before changing tools.', 'Track intervention from the first production day.'],
          },
          {
            eyebrow: '03 / Days 61-90',
            title: 'Turn the pattern into the team standard.',
            body: 'Stabilize metrics, document the gate pattern, prepare Gate 2, and publish the expansion roadmap.',
            points: ['Document incident response and review checklists.', 'Rotate gate supervision.', 'Set six-month and twelve-month autonomy targets.'],
          },
        ],
        actionTitle: 'Make agentic delivery an operating standard.',
        actionBody: 'The 90-day outcome is a transferable pattern: where agents execute, where humans supervise, and how the team knows the boundary is moving safely.',
      },
      pt: {
        title: 'Operacionalizando o Time de Desenvolvimento Agentico',
        subtitle: 'Um modelo de execucao de 90 dias para gates supervisionados por agentes, carregamento de contexto, rastreamento de divergencia e standards de equipe.',
        kicker: 'Modelo operacional tatico',
        articleSlug: 'agentic-dev-team-tactics-executive-summary',
        metrics: [
          { label: 'Linha do tempo', value: '90 dias', note: 'Fundacao, execucao do primeiro gate, estabilizacao e escala.' },
          { label: 'Contextos', value: '2', note: 'Gates separados para brownfield e greenfield.' },
          { label: 'Regra de gate', value: '< 20%', note: 'Divergencia alvo antes de sair de shadow mode.' },
        ],
        sections: [
          {
            eyebrow: '01 / Dias 1-30',
            title: 'Construa o mapa antes da missao.',
            body: 'Alinhe a equipe, audite contextos de projeto, capture baselines, selecione os primeiros gates e defina o que significa output correto do agente.',
            points: ['Criar um modelo mental compartilhado.', 'Mapear divida de contexto e qualidade de specs.', 'Atribuir supervisores de gate.'],
          },
          {
            eyebrow: '02 / Dias 31-60',
            title: 'Execute os primeiros gates em shadow mode antes de ativar.',
            body: 'Observe divergencia, refine contexto, melhore specs e ative apenas quando o gate tiver confianca baseada em criterios.',
            points: ['Registrar o que o agente deixou passar.', 'Calibrar contexto antes de trocar ferramentas.', 'Acompanhar intervencao desde o primeiro dia em producao.'],
          },
          {
            eyebrow: '03 / Dias 61-90',
            title: 'Transforme o padrao em standard da equipe.',
            body: 'Estabilize metricas, documente o padrao de gate, prepare o Gate 2 e publique o roadmap de expansao.',
            points: ['Documentar resposta a incidentes e checklists de revisao.', 'Rotacionar supervisao de gates.', 'Definir metas de autonomia para seis e doze meses.'],
          },
        ],
        actionTitle: 'Torne entrega agentica um standard operacional.',
        actionBody: 'O resultado dos 90 dias e um padrao transferivel: onde agentes executam, onde humanos supervisionam e como a equipe sabe que a fronteira esta se movendo com seguranca.',
      },
      es: {
        title: 'Operacionalizar el Equipo de Desarrollo Agentico',
        subtitle: 'Un modelo de ejecucion de 90 dias para gates supervisados por agentes, carga de contexto, seguimiento de divergencia y estandares de equipo.',
        kicker: 'Modelo operativo tactico',
        articleSlug: 'agentic-dev-team-tactics-executive-summary',
        metrics: [
          { label: 'Linea de tiempo', value: '90 dias', note: 'Fundacion, ejecucion del primer gate, estabilizacion y escala.' },
          { label: 'Contextos', value: '2', note: 'Gates separados para brownfield y greenfield.' },
          { label: 'Regla de gate', value: '< 20%', note: 'Divergencia objetivo antes de salir de shadow mode.' },
        ],
        sections: [
          {
            eyebrow: '01 / Dias 1-30',
            title: 'Construye el mapa antes de la mision.',
            body: 'Alinea al equipo, audita contextos de proyecto, captura lineas base, selecciona los primeros gates y define que significa output correcto del agente.',
            points: ['Crear un modelo mental compartido.', 'Mapear deuda de contexto y calidad de specs.', 'Asignar supervisores de gate.'],
          },
          {
            eyebrow: '02 / Dias 31-60',
            title: 'Ejecuta los primeros gates en shadow mode antes de activar.',
            body: 'Observa divergencia, refina contexto, mejora specs y activa solo cuando el gate tenga confianza basada en criterios.',
            points: ['Registrar lo que el agente omitio.', 'Calibrar contexto antes de cambiar herramientas.', 'Seguir intervencion desde el primer dia en produccion.'],
          },
          {
            eyebrow: '03 / Dias 61-90',
            title: 'Convierte el patron en estandar del equipo.',
            body: 'Estabiliza metricas, documenta el patron de gate, prepara Gate 2 y publica el roadmap de expansion.',
            points: ['Documentar respuesta a incidentes y checklists de revision.', 'Rotar supervision de gates.', 'Definir metas de autonomia a seis y doce meses.'],
          },
        ],
        actionTitle: 'Haz de la entrega agentica un estandar operativo.',
        actionBody: 'El resultado de los 90 dias es un patron transferible: donde ejecutan los agentes, donde supervisan las personas y como el equipo sabe que la frontera avanza con seguridad.',
      },
    },
  },
];

export function getPresentation(slug: string, language: string): PresentationContent | undefined {
  const presentation = presentations.find((item) => item.slug === slug);
  if (!presentation) return undefined;

  const normalizedLanguage = language.split('-')[0] as SupportedLanguage;
  return presentation.translations[normalizedLanguage] || presentation.translations.en;
}

export function getPresentationAccent(slug: string): Presentation['accent'] {
  return presentations.find((item) => item.slug === slug)?.accent || 'blue';
}
