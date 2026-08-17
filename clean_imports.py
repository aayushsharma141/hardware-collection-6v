import os
import re

files_to_fix = [
    (r"e:\Hardware-Collection\HC main\website\src\app\brands\page.tsx", [
        (r'import Image from "next/image";\n', ''),
        (r'import Link from "next/link";\n', ''),
        (r'import { Download, ArrowRight, ChevronRight } from "lucide-react";', 'import { ArrowRight } from "lucide-react";')
    ]),
    (r"e:\Hardware-Collection\HC main\website\src\app\collections\page.tsx", [
        (r'import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";', 'import { ArrowRight, CheckCircle2 } from "lucide-react";')
    ]),
    (r"e:\Hardware-Collection\HC main\website\src\app\page.tsx", [
        (r'import Image from "next/image";\n', '')
    ]),
    (r"e:\Hardware-Collection\HC main\website\src\app\showroom\page.tsx", [
        (r'import Image from "next/image";\n', ''),
        (r'import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";', 'import { MapPin } from "lucide-react";')
    ]),
    (r"e:\Hardware-Collection\HC main\website\src\components\Navbar.tsx", [
        (r'const \[scrolled, setScrolled\] = useState\(false\);', 'const [, setScrolled] = useState(false);')
    ]),
    (r"e:\Hardware-Collection\HC main\website\src\components\ProductCatalog.tsx", [
        (r'import { ArrowRight, ExternalLink, Filter, Layers, Lock, ChefHat, Bath, Building2 } from "lucide-react";', 'import { ArrowRight, Filter } from "lucide-react";'),
        (r'type Product = {.*?\n.*?\n.*?\n.*?\n.*?\n};', '')
    ]),
    (r"e:\Hardware-Collection\HC main\website\src\components\QuoteBuilder.tsx", [
        (r'import { Check, Send, X } from "lucide-react";', 'import { Check, X } from "lucide-react";'),
        (r'const \[submitted, setSubmitted\] = useState\(false\);', 'const [, setSubmitted] = useState(false);')
    ]),
    (r"e:\Hardware-Collection\HC main\website\src\components\ShowroomExperience.tsx", [
        (r'import { MapPin, Clock, Phone, ArrowRight, ShieldCheck, Star } from "lucide-react";', 'import { ArrowRight, Star } from "lucide-react";')
    ]),
    (r"e:\Hardware-Collection\HC main\website\src\components\Testimonials.tsx", [
        (r'import { Star, MessageSquareQuote, Award, Users } from "lucide-react";', 'import { Star } from "lucide-react";')
    ])
]

for file_path, replacements in files_to_fix:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        for old, new in replacements:
            content = re.sub(old, new, content, flags=re.MULTILINE|re.DOTALL)
            
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed {file_path}")
    else:
        print(f"File not found: {file_path}")
