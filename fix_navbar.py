import os

file_path = r"e:\Hardware-Collection\src\components\layout\Navbar.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Import MobileMenu and export NavLinkItem
content = content.replace(
    "interface NavLinkItem {",
    'import { MobileMenu } from "./MobileMenu";\n\nexport interface NavLinkItem {'
)

# 2. Remove dialogRef
content = content.replace(
    "  const menuButtonRef = useRef<HTMLButtonElement>(null);\n  const dialogRef = useRef<HTMLDivElement>(null);",
    "  const menuButtonRef = useRef<HTMLButtonElement>(null);"
)

# 3. Remove handleKeyDown block
idx_keydown = content.find("  /**\n   * The drawer is a modal:")
idx_keydown_end = content.find("  }, [mobileMenuOpen]);\n", idx_keydown)
if idx_keydown != -1 and idx_keydown_end != -1:
    content = content[:idx_keydown] + content[idx_keydown_end + len("  }, [mobileMenuOpen]);\n"):]

# 4. Replace Mobile Liquid Glass Modal
idx_modal = content.find("{/* ── Dedicated Mobile Liquid Glass Modal")
if idx_modal != -1:
    idx_end_modal = content.rfind("      </AnimatePresence>")
    
    mobile_menu_jsx = """      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuButtonRef={menuButtonRef}
        navLinks={navLinks}
        isLinkActive={isLinkActive}
        handleNavClick={handleNavClick}
        handleLogoClick={handleLogoClick}
        primaryPhone={primaryPhone}
        cleanPhone={cleanPhone}
        onConsultClick={() => openDrawer({ source: "navbar", intent: "consultation" })}
      />"""

    if idx_end_modal != -1:
        content = content[:idx_modal] + mobile_menu_jsx + "\n" + content[idx_end_modal + len("      </AnimatePresence>"):]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Navbar.tsx fixed successfully!")
