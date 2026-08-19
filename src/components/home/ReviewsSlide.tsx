"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/animations/FadeIn";

const REVIEWS = [
  { text: "Best collection of digital locks and architectural hardware in Jamshedpur. The showroom experience is unmatched.", author: "Rahul K.", rating: 5 },
  { text: "Sourced all hardware for my new home from here. Genuine products and excellent technical guidance.", author: "Sneha M.", rating: 5 },
  { text: "Architect's paradise. They have everything from basic fittings to luxury German brands.", author: "Vikram S.", rating: 5 },
];

export default function ReviewsSlide() {
  return (
    <section className="py-32 bg-zinc-950 border-t border-zinc-900 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <FadeIn className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[#C8A96E] text-2xl">4.8 ★</span>
            <span className="text-white text-sm tracking-widest uppercase">Verified Google Reviews</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-light text-white">What Architects &<br />Homeowners Say</h2>
        </FadeIn>

        {/* Simple horizontal overflow container */}
        <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
          {REVIEWS.map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="min-w-[300px] md:min-w-[400px] bg-zinc-900 p-8 snap-start border border-zinc-800"
            >
              <div className="flex text-[#C8A96E] mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
              <p className="text-lg text-zinc-300 font-light mb-8 leading-relaxed">
                "{review.text}"
              </p>
              <p className="text-white font-medium text-sm tracking-widest uppercase">
                {review.author}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
