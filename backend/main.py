class CheckoutSessionRequest(BaseModel):
    price_id: str

@app.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest, db: Session = Depends(get_db)):
    
    # 1. THE CONFIRMED IDs
    MONTHLY_PRICE_ID = "price_1SdBdKJyVTqxIiexTvFFcXEy"  # $24.99
    SEMESTER_PRICE_ID = "price_1SdBlTJyVTqxIiexmjK8S0Cn" # $79.99
    
    # 2. THE LOGIC SWITCH
    if request.price_id == MONTHLY_PRICE_ID:
        checkout_mode = 'subscription'  # This triggers the recurring logic
    elif request.price_id == SEMESTER_PRICE_ID:
        checkout_mode = 'payment'       # This triggers the one-time logic
    else:
        # Security: If a hacker sends a fake ID, reject it.
        raise HTTPException(status_code=400, detail="Invalid Price ID")

    try:
        # 3. CREATE THE SESSION
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price': request.price_id,
                    'quantity': 1,
                },
            ],
            mode=checkout_mode, # <--- Dynamic Mode applied here
            success_url='https://app.rigemt.com/dashboard?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://rigemt.com/pricing',
        )
        return {"id": checkout_session.id}
        
    except Exception as e:
        print(f"Stripe Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Assuming imports are added at the top
# from fastapi import Depends, HTTPException
# from sqlalchemy.orm import Session
# from . import schemas, models
# from .database import get_db
# from .oauth2 import get_current_user

@app.get("/me", response_model=schemas.UserResponse)
def get_current_user_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Returns the currently logged-in user's profile.
    Used by the frontend to sync 'access_level' after a purchase.
    """

    # Optional: Force a DB refresh to ensure we aren't reading stale cache
    db.refresh(current_user)

    return current_user