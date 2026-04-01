# Etapa 2 - Esbocar

A etapa **Esbocar** transforma o entendimento do problema em propostas de solução. 
Aqui, cada participante gera ideias de forma objetiva e visual, sem depender de longas discussões.

## Objetivo

Explorar diferentes alternativas para resolver o desafio definido na etapa anterior.

## Atividades da etapa

- Revisão rápida do foco do sprint.
- Geração individual de ideias.
- Elaboração de esboços de solução.
- Preparação das propostas para avaliação coletiva.

---

## 5W2H: Estruturando as Ideias

Para dar suporte aos esboços e garantir que as soluções para o projeto de **Belezas Naturais** sejam viáveis e compreensíveis, o grupo decidiu adotar o framework **5W2H** de forma individual.

### Justificativa do Artefato
O uso do 5W2H nesta etapa é fundamental para:
* **Viabilidade:** Garante que a ideia não seja apenas visual, mas que tenha um princípio de execução (custos, prazos e métodos).
* **Clareza:** Facilita a apresentação da proposta para o restante do grupo, reduzindo dúvidas durante a etapa de decisão.
* **Foco no Problema:** Obriga o autor a justificar o "Porquê" (*Why*) daquela solução frente ao desafio de preservação ou promoção das belezas naturais.

---

## Propostas de Solução Individuais

Cada membro deve preencher o seu quadro antes de iniciar o desenho do esboço final.

### 👤 Integrante: Ana Luiza
| Pergunta | Resposta |
| :--- | :--- |
| **What?** (O que será feito?) | Implementação do módulo de **Mapeamento e Edição de Pontos Turísticos**. O projeto consiste em criar uma base de dados onde usuários podem cadastrar locais (fotos, localização, tags) e editar informações existentes. No período inicial, o foco será a estrutura de filtros por Estado/Cidade/Região e o sistema de histórico de alterações. |
| **Why?** (Por que será feito?) | O propósito é centralizar informações sobre belezas naturais do Brasil em um único lugar, resolvendo a dificuldade de encontrar dados confiáveis para planejar trilhas. O objetivo é criar um ecossistema onde a comunidade mantém a base de dados atualizada e verificada. |
| **Where?** (Onde será feito?) | O produto estará disponível online como uma aplicação web. Os canais de divulgação para atrair usuários colaboradores incluirão comunidades de trilheiros no Instagram, fóruns de ecoturismo e parcerias com guias locais. |
| **When?** (Quando será feito?) | O MVP deverá ser entregue em conjunto com o final da matéria de Arquitetura de Software, em Julho/2026 |
| **Who?** (Quem são os envolvidos?) | **Equipe:** Desenvolvedores Backend e Frontend. **Público-alvo:** Viajantes, aventureiros e exploradores de belezas naturais (usuários comuns). **Perfil do Usuário:** Pessoas com comportamento colaborativo que desejam compartilhar novos achados naturais. |
| **How?** (Como será realizado?) | Utilizando a metodologia ágil para o desenvolvimento. O passo a passo envolve: 1. Setup do NestJS e PostgreSQL; 2. Criação das APIs de geolocalização e filtros; 3. Desenvolvimento do frontend em React com Vite; 4. Implementação da lógica de salvamento de histórico de edições (quem alterou e quando). |
| **How Much?** (Quanto vai custar?) | O custo financeiro direto é baixo devido ao uso de tecnologias Open Source. O investimento será de aproximadamente 60 horas técnicas de trabalho. A viabilidade financeira é alta, com custos apenas para hospedagem em servidor de um integrante da equipe. |

---

### 👤 Integrante: Antonio Carvalho
| Pergunta | Resposta |
| :--- | :--- |
| **What?** (O que será feito?) | Desenvolvimento do Módulo de Agendamento e Gestão de Expedições. O foco é criar a interface de inscrição para trilhas e o sistema de comunicação direta (chat 1-para-1) entre o participante e o Mestre de Caravana. Inclui a geração de códigos de confirmação e a funcionalidade de validação de presença por parte do organizador. |
| **Why?** (Por que será feito?) | Para oferecer segurança e organização no ecoturismo. O objetivo é evitar pagamentos antecipados sem confirmação e garantir que apenas guias/organizadores qualificados (Líderes de Expedição) gerenciem os grupos, resolvendo o problema da falta de uma plataforma centralizada para marcar trilhas e peregrinações. |
| **Where?** (Onde será implementado?) | A funcionalidade será integrada ao core da aplicação web. A interface de gestão será otimizada para dispositivos móveis, permitindo que o organizador valide os códigos de presença dos participantes diretamente no ponto de encontro da trilha. |
| **When?** (Quando será executado?) | O cronograma segue o semestre letivo de 2026.1 da UnB, com a implementação das regras de negócio de inscrição e chat previstas para a segunda etapa de entregas da disciplina de ADS, finalizando o ciclo de desenvolvimento em Julho/2026. |
| **Who?** (Quem será o responsável?) | Responsável Técnico: Equipe (Desenvolvimento de Regras de Negócio e Chat). Atores Envolvidos: Usuários Visitantes (que buscam as vagas) e Líderes de Expedição (que gerenciam as rotas e aprovam os membros). |
| **How?** (Como será realizado?) | Implementando uma arquitetura orientada a eventos para as notificações de inscrição. Tecnicamente, utilizaremos o NestJS para gerenciar a lógica de permissões e o status das vagas no banco PostgreSQL, enquanto o React fornecerá o painel de controle do organizador para "Validar Membros" via código único. |
| **How Much?** (Quanto custará?) | Custo zero em termos de licenciamento de software. O esforço humano estimado é de 70 horas de desenvolvimento e testes. A infraestrutura de hospedagem será providenciada de forma voluntária em servidor privado de um membro da equipe. |

