
import mercadopago
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configuração de logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Credenciais de Teste fornecidas pelo usuário
ACCESS_TOKEN = "APP_USR-5007959568656748-012702-8377ea142e422f8dd44d63b22ff0b83f-3162478356"
sdk = mercadopago.SDK(ACCESS_TOKEN)

@app.route('/criar-pagamento', methods=['POST'])
def criar_pagamento():
    try:
        data = request.json
        items_req = data.get('items', [])
        shipping_price = data.get('shippingPrice', 0)
        customer = data.get('customer', {})

        logger.info(f"Gerando preferência para: {customer.get('email')}")

        # 1. Montagem dos itens com validação de tipos
        preference_items = []
        for item in items_req:
            preference_items.append({
                "id": str(item.get('title')),
                "title": str(item.get('title')),
                "description": f"Produto Blee Shop: {item.get('title')}",
                "quantity": int(item.get('quantity', 1)),
                "currency_id": "BRL",
                "unit_price": round(float(item.get('unit_price')), 2)
            })

        # 2. Inclusão do frete como item (recomendado para Checkout Pro)
        if shipping_price > 0:
            preference_items.append({
                "id": "shipping-cost",
                "title": "Custo de Envio (Logística Blee)",
                "description": "Entrega via transportadora parceira",
                "quantity": 1,
                "currency_id": "BRL",
                "unit_price": round(float(shipping_price), 2)
            })

        # 3. Estrutura da Preferência (Checkout Pro / Redirect)
        preference_data = {
            "items": preference_items,
            "payer": {
                "name": customer.get('name', 'Cliente Blee'),
                "email": customer.get('email', ''),
            },
            "back_urls": {
                "success": "https://bleeshop.web.app/#/dashboard",
                "failure": "https://bleeshop.web.app/#/cart",
                "pending": "https://bleeshop.web.app/#/dashboard"
            },
            "auto_return": "approved",
            "statement_descriptor": "BLEESHOP",
            "external_reference": f"ORDER_{customer.get('email')}",
            "payment_methods": {
                "installments": 12,
                "excluded_payment_types": [
                    {"id": "ticket"} # Removido boleto para focar no Pix/Cartão (opcional)
                ]
            }
        }

        # 4. Requisição à API oficial
        preference_response = sdk.preference().create(preference_data)
        
        if preference_response["status"] >= 400:
            logger.error(f"Erro MP API: {preference_response['response']}")
            return jsonify({"error": "Erro na API do Mercado Pago"}), preference_response["status"]

        response_body = preference_response["response"]

        # O link principal de redirecionamento é o init_point
        return jsonify({
            "preferenceId": response_body["id"],
            "init_point": response_body["init_point"],
            "sandbox_init_point": response_body["sandbox_init_point"]
        })

    except Exception as e:
        logger.error(f"Erro crítico no servidor: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("\n🚀 SERVIDOR PYTHON BLEE SHOP ATIVO NA PORTA 3000")
    print("Acesse http://localhost:3000 para receber as requisições de pagamento\n")
    app.run(port=3000, debug=True)
