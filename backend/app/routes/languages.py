"""Language listing endpoint."""

from fastapi import APIRouter

from app.services.language_map import get_supported_languages

router = APIRouter()


@router.get("/languages")
async def list_languages():
    """Return all supported languages with their capabilities."""
    return {"languages": get_supported_languages()}
