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
    slug: 'agentic-sdlc',
    accent: 'blue',
    translations: {
      en: {
        title: 'The Agentic SDLC',
        subtitle: 'A strategic blueprint for rebuilding enterprise software delivery around AI agents, deterministic safety, and measurable autonomy.',
        kicker: 'Enterprise blueprint',
        articleSlug: 'agentic-sdlc',
        metrics: [
          { label: 'Maturity target', value: 'Level 3', note: 'Spec-driven multi-agent delivery within six months.' },
          { label: 'Core pillars', value: '3', note: 'Agent-friendly repos, CIV orchestration, and deterministic safety.' },
          { label: 'Pilot window', value: '30 days', note: 'Context, code SEO, evals, CI, and first Level 3 candidates.' },
        ],
        sections: [
          {
            eyebrow: '01 / Adoption paradox',
            title: 'AI alone is accelerating debt, not delivery.',
            body: 'Unstructured AI use increases generated code volume while reducing structural refactoring and architectural intent capture.',
            points: ['Treat velocity without validation as risk.', 'Separate tool adoption from operating-model maturity.', 'Design the SDLC around AI rather than adding AI to the old one.'],
          },
          {
            eyebrow: '02 / Enterprise architecture',
            title: 'Repositories and workflows must become agent-legible.',
            body: 'Agentic delivery needs explicit operating context, code discovery signals, golden evals, and a single task runner agents can trust.',
            points: ['Commit concise AGENTS.md or CLAUDE.md guidance.', 'Use Code SEO so agents find the right files quickly.', 'Wire evals and CI before expanding autonomy.'],
          },
          {
            eyebrow: '03 / Multi-agent control',
            title: 'No agent should validate its own work.',
            body: 'The Coordinator-Implementor-Verifier pattern separates planning, execution, and independent validation so correlated hallucinations are caught before merge.',
            points: ['Use specs as living contracts.', 'Isolate execution with branches or worktrees.', 'Require merge-readiness evidence for human review.'],
          },
        ],
        actionTitle: 'Rebuild the SDLC for governed autonomy.',
        actionBody: 'Start with the first 30 days: commit agent context, improve repository discoverability, add evals, wire CI, and select the first Level 3 pilot candidates.',
      },
      pt: {
        title: 'O SDLC Agentico',
        subtitle: 'Um blueprint estrategico para reconstruir entrega de software empresarial em torno de agentes de IA, seguranca deterministica e autonomia mensuravel.',
        kicker: 'Blueprint empresarial',
        articleSlug: 'agentic-sdlc',
        metrics: [
          { label: 'Meta de maturidade', value: 'Nivel 3', note: 'Entrega multiagente orientada por specs em ate seis meses.' },
          { label: 'Pilares centrais', value: '3', note: 'Repos agent-friendly, orquestracao CIV e seguranca deterministica.' },
          { label: 'Janela piloto', value: '30 dias', note: 'Contexto, Code SEO, evals, CI e primeiros candidatos ao Nivel 3.' },
        ],
        sections: [
          {
            eyebrow: '01 / Paradoxo da adocao',
            title: 'IA sozinha acelera divida, nao entrega.',
            body: 'Uso nao estruturado de IA aumenta volume de codigo gerado enquanto reduz refatoracao estrutural e captura de intencao arquitetural.',
            points: ['Tratar velocidade sem validacao como risco.', 'Separar adocao de ferramenta de maturidade operacional.', 'Desenhar o SDLC ao redor de IA, nao apenas adicionar IA ao modelo antigo.'],
          },
          {
            eyebrow: '02 / Arquitetura empresarial',
            title: 'Repositorios e workflows precisam ser legiveis para agentes.',
            body: 'Entrega agentica exige contexto operacional explicito, sinais de descoberta de codigo, evals dourados e um runner unico de tarefas confiavel.',
            points: ['Commitar orientacoes concisas em AGENTS.md ou CLAUDE.md.', 'Usar Code SEO para agentes encontrarem os arquivos certos rapido.', 'Conectar evals e CI antes de expandir autonomia.'],
          },
          {
            eyebrow: '03 / Controle multiagente',
            title: 'Nenhum agente deve validar o proprio trabalho.',
            body: 'O padrao Coordinator-Implementor-Verifier separa planejamento, execucao e validacao independente para capturar alucinacoes correlacionadas antes do merge.',
            points: ['Usar specs como contratos vivos.', 'Isolar execucao com branches ou worktrees.', 'Exigir evidencia de merge-readiness para revisao humana.'],
          },
        ],
        actionTitle: 'Reconstrua o SDLC para autonomia governada.',
        actionBody: 'Comece pelos primeiros 30 dias: commit do contexto para agentes, melhoria da descoberta do repositorio, criacao de evals, CI conectado e selecao dos primeiros pilotos de Nivel 3.',
      },
      es: {
        title: 'El SDLC Agentico',
        subtitle: 'Un blueprint estrategico para reconstruir la entrega de software empresarial alrededor de agentes de IA, seguridad deterministica y autonomia medible.',
        kicker: 'Blueprint empresarial',
        articleSlug: 'agentic-sdlc',
        metrics: [
          { label: 'Meta de madurez', value: 'Nivel 3', note: 'Entrega multiagente guiada por specs en hasta seis meses.' },
          { label: 'Pilares centrales', value: '3', note: 'Repos agent-friendly, orquestacion CIV y seguridad deterministica.' },
          { label: 'Ventana piloto', value: '30 dias', note: 'Contexto, Code SEO, evals, CI y primeros candidatos a Nivel 3.' },
        ],
        sections: [
          {
            eyebrow: '01 / Paradoja de adopcion',
            title: 'La IA sola acelera deuda, no entrega.',
            body: 'El uso no estructurado de IA aumenta el volumen de codigo generado mientras reduce refactorizacion estructural y captura de intencion arquitectonica.',
            points: ['Tratar velocidad sin validacion como riesgo.', 'Separar adopcion de herramienta de madurez operativa.', 'Disenar el SDLC alrededor de IA, no solo agregar IA al modelo antiguo.'],
          },
          {
            eyebrow: '02 / Arquitectura empresarial',
            title: 'Repositorios y workflows deben ser legibles para agentes.',
            body: 'La entrega agentica exige contexto operativo explicito, senales de descubrimiento de codigo, evals dorados y un runner unico de tareas confiable.',
            points: ['Commitar guias concisas en AGENTS.md o CLAUDE.md.', 'Usar Code SEO para que los agentes encuentren rapido los archivos correctos.', 'Conectar evals y CI antes de expandir autonomia.'],
          },
          {
            eyebrow: '03 / Control multiagente',
            title: 'Ningun agente debe validar su propio trabajo.',
            body: 'El patron Coordinator-Implementor-Verifier separa planificacion, ejecucion y validacion independiente para capturar alucinaciones correlacionadas antes del merge.',
            points: ['Usar specs como contratos vivos.', 'Aislar ejecucion con branches o worktrees.', 'Exigir evidencia de merge-readiness para revision humana.'],
          },
        ],
        actionTitle: 'Reconstruye el SDLC para autonomia gobernada.',
        actionBody: 'Empieza por los primeros 30 dias: commit del contexto para agentes, mejora de descubrimiento del repositorio, creacion de evals, CI conectado y seleccion de los primeros pilotos de Nivel 3.',
      },
    },
  },
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
    slug: 'autonomous-adlc-workflow',
    accent: 'teal',
    translations: {
      pt: {
        title: 'ADLC Autônomo',
        subtitle: 'Uma linha de engenharia em velocidade de máquina, com cinco estágios automatizados e três intertravamentos humanos que preservam controle e responsabilidade.',
        kicker: 'Workflow operacional',
        articleSlug: 'autonomous-adlc-workflow',
        metrics: [
          { label: 'Estágios automatizados', value: '5', note: 'Planejar, construir, testar, preparar e liberar.' },
          { label: 'Intertravamentos humanos', value: '3', note: 'Plano, verdade técnica e valor de produto.' },
          { label: 'Ambientes', value: '1:1', note: 'Um sandbox efêmero e isolado por feature.' },
        ],
        sections: [
          {
            eyebrow: '01 / Planejar + Gate 1',
            title: 'O ticket vira especificação antes de virar código.',
            body: 'Agentes sintetizam escopo, interfaces, restrições e riscos em um spec.md. Tech leads e arquitetos autorizam a intenção técnica antes do build.',
            points: ['Recuperar contexto direto do sistema e do repositório.', 'Tratar a especificação como fonte de verdade verificável.', 'Bloquear geração enquanto objetivo e arquitetura não estiverem alinhados.'],
          },
          {
            eyebrow: '02 / Construir',
            title: 'Branches paralelas, estado isolado e revisão multimodelo.',
            body: 'Agentes implementam em unidades de trabalho separadas, enquanto modelos complementares revisam arquitetura, qualidade, segurança e aderência à especificação.',
            points: ['Paralelizar execução sem compartilhar estado de escrita.', 'Evitar que um único caminho de raciocínio valide o próprio erro.', 'Integrar somente por um caminho controlado.'],
          },
          {
            eyebrow: '03 / Testar + Gate 2',
            title: 'Cada feature ganha um mundo vivo e reproduzível.',
            body: 'Um sandbox efêmero executa deploy, testes unitários e E2E. QA e engenharia inspecionam evidências e mantêm o merge bloqueado até validar a verdade.',
            points: ['Eliminar a fila de staging compartilhado.', 'Ler traces e critérios, não apenas status verde.', 'Anexar ambiente e resultados à evidência de entrega.'],
          },
          {
            eyebrow: '04 / Preparar + Gate 3',
            title: 'Performance e produto são validados em paralelo.',
            body: 'Uma trilha estressa performance enquanto outra oferece a experiência ao produto. Product owners decidem se a mudança realmente entrega valor.',
            points: ['Medir latência e comportamento sob carga.', 'Permitir uso real antes da exposição ao cliente.', 'Não confundir correção técnica com adequação ao produto.'],
          },
          {
            eyebrow: '05 / Liberar',
            title: 'O rollout observa a si mesmo e torna falhas reversíveis.',
            body: 'O canário aumenta tráfego gradualmente, compara métricas com o baseline e promove rollback automático quando detecta degradação.',
            points: ['Usar métricas técnicas e de negócio.', 'Promover somente com evidência estável.', 'Reverter em segundos sem transformar cada falha em incidente.'],
          },
        ],
        actionTitle: 'Automatize o fluxo. Preserve a responsabilidade.',
        actionBody: 'O ADLC autônomo remove filas e trabalho mecânico, mas mantém pessoas exatamente nos pontos onde julgamento, evidência e contexto de negócio são insubstituíveis.',
      },
      en: {
        title: 'Autonomous ADLC',
        subtitle: 'A machine-speed engineering line with five automated stages and three human interlocks that preserve control and accountability.',
        kicker: 'Operating workflow',
        articleSlug: 'autonomous-adlc-workflow',
        metrics: [
          { label: 'Automated stages', value: '5', note: 'Plan, build, test, prepare, and release.' },
          { label: 'Human interlocks', value: '3', note: 'Plan, technical truth, and product value.' },
          { label: 'Environments', value: '1:1', note: 'One ephemeral, isolated sandbox per feature.' },
        ],
        sections: [
          {
            eyebrow: '01 / Plan + Gate 1',
            title: 'The ticket becomes a specification before it becomes code.',
            body: 'Agents synthesize scope, interfaces, constraints, and risks into a spec.md. Tech leads and architects authorize the technical intent before build begins.',
            points: ['Retrieve context directly from the system and repository.', 'Treat the specification as a verifiable source of truth.', 'Block generation until business intent and architecture align.'],
          },
          {
            eyebrow: '02 / Build',
            title: 'Parallel branches, isolated state, and multi-model review.',
            body: 'Agents implement in separate units of work while complementary models review architecture, quality, security, and adherence to the specification.',
            points: ['Parallelize execution without sharing write state.', 'Prevent one reasoning path from validating its own error.', 'Integrate only through a controlled path.'],
          },
          {
            eyebrow: '03 / Test + Gate 2',
            title: 'Every feature gets a live, reproducible world.',
            body: 'An ephemeral sandbox runs deployment, unit tests, and E2E tests. QA and engineering inspect the evidence and keep merge blocked until truth is validated.',
            points: ['Remove the shared staging queue.', 'Read traces and criteria, not just green status.', 'Attach environment and results to delivery evidence.'],
          },
          {
            eyebrow: '04 / Prepare + Gate 3',
            title: 'Performance and product fitness are validated in parallel.',
            body: 'One track stresses performance while another exposes the experience to product. Product owners decide whether the change truly delivers value.',
            points: ['Measure latency and behavior under load.', 'Enable real use before customer exposure.', 'Do not confuse technical correctness with product fitness.'],
          },
          {
            eyebrow: '05 / Release',
            title: 'The rollout watches itself and makes failure reversible.',
            body: 'The canary gradually increases traffic, compares metrics with the baseline, and automatically rolls back when it detects degradation.',
            points: ['Use technical and business metrics.', 'Promote only with stable evidence.', 'Reverse within seconds without turning every failure into an incident.'],
          },
        ],
        actionTitle: 'Automate the flow. Preserve accountability.',
        actionBody: 'Autonomous ADLC removes queues and mechanical work while keeping people precisely where judgment, evidence, and business context are irreplaceable.',
      },
      es: {
        title: 'ADLC Autónomo',
        subtitle: 'Una línea de ingeniería a velocidad de máquina con cinco etapas automatizadas y tres interbloqueos humanos que preservan control y responsabilidad.',
        kicker: 'Workflow operativo',
        articleSlug: 'autonomous-adlc-workflow',
        metrics: [
          { label: 'Etapas automatizadas', value: '5', note: 'Planificar, construir, probar, preparar y liberar.' },
          { label: 'Interbloqueos humanos', value: '3', note: 'Plan, verdad técnica y valor de producto.' },
          { label: 'Entornos', value: '1:1', note: 'Un sandbox efímero y aislado por feature.' },
        ],
        sections: [
          {
            eyebrow: '01 / Planificar + Gate 1',
            title: 'El ticket se convierte en especificación antes de convertirse en código.',
            body: 'Los agentes sintetizan alcance, interfaces, restricciones y riesgos en un spec.md. Tech leads y arquitectos autorizan la intención técnica antes del build.',
            points: ['Recuperar contexto directamente del sistema y del repositorio.', 'Tratar la especificación como fuente de verdad verificable.', 'Bloquear la generación hasta alinear objetivo y arquitectura.'],
          },
          {
            eyebrow: '02 / Construir',
            title: 'Branches paralelas, estado aislado y revisión multimodelo.',
            body: 'Los agentes implementan en unidades de trabajo separadas mientras modelos complementarios revisan arquitectura, calidad, seguridad y adherencia a la especificación.',
            points: ['Paralelizar ejecución sin compartir estado de escritura.', 'Evitar que una ruta de razonamiento valide su propio error.', 'Integrar solamente por un camino controlado.'],
          },
          {
            eyebrow: '03 / Probar + Gate 2',
            title: 'Cada feature obtiene un mundo vivo y reproducible.',
            body: 'Un sandbox efímero ejecuta deploy, pruebas unitarias y E2E. QA e ingeniería inspeccionan la evidencia y mantienen el merge bloqueado hasta validar la verdad.',
            points: ['Eliminar la cola de staging compartido.', 'Leer traces y criterios, no solo el estado verde.', 'Adjuntar entorno y resultados a la evidencia de entrega.'],
          },
          {
            eyebrow: '04 / Preparar + Gate 3',
            title: 'Rendimiento y adecuación al producto se validan en paralelo.',
            body: 'Una vía estresa el rendimiento mientras otra expone la experiencia a producto. Product owners deciden si el cambio realmente entrega valor.',
            points: ['Medir latencia y comportamiento bajo carga.', 'Permitir uso real antes de exponerlo al cliente.', 'No confundir corrección técnica con adecuación al producto.'],
          },
          {
            eyebrow: '05 / Liberar',
            title: 'El rollout se observa a sí mismo y hace reversible el fallo.',
            body: 'El canario aumenta gradualmente el tráfico, compara métricas con el baseline y revierte automáticamente cuando detecta degradación.',
            points: ['Usar métricas técnicas y de negocio.', 'Promover solamente con evidencia estable.', 'Revertir en segundos sin convertir cada fallo en incidente.'],
          },
        ],
        actionTitle: 'Automatiza el flujo. Preserva la responsabilidad.',
        actionBody: 'El ADLC autónomo elimina colas y trabajo mecánico, pero mantiene a las personas precisamente donde el juicio, la evidencia y el contexto de negocio son irreemplazables.',
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
