# 👕 Permita-se E-commerce

O **Permita-se** é uma plataforma de e-commerce de moda desenvolvida para oferecer uma experiência moderna, intuitiva e responsiva.  
O sistema é dividido em **frontend** ( React + Tailwind ) e **backend** (Django REST Framework), permitindo o gerenciamento completo de produtos, categorias, imagens, carrinho de compras e pedidos.

---

## 🚀 Funcionalidades

- ✅ Listagem de produtos integrados à API
- ✅ Visualização detalhada dos produtos (com galeria lateral)
- ✅ Autenticação de usuários (login e cadastro)
- ✅ Adição, remoção e atualização de itens no carrinho (off-canvas sidebar)
- ✅ Finalização de pedidos
- ✅ Página de pedidos realizados
- ✅ Administração de produtos (categorias, imagens extras e campos booleanos)
- ✅ Interface responsiva (web e mobile)
- ✅ Integração com autenticação JWT

---

## 🛠️ Tecnologias utilizadas

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)  
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)   
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)  

- React
- TypeScript
- Tailwind CSS 
- Django REST Framework

---

## 📁 Estrutura do Projeto

```bash
Permita-se/
├── backend/
│   ├── manage.py
│   └── shopeasy/
│       ├── __init__.py
│       ├── settings.py
│       ├── urls.py
│       └── shop/
│           ├── __init__.py
│           ├── models.py       # Produto, Categoria, Imagens extras
│           ├── views.py        # Endpoints DRF
│           ├── serializers.py  # Serializers com suporte a imagens/URLs
│           ├── admin.py
│           ├── apps.py
│           ├── tests.py
│           └── migrations/
├── frontend/
│   ├── src/
│   │   ├── app/             # Rotas (App Router)
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── context/         # Contexto do carrinho/autenticação
│   │   ├── hooks/           # Hooks customizados
│   │   ├── services/        # Comunicação com a API
│   │   ├── styles/          # Estilos globais (Tailwind)
│   │   ├── utils/           # Funções utilitárias
│   │   └── ...
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── README.md
```

---

## ⚙️ Como rodar o projeto

```bash
# Crie e ative o ambiente virtual (venv)
# No Windows
python -m venv venv
venv\Scripts\activate

# No Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Configure e rode o backend
cd backend

# Instale as dependências do backend
pip install -r requirements.txt

# Rode as migrações
python manage.py migrate

# Inicie o servidor backend
python manage.py runserver

# Configure e rode o frontend
cd ../frontend

# Instale as dependências
npm install

# Configure o arquivo .env.local com a URL da API (exemplo incluso em .env.example)

# Rode o projeto em ambiente de desenvolvimento
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 🔗 Integração com a API

Certifique-se de que a API esteja rodando e atualize a variável de ambiente no `.env.local` com a URL correta.

Exemplo de `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1/
```

## 🧪 Testes

- **Backend:** utilize Swagger, Postman ou Insomnia para testar os endpoints.
- **Frontend:** teste os fluxos de compra, autenticação e carrinho.
## IMAGENS 
<img width="1325" height="652" alt="Exemplo1" src="https://github.com/user-attachments/assets/45518942-d035-425e-ab32-84185d360ce9" />
<img width="1325" height="652" alt="exemplo2" src="https://github.com/user-attachments/assets/4beede61-5946-47ff-8277-ce2d3c98226a" />
<img width="1325" height="652" alt="Opera Instantâneo_2025-09-08_215454_localhost" src="https://github.com/user-attachments/assets/1e727927-4e0b-4c5e-993f-da3944b86610" />
<img width="1325" height="652" alt="Opera Instantâneo_2025-09-08_215411_localhost" src="https://github.com/user-attachments/assets/3e061517-4ca5-43a6-adca-4a5e63e9c560" />

 
