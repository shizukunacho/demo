import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import current_user
from ..models import Feedback, User
from ..response import ok
from ..schemas import FeedbackRequest


router = APIRouter(tags=["feedback"])


@router.post("/feedback")
def create_feedback(
    payload: FeedbackRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    feedback = Feedback(
        id=str(uuid.uuid4()),
        user_id=user.id,
        category=payload.category,
        content=payload.content.strip(),
        contact=(payload.contact or "").strip(),
    )
    db.add(feedback)
    db.commit()
    return ok({"id": feedback.id}, "提交成功")
