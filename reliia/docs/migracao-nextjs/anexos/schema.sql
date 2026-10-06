-- Esquema atual da base de dados do RELIA (SQLite/libSQL), gerado a partir de database.py numa base nova, depois de todas as migrações.
-- A fonte da verdade continua a ser database.py.

CREATE TABLE acoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nomes_acao TEXT NOT NULL,
                nivel_bloom TEXT NOT NULL,
                pontos INTEGER NOT NULL,
                tipo_resposta TEXT NOT NULL,
                template_pergunta TEXT NOT NULL,
                respostas_esperadas TEXT
            );

CREATE TABLE auditoria (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quando TEXT DEFAULT CURRENT_TIMESTAMP,
                admin_id INTEGER,
                admin_email TEXT,
                acao TEXT NOT NULL,
                entidade TEXT,
                entidade_id TEXT,
                detalhes TEXT
            );

CREATE TABLE chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                roteiro_id INTEGER NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (roteiro_id) REFERENCES roteiros(id)
            );

CREATE TABLE checkpoints (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                roteiro_id INTEGER NOT NULL,
                acao_id INTEGER NOT NULL,
                nivel_taxonomia TEXT,
                pergunta TEXT NOT NULL,
                resposta TEXT NOT NULL,
                nota_llm INTEGER,
                feedback_llm TEXT,
                data_hora TEXT DEFAULT (DATETIME('now', 'localtime')), formato TEXT, dados TEXT,
                FOREIGN KEY (roteiro_id) REFERENCES roteiros(id)
            );

CREATE TABLE clube_membros (
                clube TEXT NOT NULL,
                usuario_id INTEGER NOT NULL,
                entrou_em TEXT DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (clube, usuario_id)
            );

CREATE TABLE configuracoes (
                chave TEXT PRIMARY KEY,
                valor TEXT
            );

CREATE TABLE consentimentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                documento TEXT NOT NULL,
                versao TEXT NOT NULL,
                aceite_em TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (usuario_id, documento, versao)
            );

CREATE TABLE contactos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                usuario_id INTEGER,
                nome TEXT,
                email TEXT NOT NULL,
                categoria TEXT NOT NULL,
                assunto TEXT NOT NULL,
                mensagem TEXT NOT NULL,
                estado TEXT DEFAULT 'novo',
                nota_admin TEXT,
                tratado_em TEXT
            );

CREATE TABLE desafios_aceites (
                usuario_id INTEGER NOT NULL,
                desafio TEXT NOT NULL,
                aceite_em TEXT DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (usuario_id, desafio)
            );

CREATE TABLE erros_app (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quando TEXT DEFAULT CURRENT_TIMESTAMP,
                tela TEXT,
                tipo TEXT,
                mensagem TEXT,
                usuario_id INTEGER
            );

CREATE TABLE estrategias (
                id INTEGER PRIMARY KEY,
                nivel_bloom TEXT NOT NULL,
                verbo TEXT NOT NULL,
                formato TEXT NOT NULL,
                foco TEXT NOT NULL,
                dificuldade INTEGER DEFAULT 1,
                pontos INTEGER NOT NULL,
                exige_texto_integral INTEGER DEFAULT 0,
                modelo TEXT,
                criterios TEXT,
                ativa INTEGER DEFAULT 1
            );

CREATE TABLE feedback_automatizado (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                roteiro_id INTEGER NOT NULL,
                resumo_checkpoints TEXT,
                feedback_motivacional TEXT,
                recomendacoes TEXT,
                insights TEXT,
                data_geracao TEXT DEFAULT (DATETIME('now', 'localtime')),
                FOREIGN KEY (roteiro_id) REFERENCES roteiros(id)
            );

CREATE TABLE fichas_obra (
                obra_id INTEGER PRIMARY KEY,
                dados TEXT NOT NULL,
                estado TEXT DEFAULT 'rascunho',
                link_texto TEXT,
                dominio_publico INTEGER DEFAULT 0,
                gerado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                validado_em TEXT,
                validado_por INTEGER
            );

CREATE TABLE fichas_professor (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                professor_id INTEGER NOT NULL,
                obra_id INTEGER NOT NULL,
                dados TEXT NOT NULL,
                estado TEXT DEFAULT 'rascunho',
                link_texto TEXT,
                dominio_publico INTEGER DEFAULT 0,
                atualizada_em TEXT DEFAULT CURRENT_TIMESTAMP,
                validada_em TEXT,
                UNIQUE (professor_id, obra_id)
            );

CREATE TABLE forum_respostas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topico_id INTEGER NOT NULL,
                usuario_id INTEGER NOT NULL,
                texto TEXT NOT NULL,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (topico_id) REFERENCES forum_topicos(id),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            );

CREATE TABLE forum_topicos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                obra_id INTEGER NOT NULL,
                usuario_id INTEGER NOT NULL,
                titulo TEXT NOT NULL,
                texto TEXT NOT NULL,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (obra_id) REFERENCES obras(id),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            );

CREATE TABLE imagens_obra (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                obra_id INTEGER NOT NULL,
                tipo TEXT NOT NULL,
                titulo TEXT,
                url_imagem TEXT NOT NULL,
                url_miniatura TEXT,
                url_pagina TEXT NOT NULL,
                autor TEXT,
                licenca TEXT NOT NULL,
                atribuicao TEXT NOT NULL,
                escolhida_por INTEGER,
                criada_em TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (obra_id, url_imagem)
            );

