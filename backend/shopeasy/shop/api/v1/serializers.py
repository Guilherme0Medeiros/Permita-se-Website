from rest_framework import serializers
from shop.models import Produto, Carrinho, ItemCarrinho, Pedido , Categoria , ImagemProduto
from django.contrib.auth.models import User

class ImagemProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagemProduto
        fields = ['id', 'imagem', 'legenda', 'produto']
        extra_kwargs = {
            'produto': {'write_only': True}  
        }


class ProdutoSerializer(serializers.ModelSerializer):
    imagem_url_final = serializers.SerializerMethodField()
    imagens_extra = ImagemProdutoSerializer(many=True, read_only=True)

    class Meta:
        model = Produto
        fields = '__all__'  # Ou liste os campos manualmente se quiser mais controle

    def get_imagem_url_final(self, obj):
        request = self.context.get('request')
        if obj.imagem:
            url = obj.imagem.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        elif obj.imagem_url:
            return obj.imagem_url
        return None

    def validate(self, data):
        # Só exige imagem se estiver criando o produto (self.instance é None)
        if self.instance is None:
            imagem = data.get('imagem')
            imagem_url = data.get('imagem_url')

            if not imagem and not imagem_url:
                raise serializers.ValidationError(
                    "Você deve enviar uma imagem ou uma URL da imagem ao cadastrar o produto."
                )
        return data





class ItemCarrinhoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.CharField(source='produto.nome', read_only=True)

    class Meta:
        model = ItemCarrinho
        fields = '__all__'
        extra_kwargs = {
            'carrinho': {'required': False}
        }

class CarrinhoSerializer(serializers.ModelSerializer):
    itens = ItemCarrinhoSerializer(many=True, required=False)

    class Meta:
        model = Carrinho
        fields = '__all__'

    def create(self, validated_data):
        itens_data = validated_data.pop('itens', [])
        carrinho = Carrinho.objects.create(**validated_data)

        for item in itens_data:
            ItemCarrinho.objects.create(carrinho=carrinho, **item)

        carrinho.atualizar_preco_total()
        return carrinho

    def update(self, instance, validated_data):
        itens_data = validated_data.pop('itens', [])
        instance.itens.all().delete()

        for item in itens_data:
            ItemCarrinho.objects.create(carrinho=instance, **item)

        instance = super().update(instance, validated_data)
        instance.atualizar_preco_total()
        return instance



class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'
        read_only_fields = ['preco_total']  

    def create(self, validated_data):
        usuario = validated_data['usuario']

       
        carrinho, _ = Carrinho.objects.get_or_create(usuario=usuario)

        
        preco_total = sum(item.produto.preco * item.quantidade for item in carrinho.itens.all())
  
        for item in carrinho.itens.all():
            produto = item.produto
            if produto.estoque < item.quantidade:
                raise serializers.ValidationError(
                    f"Estoque insuficiente para o produto: {produto.nome}"
                )
            produto.estoque -= item.quantidade
            produto.save()



        
        pedido = Pedido.objects.create(
            usuario=usuario,
            preco_total=preco_total,
            status="pendente"
        )

        return pedido

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "As senhas não coincidem."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remover campo antes de criar
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user
    
#usuario
class UserSerializer(serializers.ModelSerializer):
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_staff',
            'is_superuser'
        ]
        read_only_fields = ['id', 'email', 'is_staff', 'is_superuser']  
#mudar senha do usuario
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "As senhas não coincidem."})
        return data        
    
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


