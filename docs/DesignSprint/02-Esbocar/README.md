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

## Mapa Mental Preliminar

Durante a fase de ideação e esboço das propostas, elaboramos um mapa mental preliminar estruturando as ramificações iniciais de funcionalidades e arquitetura do sistema. O objetivo de manter esta versão inicial registrada é compará-la posteriormente com o resultado final consolidado, após a avaliação e convergência de todas as propostas da equipe.

<iframe src="assets/fase_1/images/markmap.html" width="100%" height="600px" frameborder="0" style="border: 1px solid #ddd; border-radius: 8px;">
  Seu navegador não suporta iframes.
</iframe>

---

## 5W2H: Estruturando as Ideias

Para dar suporte aos esboços e garantir que as soluções para o projeto de **Belezas Naturais** sejam viáveis e compreensíveis, o grupo decidiu adotar o framework **5W2H** de forma individual.

### Justificativa do Artefato

O uso do 5W2H nesta etapa é fundamental para:

- **Viabilidade:** Garante que a ideia não seja apenas visual, mas que tenha um princípio de execução (custos, prazos e métodos).
- **Clareza:** Facilita a apresentação da proposta para o restante do grupo, reduzindo dúvidas durante a etapa de decisão.
- **Foco no Problema:** Obriga o autor a justificar o "Porquê" (_Why_) daquela solução frente ao desafio de preservação ou promoção das belezas naturais.

---

## Propostas de Solução Individuais

Cada membro deve preencher o seu quadro antes de iniciar o desenho do esboço final.

### 👤 Integrante: Ana Luiza

| Pergunta                           | Resposta                                                                                                                                                                                                                                                                                                                                        |
| :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What?** (O que será feito?)      | Implementação do módulo de **Mapeamento e Edição de Pontos Turísticos**. O projeto consiste em criar uma base de dados onde usuários podem cadastrar locais (fotos, localização, tags) e editar informações existentes. No período inicial, o foco será a estrutura de filtros por Estado/Cidade/Região e o sistema de histórico de alterações. |
| **Why?** (Por que será feito?)     | O propósito é centralizar informações sobre belezas naturais do Brasil em um único lugar, resolvendo a dificuldade de encontrar dados confiáveis para planejar trilhas. O objetivo é criar um ecossistema onde a comunidade mantém a base de dados atualizada e verificada.                                                                     |
| **Where?** (Onde será feito?)      | O produto estará disponível online como uma aplicação web. Os canais de divulgação para atrair usuários colaboradores incluirão comunidades de trilheiros no Instagram, fóruns de ecoturismo e parcerias com guias locais.                                                                                                                      |
| **When?** (Quando será feito?)     | O MVP deverá ser entregue em conjunto com o final da matéria de Arquitetura de Software, em Julho/2026                                                                                                                                                                                                                                          |
| **Who?** (Quem são os envolvidos?) | **Equipe:** Desenvolvedores Backend e Frontend. **Público-alvo:** Viajantes, aventureiros e exploradores de belezas naturais (usuários comuns). **Perfil do Usuário:** Pessoas com comportamento colaborativo que desejam compartilhar novos achados naturais.                                                                                  |
| **How?** (Como será realizado?)    | Utilizando a metodologia ágil para o desenvolvimento. O passo a passo envolve: 1. Setup do NestJS e PostgreSQL; 2. Criação das APIs de geolocalização e filtros; 3. Desenvolvimento do frontend em React com Vite; 4. Implementação da lógica de salvamento de histórico de edições (quem alterou e quando).                                    |
| **How Much?** (Quanto vai custar?) | O custo financeiro direto é baixo devido ao uso de tecnologias Open Source. O investimento será de aproximadamente 60 horas técnicas de trabalho. A viabilidade financeira é alta, com custos apenas para hospedagem em servidor de um integrante da equipe.                                                                                    |

---

### 👤 Integrante: Antonio Carvalho