---

### 👤 Integrante: Miguel Arthur Oliveira de Lima
| Pergunta | Resposta |
| :--- | :--- |
| **What?** (O que será feito?) |O desenvolvimento da arquitetura e modelagem de uma plataforma digital híbrida (web/mobile) de mapeamento colaborativo e gestão de ecoturismo focada em localidades brasileiras. O sistema atuará como um ecossistema que conecta descobridores de belezas naturais a Guias Locais. O escopo técnico abrange quatro features centrais: Conexão Ponto-Trilha (vinculação automatizada de locais a pacotes), Cadastro Fast-Track (inserção ágil de metadados geográficos por guias), Sistema de Controle de Vagas (gestão de concorrência e aprovação de reservas) e Motor de Gamificação (distribuição de insígnias digitais pós-conclusão).|
| **Why?** (Por que será feito?) |O mercado de ecoturismo no Brasil sofre com a fragmentação de dados e a alta intermediação. Plataformas de geolocalização puras (como Wikiloc) carecem de curadoria e ferramentas de gestão de negócios para profissionais, enquanto agências tradicionais elevam o custo para o turista. A plataforma visa resolver esta ineficiência desintermediando o contato através de um sistema seguro, gerando valor direto para o Guia Local e incentivando o engajamento contínuo do Turista por meio de gamificação e descoberta colaborativa.|
| **Where?** (Onde será implementado?) |A modelagem e documentação ocorrerão de forma colaborativa utilizando ferramentas de diagramação (Figma, softwares de modelagem UML/BPMN). A aplicação será projetada para implantação em ambiente de nuvem (Cloud), visando alta disponibilidade e escalabilidade nacional, permitindo acesso responsivo tanto via navegadores desktop quanto dispositivos móveis no terreno.|
| **When?** (Quando será executado?) |O projeto será desenvolvido iterativamente ao longo do atual semestre acadêmico. O cronograma seguirá os marcos da disciplina de Arquitetura e Desenho de Software, iniciando com a ideação (Design Sprint e mapas mentais), passando pela modelagem de processos de negócio (BPMN), e culminando na entrega dos protótipos e diagramas arquiteturais da solução.|
| **Who?** (Quem será o responsável?) |A equipe de engenharia (Grupo 5), responsável pela modelagem de processos, levantamento de requisitos e definição da arquitetura de software.|
| **How?** (Como será realizado?) |O desenvolvimento será guiado por metodologias ágeis e práticas de engenharia de software. Os fluxos de negócio críticos (como o processo de solicitação e aprovação de vagas pelo Guia) serão mapeados em notação BPMN para eliminar gargalos lógicos. A arquitetura back-end em NestJS exigirá a construção de uma API RESTful robusta, capaz de gerenciar concorrência no banco de dados para reservas e aplicar lógicas de controle de acesso (RBAC) para separar as permissões de Turistas, Guias e Administradores. O front-end em React consumirá essas APIs e integrará serviços de mapas.|
| **How Much?** (Quanto custará?) |O custo financeiro operacional será mitigado pela adoção de infraestrutura em free tier (hospedagem de aplicações, instâncias de banco de dados e APIs de geolocalização gratuitas/open-source). O custo real do projeto é medido no esforço técnico e horas de trabalho dedicadas pelos membros do grupo nas fases de pesquisa, levantamento de requisitos, diagramação arquitetural e prototipagem durante o ciclo letivo.|

---

## Entregáveis esperados

- Conjunto de esboços de solução.
- Registros das principais ideias consideradas (Tabelas 5W2H).

## Planilha de versionamento

| Versão | Data       | Descrição                                      | Autor                                 | Revisor |
| :----- | :--------- | :--------------------------------------------- | :------------------------------------ | :------ |
| 1.0    | 01/04/2026 | Criação do documento e adição da estrutura base | [Ana Luiza](https://github.com/ana-pfeilsticker) |         |
| 1.1    | 01/04/2026 | Inclusão dos templates 5W2H, justificativa e preenchimento do 5w2h individual    | [Ana Luiza](https://github.com/ana-pfeilsticker)                           |         |
| 1.2    | 01/04/2026 | Preenchimento do 5w2h individual    | [Antonio Carvalho](https://github.com/antonioscarvalho)                           |         |
| 1.3    | 01/04/2026 | Preenchimento do 5w2h individual    | [Miguel Arthur](https://github.com/zlimaz)                           |         |
