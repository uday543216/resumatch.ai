import stripe
import os
import logging

# Fallback test key if not provided
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_mock")

def create_checkout_session(client_ip: str, success_url: str, cancel_url: str) -> dict:
    """Creates a Stripe Checkout Session for the Premium Tier."""
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'inr',
                    'product_data': {
                        'name': 'ResuMatch AI Premium',
                        'description': 'Unlimited Resume Tailoring & Cover Letters (1 Month)',
                    },
                    'unit_amount': 29900, # ₹299.00 in paise
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{success_url}?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=cancel_url,
            client_reference_id=client_ip
        )
        return {"url": session.url}
    except Exception as e:
        logging.error(f"Stripe Session Error: {e}")
        return {"error": str(e)}
