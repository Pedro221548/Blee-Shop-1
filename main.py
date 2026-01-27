
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
        origin = data.get('origin', 'https://blee-shop-1.vercel.app')

        logger.info(f"Gerando preferência de checkout para: {customer.get('email')}")

        # 1. Montagem dos itens (conforme seu exemplo, garantindo float no unit_price)
        preference_items = []
        for item in items_req:
            preference_items.append({
                "id": str(item.get('id', '6')),
                "title": str(item.get('title')),
                "quantity": int(item.get('quantity', 1)),
                "currency_id": "BRL",
                "unit_price": float(item.get('unit_price', 1.0))
            })

        # 2. Adicionar frete se houver
        if shipping_price > 0:
            preference_items.append({
                "id": "shipping",
                "title": "Frete Blee Shop",
                "quantity": 1,
                "currency_id": "BRL",
                "unit_price": float(shipping_price)
            })

        # 3. Configuração da Preference (Baseado no seu snippet de teste)
        preference_data = {
            "items": preference_items,
            "payer": {
                "name": customer.get('name', 'Cliente Blee'),
                "email": customer.get('email', ''),
            },
            "back_urls": {
                "success": f"{origin}/#/product/1769493091809compracerta",
                "failure": f"{origin}/#/product/1769493091809compraerrada",
                "pending": f"{origin}/#/product/1769493091809compraerrada"
            },
            "auto_return": "approved",
            "statement_descriptor": "BLEESHOP",
            "payment_methods": {
                "installments": 12,
                "excluded_payment_types": [
                    {"id": "ticket"} # Opcional: remover boleto
                ]
            }
        }

        # 4. Criar Preferência na SDK
        preference_response = sdk.preference().create(preference_data)
        
        if preference_response["status"] >= 400:
            logger.error(f"Erro MP API: {preference_response['response']}")
            return jsonify({"error": "Falha na comunicação com Mercado Pago"}), preference_response["status"]

        res = preference_response["response"]

        # Retornamos o link de redirecionamento (init_point)
        return jsonify({
            "preferenceId": res["id"],
            "init_point": res["init_point"],
            "sandbox_init_point": res["sandbox_init_point"]
        })

    except Exception as e:
        logger.error(f"Falha Interna no Servidor: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("\n🐝 [Blee Shop] Servidor Python Ativo")
    print("Pronto para gerar links de redirecionamento Mercado Pago na porta 3000\n")
    app.run(port=3000, debug=True)
