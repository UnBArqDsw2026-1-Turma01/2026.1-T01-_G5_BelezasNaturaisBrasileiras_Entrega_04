# Glossário

## 1. Introdução

O glossário é um documento fundamental na Engenharia de Software, atuando como um dicionário centralizado para o projeto. O seu propósito principal é nivelar o conhecimento de toda a equipe de desenvolvimento, professores, avaliadores e futuros *stakeholders*, garantindo que todos utilizem a mesma terminologia e compreendam os conceitos sem ambiguidades. 

Para o desenvolvimento da plataforma **Belezas Naturais do Brasil**, a padronização do vocabulário é crucial. Como o sistema une o nicho de ecoturismo com regras rigorosas de moderação e engenharia web, termos de domínio específico (como "Código de Confirmação", "Badge" ou "Check-in Físico") e jargões arquiteturais (como "RBAC" ou "SPA") precisam ter suas fronteiras semânticas muito bem definidas. Isso evita falhas de comunicação no levantamento de requisitos e erros na implementação das regras de negócio.

Sendo assim, este artefato documenta as palavras-chave, entidades e conceitos técnicos adotados pela equipe ao longo de todo o ciclo de vida do projeto, organizados de forma a facilitar a rápida consulta e a imersão na arquitetura do sistema.

## 2. Glossário

Os termos estão organizados em ordem alfabética dentro de cada categoria temática.

### 2.1 Plataforma e Sistema

| Termo | Definição |
| :--- | :--- |
| **Administrador** | Perfil de usuário com privilégios máximos no sistema, responsável pela moderação de conteúdo (remoção de denúncias, exclusão de locais) e gestão de contas (aprovação de upgrades e bloqueios). |
| **Aviso de Segurança (Anti-Fraude)** | Alerta visual fixo implementado nativamente nas telas de chat e reserva, com a finalidade de instruir o usuário comum a não realizar pagamentos antecipados antes da confirmação presencial da vaga. |
| **Badge (Insígnia)** | Recompensa digital e visual de gamificação fixada no perfil público de um usuário, atestando sua participação validada e concluída em uma trilha ou expedição. |
| **Belezas Naturais do Brasil** | Plataforma web colaborativa focada no mapeamento de pontos turísticos ecológicos e gestão de inscrições para trilhas e expedições. |
| **Chat 1-para-1** | Canal de comunicação individual, direto e privado gerado automaticamente entre um usuário solicitante de vaga e o organizador de uma trilha. O sistema proíbe grupos visando segurança e privacidade. |
| **Check-in Físico** | Processo de validação presencial no ponto de encontro de uma trilha, onde o usuário apresenta seu Código de Confirmação para o Organizador atestar sua presença no sistema. |
| **Código de Confirmação** | Sequência alfanumérica única gerada pelo sistema e entregue ao usuário apenas após o organizador aceitar sua solicitação. É o "ingresso" digital para a validação da badge. |
| **Denúncia (Report)** | Ferramenta acionável pela comunidade para sinalizar aos administradores sobre locais, comentários ou perfis que infringem as regras da plataforma. |
| **Finalizar Trilha** | Ação exclusiva do Organizador que marca o término de um evento, alterando o status da trilha para inativo e acionando o gatilho automático de distribuição de badges para os participantes com código validado. |
| **Histórico de Edição** | Registro de auditoria no banco de dados que armazena "quem alterou" e "quando alterou" informações de um Ponto Turístico, garantindo rastreabilidade das colaborações da comunidade. |
| **Organizador (Guia/Líder)** | Perfil de usuário com permissões elevadas que passou por validação de documentos (RG/CPF). Tem o poder de criar eventos (trilhas), aprovar vagas e validar participantes. |
| **Ponto Turístico** | Localização geográfica natural mapeada na plataforma de forma colaborativa. Contém fotos, descrição, localização via hierarquia (Estado > Cidade > Região), tags de acesso e uma lista de trilhas vinculadas. |
| **Trilha (Evento)** | Entidade gerenciada por um Organizador que define um percurso, data, hora e ponto de encontro. Pode estar nos estados: Ativa, Lotada ou Inativa (Encerrada). |
| **Usuário Comum** | Usuário autenticado na plataforma. Pode mapear e editar locais, avaliar perfis e solicitar inscrição em trilhas, mas não pode organizar eventos. |
| **Visitante** | Usuário não autenticado. Possui permissão restrita de leitura, podendo navegar pelo feed, buscar locais e visualizar perfis, mas sem interagir com o sistema. |

### 2.2 Engenharia de Software e Requisitos

