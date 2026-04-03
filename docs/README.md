<div align="center">

<img src="/2026.1-T01-_G5_BelezasNaturaisBrasileiras_Entrega_01/docs/assets/images/as_comp_cor.jpg" alt="UnB Logo" width="400"/>

# 🌿 Plataforma de Belezas Naturais e Trilhas

> **Mapeamento colaborativo de trilhas e pontos turísticos naturais do Brasil**

[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Entrega](https://img.shields.io/badge/Entrega-1-green?style=for-the-badge)](.)
[![Disciplina](https://img.shields.io/badge/FGA0208-Arquitetura%20%26%20Desenho-blueviolet?style=for-the-badge)](.)

---

**Disciplina:** Arquitetura e Desenho de Software — FGA0208
**Curso:** Engenharia de Software
**Instituição:** Faculdade de Ciências e Tecnologias em Engenharia (FCTE) — Universidade de Brasília (UnB)
**Professora:** Milene Serrano
**Grupo:** 05

</div>

---

## Índice

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Equipe](#-equipe)
3. [Base do Projeto — Design Sprint](#-base-do-projeto--design-sprint)
4. [Processos e Modelagem — BPMN](#-processos-e-modelagem--bpmn)
5. [Engenharia de Requisitos](#-engenharia-de-requisitos)
6. [Arquitetura e Design](#-arquitetura-e-design)
7. [Como Rodar o Projeto](#-como-rodar-o-projeto)
8. [Iniciativas Extras](#-iniciativas-extras)
9. [Histórico de Versões](#-histórico-de-versões)

---

## Sobre o Projeto

A **Plataforma de Belezas Naturais e Trilhas** é um ecossistema digital voltado ao mapeamento colaborativo de pontos turísticos naturais brasileiros — cachoeiras, montanhas, grutas e trilhas. O sistema endereça dois problemas centrais identificados na fase de descoberta:

1. **Fragmentação da informação** — dados sobre trilhas estão dispersos em múltiplas fontes sem padronização ou curadoria;
2. **Insegurança no agendamento** — a falta de canais formais entre visitantes e organizadores gera riscos operacionais e logísticos.

A solução conecta quatro perfis de usuário em uma arquitetura de acessos graduados:

| Perfil | Capacidades Principais |
|---|---|
| **Visitante** | Explorar feed público com filtros por Estado, Cidade e Região |
| **Usuário Comum** | Favoritar trilhas, realizar check-ins e acumular badges de conquista |
| **Organizador** | Publicar e gerenciar trilhas, validar presenças via código único |
| **Administrador** | Moderar conteúdo, gerir usuários e auditar histórico de edições |

---

## Equipe

Aqui está a tabela de equipe atualizada, incluindo o **Paulo Filho** e todos os links diretos para os perfis do GitHub:

---

## Equipe

| Matrícula | Aluno | GitHub |
| :--- | :--- | :--- |
| 22/2015060 | Ana Luiza Pfeilsticker | [ana-pfeilsticker](https://github.com/ana-pfeilsticker) |
| 22/2006552 | Antonio Carvalho | [antonioscarvalho](https://github.com/antonioscarvalho) |
| 20/0035703 | Breno Alexandre | [brenoalexandre0](https://github.com/brenoalexandre0) |
| 23/1011462 | Heloisa Silva | [Heloisa-Santos](https://github.com/Heloisa-Santos) |
| 22/2021998 | Mateus Magno | [mtsmgn0](https://github.com/mtsmgn0) |
| 20/2046265 | Mário Vinicius | [MarioViniciusBC](https://github.com/MarioViniciusBC) |
| 21/1062320 | Miguel Arthur | [zlimaz](https://github.com/zlimaz) |
| - | Paulo Filho | [PauloFilho2](https://github.com/PauloFilho2) |
| 22/2006211 | Vitor Valerio Hoffmann | [vitor-hoffmann](https://github.com/vitor-hoffmann) |

---

---
 
## Base do Projeto — Design Sprint
 
A base conceitual da plataforma foi construída por meio de um **Design Sprint**, metodologia ágil de cinco fases condensadas que permitiu à equipe alinhar problemas, explorar soluções e validar hipóteses antes de qualquer linha de código.
 
### Etapas Executadas
 
#### Entender (Unpack)
Nesta etapa, o grupo mapeou as dores dos usuários-alvo — caminhantes, aventureiros e organizadores de eventos outdoor. O principal insight foi a **dicotomia entre abundância de destinos e escassez de informação confiável**, além da ausência de um canal seguro para comunicação entre visitantes e organizadores.
 
**Artefatos gerados:** Mapa de empatia, Brainstorming estruturado, Definição do problema central ("Como Poderíamos...").
 
#### Esboçar (Sketch)
Cada membro propôs soluções individuais para os problemas levantados. As propostas contemplaram desde feeds filtráveis até sistemas gamificados com badges de conquista.
 
**Artefatos gerados:** Esboços individuais de interfaces, Rich Pictures e Storyboards conceituais.
 
#### Decidir (Decision)
A equipe convergiu para uma solução híbrida que combina **feed inteligente com filtros geográficos**, sistema de **agendamento seguro via código único** e **gamificação por conquistas**, priorizando os fluxos de maior impacto para o MVP.
 
**Artefatos gerados:** Mapa de priorização, Solução escolhida consolidada, Protótipo de baixa fidelidade.
 
#### Prototipar (Prototyping)
Com a solução definida, a equipe produziu protótipos navegáveis de média fidelidade, validando a jornada do Usuário Comum e do Organizador nos fluxos de exploração e agendamento de trilhas.
 
**Artefatos gerados:** Protótipo no Figma, fluxos de telas para os perfis principais.
 
> **Impacto no Projeto:** O Design Sprint estabeleceu a visão compartilhada do produto, evitando retrabalho na fase de modelagem. Todas as regras de negócio (RN) e requisitos funcionais (RF) identificados nos artefatos de modelagem têm rastreabilidade direta para as decisões do Sprint.
 
---
 
## Processos e Modelagem — BPMN
 
A modelagem de processos foi realizada utilizando a notação **BPMN 2.0 (Business Process Model and Notation)**, capturando os fluxos de valor mais críticos da plataforma.
 
### Fluxo de Agendamento de Trilhas
 
O processo de agendamento é o fluxo central da plataforma, envolvendo três *pools* de participantes:
 
```
Usuário Comum  →  Sistema da Plataforma  →  Organizador
```
 
**Etapas principais do fluxo:**
 
1. **Descoberta** — O usuário acessa o feed e aplica filtros (Estado / Cidade / Região / Tipo de trilha);
2. **Solicitação** — O usuário acessa a página da trilha e solicita participação no evento;
3. **Chat Seguro** — O sistema abre um canal de **comunicação 1-para-1** entre usuário e organizador (RN03), sem exposição de dados pessoais no feed;
4. **Confirmação** — O organizador confirma a presença e o sistema emite um **código único de validação**;
5. **Check-in** — No dia do evento, o organizador valida o código do participante, registrando a presença oficialmente;
6. **Recompensa** — O sistema verifica critérios e atribui **badges de conquista** ao usuário.
 
### Fluxo de Moderação de Conteúdo
 
O processo de moderação garante a integridade das informações publicadas:
 
```
Organizador  →  Sistema (Análise)  →  Administrador  →  Publicação
```
 
Todo conteúdo editado gera uma entrada no **histórico de versões** (RN01), permitindo auditoria completa e reversão de alterações indevidas. O Administrador pode acionar a moderação reativa via denúncias de usuários ou proativa via varredura periódica.
 
---
 
## Engenharia de Requisitos
 
### Requisitos Funcionais (RF)
 
| ID | Descrição |
|---|---|
| RF01 | O sistema deve permitir o cadastro de usuários com nome, sexo biológico, e-mail, WhatsApp e senha, além de oferecer autenticação via Google. |
| RF02 | O sistema deve exibir um feed de pontos turísticos, permitindo a filtragem manual hierárquica por Estado, Cidade e Região. |
| RF03 | O sistema deve permitir que usuários cadastrados criem e editem informações de pontos turísticos. |
| RF04 | O sistema deve exibir páginas individuais para pontos turísticos e para trilhas, contendo detalhes, fotos, comentários e rotas. |
| RF05 | O sistema deve permitir que um usuário se inscreva em uma trilha, enviando uma mensagem inicial que abre um chat 1-para-1 com o organizador. |
| RF06 | O sistema deve gerar um código de presença único para o usuário inscrito, disponibilizado apenas após a confirmação do organizador. |
| RF07 | O sistema deve permitir ao organizador aceitar ou recusar participantes e validar a presença inserindo o código do usuário. |
| RF08 | O sistema deve permitir que o organizador crie trilhas e edite apenas as trilhas de sua autoria. |
| RF09 | O sistema deve permitir que o organizador finalize uma trilha, inativando-a e distribuindo automaticamente badges aos participantes com presença validada. |
| RF10 | O sistema deve permitir que usuários comuns enviem formulários (com RG, CPF, justificativa e links) solicitando o status de Organizador. |
| RF11 | O sistema deve possuir um painel administrativo para aprovação de organizadores, promoção de usuários, gestão de denúncias e exclusão de locais. |
| RF12 | O sistema deve permitir que qualquer usuário denuncie locais, perfis e comentários. |
 
### Requisitos Não Funcionais (RNF)
 
| ID | Descrição | Tecnologia de Atendimento |
|---|---|---|
| RNF01 | O backend da aplicação deve ser desenvolvido utilizando o framework NestJS. | **NestJS** — arquitetura modular com Decorators e injeção de dependência nativa |
| RNF02 | O frontend da aplicação deve ser construído como uma SPA utilizando React com Vite e TypeScript. | **React + Vite + TypeScript** — renderização eficiente e tipagem estática |
| RNF03 | O sistema deve utilizar o PostgreSQL como banco de dados relacional. | **PostgreSQL** — integridade referencial e suporte a dados relacionais complexos |
| RNF04 | O sistema deve apresentar avisos de segurança claros na interface contra pagamentos antecipados. | Implementado via componentes de alerta no frontend |
 
### Regras de Negócio (RN)
 
| ID | Descrição |
|---|---|
| RN01 | Qualquer usuário autenticado pode editar locais, mas o sistema deve registrar histórico de versionamento (autor e data). |
| RN02 | A exclusão permanente de um ponto turístico é irrestrita e exclusiva do perfil de Administrador. |
| RN03 | A comunicação dentro das trilhas deve ser estritamente individual (1-para-1). O sistema não deve permitir chats em grupo. |
| RN04 | O usuário ganha o direito de avaliar o organizador no momento em que o chat de solicitação é aberto. |
| RN05 | As badges de participação só serão fixadas no perfil no exato momento da ação de "Finalizar Trilha", e apenas para códigos validados. |
| RN06 | Uma trilha inativa retorna ao status ativo caso o organizador altere sua data de início para o futuro. |
| RN07 | Se uma trilha for deletada, badges e comentários atrelados ao perfil do organizador devem ser preservados permanentemente. |
 
---
 
## Arquitetura e Design
 
A arquitetura da plataforma adota o padrão **cliente-servidor com separação estrita de responsabilidades**, refletindo as boas práticas de Clean Architecture e os princípios SOLID.
 
### Visão de Camadas
 
```
┌─────────────────────────────────────────┐
│           Frontend (React + Vite)        │
│      Componentes / Páginas / Hooks       │
└──────────────────┬──────────────────────┘
                   │ HTTP / REST
┌──────────────────▼──────────────────────┐
│           Backend (NestJS)              │
│  Controllers → Services → Repositories  │
│       Guards (Autenticação/RBAC)        │
└──────────────────┬──────────────────────┘
                   │ ORM (TypeORM)
┌──────────────────▼──────────────────────┐
│          Banco de Dados (PostgreSQL)     │
│  Entidades / Relações / Histórico        │
└─────────────────────────────────────────┘
```
 
### Regras de Negócio Centrais
 
> **RN01 — Versionamento de Edições:** Toda alteração em um ponto turístico deve ser registrada com autor e data. A entidade `EditHistory` armazena o histórico completo, permitindo auditoria pelo Administrador. Qualquer usuário autenticado pode editar, mas nenhuma modificação sobrescreve dados sem registro.
 
> **RN02 — Exclusão Restrita ao Administrador:** A remoção permanente de um ponto turístico é uma operação exclusiva do perfil Administrador, prevenindo exclusões acidentais ou mal-intencionadas por outros perfis.
 
> **RN03 — Restrição de Chat 1-para-1:** O sistema de comunicação interna opera exclusivamente em canais privados entre um Usuário Comum e um Organizador vinculado a uma trilha. Chats em grupo estão explicitamente fora do escopo.
 
> **RN04 — Avaliação do Organizador:** O direito de avaliação é concedido automaticamente no momento em que o chat de solicitação é aberto, garantindo que apenas participantes legítimos possam opinar.
 
> **RN05 — Distribuição de Badges na Finalização:** As badges de participação são atribuídas exclusivamente no ato de "Finalizar Trilha" e somente para participantes com código de presença validado pelo organizador.
 
> **RN06 — Reativação de Trilha Inativa:** Uma trilha no status inativo retorna automaticamente ao status ativo caso o organizador altere sua data de início para uma data futura.
 
> **RN07 — Preservação de Dados em Trilhas Deletadas:** A exclusão de uma trilha não afeta badges e comentários já atrelados ao perfil do organizador, que são preservados permanentemente.
 
### Controle de Acesso (RBAC)
 
O controle de acesso é baseado em **papéis hierárquicos** implementados via Guards do NestJS. Cada endpoint da API declara explicitamente os papéis autorizados, sendo o token JWT validado e o perfil extraído em cada requisição.
 
---
 
## Como Rodar o Projeto
 
> **Há algo a ser executado:** SIM
 
### Pré-requisitos
 
Certifique-se de ter instalado em sua máquina:
 
- [Node.js](https://nodejs.org/) `v18+`
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) `v14+`
- [Git](https://git-scm.com/)
 
### 1. Clone o Repositório
 
```bash
git clone https://github.com/<org>/plataforma-trilhas.git
cd plataforma-trilhas
```
 
### 2. Configuração do Banco de Dados
 
Crie o banco de dados PostgreSQL e configure as variáveis de ambiente:
 
```bash
# No PostgreSQL
CREATE DATABASE trilhas_db;
```
 
```bash
# No diretório backend, crie o arquivo .env
cp backend/.env.example backend/.env
```
 
Edite o `backend/.env` com suas credenciais:
 
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_NAME=trilhas_db
JWT_SECRET=sua_chave_secreta
```
 
### 3. Executando o Backend (NestJS)
 
```bash
# Acesse o diretório do backend
cd backend
 
# Instale as dependências
npm install
 
# Execute as migrations do banco de dados
npm run migration:run
 
# Inicie o servidor em modo de desenvolvimento
npm run start:dev
```
 
> O servidor backend estará disponível em `http://localhost:3000`
 
### 4. Executando o Frontend (React + Vite)
 
```bash
# Em um novo terminal, acesse o diretório do frontend
cd frontend
 
# Instale as dependências
npm install
 
# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env e defina VITE_API_URL=http://localhost:3000
 
# Inicie o servidor de desenvolvimento
npm run dev
```
 
> O frontend estará disponível em `http://localhost:5173`
 
### 5. Verificando a Instalação
 
Após ambos os serviços estarem em execução, acesse `http://localhost:5173` no navegador. Você deverá ver a tela inicial da plataforma com o feed de trilhas.
 
<details>
<summary>Opcão alternativa: Executando com Docker Compose</summary>
 
```bash
# Na raiz do projeto
docker-compose up --build
```
 
Este comando sobe automaticamente o PostgreSQL, o backend e o frontend em contêineres isolados.
 
</details>
 
---
 
## Iniciativas Extras
 
As contribuições a seguir foram desenvolvidas além do escopo mínimo exigido para a Entrega 1, demonstrando comprometimento da equipe com a qualidade técnica e metodológica do projeto:
 
| Iniciativa | Descrição | Impacto |
|---|---|---|
| **Protótipo de Alta Fidelidade** | Além do protótipo de média fidelidade exigido, a equipe produziu telas navegáveis no Figma com design system completo | Reduz ambiguidade na fase de implementação |
| **Modelagem RBAC** | Diagrama detalhado do controle de acesso baseado em papéis com matriz de permissões por endpoint | Antecipa decisões de segurança para a fase de desenvolvimento |
| **Glossário de Termos** | Documento padronizando a linguagem ubíqua do domínio (trilha, ponto turístico, organizador, check-in etc.) | Alinha comunicação entre todos os stakeholders |
| **Backlog Priorizado** | Épicos e User Stories detalhadas com critérios de aceitação, priorizados por valor de negócio (MoSCoW) | Facilita o planejamento das próximas entregas |
| **BPMN de Duplo Fluxo** | Modelagem de dois processos distintos (agendamento e moderação) ao invés de apenas um | Cobertura mais ampla dos fluxos críticos do sistema |
 
---
 
## Histórico de Versões
 
| Versão | Data | Descrição | Autor | Revisor(es) |
|---|---|---|---|---|
| 1.0 | 31/03/2026 | Criação da Home — Entrega 1 | Antonio | Mário |
| 1.1 | 03/04/2026 | Refatoração completa do README com seções de requisitos, BPMN, guia de execução e iniciativas extras | — | — |
 
---
 
<div align="center">
 
Desenvolvido pelo **Grupo 05** — FGA0208 / UnB 2026.1
 
</div>