# cleantrack_3.0
Plataforma de gestão para estética automotiva desenvolvida no Projeto Integrador III (UNIVESP).

# CleanTrack 3.0 - Protótipo Navegável

Este é um protótipo navegável de alta fidelidade desenvolvido para a aplicação **CleanTrack 3.0**, um sistema de gestão voltado para empresas de estética automotiva. O projeto foi construído seguindo uma abordagem **Mobile First**, com foco em fidelidade visual, usabilidade e facilidade de demonstração.

## 🚀 Objetivo do Protótipo

O foco deste material é apresentar a experiência do usuário (UX) e a interface (UI) planejadas para o MVP do sistema, simulando interações reais sem a necessidade de um backend ou banco de dados.

## 🛠️ Stack Utilizada

- **HTML5**: Estrutura semântica das páginas.
- **CSS3 (Vanilla)**: Design responsivo, variáveis CSS para temas e animações suaves.
- **JavaScript (Vanilla)**: Lógica de Single Page Application (SPA), roteamento simples, manipulação de dados mockados e interações no gráfico.
- **Google Fonts (Outfit)**: Tipografia moderna e premium.
- **Font Awesome**: Ícones vetoriais.

## 📂 Estrutura de Pastas

```text
/cleantrack-prototipo
  /assets
    /images    # Imagens e logotipos
    /icons     # Ícones personalizados (se aplicável)
  /css
    variables.css # Tokens de design (cores, fontes, sombras)
    style.css     # Estilos globais e componentes
  /js
    data.js    # Dados mockados (clientes, serviços, faturamento)
    app.js     # Lógica da SPA, roteamento e interações
  index.html   # Ponto de entrada único
  README.md    # Documentação
```

## ⚙️ Como Executar Localmente

Como o projeto é estático, você pode executá-lo de forma simples:

1.  Clone este repositório ou baixe os arquivos.
2.  Abra o arquivo `index.html` diretamente no seu navegador.
3.  **Para uma melhor experiência (opcional)**: Use uma extensão de "Live Server" (como a do VS Code) ou um servidor HTTP simples (ex: `python -m http.server`).

## 📱 Funcionalidades Demonstradas

- **Login**: Simulação de entrada com transição suave.
- **Dashboard**: Visão geral com cards de indicadores e clientes recentes.
- **Gestão de Clientes**: Lista completa de clientes com status e ação de agendamento.
- **Serviços do Dia**: Cronograma de serviços com horários e tipos de lavagem.
- **Faturamento**: Gráfico interativo que exibe projeções e comparativos mensais.
- **Navegação SPA**: Troca de telas instantânea via menu flutuante.

---

*Nota: Este é um protótipo visual. Nenhuma informação é persistida em banco de dados.*
