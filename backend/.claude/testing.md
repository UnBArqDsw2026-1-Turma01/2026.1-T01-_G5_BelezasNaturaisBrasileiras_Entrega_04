#  Guidelines de Testes Unitários

##  Regra de Ouro: Teste é Obrigatório
- **Nenhuma funcionalidade é considerada "pronta" (Done) sem os respectivos testes unitários.**
- Ao criar um Use Case ou Entidade, você DEVE gerar o arquivo de teste correspondente (`.spec.ts`).

##  Onde focar os testes?
Na Clean Architecture, priorizamos os testes onde a lógica de negócio reside:
1. **Domain (Entities/Value Objects):** Testar regras intrínsecas e validações.
2. **Application (Use Cases):** Testar o fluxo de negócio, garantindo que o Use Case chama os repositórios corretamente.

##  Padrões de Implementação
- **Mocks/Spies:** Utilize o `jest` para mockar as interfaces dos repositórios. Nunca use o banco de dados real em testes unitários.
- **Padrão AAA (Arrange, Act, Assert):**
  - *Arrange:* Prepare os mocks e os dados de entrada.
  - *Act:* Execute o método a ser testado.
  - *Assert:* Verifique se o resultado é o esperado e se os mocks foram chamados com os parâmetros corretos.
- **Isolamento:** O teste do Use Case não deve depender do NestJS (não use `Test.createTestingModule` se puder instanciar a classe manualmente com mocks). Isso torna os testes 10x mais rápidos.

##  Localização
- Os arquivos de teste devem ficar ao lado do arquivo testado.
  - Ex: `src/application/use-cases/create-user.ts`
  - Teste: `src/application/use-cases/create-user.spec.ts`

##  O que NÃO fazer
- Testar controllers (isso são testes de integração/E2E e devem ser tratados separadamente).
- Fazer testes que dependem de ordem de execução.
- Ignorar caminhos de erro (sempre teste o "Happy Path" e os "Edge Cases/Errors").