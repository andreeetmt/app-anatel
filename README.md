# Projeto de Aplicativo de Exposição a Campo Eletromagnético

Aplicativo desenvolvido em **React Native** para cálculo da exposição humana a campos eletromagnéticos. O sistema utiliza mapas interativos para exibir torres de telecomunicações, calcular suas áreas de cobertura e estimar a exposição em um ponto selecionado pelo usuário.

---

# Funcionalidades

- 📍 Exibição de torres de telecomunicações em mapa interativo.
- 🎯 Seleção de um ponto no mapa para análise.
- 📡 Identificação das torres próximas ao ponto selecionado.
- ⭕ Visualização das áreas de alcance das torres.
- 📊 Exibição de uma tabela com informações das torres encontradas.
- ⚡ Cálculo da exposição a campos eletromagnéticos no local escolhido.

---

# Tecnologias Utilizadas

- React Native
- Expo SDK 53
- TypeScript
- React Native Maps
- React Navigation

---

# Pré-requisitos

Antes de iniciar, você precisará apenas de:

- Uma conta no GitHub.
- Uma conta na Expo.
- O aplicativo **Expo Go (SDK 53)** instalado em seu celular.

> **Importante:** Este projeto foi desenvolvido para ser executado no **GitHub Codespaces**. Não é necessário instalar Node.js, npm ou qualquer dependência localmente no até a atual versão.

---

# Executando o projeto

1. Faça um **Fork** deste repositório.

2. Abra o seu fork utilizando o **GitHub Codespaces**.

3. No terminal do Codespaces, acesse a pasta do projeto:

```bash
cd app
```

4. Instale as dependências:

```bash
npm install
```

5. Inicie o servidor utilizando o modo **Tunnel**:

```bash
npx expo start --tunnel
```

> **O parâmetro `--tunnel` é obrigatório**, pois permite que o Expo Go no celular encontre o servidor executado dentro do Codespaces.

6. Abra o **Expo Go** no celular.

7. Faça login com a mesma conta Expo utilizada no projeto (caso necessário).

8. Escaneie o QR Code exibido no terminal ou na interface do Expo.

---

# Como utilizar

1. Abra o aplicativo no Expo Go.
2. Navegue pelo mapa.
3. Toque em qualquer ponto para realizar uma análise.
4. O aplicativo exibirá:
   - As torres próximas;
   - Os círculos de alcance;
   - A tabela com as informações das torres;
   - O cálculo da exposição aos campos eletromagnéticos.

---

# Licença

Este projeto foi desenvolvido para a Agência Nacional de Telecomunicações e conta com o trabalho de diversos estagiários.
