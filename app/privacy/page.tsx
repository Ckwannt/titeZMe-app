'use client';

export default function PrivacyPage() {
  return (
    <div className="bg-[#0A0A0A] text-white pt-24 min-h-screen font-sans border-t border-[#1a1a1a]">
      <section className="bg-[#111] py-24 px-6 min-h-screen">
        <div className="max-w-[800px] mx-auto text-left">
          <div className="text-xs font-bold text-[#FFD600] uppercase tracking-widest mb-4">LEGAL</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-sm font-bold text-gray-500 mb-12">Last updated: May 2026</p>

          <div className="text-[#888580] space-y-12 leading-relaxed">

            <div>
              <p className="mb-4">At titeZMe, operated by Ibrahim MELLOULI, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use titezme.com (&quot;Platform&quot;).</p>
              <p className="mb-2">This policy complies with:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>GDPR (European Union)</li>
                <li>UK GDPR (United Kingdom)</li>
                <li>CCPA (California, USA)</li>
                <li>Law 09-08 (Morocco)</li>
                <li>Other applicable privacy laws</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">1. DATA CONTROLLER</h2>
              <p className="font-bold text-[#F0EDE8] mb-2">Data Controller:</p>
              <p>
                Ibrahim MELLOULI<br/>
                Operating as: titeZMe<br/>
                Website: titezme.com<br/>
                Contact: <a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline">support@titezme.com</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">2. DATA WE COLLECT</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">2.1 Account Data</h3>
              <p className="mb-2">When you create an account:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Full name</li>
                <li>Email address</li>
                <li>Password (encrypted, never readable)</li>
                <li>Phone number (if provided)</li>
                <li>Profile photo (if provided)</li>
                <li>Role (client or barber)</li>
                <li>City and country</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">2.2 Barber / Shop Profile Data</h3>
              <p className="mb-2">If you register as a barber or shop:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Professional bio</li>
                <li>Services and prices</li>
                <li>Availability schedule</li>
                <li>Languages spoken</li>
                <li>Portfolio photos (when activated)</li>
                <li>Social media links (if provided)</li>
                <li>Barber code</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">2.3 Booking Data</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Booking date, time, service</li>
                <li>Booking status and history</li>
                <li>Payment confirmation (cash, no card data collected)</li>
                <li>Cut confirmation status</li>
                <li>No-show records</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">2.4 Review Data</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Star ratings</li>
                <li>Written reviews</li>
                <li>Review timestamps</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">2.5 Usage Data (automatically collected)</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device type</li>
                <li>Pages visited and time spent</li>
                <li>Referring URLs</li>
                <li>Location data (if permission granted)</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">2.6 Communications</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>Messages sent to support</li>
                <li>Notification preferences</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">3. HOW WE USE YOUR DATA</h2>
              <p className="mb-4">We use your data to:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-6">
                <li>(a) Create and manage your account</li>
                <li>(b) Process and manage bookings</li>
                <li>(c) Connect clients with barbers</li>
                <li>(d) Send booking confirmations and reminders</li>
                <li>(e) Display reviews and ratings</li>
                <li>(f) Detect and prevent fraud</li>
                <li>(g) Enforce booking limits and Platform rules</li>
                <li>(h) Improve our Platform and user experience</li>
                <li>(i) Send service-related notifications</li>
                <li>(j) Comply with legal obligations</li>
                <li>(k) Respond to support requests</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">3.1 Legal Basis (GDPR)</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>Contract performance: processing necessary to provide booking services</li>
                <li>Legitimate interests: fraud prevention, Platform improvement, security</li>
                <li>Consent: marketing communications, location data</li>
                <li>Legal obligation: compliance with applicable laws</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">4. DATA SHARING</h2>
              <p className="mb-4 font-bold text-[#FFD600]">We do NOT sell your personal data. We do NOT rent your personal data. We do NOT share your data with advertisers.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.2 We share data with:</h3>

              <p className="font-bold text-[#F0EDE8] mb-1">Firebase (Google LLC)</p>
              <p className="mb-4">We use Firebase for authentication, database storage, and analytics. Firebase is GDPR compliant and processes data in accordance with Google&apos;s Privacy Policy. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FFD600] hover:underline">policies.google.com/privacy</a></p>

              <p className="font-bold text-[#F0EDE8] mb-1">Google Analytics</p>
              <p className="mb-4">We use Google Analytics to understand how users interact with our Platform. This involves cookies and usage data. You can opt out at: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#FFD600] hover:underline">tools.google.com/dlpage/gaoptout</a></p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.3 We may also share data with:</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>Law enforcement or government authorities when required by law</li>
                <li>Legal advisors when necessary to protect our legal rights</li>
                <li>Successor entities in the event of a business transfer or acquisition</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">5. COOKIES</h2>
              <p className="mb-4">5.1 We use cookies and similar technologies for:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Authentication (keeping you logged in)</li>
                <li>Platform functionality</li>
                <li>Analytics and performance</li>
                <li>Security</li>
              </ul>
              <p className="mb-4">5.2 Essential cookies cannot be disabled as they are necessary for the Platform to function.</p>
              <p>5.3 You can control non-essential cookies through your browser settings. Note that disabling cookies may affect Platform functionality.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">6. DATA RETENTION</h2>
              <p className="mb-4">We retain your data for:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Account data: as long as your account is active, plus 2 years after deletion</li>
                <li>Booking history: 5 years for legal and tax purposes</li>
                <li>Reviews: indefinitely unless removed by admin</li>
                <li>Usage / analytics data: 26 months</li>
                <li>Support communications: 3 years</li>
              </ul>
              <p className="mb-2">When your account is deleted:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>Personal profile data is removed</li>
                <li>Booking records are anonymized</li>
                <li>Reviews are anonymized but may remain on the Platform</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">7. YOUR RIGHTS</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.1 GDPR Rights (EU / UK users)</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your data (&quot;right to be forgotten&quot;)</li>
                <li>Restrict processing of your data</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.2 CCPA Rights (California users)</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Know what data we collect</li>
                <li>Delete your personal data</li>
                <li>Opt-out of data sale (we do not sell data)</li>
                <li>Non-discrimination for exercising your rights</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.3 Morocco Law 09-08 Rights</h3>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Object to processing</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.4 All Users</h3>
              <p>To exercise any of these rights, contact us at: <a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline">support@titezme.com</a><br/>We will respond within 30 days. We may need to verify your identity before processing your request.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">8. DATA SECURITY</h2>
              <p className="mb-4">8.1 We implement appropriate technical and organizational measures to protect your data including:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Encryption of data in transit (TLS)</li>
                <li>Encrypted password storage</li>
                <li>Firebase security rules</li>
                <li>Access controls and authentication</li>
                <li>Regular security monitoring</li>
              </ul>
              <p className="mb-4">8.2 No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
              <p>8.3 In the event of a data breach that affects your rights and freedoms, we will notify affected users and relevant authorities within 72 hours as required by GDPR.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">9. CHILDREN&apos;S PRIVACY</h2>
              <p className="mb-4">9.1 The Platform is not directed at children under 16 years of age.</p>
              <p className="mb-4">9.2 We do not knowingly collect personal data from users under 16 without verified parental consent.</p>
              <p className="mb-4">9.3 If we discover we have collected data from a user under 16 without parental consent, we will delete it immediately.</p>
              <p>9.4 If you are a parent and believe your child under 16 has created an account, contact us at <a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline">support@titezme.com</a> immediately.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">10. INTERNATIONAL TRANSFERS</h2>
              <p className="mb-4">10.1 Your data may be transferred to and processed in countries outside your country of residence, including the United States where Google/Firebase servers are located.</p>
              <p>10.2 When transferring data outside the EEA, we ensure appropriate safeguards are in place including Standard Contractual Clauses approved by the European Commission.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">11. THIRD PARTY LINKS</h2>
              <p>The Platform may contain links to third-party websites. We are not responsible for the privacy practices of those websites. We encourage you to read their privacy policies.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">12. CHANGES TO THIS POLICY</h2>
              <p>We may update this Privacy Policy from time to time. We will notify users of significant changes via email or Platform notification. The updated date at the top of this page will always reflect the latest version.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">13. SUPERVISORY AUTHORITIES</h2>
              <p className="mb-4">If you are in the EU / UK and believe we have not handled your data correctly, you have the right to lodge a complaint with your local data protection authority:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>EU: Your national data protection authority (list at <a href="https://edpb.europa.eu" target="_blank" rel="noopener noreferrer" className="text-[#FFD600] hover:underline">edpb.europa.eu</a>)</li>
                <li>UK: Information Commissioner&apos;s Office (<a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#FFD600] hover:underline">ico.org.uk</a>)</li>
                <li>Spain: AEPD (<a href="https://aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#FFD600] hover:underline">aepd.es</a>)</li>
                <li>Morocco: CNDP (<a href="https://cndp.ma" target="_blank" rel="noopener noreferrer" className="text-[#FFD600] hover:underline">cndp.ma</a>)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">14. CONTACT US</h2>
              <p className="mb-2">For privacy-related questions, data requests, or concerns:</p>
              <p className="font-bold">
                Email: <a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline">support@titezme.com</a><br/>
                Website: titezme.com<br/>
                Response time: within 30 days
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
