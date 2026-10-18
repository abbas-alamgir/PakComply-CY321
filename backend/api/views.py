from datetime import datetime, timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_status(request):
    """Health and status endpoint for PakComply backend."""
    return Response(
        {
            "status": "online",
            "service": "PakComply Backend API",
            "version": "1.0.0",
            "framework": "Django REST Framework",
            "compliance_standard": "Pakistan Personal Data Protection Bill 2023",
            "server_time": datetime.now(timezone.utc).isoformat(),
            "message": "Connected successfully to Django backend!",
        }
    )


@api_view(["GET"])
def compliance_categories(request):
    """Returns the primary compliance domains evaluated under the 2023 Bill."""
    categories = [
        {
            "id": "consent",
            "name": "Consent Management",
            "clause": "Sections 6 & 11",
            "description": "Evaluation of explicit consent mechanisms, withdrawal procedures, and notices.",
        },
        {
            "id": "processing",
            "name": "Data Processing & Purpose Limitation",
            "clause": "Section 5",
            "description": "Assessment of legitimate data collection boundaries, transparency, and fairness.",
        },
        {
            "id": "retention",
            "name": "Data Retention & Disposal",
            "clause": "Section 9",
            "description": "Review of retention periods, automatic purging policies, and disposal proofs.",
        },
        {
            "id": "security",
            "name": "Security Safeguards & Controls",
            "clause": "Section 15",
            "description": "Technical and organizational measures, encryption, access controls, and breach protocols.",
        },
        {
            "id": "cross_border",
            "name": "Cross-Border Data Transfer",
            "clause": "Section 31",
            "description": "Conditions for transferring personal data outside of Pakistan and adequacy requirements.",
        },
        {
            "id": "governance",
            "name": "DPO & Internal Audits",
            "clause": "Section 22",
            "description": "Appointment of Data Protection Officer and regular compliance auditing mechanisms.",
        },
    ]
    return Response({"count": len(categories), "categories": categories})
