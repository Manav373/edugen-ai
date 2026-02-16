from fastapi import UploadFile
import PyPDF2
import io
import base64
from PIL import Image
import pytesseract
import fitz  # PyMuPDF

class FileProcessor:
    """Service for processing uploaded assignment files"""
    
    @staticmethod
    async def extract_text_from_pdf(file: UploadFile) -> str:
        """Extract text from PDF file"""
        try:
            content = await file.read()
            pdf_file = io.BytesIO(content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            return text.strip()
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    @staticmethod
    async def extract_text_from_image(file: UploadFile) -> str:
        """Extract text from image using OCR"""
        try:
            # Check for Tesseract in common Windows paths if not in PATH
            import os
            import shutil
            
            if not shutil.which("tesseract"):
                possible_paths = [
                    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
                    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
                    r"C:\Users\MANAV\AppData\Local\Tesseract-OCR\tesseract.exe"
                ]
                for path in possible_paths:
                    if os.path.exists(path):
                        pytesseract.pytesseract.tesseract_cmd = path
                        break
            
            content = await file.read()
            image = Image.open(io.BytesIO(content))
            
            # Use pytesseract for OCR
            try:
                text = pytesseract.image_to_string(image)
                return text.strip()
            except pytesseract.TesseractNotFoundError:
                raise Exception(
                    "Tesseract OCR is not installed or not found in PATH. "
                    "Please install Tesseract OCR from https://github.com/UB-Mannheim/tesseract/wiki "
                    "and add it to your System PATH, or install it to C:\\Program Files\\Tesseract-OCR"
                )
            
        except Exception as e:
            raise Exception(f"Error extracting text from image: {str(e)}")
    
    @staticmethod
    async def extract_text_from_txt(file: UploadFile) -> str:
        """Extract text from plain text file"""
        try:
            content = await file.read()
            text = content.decode('utf-8')
            return text.strip()
        except Exception as e:
            raise Exception(f"Error reading text file: {str(e)}")
    
    @staticmethod
    async def process_file(file: UploadFile) -> str:
        """Process uploaded file and extract text based on file type"""
        file_type = file.content_type
        
        if file_type == 'application/pdf':
            return await FileProcessor.extract_text_from_pdf(file)
        elif file_type in ['image/jpeg', 'image/png', 'image/jpg']:
            return await FileProcessor.extract_text_from_image(file)
        elif file_type == 'text/plain':
            return await FileProcessor.extract_text_from_txt(file)
        else:
            raise Exception(f"Unsupported file type: {file_type}")

    @staticmethod
    def _image_to_base64(image: Image.Image) -> str:
        buffered = io.BytesIO()
        if image.mode != 'RGB':
            image = image.convert('RGB')
        image.save(buffered, format="JPEG", quality=85)
        return base64.b64encode(buffered.getvalue()).decode("utf-8")

    @staticmethod
    async def extract_text_from_bytes(file_bytes: bytes, file_type: str) -> str:
        """Extract text from file bytes based on file type"""
        try:
            if file_type == 'application/pdf':
                try:
                    import PyPDF2
                    pdf_file = io.BytesIO(file_bytes)
                    pdf_reader = PyPDF2.PdfReader(pdf_file)
                    text = ""
                    for page in pdf_reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text += extracted + "\n"
                    return text.strip()
                except Exception as e:
                    # Fallback to PyMuPDF if PyPDF2 fails (optional but good)
                    return "" 
            
            elif file_type in ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']:
                 # Use existing image extraction logic (needs refactoring to share code)
                 # For now, duplicate inner logic of extract_text_from_image but adapting for bytes
                 image = Image.open(io.BytesIO(file_bytes))
                 try:
                    import pytesseract
                    # Ensure tesseract path is set (copy logic from extract_text_from_image if needed, 
                    # but simpler to assume it's set or rely on env)
                    # For safety, let's just try basic OCR
                    text = pytesseract.image_to_string(image)
                    return text.strip()
                 except Exception:
                     return "[Image Text Extraction Failed]"

            elif file_type == 'text/plain':
                return file_bytes.decode('utf-8').strip()
            
            return ""
        except Exception as e:
            print(f"Error extracting text from bytes: {e}")
            return ""

    @staticmethod
    def process_file_to_base64_images(file_bytes: bytes, file_type: str) -> list[str]:
        """
        Convert file bytes (PDF or Image) to a list of Base64 strings.
        Returns: List of base64 encoded strings (VDom content).
        """
        images_base64 = []
        
        try:
            if file_type == 'application/pdf':
                # Open PDF from bytes
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                
                # Limit to first 5 pages to avoid token explosion
                for page_num in range(min(len(doc), 5)):
                    page = doc.load_page(page_num)
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # 2x zoom for clarity
                    
                    # Convert to PIL Image
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    images_base64.append(FileProcessor._image_to_base64(img))
                    
                doc.close()
                
            elif file_type in ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']:
                image = Image.open(io.BytesIO(file_bytes))
                # Resize if too large
                if image.width > 2000 or image.height > 2000:
                    image.thumbnail((2000, 2000))
                    
                images_base64.append(FileProcessor._image_to_base64(image))
                
            return images_base64
            
        except Exception as e:
            print(f"Error processing file to images: {e}")
            return []

file_processor = FileProcessor()
