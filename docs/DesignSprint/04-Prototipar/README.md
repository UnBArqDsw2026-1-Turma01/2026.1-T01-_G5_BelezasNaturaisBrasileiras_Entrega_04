# Etapa 4 - Prototipar

A etapa Prototipar materializa a solução escolhida em uma representação testável. O foco é construir algo suficiente para validar hipóteses com usuários reais.

## Objetivo
Criar um protótipo realista, rápido e funcional para o contexto do teste.

## Atividades da etapa
*   definição do escopo do protótipo
*   distribuição de responsabilidades
*   construção colaborativa do protótipo
*   revisão final para preparo do teste

## Entregáveis esperados
Definimos a arquitetura inicial e mapeamos os fluxos de todas as telas da aplicação para cobrir integralmente os Requisitos Funcionais levantados. O protótipo abrange desde a visão pública até os painéis de controle e gestão, garantindo que as restrições impostas na etapa de Decisão tenham reflexo direto na interface. 

As telas estruturadas para o protótipo são:

### 1. Autenticação e Acesso
* **Tela de Login:** Interface de acesso via e-mail/senha ou autenticação integrada ao Google.
* **Tela de Cadastro:** Formulário de registro coletando nome, sexo biológico, e-mail, WhatsApp e senha.

### 2. Navegação Principal (Pública e Geral)
* **Tela Inicial (Feed):** Interface principal com filtros hierárquicos manuais (Estado > Cidade > Região) e listagem de cards de pontos turísticos.
* **Tela de Detalhes do Ponto Turístico:** Exibição de fotos, descrição, comentários, botão de denúncia, histórico de edições e lista de trilhas vinculadas ao local.
* **Tela de Detalhes da Trilha:** Informações do percurso, data, horário, ponto de encontro e botão central "Inscreva-se".
* **Tela de Perfil Público:** Visão do perfil (usuário ou organizador) exibindo foto, avaliações gerais e badges de participação conquistadas.

### 3. Área do Usuário Comum
* **Painel Pessoal (Meu Perfil):** Espaço para edição de dados básicos e visualização dos códigos de confirmação recebidos para trilhas aprovadas.
* **Tela de Cadastro/Edição de Ponto Turístico:** Formulário colaborativo para inserção de novas belezas naturais na plataforma.
* **Tela de Mensagens (Chat 1-para-1):** Interface de comunicação com o organizador, contendo o aviso fixo de segurança contra pagamentos e o módulo de avaliação antecipada.
* **Tela de Solicitação de Upgrade:** Formulário para envio de documentos (RG, CPF), justificativa e links para análise de perfil de Organizador.
* **Modal de Denúncia:** Módulo sobreposto para reportar perfis, comentários ou locais irregulares.

### 4. Área do Organizador
* **Dashboard do Organizador:** Painel listando trilhas criadas (ativas e inativas), atalhos para alterar datas e o botão de "Finalizar Trilha".
* **Tela de Criação/Edição de Trilha:** Formulário para definição de tipo, datas, ponto de encontro e mapeamento dos locais do percurso.
* **Tela de Gestão de Vagas:** Interface listando solicitações pendentes de usuários interessados, permitindo aceitar ou recusar.
* **Tela de Validação de Presença (Check-in):** Tela operacional para o organizador inserir os códigos fornecidos pelos participantes no ponto de encontro.

### 5. Área do Administrador
* **Painel Administrativo (Moderação):** Dashboard contendo o fluxo de denúncias e ferramentas exclusivas para exclusão definitiva de locais e bloqueio de contas.
* **Painel Administrativo (Upgrades):** Fila de solicitações de usuários comuns, permitindo a checagem de documentos para promoção a Organizador.




## Planilha de versionamento

| Versao | Data       | Descricao                                      | Autor                                 | Revisor |
| ------ | ---------- | ---------------------------------------------- | ------------------------------------- | ------- |
| 1.0    | 01/04/2026 | Criacao do documento e adicao da estrutura base | [Ana Luiza](https://github.com/ana-pfeilsticker) |         |
| 1.1 | 02/04/2026 | Criação do documento e definição de escopo do protótipo | [Mateus Magno](https://github.com/mtsmgn0)     | |