| Pergunta                             | Resposta                                                                                                                                                                                                                                                                                                                              |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **What?** (O que será feito?)        | Desenvolvimento do Módulo de Agendamento e Gestão de Expedições. O foco é criar a interface de inscrição para trilhas e o sistema de comunicação direta (chat 1-para-1) entre o participante e o Mestre de Caravana. Inclui a geração de códigos de confirmação e a funcionalidade de validação de presença por parte do organizador. |
| **Why?** (Por que será feito?)       | Para oferecer segurança e organização no ecoturismo. O objetivo é evitar pagamentos antecipados sem confirmação e garantir que apenas guias/organizadores qualificados (Líderes de Expedição) gerenciem os grupos, resolvendo o problema da falta de uma plataforma centralizada para marcar trilhas e peregrinações.                 |
| **Where?** (Onde será implementado?) | A funcionalidade será integrada ao core da aplicação web. A interface de gestão será otimizada para dispositivos móveis, permitindo que o organizador valide os códigos de presença dos participantes diretamente no ponto de encontro da trilha.                                                                                     |
| **When?** (Quando será executado?)   | O cronograma segue o semestre letivo de 2026.1 da UnB, com a implementação das regras de negócio de inscrição e chat previstas para a segunda etapa de entregas da disciplina de ADS, finalizando o ciclo de desenvolvimento em Julho/2026.                                                                                           |
| **Who?** (Quem será o responsável?)  | Responsável Técnico: Equipe (Desenvolvimento de Regras de Negócio e Chat). Atores Envolvidos: Usuários Visitantes (que buscam as vagas) e Líderes de Expedição (que gerenciam as rotas e aprovam os membros).                                                                                                                         |
| **How?** (Como será realizado?)      | Implementando uma arquitetura orientada a eventos para as notificações de inscrição. Tecnicamente, utilizaremos o NestJS para gerenciar a lógica de permissões e o status das vagas no banco PostgreSQL, enquanto o React fornecerá o painel de controle do organizador para "Validar Membros" via código único.                      |
| **How Much?** (Quanto custará?)      | Custo zero em termos de licenciamento de software. O esforço humano estimado é de 70 horas de desenvolvimento e testes. A infraestrutura de hospedagem será providenciada de forma voluntária em servidor privado de um membro da equipe.                                                                                             |

---

### 👤 Integrante: Miguel Arthur Oliveira de Lima

| Pergunta                             | Resposta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **What?** (O que será feito?)        | O desenvolvimento da arquitetura e modelagem de uma plataforma digital híbrida (web/mobile) de mapeamento colaborativo e gestão de ecoturismo focada em localidades brasileiras. O sistema atuará como um ecossistema que conecta descobridores de belezas naturais a Guias Locais. O escopo técnico abrange quatro features centrais: Conexão Ponto-Trilha (vinculação automatizada de locais a pacotes), Cadastro Fast-Track (inserção ágil de metadados geográficos por guias), Sistema de Controle de Vagas (gestão de concorrência e aprovação de reservas) e Motor de Gamificação (distribuição de insígnias digitais pós-conclusão). |
| **Why?** (Por que será feito?)       | O mercado de ecoturismo no Brasil sofre com a fragmentação de dados e a alta intermediação. Plataformas de geolocalização puras (como Wikiloc) carecem de curadoria e ferramentas de gestão de negócios para profissionais, enquanto agências tradicionais elevam o custo para o turista. A plataforma visa resolver esta ineficiência desintermediando o contato através de um sistema seguro, gerando valor direto para o Guia Local e incentivando o engajamento contínuo do Turista por meio de gamificação e descoberta colaborativa.                                                                                                  |
| **Where?** (Onde será implementado?) | A modelagem e documentação ocorrerão de forma colaborativa utilizando ferramentas de diagramação (Figma, softwares de modelagem UML/BPMN). A aplicação será projetada para implantação em ambiente de nuvem (Cloud), visando alta disponibilidade e escalabilidade nacional, permitindo acesso responsivo tanto via navegadores desktop quanto dispositivos móveis no terreno.                                                                                                                                                                                                                                                              |
| **When?** (Quando será executado?)   | O projeto será desenvolvido iterativamente ao longo do atual semestre acadêmico. O cronograma seguirá os marcos da disciplina de Arquitetura e Desenho de Software, iniciando com a ideação (Design Sprint e mapas mentais), passando pela modelagem de processos de negócio (BPMN), e culminando na entrega dos protótipos e diagramas arquiteturais da solução.                                                                                                                                                                                                                                                                           |
| **Who?** (Quem será o responsável?)  | A equipe de engenharia (Grupo 5), responsável pela modelagem de processos, levantamento de requisitos e definição da arquitetura de software.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **How?** (Como será realizado?)      | O desenvolvimento será guiado por metodologias ágeis e práticas de engenharia de software. Os fluxos de negócio críticos (como o processo de solicitação e aprovação de vagas pelo Guia) serão mapeados em notação BPMN para eliminar gargalos lógicos. A arquitetura back-end em NestJS exigirá a construção de uma API RESTful robusta, capaz de gerenciar concorrência no banco de dados para reservas e aplicar lógicas de controle de acesso (RBAC) para separar as permissões de Turistas, Guias e Administradores. O front-end em React consumirá essas APIs e integrará serviços de mapas.                                          |
| **How Much?** (Quanto custará?)      | O custo financeiro operacional será mitigado pela adoção de infraestrutura em free tier (hospedagem de aplicações, instâncias de banco de dados e APIs de geolocalização gratuitas/open-source). O custo real do projeto é medido no esforço técnico e horas de trabalho dedicadas pelos membros do grupo nas fases de pesquisa, levantamento de requisitos, diagramação arquitetural e prototipagem durante o ciclo letivo.                                                                                                                                                                                                                |

