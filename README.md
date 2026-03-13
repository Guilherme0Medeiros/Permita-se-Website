# Permita-se E-commerce

O **Permita-se** é uma plataforma de e-commerce de moda desenvolvida para oferecer uma experiência moderna, intuitiva e responsiva.

O sistema é dividido em:

- **Frontend:** React + TypeScript + TailwindCSS
- **Backend:** Django REST Framework

A aplicação permite o gerenciamento completo de **produtos, categorias, imagens, carrinho de compras e pedidos**.

---

# 🚀 Funcionalidades

- ✅ Listagem de produtos integrada à API
- ✅ Visualização detalhada dos produtos com galeria de imagens
- ✅ Autenticação de usuários (login e cadastro)
- ✅ Carrinho de compras com sidebar (off-canvas)
- ✅ Adição e remoção de produtos no carrinho
- ✅ Finalização de pedidos
- ✅ Administração de produtos
- ✅ Upload de imagens extras
- ✅ Interface responsiva (desktop e mobile)

---

# 🛠️ Tecnologias utilizadas

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)  
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)  
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)

## Frontend

- React
- TypeScript
- TailwindCSS
- React Router
- Axios
- Vite

## Backend

- Django
- Django REST Framework
- JWT Authentication
- Postgres

---

# 🧱 Arquitetura do Sistema

A aplicação segue uma **arquitetura cliente-servidor baseada em API REST**.

Frontend (React)
│
│ HTTP Requests (Axios)
▼
Backend API (Django REST Framework)
│
│ ORM
▼
Banco de Dados (Postgres)


# Principais Endpoints da API

### Produtos

| Método | Endpoint             | Descrição                          |
|--------|----------------------|-----------------------------------|
| GET    | /api/v1/produtos/    | Lista produtos                    |
| POST   | /api/v1/produtos/    | Cria um novo produto              |
| PATCH  | /api/v1/produtos/:id | Atualiza produto                  |
| DELETE | /api/v1/produtos/:id | Soft delete no produto            |

### Carrinho

| Método | Endpoint                    | Descrição                                |
|--------|-----------------------------|-------------------------------------------|
| GET    | /api/v1/carrinhos/          | Detalhes do carrinho                     |
| POST   | /api/v1/carrinhos/adicionar-item/ | Adiciona item ao carrinho         |
| POST   | /api/v1/carrinhos/remover-item/  | Remove item do carrinho            |

### Pedidos

| Método | Endpoint             | Descrição                           |
|--------|----------------------|--------------------------------------|
| GET    | /api/v1/pedidos/     | Lista de pedidos                     |
| POST   | /api/v1/pedidos/     | Cria um novo pedido                  |
| POST   | /api/v1/pedidos/:id/pagar/ | Marca o pedido como pago         |
| DELETE | /api/v1/pedidos/:id/ | Soft delete no pedido                |

## 📚 Documentação

- Swagger: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- ReDoc: [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)

## ⚙️ Como rodar o projeto (Backend)
```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/seu-repo.git

# Acessar a pasta
cd backend\shopeasy

# Criar e ativar ambiente virtual

# No Windows
python -m venv venv
venv\Scripts\activate

# No Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configuração do Banco de Dados (PostgreSQL)

Crie um arquivo chamado .env na pasta
#Conteúdo do arquivo:

DB_NAME=seu_bancodb
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432 #porta e host padrao

# Rodar migrações
python manage.py migrate

# Iniciar servidor
python manage.py runserver

```
# 🌐 Frontend (React + Vite)
```bash
#Acesse a pasta do frontend
cd frontend
#Instalar dependências
npm install
#Rodar o projeto em ambiente de desenvolvimento
npm run dev
```

## 🧪 Testes

Você pode usar ferramentas como Postman, Insomnia ou a própria interface Swagger para testar os endpoints.

# Imagens

<img width="1304" height="644" alt="Image" src="https://github.com/user-attachments/assets/2c5454e0-eb32-483b-bd5f-503d4e2d74f7" />

<img width="1321" height="646" alt="Image" src="https://github.com/user-attachments/assets/9a2a7faf-c7c7-49b0-86cd-a22c55424c38" />

<img width="1321" height="646" alt="Image" src="https://github.com/user-attachments/assets/3a244540-c80f-4cd8-86e0-1abb37a1d348" />

<img width="1321" height="646" alt="Image" src="https://github.com/user-attachments/assets/a18eed30-3205-4bd9-8162-874320436579" />

<img width="1309" height="623" alt="Image" src="https://github.com/user-attachments/assets/59e3a070-aae9-4aed-9fcb-7c5eca6475b0" />

<img width="1306" height="925" alt="Image" src="https://github.com/user-attachments/assets/c44cf375-2afd-4ae1-8b88-855418074b90" />

<img width="1321" height="2994" alt="Image" src="https://github.com/user-attachments/assets/662caf01-eb0b-4112-bf72-1445429a7148" />