CREATE TABLE infograficos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                roteiro_id INTEGER NOT NULL,
                chave TEXT NOT NULL,
                topico TEXT,
                dados TEXT NOT NULL,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (roteiro_id, chave)
            );

CREATE TABLE inquerito_participacoes (
                usuario_id INTEGER NOT NULL,
                inquerito TEXT NOT NULL,
                versao TEXT NOT NULL,
                estado TEXT NOT NULL,
                data TEXT NOT NULL,
                PRIMARY KEY (usuario_id, inquerito, versao)
            );

CREATE TABLE inquerito_respostas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                inquerito TEXT NOT NULL,
                versao TEXT NOT NULL,
                data TEXT NOT NULL,
                respostas TEXT NOT NULL,
                sus REAL,
                nps INTEGER,
                contexto TEXT
            );

CREATE TABLE logs_uso (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER, 
                acao TEXT NOT NULL,
                data_hora TEXT DEFAULT (DATETIME('now', 'localtime')),
                detalhes TEXT,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            );

CREATE TABLE obras (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                autor TEXT NOT NULL,
                ano_publicacao INTEGER,
                genero TEXT
            , capa TEXT, no_catalogo INTEGER DEFAULT 0);

CREATE TABLE pedidos_obra (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                titulo TEXT NOT NULL,
                autor TEXT NOT NULL,
                estado TEXT DEFAULT 'pendente',
                obra_id INTEGER,
                nota TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                resolvido_em TEXT
            );

CREATE TABLE pedidos_professor (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                instituicao TEXT,
                motivo TEXT,
                estado TEXT DEFAULT 'pendente',
                nota_admin TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                resolvido_em TEXT
            );

CREATE TABLE perguntas_professor (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                professor_id INTEGER NOT NULL,
                obra_id INTEGER NOT NULL,
                estrategia_id INTEGER NOT NULL,
                formato TEXT,
                dados TEXT NOT NULL,
                criada_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

CREATE TABLE reescritas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                checkpoint_id INTEGER NOT NULL,
                roteiro_id INTEGER NOT NULL,
                resposta TEXT NOT NULL,
                fracao REAL,
                feedback TEXT,
                criada_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

CREATE TABLE relatorios_ia (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                roteiro_id INTEGER NOT NULL,
                n_respostas INTEGER NOT NULL,
                conteudo TEXT NOT NULL,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (roteiro_id, n_respostas)
            );

CREATE TABLE reportes_pergunta (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                checkpoint_id INTEGER,
                usuario_id INTEGER,
                roteiro_id INTEGER,
                estrategia_id INTEGER,
                formato TEXT,
                motivo TEXT NOT NULL,
                comentario TEXT,
                pergunta TEXT,
                estado TEXT DEFAULT 'novo',
                nota_admin TEXT,
                UNIQUE (checkpoint_id, usuario_id)
            );

CREATE TABLE resumos_semanais (
                semana TEXT PRIMARY KEY,
                texto TEXT NOT NULL,
                estatisticas TEXT,
                gerado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

CREATE TABLE roteiro_mapa (
                roteiro_id INTEGER PRIMARY KEY,
                dados TEXT NOT NULL,
                atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

CREATE TABLE roteiros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            obra_id INTEGER NOT NULL,
            usuario_id INTEGER,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'ativo', resumo TEXT,
            FOREIGN KEY (obra_id) REFERENCES obras(id)
        );

CREATE TABLE turma_membros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                turma_id INTEGER NOT NULL,
                usuario_id INTEGER NOT NULL,
                numero INTEGER NOT NULL,
                entrou_em TEXT DEFAULT CURRENT_TIMESTAMP,
                partilha INTEGER DEFAULT 0,
                UNIQUE (turma_id, usuario_id),
                UNIQUE (turma_id, numero)
            );

CREATE TABLE turma_obras (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                turma_id INTEGER NOT NULL,
                obra_id INTEGER NOT NULL,
                prazo TEXT,
                orientacao TEXT,
                criada_em TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (turma_id, obra_id)
            );

CREATE TABLE turmas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                professor_id INTEGER NOT NULL,
                nome TEXT NOT NULL,
                ano_letivo TEXT,
                codigo TEXT UNIQUE NOT NULL,
                ativa INTEGER DEFAULT 1,
                criada_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

CREATE TABLE uso_llm (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                quando TEXT DEFAULT CURRENT_TIMESTAMP,
                funcao TEXT,
                modelo TEXT,
                tokens_in INTEGER,
                tokens_out INTEGER,
                duracao_ms INTEGER,
                ok INTEGER,
                erro TEXT
            );

CREATE TABLE usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uid TEXT,
                nome TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                idade INTEGER,
                cidade TEXT,
                interesses TEXT, 
                nivel_educacional TEXT,
                habito_leitura TEXT,
                opcao_compartilhar INTEGER,
                criado_em TEXT DEFAULT (DATETIME('now', 'localtime')),
                ultima_atualizacao TEXT DEFAULT (DATETIME('now', 'localtime'))
            , is_admin INTEGER DEFAULT 0, variante_pt TEXT, is_professor INTEGER DEFAULT 0);

