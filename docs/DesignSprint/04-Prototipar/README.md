# Etapa 4 - Prototipar

A etapa Prototipar materializa a solução escolhida em uma representação testável. O foco é construir algo suficiente para validar hipóteses com usuários reais.

## Objetivo

Criar um protótipo realista, rápido e funcional para o contexto do teste.

## Atividades da etapa

- definição do escopo do protótipo
- distribuição de responsabilidades
- construção colaborativa do protótipo
- revisão final para preparo do teste

## Entregáveis esperados

Definimos a arquitetura inicial e mapeamos os fluxos de todas as telas da aplicação para cobrir integralmente os Requisitos Funcionais levantados. O protótipo abrange desde a visão pública até os painéis de controle e gestão, garantindo que as restrições impostas na etapa de Decisão tenham reflexo direto na interface.

As telas estruturadas para o protótipo são:

### 1. Autenticação e Acesso

- **Tela de Login:** Interface de acesso via e-mail/senha ou autenticação integrada ao Google.
<img width="831" height="622" alt="image" src="https://github.com/user-attachments/assets/a68af02f-5bfb-4619-8a47-c95afc4b237f" />

- **Tela de Cadastro:** Formulário de registro coletando nome, sexo biológico, e-mail, WhatsApp e senha.
<img width="620" height="472" alt="image" src="https://github.com/user-attachments/assets/493039a0-e50f-4c87-ada7-1945f5139932" />

### 2. Navegação Principal (Pública e Geral)

- **Tela Inicial (Feed):** Interface principal com filtros hierárquicos manuais (Estado > Cidade > Região) e listagem de cards de pontos turísticos.
<img width="615" height="495" alt="image" src="https://github.com/user-attachments/assets/1dcd0410-3ed8-40db-824d-1508bc05ab8a" />

- **Tela de Detalhes do Ponto Turístico:** Exibição de fotos, descrição, comentários, botão de denúncia, histórico de edições e lista de trilhas vinculadas ao local.
<img width="445" height="806" alt="image" src="https://github.com/user-attachments/assets/5b7de9bb-9528-477e-87d3-9b5ece0f0545" />

- **Tela de Detalhes da Trilha:** Informações do percurso, data, horário, ponto de encontro e botão central "Inscreva-se".
<img width="434" height="497" alt="image" src="https://github.com/user-attachments/assets/bb2aa7cb-a81d-4d44-a2af-6815db899085" />

- **Tela de Perfil Público:** Visão do perfil (usuário ou organizador) exibindo foto, avaliações gerais e badges de participação conquistadas.
<img width="940" height="704" alt="image" src="https://github.com/user-attachments/assets/98f2765c-89f5-4e6c-bb26-5e8a758a1e5a" />

### 3. Área do Usuário Comum

- **Painel Pessoal (Meu Perfil):** Espaço para edição de dados básicos e visualização dos códigos de confirmação recebidos para trilhas aprovadas.
<img width="418" height="307" alt="image" src="https://github.com/user-attachments/assets/79d07536-8856-4ad8-a7ee-a5449ecc9728" />

- **Tela de Cadastro/Edição de Ponto Turístico:** Formulário colaborativo para inserção de novas belezas naturais na plataforma.
<img width="674" height="577" alt="image" src="https://github.com/user-attachments/assets/9f9cd08a-edc8-48dd-a275-bd9c8857b5c9" />

- **Tela de Mensagens (Chat 1-para-1):** Interface de comunicação com o organizador, contendo o aviso fixo de segurança contra pagamentos e o módulo de avaliação antecipada.
<img width="532" height="403" alt="image" src="https://github.com/user-attachments/assets/bf113408-8109-4919-990a-6dd924f7760c" />

- **Tela de Solicitação de Upgrade:** Formulário para envio de documentos (RG, CPF), justificativa e links para análise de perfil de Organizador.
<img width="552" height="762" alt="image" src="https://github.com/user-attachments/assets/9ca14e66-88ff-4535-87e8-df8e9b9a0b61" />

- **Modal de Denúncia:** Módulo sobreposto para reportar perfis, comentários ou locais irregulares.
<img width="533" height="344" alt="image" src="https://github.com/user-attachments/assets/7b504edc-83c2-4466-93f9-70662ba5c28d" />


### 4. Área do Organizador

- **Dashboard do Organizador:** Painel listando trilhas criadas (ativas e inativas), atalhos para alterar datas e o botão de "Finalizar Trilha".
<img width="670" height="499" alt="image" src="https://github.com/user-attachments/assets/db631cbf-7b79-44f1-9315-c308cd042cb7" />

- **Tela de Criação/Edição de Trilha:** Formulário para definição de tipo, datas, ponto de encontro e mapeamento dos locais do percurso.
<img width="546" height="549" alt="image" src="https://github.com/user-attachments/assets/60be9203-f5a9-4859-b306-6ff66b107526" />

- **Tela de Gestão de Vagas:** Interface listando solicitações pendentes de usuários interessados, permitindo aceitar ou recusar.
<img width="946" height="204" alt="image" src="https://github.com/user-attachments/assets/adcca9d1-4081-453b-bb04-37762c065a4c" />

- **Tela de Validação de Presença (Check-in):** Tela operacional para o organizador inserir os códigos fornecidos pelos participantes no ponto de encontro.
<img width="936" height="125" alt="image" src="https://github.com/user-attachments/assets/ea76b1e0-21ed-49d4-9d59-82f668de2246" />

### 5. Área do Administrador

- **Painel Administrativo (Moderação):** Dashboard contendo o fluxo de denúncias e ferramentas exclusivas para exclusão definitiva de locais e bloqueio de contas.
<img width="485" height="659" alt="image" src="https://github.com/user-attachments/assets/4a9afd63-36e0-4b40-8e53-2c6bf04763a0" />

- **Painel Administrativo (Upgrades):** Fila de solicitações de usuários comuns, permitindo a checagem de documentos para promoção a Organizador.
<img width="473" height="767" alt="image" src="https://github.com/user-attachments/assets/73c71312-2ada-4fba-8f09-7b15921821ef" />

## Link do figma

https://www.figma.com/design/JKOZFFnJU9t9CxnwiWPAx2/Belezas-Naturais?node-id=0-1&t=lEmq8GVMIr2ZYK89-1

## Planilha de versionamento

| Versao | Data       | Descricao                                               | Autor                                            | Revisor                                             |
| ------ | ---------- | ------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------- |
| 1.0    | 01/04/2026 | Criacao do documento e adicao da estrutura base         | [Ana Luiza](https://github.com/ana-pfeilsticker) | [Vitor Hoffmann](https://github.com/vitor-hoffmann) |
| 1.1    | 02/04/2026 | Criação do documento e definição de escopo do protótipo | [Mateus Magno](https://github.com/mtsmgn0)       | [Vitor Hoffmann](https://github.com/vitor-hoffmann) |
| 2.0    | 05/04/2026 | Adição do protótipo e imagens das telas       | [Ana Luiza](https://github.com/ana-pfeilsticker) | [Vitor Hoffmann](https://github.com/vitor-hoffmann) |

