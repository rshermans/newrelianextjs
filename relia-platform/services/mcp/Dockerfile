FROM python:3.12-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código do servidor MCP
COPY . .

# Criar diretório de dados
RUN mkdir -p /app/data

EXPOSE 8001

CMD ["python", "-m", "corpus_server.server"]
