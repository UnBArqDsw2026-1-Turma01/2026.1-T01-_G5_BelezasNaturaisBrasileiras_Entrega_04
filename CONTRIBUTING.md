# Guia de Contribuição 

Este documento estabelece as diretrizes para contribuir com o projeto **Plataforma de Belezas Naturais e Trilhas**. Seguir estas normas ajuda a manter a organização do código e a agilidade nas entregas da disciplina.

---

## Fluxo de Trabalho (GitFlow)

Utilizamos uma variação simplificada do GitFlow. **Nunca faça commits diretamente na branch `main` ou `development`.**

1.  **Criação de Branch:** Crie uma branch a partir da `development` com um nome descritivo:
    * `feature/nome-da-funcionalidade` (Para novas implementações)
    * `fix/nome-do-bug` (Para correção de erros)
    * `docs/nome-do-documento` (Para documentação técnica)
2.  **Desenvolvimento:** Realize suas alterações respeitando os requisitos não funcionais (NestJS/React/TS).
3.  **Sincronização:** Antes de finalizar, faça um `git pull origin development` para evitar conflitos.
4.  **Push:** Envie sua branch para o GitHub: `git push origin minha-branch`.

---

## Padrão de Commits

Adotamos o padrão de [Conventional Commits](https://www.conventionalcommits.org/). Suas mensagens devem seguir a estrutura:
`<tipo>(escopo): descrição curta`

**Tipos permitidos:**
* `feat`: Uma nova funcionalidade.
* `fix`: Correção de um erro.
* `docs`: Alterações na documentação.
* `style`: Formatação, pontos e vírgulas (sem alteração de código).
* `refactor`: Refatoração de código que não altera comportamento.
* `test`: Adição ou correção de testes.

*Exemplo:* `feat(auth): adiciona login social via Google`

---

## Processo de Pull Request (PR)

Ao abrir um PR para a branch `development`:

1.  **Descrição:** Explique brevemente o que foi feito e qual Requisito Funcional (RF) está sendo atendido.
2.  **Revisão:** Pelo menos um outro integrante do grupo deve revisar e aprovar o código.
3.  **Conflitos:** O autor do PR é responsável por resolver quaisquer conflitos antes do merge.

---

## Ambiente de Desenvolvimento

* **Backend:** Node.js + NestJS + PostgreSQL.
* **Frontend:** React (Vite) + TypeScript.
* **Padronização:** Utilize ESLint e Prettier para manter a consistência do código.

---

## Regras de Ouro
* Siga a **RN01 (Histórico de Edição)**: Lembre-se de implementar o log de versionamento ao alterar dados de locais.
* Documente novas funções e componentes.
* Mantenha os diagramas (BPMN/Mapa Mental) atualizados conforme as mudanças no escopo.

---