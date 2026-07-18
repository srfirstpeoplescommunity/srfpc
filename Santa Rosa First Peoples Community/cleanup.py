import re

def clean_text(input_file, output_html):
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Remove form feeds
    content = content.replace('\x0c', '')
    
    # Split into blocks based on blank lines
    blocks = re.split(r'\n\s*\n', content)
    
    cleaned_blocks = []
    for block in blocks:
        block = block.strip()
        if not block:
            continue
            
        # Filter out headers and footers
        lines = block.split('\n')
        new_lines = []
        for line in lines:
            line_str = line.strip()
            if re.match(r'^Page \d+ of \d+$', line_str) or 'ISSUES IN INDIGENOUS CARIBBEAN STUDIES' in line_str:
                continue
            new_lines.append(line_str)
            
        if not new_lines:
            continue
            
        # Join lines into a paragraph
        paragraph = ' '.join(new_lines)
        
        # Simple HTML escaping
        paragraph = paragraph.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        
        # Check if it looks like a heading
        if len(paragraph) < 100 and not paragraph.endswith('.') and not paragraph.endswith(','):
            cleaned_blocks.append(f'<h2>{paragraph}</h2>')
        else:
            cleaned_blocks.append(f'<p>{paragraph}</p>')
            
    # Generate HTML
    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>We are not extinct</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            font-size: 12pt;
        }}
        p {{
            margin-bottom: 1em;
            text-align: justify;
        }}
        h2 {{
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            color: #333;
        }}
    </style>
</head>
<body>
    {''.join(cleaned_blocks)}
</body>
</html>"""

    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(html_content)

if __name__ == '__main__':
    clean_text('raw_text.txt', 'cleaned_document.html')
