## Planos de Risco, Custo e Tempo

Este artefato detalha a estratégia de gestão do **Grupo 05** para garantir a entrega da **Plataforma de Belezas Naturais e Trilhas**, considerando as restrições acadêmicas e os objetivos técnicos da disciplina **FGA0208**.

### 1. Plano de Gerenciamento de Riscos

Utilizamos uma matriz de probabilidade e impacto para antecipar eventos que possam comprometer o projeto, definindo ações preventivas e de contingência.

| Risco | Probabilidade | Impacto | Ação Preventiva | Plano de Contingência |
| :--- | :---: | :---: | :--- | :--- |
| **Curva de aprendizado (NestJS)** | Alta | Médio | Realização de *Dojos* técnicos e pareamento. | Simplificar funcionalidades ou usar bibliotecas auxiliares. |
| **Incompatibilidade de horários** | Média | Alto | Definição de janelas fixas para reuniões síncronas. | Comunicação assíncrona robusta via Discord/WhatsApp. |
| **Saída de membro do grupo** | Baixa | Muito Alto | Documentação clara de todos os processos e código. | Redistribuição de tarefas e readequação do escopo (MVP). |
| **Atraso na integração Front/Back** | Média | Alto | Definição precoce de contratos de API (Swagger/OpenAPI). | Mockar dados no Frontend para não travar o desenvolvimento. |

### 2. Plano de Custos

Como o projeto é de natureza acadêmica, o foco do plano de custos reside no **Custo de Oportunidade** e no uso de infraestrutura gratuita (*Free Tier*).

* **Recursos Humanos:** 09 integrantes dedicando aprox. **10h/semana** cada. Ao longo de 15 semanas, totaliza-se **1.350 horas-homem**. Estimando um valor de mercado de **R$ 50,00/h**, o custo intelectual do projeto é de **R$ 67.500,00**.
* **Infraestrutura Cloud (Custo Zero):**
    * **Hospedagem (Frontend):** Vercel/Netlify.
    * **Hospedagem (Backend):** Render/Fly.io.
    * **Banco de Dados:** Supabase/Render PostgreSQL.
* **Ferramentas de Design e Gestão:** Figma, GitHub, Discord e Trello (Versões gratuitas).
* **Total de Desembolso Financeiro Direto:** **R$ 0,00**.

### 3. Plano de Tempo (Cronograma de Entregas)

O cronograma segue o calendário oficial da disciplina, dividido em quatro grandes marcos (*Sprints*).

| Marco | Prazo | Foco Principal | Status |
| :--- | :---: | :--- | :---: |
| **Entrega 1** | 03/04/2026 | Base, Design Sprint, Requisitos e Processos (BPMN). | ✅ Concluído |
| **Entrega 2** | Maio/2026 | Arquitetura, Padrões de Projeto (GoF/GRASP) e Protótipo. | 🕒 Planejado |
| **Entrega 3** | Junho/2026 | Implementação do MVP (Front + Back) e Testes Unitários. | 🕒 Planejado |
| **Entrega 4** | Julho/2026 | Refinamento, Documentação Final e Apresentação. | 🕒 Planejado |

**Estratégia de Monitoramento:** O grupo realiza reuniões semanais de acompanhamento e utiliza o quadro **Kanban no GitHub Projects** para monitorar o progresso das tarefas em tempo real, garantindo que o *burndown* do projeto esteja alinhado com as datas fatais das entregas.

---

## Planilha de Versionamento

| Versão | Data       | Descrição                                   | Autor                                               | Revisor                                                 |
| :----- | :--------- | :------------------------------------------ | :-------------------------------------------------- | :------------------------------------------------------ |
| 1.0 | 03/04/2026 | Criação da página de Planos de Risco, Custo e Tempo. | [Antonio Carvalho](https://github.com/antonioscarvalho) |  |