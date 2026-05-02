#  Review Checklist (Senior/Tech Lead)

##  Arquitetura (Clean Arch)
- [ ] **Vazamento de Camada**: Há importações de `infrastructure` dentro de `domain` ou `application`?
- [ ] **Acoplamento**: O Use Case depende de uma classe concreta ou de uma interface/abstract class?
- [ ] **Responsabilidade**: O Controller está apenas delegando a tarefa para o Use Case e tratando o retorno (HTTP)?

##  Qualidade do Código
- [ ] **Tipagem**: Há algum uso de `any` ou tipos implícitos que poderiam ser evitados?
- [ ] **Nomenclatura**: Nomes de variáveis e funções são claros e em inglês (se for o padrão)?
- [ ] **Tamanho**: Funções ou classes estão grandes demais (quebrando o SRP)?

##  Persistência (Prisma)
- [ ] **Mapeamento**: Os dados retornados pelo repositório são Entidades de Domínio puras?
- [ ] **Performance**: As queries do Prisma parecem otimizadas? Há risco de N+1?
- [ ] **Erro de DB**: Erros de banco (ex: P2002 Unique Constraint) são capturados e convertidos em Domain Errors específicos?

##  Testes & Documentação
- [ ] **Testabilidade**: O código novo permite injeção de mocks facilmente?
- [ ] **Docs**: Se houve mudança em regra de negócio, a pasta `../docs/` foi atualizada?
- [ ] **Migrations**: Se o schema mudou, a migration está incluída e bem nomeada?

##  Instrução para o Claude
"Se este PR falhar em qualquer um desses pontos, aponte o erro técnico, explique qual princípio da Clean Arch foi violado e sugira a refatoração específica."