---

### 👤 Integrante: Vitor Hoffmann

| Pergunta                             | Resposta                                                                                                                                                                                                                                                                                                                                     |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What?** (O que será feito?)        | Desenvolvimento do **Módulo de Gestão de Perfis (Turistas e Guias) e Cadastro Fast-Track de Trilhas**. O foco é a implementação do sistema de autenticação, controle de acesso por papéis (RBAC) e o fluxo ágil para que os guias locais publiquem suas rotas e pacotes na plataforma.                                                       |
| **Why?** (Por que será feito?)       | Para viabilizar a segurança e o modelo de negócio da plataforma. É necessário diferenciar de forma clara as permissões de um Turista e de um Guia Local. O Cadastro Fast-Track resolve a dor da alta intermediação, permitindo que os guias insiram metadados e pacotes rapidamente para que fiquem disponíveis no mapeamento e agendamento. |
| **Where?** (Onde será implementado?) | Integrado diretamente ao core da aplicação web/mobile. As rotas de autenticação protegerão os endpoints da API, e as interfaces (painéis de controle e formulários) estarão acessíveis nos perfis logados dos usuários.                                                                                                                      |
| **When?** (Quando será executado?)   | O cronograma segue os marcos do semestre letivo de 2026.1 da disciplina de Arquitetura e Desenho de Software, com a modelagem de acesso e entrega do MVP ocorrendo de forma iterativa até Julho/2026.                                                                                                                                        |
| **Who?** (Quem será o responsável?)  | **Responsável:** Vitor Hoffmann. **Atores Envolvidos:** Equipe de desenvolvimento (Grupo 5) responsável pela integração. **Público-alvo:** Turistas (consumidores) e Guias Locais (ofertantes).                                                                                                                                              |
| **How?** (Como será realizado?)      | Utilizando o NestJS para construir APIs RESTful robustas que gerenciem a autenticação (ex: JWT) e autorização (RBAC). O PostgreSQL será usado para modelar as relações entre Usuários, Perfis e as Trilhas cadastradas. O front-end em React consumirá essas APIs para renderizar os fluxos de cadastro Fast-Track de forma intuitiva.       |
| **How Much?** (Quanto custará?)      | Custo financeiro isento devido à adoção de tecnologias open-source e infraestrutura em _free tier_. O custo principal baseia-se no esforço técnico e nas horas de trabalho dedicadas (estimadas em 60 a 70 horas) ao longo do ciclo de desenvolvimento do projeto acadêmico.                                                                 |

---

### 👤 Integrante: Paulo Filho

| Pergunta                           | Resposta                                                                                                                                                                                                                                                                                                                                        |
| :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What?** (O que será feito?) | Desenvolvimento de uma **plataforma digital colaborativa** para informações sobre áreas turísticas naturais brasileiras. O sistema integrará um blog a um catálogo de trilhas e ecoturismo, permitindo o cadastro de locais por usuários e a criação de rotas organizadas por guias locais. |
| **Why?** (Por que será feito?) | Para promover o **turismo sustentável** e a economia local, conectando turistas diretamente a guias. O objetivo é reduzir a dependência de agências caras e ampliar a visibilidade de destinos naturais pouco explorados no Brasil de forma consciente. |
| **Where?** (Onde será implementado?) | Plataforma digital acessível via **desktop, website e dispositivos móveis**. A atuação abrange todo o território brasileiro, com foco em regiões de alto potencial turístico natural. |
| **When?** (Quando será executado?) | Durante o semestre letivo de **2026.1**, dentro da disciplina de Arquitetura e Desenho de Software. O cronograma inclui levantamento de requisitos, prototipação, modelagem, desenvolvimento e validação. |
| **Who?** (Quem será o responsável?) | **Responsáveis:** Equipe ágil (Grupo de ADS) composta por Product Owner, Scrum Master e desenvolvedores (Full Stack). **Atores Envolvidos:** Turistas e guias locais como principais stakeholders. |
| **How?** (Como será realizado?) | Utilizando **metodologias ágeis (Scrum e Kanban)** e modelagem BPMN. A stack tecnológica conta com **React** no front-end e **Node.js com NestJS** no back-end, estruturados em uma arquitetura em camadas. |
| **How Much?** (Quanto custará?) | **Custo zero**, devido ao cunho estritamente acadêmico do projeto. O investimento principal consiste nas horas de dedicação técnica da equipe para o cumprimento dos requisitos da disciplina. |

