<div align="center">
    <img src="https://raw.githubusercontent.com/agentuity/cli/refs/heads/main/.github/Agentuity.png" alt="Agentuity" width="100"/> <br/>
    <strong>Build Agents, Not Infrastructure</strong> <br/>
    <br/>
        <a target="_blank" href="https://app.agentuity.com/deploy" alt="Agentuity">
            <img src="https://app.agentuity.com/img/deploy.svg" />
        </a>
    <br />
</div>

# 📚 ArXiv Paper Scout Agent

An Agentuity demo agent that helps hackathon students discover research papers and get project ideas inspired by cutting-edge research.

## 🎯 Use Case

This agent demonstrates how to build a research assistant for hackathon participants that:

- Searches ArXiv for relevant research papers based on topics
- Classifies papers by category (ML, AI, Computer Vision, etc.)
- Analyzes abstracts and identifies key insights
- Suggests 2-3 hackathon project ideas inspired by the research
- Provides concise summaries optimized for quick decision-making

Perfect for students who need to:
- Find relevant research quickly during a hackathon
- Understand what's cutting-edge in their domain
- Generate innovative project ideas based on recent papers
- Get started fast without getting lost in academic papers

## 📋 Prerequisites

- **Bun**: Version 1.2.4 or higher
- **Agentuity CLI**: Latest version

## 🚀 Getting Started

### Authentication

Before using Agentuity, you need to authenticate:

```bash
agentuity login
```

This command will open a browser window where you can log in to your Agentuity account.

### Import this agent into your account

```bash
agentuity project import
```

### Development Mode

Run your project in development mode with:

```bash
agentuity dev
```

This will start your project and open a new browser window connecting your agent to Agentuity in DevMode, allowing you to test and debug your agent in real-time.

## 🌐 Deployment

When you're ready to deploy your agent to the Agentuity Cloud:

```bash
agentuity deploy
```

This command will bundle your agent and deploy it to the cloud, making it accessible via the Agentuity platform.

## 📖 Documentation

### Resources

- [Agentuity JavaScript SDK](https://agentuity.dev/SDKs/javascript)
- [ArXiv API Documentation](https://info.arxiv.org/help/api/user-manual.html)
