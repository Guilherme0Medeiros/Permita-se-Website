from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from .serializers import UserSerializer , ChangePasswordSerializer
from django.contrib.auth.models import User
from .serializers import CategoriaSerializer

from shop.models import Produto, Carrinho, ItemCarrinho, Pedido , Categoria , ImagemProduto
from .serializers import (
    ProdutoSerializer,
    CarrinhoSerializer,
    ItemCarrinhoSerializer,
    PedidoSerializer,
    RegisterSerializer,
    ImagemProdutoSerializer,
)

from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend


class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.filter(excluido=False)
    serializer_class = ProdutoSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend]  # permite filtros
    filterset_fields = ['categoria__nome']   # ativa o filtro por categoria

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def destroy(self, request, *args, **kwargs):
        produto = self.get_object()
        produto.excluido = True
        produto.save()
        return Response({"detail": "Produto excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)

class ImagemProdutoViewSet(viewsets.ModelViewSet):
    queryset = ImagemProduto.objects.all()
    serializer_class = ImagemProdutoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class ItemCarrinhoViewSet(viewsets.ModelViewSet):
    queryset = ItemCarrinho.objects.filter(excluido=False)
    serializer_class = ItemCarrinhoSerializer


class CarrinhoViewSet(viewsets.ModelViewSet):
    serializer_class = CarrinhoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retorna só o carrinho do usuário autenticado
        return Carrinho.objects.filter(usuario=self.request.user)

    @action(detail=False, methods=['get'], url_path='meu-carrinho')
    def meu_carrinho(self, request):
        carrinho, created = Carrinho.objects.get_or_create(usuario=request.user)
        serializer = self.get_serializer(carrinho)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='adicionar-item')
    def adicionar_item(self, request):
        usuario = request.user
        carrinho, created = Carrinho.objects.get_or_create(usuario=usuario)

        dados = request.data
        produto_id = dados.get("produto")
        quantidade = dados.get("quantidade", 1)

        if not produto_id:
            return Response({"error": "Produto é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        item, created = ItemCarrinho.objects.get_or_create(
            carrinho=carrinho,
            produto_id=produto_id,
            defaults={"quantidade": quantidade}
        )

        if not created:
            item.quantidade += int(quantidade)
            item.save()

        carrinho.atualizar_preco_total()

        return Response({"message": "Item adicionado ao carrinho."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path='remover-item')
    def remover_item(self, request):
        usuario = request.user
        carrinho = Carrinho.objects.filter(usuario=usuario).first()
        if not carrinho:
            return Response({"error": "Nenhum carrinho encontrado para o usuário."}, status=status.HTTP_404_NOT_FOUND)

        produto_id = request.data.get("produto")
        quantidade = int(request.data.get("quantidade", 1))

        if not produto_id:
            return Response({"error": "ID do produto é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        item = carrinho.itens.filter(produto_id=produto_id).first()
        if not item:
            return Response({"error": "Item não encontrado no carrinho."}, status=status.HTTP_404_NOT_FOUND)

        if item.quantidade > quantidade:
            item.quantidade -= quantidade
            item.save()
        else:
            item.delete()

        carrinho.atualizar_preco_total()

        return Response({"message": "Item removido do carrinho."}, status=status.HTTP_200_OK)


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()  # ADICIONADO: queryset base para o DRF
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Apenas os pedidos do usuário logado e que não foram excluídos
        return Pedido.objects.filter(usuario=self.request.user, excluido=False)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=['post'])
    def pagar(self, request, pk=None):
        pedido = self.get_object()

        if pedido.status == "pago":
            return Response({'mensagem': 'Este pedido já foi pago.'}, status=status.HTTP_400_BAD_REQUEST)

        pedido.status = "pago"
        pedido.save()

        Carrinho.objects.filter(usuario=pedido.usuario).delete()

        return Response({'mensagem': 'Pagamento confirmado! Pedido marcado como pago.'}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        pedido = self.get_object()
        pedido.excluido = True
        pedido.save()
        return Response({"detail": "Pedido excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)



class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Usuário criado com sucesso!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id)
    
#para ver as informacoes do propio perfil
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)   
    
#mudar senha do usuario
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        user = request.user

        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['current_password']):
                return Response({"current_password": "Senha atual incorreta."}, status=400)

            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Senha atualizada com sucesso!"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=400)     

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.filter(excluido=False)
    serializer_class = CategoriaSerializer