# Bands App

Sistema simples de gerenciamento de bandas organizadas por gênero musical.

## Tema

Aplicação para cadastrar e organizar bandas por gênero musical. Cada gênero pode ter várias bandas (relacionamento 1:N).

## Estrutura

```
├── backend/          # API FastAPI
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       └── routes/
└── frontend/         # React + Vite
    └── src/
```

## Como rodar o Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Rodar servidor
uvicorn app.main:app --reload
```

API disponível em: http://localhost:8000

Documentação: http://localhost:8000/docs

## Como rodar o Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

Frontend disponível em: http://localhost:3000

## Screenshots

### Tela principal

![Tela principal](screenshots/main.png)

### Criando categoria

![Criando categoria](screenshots/genres.png)

### Criando nota

![Criando nota](screenshots/all.png)

## Endpoints da API

### Genres (Gêneros)

- `GET /api/categories/` - Listar gêneros
- `POST /api/categories/` - Criar gênero
- `PUT /api/categories/{id}` - Atualizar gênero
- `DELETE /api/categories/{id}` - Deletar gênero

### Bands (Bandas)

- `GET /api/notes/` - Listar bandas
- `POST /api/notes/` - Criar banda
- `PUT /api/notes/{id}` - Atualizar banda
- `DELETE /api/notes/{id}` - Deletar banda

## Tecnologias

**Backend:** Python, FastAPI, SQLAlchemy, SQLite

**Frontend:** React, Vite
