import gerarCardapio from "./gerarCardapio.js";

class CaixaDaLanchonete {
    calcularValorDaCompra(metodoDePagamento, itens) {
        const CardapioDBLanches = gerarCardapio();

        // Gerar os metodos de pagamentos que são aceitos e suas alterações no valor
        const pagarVia = {
            dinheiro: (valor)=>{
                var difNoValor = (valor / 100) * 5;
                return valor - difNoValor;
            },
            debito:(valor)=>{
                return valor;
            },
            credito:(valor)=>{
                var difNoValor = (valor / 100) * 3;
                return valor + difNoValor;
            }
        } 

        class Pedido {
            adicionarPedido(codigo, quantidade){
                this[codigo] = CardapioDBLanches[codigo];
                this[codigo].quantidade = quantidade;
            }
        };

        var PedidoCliente = new Pedido;

        var valorAPagar = 0;
        var itensPrincipais = [];

        // Esse FOR serve para registrar os lanches e verificar se eles batem com as regras estabelecidas
        for (let item of itens){
            let codigoDoLanche = item.split(',')[0];
            let quantidade = item.split(',')[1];

            // Verificações
            if (quantidade <= 0) return 'Quantidade inválida!';
            
            try { PedidoCliente.adicionarPedido(codigoDoLanche, quantidade);}
            catch { return 'Item inválido!'}


            valorAPagar += PedidoCliente[codigoDoLanche].valor * quantidade;

            // Se o item é um Extra, adiciona qual é o seu item principal a lista
            if (PedidoCliente[codigoDoLanche].extra != false) {
                itensPrincipais.push(PedidoCliente[codigoDoLanche].extra);
            }
        }

        // Esse FOR verifica a lista de itensPrincipais e se esta faltando algum
        for (let item of itensPrincipais){
            if (!PedidoCliente[item]) return 'Item extra não pode ser pedido sem o principal';
        }

        if (valorAPagar === 0) return 'Não há itens no carrinho de compra!';
        
        try {
            valorAPagar = pagarVia[metodoDePagamento](valorAPagar);
        } catch {
            return 'Forma de pagamento inválida!';
        }

        return `R$ ${(valorAPagar.toFixed(2)).replace('.', ',')}`;
    }

}

export { CaixaDaLanchonete };