---

### 👤 Integrante: Heloisa Silva

| Pergunta                             | Resposta                                                                                                                                                                                                                                                                                                                              |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **What?** (O que será feito?)        | A equipe desenvolverá um sistema web em formato de Blog para conectar amantes de trilhas e natureza que tenham interesse em conhecer belezas naturais em suas redondezas ou em novos lugares. |
| **Why?** (Por que será feito?)       |	O objetivo é disponibilizar uma plataforma que conecte pessoas que se conheçam trilhas e ofereçam caravanas e excursões para conhecer os locais compartilhados dentro de sistema.                 |
| **Where?** (Onde será implementado?) |  O projeto será desenvolvido em ambiente web com acessibilidade possível em aparelhos desktop e dispositivos móveis                                                                                    |
| **When?** (Quando será executado?)   |O projeto será realizado durante o semestre pela disciplina de arquitetura de software do curso de engenharia de software da Universidade de Brasília, sendo o final previsto para 29/06                                                                                         |
| **Who?** (Quem será o responsável?)  | A equipe será responsável pela realização. do projeto que tem como público alvo amantes de trilha e natureza que tenham vontade de conhecer belezas naturais                                                                                         |
| **How?** (Como será realizado?)      | A equipe decidiu utilizar o Scrum, combinado com Kanban. Será utilizado para o desenvolvimento REACT para o frontend    e NESTJS para o backend             |
| **How Much?** (Quanto custará?)      | O progeto durara por volta de 60 horas trabalhadas, mas como se trata de um projeto academico os custos serão nulos. |                                                                                        |

---

### 👤 Integrante: Mateus Magno

| Pergunta | Resposta |
| :--- | :--- |
| **What?** (O que será feito?) | Desenvolvimento do **Núcleo de Eventos e Sistema de Validação**. O foco é a implementação do ciclo de vida das trilhas: criação pelo Organizador, fluxo de inscrição com chat 1-para-1 e a validação final via código único para concessão de badges. |
| **Why?** (Por que será feito?) | Para profissionalizar a organização de trilhas e peregrinações, mitigando riscos de fraudes financeiras através de avisos nativos e garantindo que o perfil do usuário reflita sua experiência real no mundo físico através de badges validadas. |
| **Where?** (Onde será feito?) | Aplicação Web Escalável (SPA). O sistema será focado inicialmente no ecoturismo e rotas de peregrinação, visando atender a demanda de comunidades de trilheiros e exploradores de belezas naturais no Brasil. |
| **When?** (Quando será feito?) | O desenvolvimento ocorrerá durante o primeiro semestre de 2026, com a entrega do MVP funcional programada para o fechamento da disciplina de Arquitetura de Software em Julho. |
| **Who?** (Quem são os envolvidos?) | **Equipe:** Desenvolvedores Full-stack. **Público-alvo:** Organizadores de eventos de aventura, guias e usuários comuns que buscam grupos confiáveis para prática de atividades na natureza. |
| **How?** (Como será realizado?) | Utilizando **NestJS** para a arquitetura do backend e **PostgreSQL** para persistência de dados transacionais. A interface será construída em **React com TypeScript**, garantindo a integridade do fluxo de validação de códigos. |
| **How Much?** (Quanto vai custar?) | Investimento estimado em **80 horas técnicas** de desenvolvimento especializado. Custos de infraestrutura nulos pelo uso de tecnologias open-source e custos de hospedagem oferecidos voluntariamente por um membro da equipe. |

---

### 👤 Integrante: Mário Vinicius

