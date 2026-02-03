import Link from "next/link";
import { CheckCircle, Clock, Shield, Search } from "lucide-react";
import fs from 'fs/promises';
import path from 'path';
import { getEmbedLink } from "@/utils/imageUtils";

async function getSettings() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'settings.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

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
  const settings = await getSettings();
  const { hero, features } = content;
  
  // Use Company Name from settings if available, otherwise default
  const displayTitle = hero?.title || (settings.companyName ? `${settings.companyName} Services` : "Experience the Perfect Clean");

  return (
    <>
      {/* Hero Section */}
      <section className="section" style={{ 
        background: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${getEmbedLink(hero.backgroundImage) || 'https://images.unsplash.com/photo-1581578731117-104f2a8775aa?auto=format&fit=crop&q=80'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '150px 0',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2, color: 'white' }}>
            {displayTitle}
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '600px', marginInline: 'auto', color: 'rgba(255,255,255,0.9)' }}>
            {hero.subtitle || "Professional home and office cleaning services tailored to your needs."}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/book" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
              {hero.ctaPrimary || "Book Now"}
            </Link>
            <Link href="/services" className="btn" style={{ background: 'transparent', color: 'white', border: '1px solid white', fontSize: '1.1rem', padding: '1rem 2rem' }}>
              {hero.ctaSecondary || "Our Services"}
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Search Section - NEW */}
      <section style={{ background: 'var(--surface)', padding: '2rem 0', marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '1.5rem' }}>
             <h3 style={{ margin: 0, whiteSpace: 'nowrap' }}>Manage Booking</h3>
             <form action="/customer/bookings" method="GET" style={{ display: 'flex', flexGrow: 1, gap: '0.5rem' }}>
               <div style={{ position: 'relative', flexGrow: 1 }}>
                 <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                 <input 
                   name="email" 
                   type="email" 
                   placeholder={settings.email ? `Enter email (e.g. ${settings.email})` : "Enter email to find booking..."} 
                   required
                   style={{ paddingLeft: '2.5rem' }}
                 />
               </div>
               <button type="submit" className="btn btn-primary">Find</button>
             </form>
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
