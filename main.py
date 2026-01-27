
import mercadopago
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configuração de logs para debug
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Credencial fornecida: APP_USR-5007959568656748-012702-8377ea142e422f8dd44d63b22ff0b83f-3162478356
ACCESS_TOKEN = "APP_USR-5007959568656748-012702-8377ea142e422f8dd44d63b22ff0b83f-3162478356"
sdk = mercadopago.SDK(ACCESS_TOKEN)

@app.route('/criar-pagamento', methods=['POST'])
def criar_pagamento():
    try:
        data = request.json
        items_req = data.get('items', [])
        shipping_price = data.get('shippingPrice', 0)
        customer = data.get('customer', {})
        # Recebe a origem do frontend para garantir back_urls corretas
        origin = data.get('origin', 'https://bleeshop.web.app')

        logger.info(f"Gerando preferência para: {customer.get('email')} vindo de {origin}")

        # 1. Montagem rigorosa dos itens
        preference_items = []
        for item in items_req:
            preference_items.append({
                "id": str(item.get('title'))[:20], # ID curto
                "title": str(item.get('title')),
                "quantity": int(item.get('quantity', 1)),
                "currency_id": "BRL",
                "unit_price": round(float(item.get('unit_price')), 2)
            })

        # 2. Adicionar frete como item se existir
        if shipping_price > 0:
            preference_items.append({
                "id": "shipping-fee",
                "title": "Frete e Entrega Blee Shop",
                "quantity": 1,
                "currency_id": "BRL",
                "unit_price": round(float(shipping_price), 2)
            })

        # 3. Definição da Preferência (Checkout Pro)
        preference_data = {
            "items": preference_items,
            "payer": {
                "name": customer.get('name', 'Cliente Blee'),
                "email": customer.get('email', ''),
            },
            "back_urls": {
                "success": f"{origin}/#/dashboard",
                "failure": f"{origin}/#/cart",
                "pending": f"{origin}/#/dashboard"
            },
            "auto_return": "approved",
            "statement_descriptor": "BLEESHOP",
            "external_reference": f"ORDER_{customer.get('email')}",
            "payment_methods": {
                "installments": 12,
                "excluded_payment_types": [
                    {"id": "ticket"} # Removendo boleto para agilizar processamento
                ]
            }
        }

        # 4. Criar Preferência
        preference_response = sdk.preference().create(preference_data)
        
        if preference_response["status"] >= 400:
            logger.error(f"Erro MP API: {preference_response['response']}")
            return jsonify({"error": "Erro na API do Mercado Pago", "details": preference_response["response"]}), preference_response["status"]

        res = preference_response["response"]

        # Retorna o ID e os links (init_point é o oficial de produção)
        return jsonify({
            "preferenceId": res["id"],
            "init_point": res["init_point"],
            "sandbox_init_point": res["sandbox_init_point"]
        })

    except Exception as e:
        logger.error(f"Falha Interna: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("\n🐝 Blee Backend Python ON na porta 3000")
    app.run(port=3000, debug=True)