| Pergunta                           | Resposta     |
| :--------------------------------- | :----------- |
| **What?** (O que será feito?)      | **O Produto:** Desenvolvimento de uma plataforma digital híbrida que atua simultaneamente como um Blog Colaborativo e um Catálogo de Trilhas e Ecoturismo. **Diferenciais:** Contará com um sistema de gamificação (medalhas) e controle de vagas para expedições. |
| **Why?** (Por que será feito?)     | **O Propósito:** Dar visibilidade a belezas naturais e rotas isoladas do Brasil. **O Problema:** Resolver a descentralização de informações (como ocorre em sites de mapas confusos) e democratizar o acesso ao ecoturismo. **A Solução:** Conectar diretamente os turistas a guias locais capacitados, eliminando a dependência de agências com alto custo.|
| **Where?** (Onde será feito?)      | **Ambiente de Uso:** A plataforma será disponibilizada em ambiente Web/Mobile para acesso remoto por turistas e guias. **Ambiente de Desenvolvimento:** Repositório no GitHub (`UnBArqDsw2026-1-Turma01/2026.1-T01-_G5_BelezasNaturaisBrasileiras_Entrega_01`) e ambientes de desenvolvimento local da equipe.|
| **When?** (Quando será feito?)     | **Prazo de Execução:** Durante o semestre letivo de 2026.1 da disciplina de Arquitetura e Desenho de Software. **Marco Atual:** O escopo inicial e o planejamento base (Módulo Base) têm entrega fixada para o dia 06/04/2026. |
| **Who?** (Quem são os envolvidos?) | **Equipe de Desenvolvimento:** Grupo 5, composto por 10 alunos de Engenharia de Software da UnB. **Atores do Sistema:** Administrador, Usuário Visitante/Turista, Guia Local/Mestre de Caravana |
| **How?** (Como será realizado?)    | **Metodologia de Design:** O planejamento seguirá as 5 etapas da Design Sprint adaptada para a disciplina (Unpack, Sketch, Decide, Prototype, Validate). **Modelagem:** A arquitetura e os processos do sistema utilizarão metodologias ágeis (com processos modelados em notação BPMN). **Stack Tecnológica:** O desenvolvimento técnico será feito utilizando **NestJS** no back-end e **React** no front-end.|
| **How Much?** (Quanto vai custar?) | **Fase Acadêmica:** O custo principal é medido em esforço humano (horas de estudo, reuniões, design e codificação dos 10 integrantes do grupo). **Ferramentas:** Uso de licenças educacionais e camadas gratuitas (Figma, GitHub, Trello/Jira, Docsify). **Fase de Produção (Futuro):** Possíveis custos operacionais de infraestrutura em nuvem (servidores AWS/GCP, hospedagem de banco de dados) e registro de domínio caso desejemos sair do escopo atualmente disponibilizado pelo servidor do nosso colega. |

---

## Entregáveis esperados

- Conjunto de esboços de solução.
- Registros das principais ideias consideradas (Tabelas 5W2H).

## Planilha de versionamento

| Versão | Data       | Descrição                                                                     | Autor                                                   | Revisor |
| :----- | :--------- | :---------------------------------------------------------------------------- | :------------------------------------------------------ | :------ |
| 1.0    | 01/04/2026 | Criação do documento e adição da estrutura base                               | [Ana Luiza](https://github.com/ana-pfeilsticker)        | Mateus Magno |
| 1.1    | 01/04/2026 | Inclusão dos templates 5W2H, justificativa e preenchimento do 5w2h individual | [Ana Luiza](https://github.com/ana-pfeilsticker)        | Mateus Magno |
| 1.2    | 01/04/2026 | Preenchimento do 5w2h individual                                              | [Antonio Carvalho](https://github.com/antonioscarvalho) | Mateus Magno |
| 1.3    | 01/04/2026 | Preenchimento do 5w2h individual                                              | [Miguel Arthur](https://github.com/zlimaz)              | Mateus Magno |
| 1.4    | 01/04/2026 | Preenchimento do 5w2h individual                                              | [Vitor Hoffmann](https://github.com/vitor-hoffmann)     | Mateus Magno |
| 1.5    | 01/04/2026 | Preenchimento do 5w2h individual                                              | [Paulo Filho](https://github.com/PauloFilho2)       | Mateus Magno |
| 1.6    | 01/04/2026 | Preenchimento do 5w2h individual                                              | [Heloisa Silva](https://github.com/Heloisa-Santos)       | Mateus Magno |
| 1.7   | 01/04/2026 | Preenchimento do 5w2h individual                                              | [Mateus Magno](https://github.com/mtsmgn0)       |         |
| 1.8   | 02/04/2026 | Preenchimento do 5w2h individual                                              | [Mário Vinícius](https://github.com/MarioViniciusBC)       | Mateus Magno |
| 1.9   | 01/04/2026 | Inclusão do mapa mental preliminar desenvolvido em sala                                       | [Mateus Magno](https://github.com/mtsmgn0)       |         |

