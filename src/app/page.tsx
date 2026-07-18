import Image from "next/image";
import { ShieldCheck, MessageCircle, Phone, MapPin, Truck, Users, ChevronRight, Calendar, Diamond } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Premium Hanging Ribbon — top-right "WEBSITE LAUNCHING SOON" */}
      <div className="ribbon-clip absolute right-[5%] top-0 bg-gradient-to-br from-[#710111] to-[#460007] px-5 pt-8 pb-12 shadow-2xl z-50 flex flex-col items-center gap-2 border-x border-b border-[#D4AF37]/40 font-montserrat tracking-widest text-[0.6rem] uppercase text-[#FDF1AC] font-bold">
        <div className="ribbon-clip absolute inset-[3px] border border-[#D4AF37]/50 border-t-0 pointer-events-none"></div>
        <Calendar className="w-6 h-6 text-[#FDF1AC] mb-1" strokeWidth={1.5} />
        <span className="text-center leading-tight">WEBSITE<br />LAUNCHING<br />SOON</span>
      </div>

      {/* Main Container */}
      <div className="h-[100dvh] w-full relative flex flex-col py-4 px-6 lg:px-12 overflow-x-hidden overflow-y-auto md:overflow-hidden">

        {/* Background Image Layer — sharp, no blur */}
        <div className="fixed inset-0 -z-20 bg-[url('/Hardware%20Collection/hero_bg.png')] bg-cover bg-center brightness-[0.6]"></div>

        {/* Dark overlay — heavy vignette, very dark center to read text, edges slightly visible */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_center,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.93)_50%,rgba(5,5,5,0.65)_100%)]"></div>

        <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 relative z-10 items-center text-center justify-center">

          {/* Logo — 3D "HC" icon matching reference */}
          <div className="flex flex-col items-center mt-2 mb-3 animate-[fadeInDown_1s_ease-out]">
            <Image
              src="/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png"
              alt="Hardware Collection Logo"
              width={120}
              height={120}
              className="w-[120px] md:w-[130px] h-auto mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              priority
            />
            <div className="font-montserrat font-bold text-[1.15rem] tracking-[0.18em] mb-1 text-white">HARDWARE COLLECTION</div>
            <div className="flex items-center gap-4 font-montserrat text-[0.6rem] font-medium tracking-[0.25em] text-[#E3B96A] before:content-[''] before:h-[1px] before:w-10 before:bg-[#AC833B]/60 after:content-[''] after:h-[1px] after:w-10 after:bg-[#AC833B]/60">
              SAKCHI, JAMSHEDPUR
            </div>
          </div>

          {/* Hero Content */}
          <main className="flex flex-col items-center justify-center text-center flex-1 animate-[fadeInUp_1s_ease-out_0.2s_both] w-full">
            <div className="mb-4">
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-[4rem] font-semibold leading-[1.1] drop-shadow-2xl">
                <span className="text-white">Premium Hardware</span>
              </h1>
              {/* Short red/maroon underline — between headline lines, matching reference */}
              <div className="w-14 h-[2px] bg-[#8B0000] rounded-full my-2 mx-auto"></div>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-[4rem] font-semibold leading-[1.1] drop-shadow-2xl">
                <span className="bg-gradient-to-r from-[#F9DC8A] via-[#FFECAE] to-[#C89C4C] bg-clip-text text-transparent">&amp; Digital Locks</span>
              </h1>
            </div>

            <p className="font-manrope text-sm md:text-base text-[#ACACAC] max-w-xl mb-6 leading-relaxed">
              Authorized Dealer for <strong className="text-white font-bold">Hafele, Dorset,</strong><br />
              <strong className="text-white font-bold">Labacha &amp; Hettich</strong> in Sakchi, Jamshedpur.
            </p>

            {/* Features Row — with vertical dividers between badges */}
            <div className="flex flex-col md:flex-row flex-wrap justify-center items-stretch w-full mb-6 animate-[fadeInUp_1s_ease-out_0.4s_both]">
              {[
                { icon: ShieldCheck, title: "AUTHORIZED\nDEALER", desc: "Trusted Brands" },
                { icon: Truck, title: "SAME-DAY\nAVAILABILITY", desc: "Fast & Reliable" },
                { icon: Users, title: "100+\nHAPPY CUSTOMERS", desc: "Quality You Can Trust" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center">
                  {/* Feature badge */}
                  <div className="flex items-center gap-3.5 text-left px-6 py-3 min-w-[220px]">
                    <div className="w-11 h-11 rounded-full bg-[#A30018] flex items-center justify-center shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                      <feature.icon className="w-5 h-5 text-white stroke-[1.5px]" />
                    </div>
                    <div>
                      <div className="font-montserrat font-bold text-[0.72rem] tracking-wide leading-tight mb-0.5 text-white whitespace-pre-line">{feature.title}</div>
                      <div className="font-manrope text-[0.65rem] text-[#ACACAC] font-medium">{feature.desc}</div>
                    </div>
                  </div>
                  {/* Vertical divider — hidden after last item */}
                  {i < 2 && (
                    <div className="hidden md:block w-[1px] h-10 bg-white/20 shrink-0"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Offer Pill — gold diamond icon, gold border, uppercase */}
            <div className="w-full flex justify-center mb-6 animate-[fadeInUp_1s_ease-out_0.5s_both]">
              <div className="inline-flex items-center gap-2 border border-[#D4AF37]/50 rounded-full px-5 py-2.5 md:py-3 text-[0.6rem] sm:text-[0.65rem] font-bold text-[#E3B96A] tracking-[0.15em] bg-black/50 uppercase">
                <Diamond className="w-3 h-3 text-[#E3B96A] shrink-0 rotate-0" strokeWidth={2} />
                Special pricing for early enquiries prior to full launch
              </div>
            </div>

            {/* CTAs — rounded-lg (not fully rounded), matching reference proportions */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full mb-6 animate-[fadeInUp_1s_ease-out_0.6s_both]">
              <a href="https://wa.me/919835190738" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-2 w-full sm:w-auto min-w-[240px] px-5 py-3 md:py-3.5 bg-gradient-to-r from-[#F9DC8A] via-[#FFECAE] to-[#C89C4C] text-black font-montserrat font-bold text-[0.75rem] tracking-wide rounded-lg shadow-[0_0_30px_rgba(227,185,106,0.35)] transition-all duration-300 hover:scale-[1.03]">
                <MessageCircle size={16} className="stroke-[1.5px]" />
                <span>ENQUIRE ON WHATSAPP</span>
                <ChevronRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
              </a>

              <a href="tel:+919835190738" className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[160px] px-5 py-3 md:py-3.5 bg-black/40 text-white font-montserrat font-bold text-[0.75rem] tracking-wide rounded-lg border border-white/20 transition-all duration-300 hover:bg-white/10 hover:border-white/40">
                <Phone size={16} className="stroke-[1.5px]" />
                <span>CALL US</span>
              </a>

              <a href="https://maps.app.goo.gl/6qokJfpuQgfNwqZK9" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[160px] px-5 py-3 md:py-3.5 bg-black/40 text-white font-montserrat font-bold text-[0.75rem] tracking-wide rounded-lg border border-white/20 transition-all duration-300 hover:bg-white/10 hover:border-white/40">
                <MapPin size={16} className="stroke-[1.5px]" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>

            {/* Brands Strip — Original logos in white containers for perfect visibility and uniform size */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4 animate-[fadeInUp_1s_ease-out_0.7s_both] px-4 w-full max-w-4xl">
              <div className="bg-white rounded-xl shadow-lg flex items-center justify-center p-3 sm:p-4 w-full md:w-36 h-14 sm:h-16 md:h-20 transition-transform hover:scale-105">
                <div className="relative w-full h-full">
                  <Image src="/brands/Hafele.png" alt="Hafele" fill className="object-contain" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg flex items-center justify-center p-4 sm:p-5 w-full md:w-36 h-14 sm:h-16 md:h-20 transition-transform hover:scale-105">
                <div className="relative w-full h-full">
                  <Image src="/brands/dorset-seeklogo.svg" alt="Dorset" fill className="object-contain" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden w-full md:w-36 h-14 sm:h-16 md:h-20 transition-transform hover:scale-105">
                <div className="relative w-full h-full scale-[1.7]">
                  <Image src="/brands/labacha_logo.webp" alt="Labacha" fill className="object-contain" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg flex items-center justify-center p-3 sm:p-4 w-full md:w-36 h-14 sm:h-16 md:h-20 transition-transform hover:scale-105">
                <div className="relative w-full h-full">
                  <Image src="/brands/Hettich.svg" alt="Hettich" fill className="object-contain" />
                </div>
              </div>
            </div>

          </main>

          {/* Footer Address */}
          <footer className="mt-auto pt-6 flex items-center justify-center gap-2 font-manrope text-xs sm:text-sm text-[#ACACAC] text-center animate-[fadeInUp_1s_ease-out_0.8s_both]">
            <MapPin size={14} className="text-[#ff3b5c] fill-[#ff3b5c]/20 shrink-0" />
            <span>1/18, Kashidih, near Durga Puja Maidan, Sakchi, Jamshedpur – 831001</span>
          </footer>

        </div>
      </div>
    </>
  );
}
