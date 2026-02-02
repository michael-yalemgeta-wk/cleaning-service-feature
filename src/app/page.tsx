import Link from "next/link";
import { CheckCircle, Clock, Shield } from "lucide-react";
import fs from 'fs/promises';
import path from 'path';

async function getContent() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { 
      hero: { 
        title: "Experience the Perfect Clean",
        subtitle: "Professional home and office cleaning services tailored to your needs.",
        ctaPrimary: "Book Now"
      },
      features: []
    };
  }
}

import ServerServiceList from "@/components/ServerServiceList";
import DynamicTestimonials from "@/components/DynamicTestimonials";

export default async function Home() {
  const content = await getContent();
  const { hero, features } = content;

  return (
    <>
      {/* Hero Section */}
      <section className="section" style={{ background: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url(https://images.unsplash.com/photo-1581578731117-104f2a112a2e?q=80&w=1920&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', padding: '150px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>
            {hero.title?.split(' ').map((word: string, i: number) => 
              word === 'Perfect' || word === 'Clean' ? 
                <span key={i} style={{ color: 'var(--accent)' }}>{word} </span> : 
                <span key={i}>{word} </span>
            )}
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '600px', marginInline: 'auto', color: 'var(--surface-alt)' }}>
            {hero.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/book" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
              {hero.ctaPrimary || "Book Now"}
            </Link>
            <Link href="#services" className="btn btn-secondary" style={{ background: 'transparent', color: 'white', borderColor: 'white' }}>
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Stripe */}
      <div style={{ background: 'var(--primary)', padding: '2rem 0', color: 'white' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {features?.length > 0 ? features.map((feature: any) => (
            <div key={feature.id} className="flex items-center gap-sm">
              {feature.icon === 'CheckCircle' && <CheckCircle />}
              {feature.icon === 'Shield' && <Shield />}
              {feature.icon === 'Clock' && <Clock />}
              <span>{feature.title}</span>
            </div>
          )) : (
            <>
              <div className="flex items-center gap-sm">
                <CheckCircle /> <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-sm">
                <Shield /> <span>Bonded & Insured</span>
              </div>
              <div className="flex items-center gap-sm">
                <Clock /> <span>Flexible Scheduling</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="section">
        <ServerServiceList />
      </section>

      <DynamicTestimonials />

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--surface-alt)' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready for a Cleaner Home?</h2>
          <p className="mb-md" style={{ color: 'var(--text-muted)' }}>Book your service in less than 60 seconds.</p>
          <Link href="/book" className="btn btn-primary">Book Your Clean</Link>
        </div>
      </section>
    </>
  );
}
