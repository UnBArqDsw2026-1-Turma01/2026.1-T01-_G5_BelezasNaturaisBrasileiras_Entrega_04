# Plataforma de Belezas Naturais e Trilhas

<p align="center">
  <img src="/docs/assets/fase_1/images/Image_3zdyl93zdyl93zdy.png" alt="Logo da Plataforma de Belezas Naturais e Trilhas" width="400"/>
</p>

---

<p align="center">
  <a href="https://unbarqdsw2026-1-turma01.github.io/2026.1-T01-_G5_BelezasNaturaisBrasileiras_Entrega_01/#/" target="_blank"><b>Acessar a Documentação Completa (GitHub Pages)</b></a>
</p>

**Disciplina:** Arquitetura e Desenho de Software  
**Curso:** Engenharia de Software  
**Universidade:** Faculdade de Ciências e Tecnologias em Engenharia (FCTE) - Universidade de Brasília (UnB)  
**Professora:** Milene Serrano  
**Grupo:** 05

---

## Sobre o Projeto

O sistema é uma plataforma dedicada a centralizar a descoberta e organização de ecoturismo no Brasil, com foco inicial em **Belezas Naturais e Trilhas**. Ele resolve a fragmentação de informações sobre locais turísticos naturais e a dificuldade de conectar aventureiros a organizadores de trilhas confiáveis.

## Principais Diferenciais:
* **Mapeamento Colaborativo:** Visitantes e usuários cadastrados podem descobrir e contribuir com novos pontos turísticos, garantindo um feed dinâmico e atualizado.
* **Conexão Direta com Organizadores:** A plataforma facilita a inscrição em trilhas através de chats individuais, promovendo segurança e clareza na comunicação.
* **Transparência e Segurança:** Inclui sistema de avaliações, perfis de organizadores verificados e alertas de segurança claros sobre pagamentos.
* **Gamificação:** Uso de *badges* de participação para incentivar o engajamento e validar experiências concluídas.

---

Este repositório foi criado a partir do modelo padrão para a disciplina de Arquitetura e Desenho de Software e utiliza a tecnologia [Docsify](https://docsify.js.org/) para a geração do site de documentação.

---

### Instalando o Docsify Localmente

Se desejar visualizar a documentação localmente, execute o comando:

```shell
npm i docsify-cli -g
```

### Executando localmente

Para iniciar o site localmente, utilize o comando:

```shell
docsify serve ./docs
```

---
 
## Como Rodar o Projeto
 
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
 

## Integrantes

<center>
    <table style="margin-left: auto; margin-right: auto;">
        <tr>
            <td align="center">
                <a href="https://github.com/ana-pfeilsticker">
                    <img style="border-radius: 50%;" src="https://github.com/ana-pfeilsticker.png?size=150" width="150px;"/>
                    <h5 class="text-center">Ana Luiza Pfeilsticker</h5>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/antonioscarvalho">
                    <img style="border-radius: 50%;" src="https://github.com/antonioscarvalho.png?size=150" width="150px;"/>
                    <h5 class="text-center">Antonio Carvalho</h5>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/brenoalexandre0">
                    <img style="border-radius: 50%;" src="https://github.com/brenoalexandre0.png?size=150" width="150px;"/>
                    <h5 class="text-center">Breno Garcia</h5>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Heloisa-Santos">
                    <img style="border-radius: 50%;" src="https://github.com/Heloisa-Santos.png?size=150" width="150px;"/>
                    <h5 class="text-center">Heloísa Santos</h5>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/MarioViniciusBC">
                    <img style="border-radius: 50%;" src="https://github.com/MarioViniciusBC.png?size=150" width="150px;"/>
                    <h5 class="text-center">Mário Vinicius</h5>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/mtsmgn0">
                    <img style="border-radius: 50%;" src="https://github.com/mtsmgn0.png?size=150" width="150px;"/>
                    <h5 class="text-center">Mateus Magno</h5>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/zlimaz">
                    <img style="border-radius: 50%;" src="https://github.com/zlimaz.png?size=150" width="150px;"/>
                    <h5 class="text-center">Miguel Arthur</h5>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/PauloFilho2">
                    <img style="border-radius: 50%;" src="https://github.com/PauloFilho2.png?size=150" width="150px;"/>
                    <h5 class="text-center">Paulo Filho</h5>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/vitor-hoffmann">
                    <img style="border-radius: 50%;" src="https://github.com/vitor-hoffmann.png?size=150" width="150px;"/>
                    <h5 class="text-center">Vitor Hoffmann</h5>
                </a>
            </td>
        </tr>
    </table>
</center>

---

## Planilha de Versionamento

| Versão | Data       | Descrição                                   | Autor                                               | Revisor                                                 |
| :----- | :--------- | :------------------------------------------ | :-------------------------------------------------- | :------------------------------------------------------ |
| 1.0 | 31/03/2026 | Criação do README | [Antonio Carvalho](https://github.com/antonioscarvalho) |  |
| 1.1 | 03/04/2026 | Refatoração do README com novo guia de execução |  [Antonio Carvalho](https://github.com/antonioscarvalho)  | |
 
---
 
<div align="center">
 
Desenvolvido pelo **Grupo 05** — FGA0208 / UnB 2026.1
 
</div>
