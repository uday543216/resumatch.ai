import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extracts all text from a PDF file byte stream."""
    try:
        # Open the PDF from bytes using fitz
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        text_content = []
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text_content.append(page.get_text())
            
        return "\n".join(text_content).strip()
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")
