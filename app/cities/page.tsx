'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CitiesPage() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = 'Cities — titeZMe'; }, []);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, 'professionalProfiles'),
            where('isLive', '==', true)
          )
        );
        setBarbers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

  // Group by city and count
  const cityStats = barbers.reduce((acc: any, barber: any) => {
    const city = barber.city || 'Unknown';
    if (!acc[city]) {
      acc[city] = { city, barberCount: 0, shopCount: 0 };
    }
    acc[city].barberCount++;
    return acc;
  }, {});

  const liveCities = (Object.values(cityStats) as any[]).sort(
    (a: any, b: any) => b.barberCount - a.barberCount
  );

  // Hardcoded coming soon cities (filter out any that are already live)
  const comingSoonCities = [
    'Amsterdam', 'Berlin', 'Rome', 'Dubai', 'London', 'Paris', 'Brussels', 'Toronto',
  ].filter(
    city => !liveCities.find((c: any) => c.city.toLowerCase() === city.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      fontFamily: 'Nunito, sans-serif',
      padding: '60px 20px'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#555',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            CITIES
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.1 }}>
            We&apos;re live where you are
          </h1>
          <p style={{ fontSize: '14px', color: '#555', marginTop: '12px' }}>
            Find barbers in your city or request titeZMe in a new location.
          </p>
        </div>

        {/* Live cities */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '48px'
          }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: '16px',
                padding: '20px',
                height: '120px',
                animation: 'pulse 1.5s infinite'
              }} />
            ))}
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }`}</style>
          </div>
        ) : liveCities.length > 0 ? (
          <>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#555',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              LIVE NOW
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '48px'
            }}>
              {liveCities.map((city: any, index: number) => (
                <Link
                  key={city.city}
                  href={`/barbers?city=${encodeURIComponent(city.city)}`}
                  style={{
                    background: '#111',
                    border: `1px solid ${index === 0 ? '#F5C51833' : '#1e1e1e'}`,
                    borderRadius: '16px',
                    padding: '20px',
                    textDecoration: 'none',
                    display: 'block'
                  }}
                >
                  {index === 0 && (
                    <div style={{
                      background: '#F5C518',
                      color: '#0a0a0a',
                      fontSize: '9px',
                      fontWeight: 900,
                      letterSpacing: '0.1em',
                      padding: '3px 8px',
                      borderRadius: '99px',
                      display: 'inline-block',
                      marginBottom: '10px'
                    }}>
                      MOST POPULAR
                    </div>
                  )}
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
                    {city.city}
                  </div>
                  <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px' }}>
                    {city.barberCount} barber{city.barberCount !== 1 ? 's' : ''}
                    {city.shopCount > 0 ? ` · ${city.shopCount} shop${city.shopCount !== 1 ? 's' : ''}` : ''}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#F5C518' }}>
                    Explore →
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : null}

        {/* Coming soon cities */}
        {comingSoonCities.length > 0 && (
          <>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#555',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}>
              COMING SOON
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px'
            }}>
              {comingSoonCities.map(city => (
                <div key={city} style={{
                  background: '#0d0d0d',
                  border: '1px solid #141414',
                  borderRadius: '16px',
                  padding: '20px',
                  opacity: 0.6
                }}>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#444', marginBottom: '6px' }}>
                    {city}
                  </div>
                  <div style={{ fontSize: '12px', color: '#333', marginBottom: '12px' }}>
                    Coming soon
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#333' }}>
                    Request it →
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
