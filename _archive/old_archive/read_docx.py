import zipfile
import xml.etree.ElementTree as ET
import os

def extract_text(docx_path):
    if not os.path.exists(docx_path):
        return f"File not found: {docx_path}"
    
    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            xml_content = zip_ref.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # Namespace for Word processing ML
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # Find all paragraphs and their text
            texts = []
            for p in tree.findall('.//w:p', ns):
                para_text = ""
                for t in p.findall('.//w:t', ns):
                    if t.text:
                        para_text += t.text
                if para_text:
                    texts.append(para_text)
            
            return "\n".join(texts)
    except Exception as e:
        return f"Error reading {docx_path}: {e}"

files = [
    r"C:\Users\aayus\Downloads\hardware_collection_dev_brief.docx",
    r"C:\Users\aayus\Downloads\service_pricing_table.docx"
]

with open("docx_content.txt", "w", encoding="utf-8") as out:
    for f in files:
        out.write(f"--- CONTENT OF {os.path.basename(f)} ---\n")
        out.write(extract_text(f))
        out.write("\n" + "="*50 + "\n\n")
