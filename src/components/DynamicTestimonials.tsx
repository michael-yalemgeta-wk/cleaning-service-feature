import { Star } from "lucide-react";
import fs from 'fs/promises';
import path from 'path';

async function getTestimonials() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const content = JSON.parse(data);
    return content.testimonials || [];
  } catch (error) {
    return [];
  }
}

export default async function DynamicTestimonials() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="section" style={{ background: 'var(--surface-alt)' }}>
      <div className="container">
        <h2 className="text-center mb-lg" style={{ fontSize: '2.5rem' }}>What Our Customers Say</h2>
        <div className="grid-3">
          {testimonials.map((r: any) => (
            <div key={r.id} className="card" style={{ textAlign: 'center' }}>
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
