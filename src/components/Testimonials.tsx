"use client";

import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    { name: "Alice Johnson", rating: 5, text: "Absolutely amazing service. The team was professional and left my house sparkling clean!" },
    { name: "Mark Smith", rating: 5, text: "Great attention to detail. I've used many services before, but PristineClean is the best." },
    { name: "Sarah Williams", rating: 4, text: "Very good service, arrived on time and did a solid job. Will book again." }
  ];

  return (
    <section className="section" style={{ background: 'var(--surface-alt)' }}>
      <div className="container">
        <h2 className="text-center mb-lg" style={{ fontSize: '2.5rem' }}>What Our Customers Say</h2>
        <div className="grid-3">
          {reviews.map((r, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent)' }}>
                {[...Array(5)].map((_, starIndex) => (
                   <Star key={starIndex} fill={starIndex < r.rating ? "currentColor" : "none"} strokeWidth={1} />
                ))}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', flexGrow: 1 }}>"{r.text}"</p>
              <h4 style={{ fontWeight: 'bold' }}>- {r.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