| Termo | Definição |
| :--- | :--- |
| **Arquitetura de Software** | Estrutura fundamental de um sistema de software, que compreende os componentes, seus relacionamentos, o ambiente e os princípios que guiam seu design e evolução. |
| **BPMN (Business Process Model and Notation)** | Notação gráfica padrão para modelagem de processos de negócio. Utilizada pela equipe para mapear o fluxo de trabalho da fábrica de software. |
| **Carga Cognitiva** | Esforço mental exigido para compreender e realizar uma tarefa. Na engenharia de software, alta carga cognitiva prejudica a manutenibilidade de sistemas. |
| **Coesão** | Medida de quão intimamente relacionadas e focadas estão as responsabilidades de um módulo de software. |
| **Dívida Técnica** | Custo oculto gerado por atalhos no desenvolvimento, como ignorar testes ou documentação, resultando em um código difícil de manter. |
| **Design Sprint** | Metodologia ágil de ideação e validação utilizada em fases (Unpack, Sketch, Decide, Prototype) para estruturar a tomada de decisões da equipe. |
| **Grande Bola de Lama** | Metáfora para descrever um sistema de software sem arquitetura clara, estruturado de forma desorganizada e difícil de compreender ou manter. |
| **MVP (Minimum Viable Product)** | Produto Mínimo Viável. A versão de um novo produto com recursos justos o suficiente para satisfazer os clientes iniciais e fornecer feedback para o desenvolvimento futuro. |
| **Regra de Negócio (RN)** | Restrição ou diretriz que define ou restringe algum aspecto do negócio e, consequentemente, do software (Ex: "A exclusão de um local é exclusiva do Administrador"). |
| **Requisito Funcional (RF)** | Declaração de um serviço ou função que o sistema deve fornecer, como ele deve reagir a entradas específicas e como se comportar em situações particulares. |
| **Requisito Não Funcional (RNF)** | Restrição aos serviços ou funções oferecidas pelo sistema. Incluem restrições de tempo, restrições sobre o processo de desenvolvimento, padrões arquiteturais ou linguagens (Ex: O uso de NestJS e PostgreSQL). |
| **Rastreabilidade** | A capacidade de descrever e seguir a vida de um requisito, tanto para a frente (para artefatos de código/design) quanto para trás (para as necessidades dos stakeholders). |

### 2.3 Tecnologia e Desenvolvimento Web

| Termo | Definição |
| :--- | :--- |
| **API RESTful** | Interface de Programação de Aplicações que segue os princípios REST (Representational State Transfer), permitindo que o front-end (React) se comunique com o back-end (NestJS). |
| **CI/CD** | Integração Contínua e Entrega Contínua. Práticas essenciais para automatizar testes e implementações, cuja ausência contribui para o aumento da dívida técnica. |
| **NestJS** | Framework para a construção de aplicativos Node.js do lado do servidor (back-end) eficientes, confiáveis e escaláveis, utilizando TypeScript de forma nativa. |
| **PostgreSQL** | Sistema de gerenciamento de banco de dados relacional objeto-relacional (ORDBMS) avançado e de código aberto, escolhido pela equipe para garantir a integridade dos históricos de edição e transações complexas de reservas. |
| **React** | Biblioteca JavaScript de código aberto com foco em criar interfaces de usuário (front-end) em páginas web. |
| **RBAC (Role-Based Access Control)** | Controle de Acesso Baseado em Funções. Mecanismo de segurança usado no projeto para restringir acessos a recursos com base nas funções dos usuários (Visitante, Comum, Organizador, Administrador). |
---

## 3. Referências Bibliográficas

IEEE. IEEE Std 610.12-1990: IEEE standard glossary of software engineering terminology. New York: Institute of Electrical and Electronics Engineers, 1990. Disponível em: https://ieeexplore.ieee.org/document/159342. Acesso em: 03 abr. 2026.

PROJECT MANAGEMENT INSTITUTE. *Um guia do conhecimento em gerenciamento de projetos (Guia PMBOK)*. 7. ed. Newtown Square, PA: PMI, 2021. Disponível em: https://www.pmi.org/pmbok-guide-standards/foundational/pmbok. Acesso em: 03 abr. 2026.

PRESSMAN, R. S.; MAXIM, B. R. *Engenharia de Software: Uma Abordagem Profissional*. 9. ed. Porto Alegre: McGraw-Hill/Bookman, 2021.

SOMMERVILLE, I. *Engenharia de Software*. 10. ed. São Paulo: Pearson, 2019.

WIEGERS, K.; BEATTY, J. *Software Requirements*. 3. ed. Redmond, WA: Microsoft Press, 2013.

---

## Histórico de Versões

| Versão | Data | Descrição | Autor | Revisor |
| :--- | :--- | :--- | :--- | :--- |
| 1.0 | 03/04/2026 | Criação da V1 do Glossário adaptado para o escopo do projeto Belezas Naturais do Brasil | [Mateus Magno](https://github.com/mtsmgn0) | |
