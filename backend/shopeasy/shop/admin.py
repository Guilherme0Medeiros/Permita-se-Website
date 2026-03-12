from django.contrib import admin
from .models import Produto, Categoria, ImagemProduto, ItemCarrinho, Pedido

admin.site.register(Produto)
admin.site.register(Categoria)
admin.site.register(ImagemProduto)
admin.site.register(ItemCarrinho)
admin.site.register(Pedido)