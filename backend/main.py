class CheckoutSessionRequest(BaseModel):
    price_id: str

@app.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest, db: Session = Depends(get_db)):
    
    # 1. THE CONFIRMED IDs
    MONTHLY_PRICE_ID = "price_1SdBdKJyVTqxIiexTvFFcXEy"  # $24.99
    SEMESTER_PRICE_ID = "price_1SdBlTJyVTqxIiexmjK8S0Cn" # $79.99
    
    # 2. Set the Mode
    if request.price_id == MONTHLY_PRICE_ID:
        checkout_mode = 'subscription'  # Recurring Charge
    elif request.price_id == SEMESTER_PRICE_ID:
        checkout_mode = 'payment'       # One-Time Charge
    else:
        # Security fallback: If an unknown ID is sent, block it.
        raise HTTPException(status_code=400, detail="Invalid Price ID")

    try:
        # 3. Create Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price': request.price_id,
                    'quantity': 1,
                },
            ],
            mode=checkout_mode, # <--- Uses the logic above
            success_url='https://app.rigemt.com/dashboard?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://rigemt.com/pricing',
        )
        return {"id": checkout_session.id}
        
    except Exception as e:
        print(f"Stripe Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))