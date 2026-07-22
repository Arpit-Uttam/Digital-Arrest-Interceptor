#!/usr/bin/env python3
"""
Digital Arrest Interceptor - PDF Generator
Converts project_documentation.html / project_documentation.md into a styled PDF.
"""

import os
import sys

def convert_to_pdf():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(script_dir, "project_documentation.html")
    pdf_path = os.path.join(script_dir, "Digital_Arrest_Interceptor_Documentation.pdf")

    # 1. Try Pyppeteer / Playwright / WeasyPrint / ReportLab / pdfkit
    try:
        from weasyprint import HTML
        print(f"[*] Compiling PDF using WeasyPrint from {html_path}...")
        HTML(html_path).write_pdf(pdf_path)
        print(f"[+] Success! PDF generated at: {pdf_path}")
        return
    except ImportError:
        pass

    try:
        import pdfkit
        print(f"[*] Compiling PDF using pdfkit from {html_path}...")
        pdfkit.from_file(html_path, pdf_path)
        print(f"[+] Success! PDF generated at: {pdf_path}")
        return
    except ImportError:
        pass

    print("[*] HTML document prepared for browser print PDF export.")
    print(f"[*] Please open {html_path} in Google Chrome or Microsoft Edge and press Ctrl+P -> Save as PDF.")

if __name__ == "__main__":
    convert_to_pdf()
