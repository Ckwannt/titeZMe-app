'use client';

export default function PrivacyPage() {
  return (
    <div className="bg-[#0A0A0A] text-white pt-24 min-h-screen font-sans border-t border-[#1a1a1a]">
      <section className="bg-[#111] py-24 px-6 min-h-screen">
        <div className="max-w-[800px] mx-auto text-left">
          <div className="text-xs font-bold text-brand-yellow uppercase tracking-widest mb-4">LEGAL</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-sm font-bold text-gray-500 mb-1">Last updated: May 2026</p>
          <p className="text-sm font-bold text-gray-500 mb-12">Effective date: May 2026</p>

          <div className="text-gray-300 space-y-12 leading-relaxed">
            
            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 1 — Introduction</h2>
              <p>titeZMe (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the titeZMe platform, accessible via our website and mobile applications. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our services. By accessing or using titeZMe, you agree to the terms of this Privacy Policy.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 2 — Information We Collect</h2>
              
              <h3 className="text-lg font-bold text-white mt-6 mb-3">2.1 Information you provide directly:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>Full name and profile photo</li>
                <li>Email address and password</li>
                <li>Phone number</li>
                <li>City, country and address (for barbers and barbershop owners)</li>
                <li>Professional information (for barbers): specialties, languages spoken, working hours, pricing</li>
                <li>Payment method preferences</li>
                <li>Communications you send us</li>
              </ul>

              <h3 className="text-lg font-bold text-white mt-6 mb-3">2.2 Information collected automatically:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>Device information (browser type, operating system, device identifiers)</li>
                <li>IP address and approximate location</li>
                <li>Pages visited and features used</li>
                <li>Booking history and interaction data</li>
                <li>Log data and crash reports</li>
              </ul>

              <h3 className="text-lg font-bold text-white mt-6 mb-3">2.3 Information from third parties:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>If you sign in via Google, we receive your name, email and profile photo from Google in accordance with their privacy policy</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 3 — How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-6">
                <li>Create and manage your account</li>
                <li>Connect clients with barbers and barbershops</li>
                <li>Process and manage bookings</li>
                <li>Send booking confirmations, reminders and notifications</li>
                <li>Improve and personalise our services</li>
                <li>Ensure platform safety and prevent fraud</li>
                <li>Comply with legal obligations</li>
                <li>Respond to your support requests</li>
                <li>Send service-related communications</li>
              </ul>
              <p className="font-bold text-brand-yellow">We do NOT sell your personal data to third parties. Ever.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 4 — How We Share Your Information</h2>
              
              <h3 className="text-lg font-bold text-white mt-6 mb-2">4.1 With other users:</h3>
              <p className="mb-4">When you make a booking, your first name and booking details are shared with the relevant barber or barbershop. Your full name, phone number and email are never publicly displayed.</p>

              <h3 className="text-lg font-bold text-white mt-6 mb-2">4.2 Barber public profiles:</h3>
              <p className="mb-4">Barbers choose what information to display publicly: name, photo, specialties, languages, pricing and availability. This information is visible to all visitors.</p>

              <h3 className="text-lg font-bold text-white mt-6 mb-2">4.3 Service providers:</h3>
              <p className="mb-2">We share data with trusted service providers who assist us in operating our platform, including:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
                <li>Firebase (Google) — database and authentication infrastructure</li>
                <li>Vercel — hosting and deployment</li>
                <li>Sentry — error monitoring</li>
              </ul>
              <p className="mb-4">These providers are contractually bound to protect your data.</p>

              <h3 className="text-lg font-bold text-white mt-6 mb-2">4.4 Legal requirements:</h3>
              <p>We may disclose your information if required by law, court order, or governmental authority.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 5 — Data Retention</h2>
              <p className="mb-4">We retain your personal data for as long as your account is active or as needed to provide our services.</p>
              <p className="mb-2">Upon account deletion:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
                <li>Your profile is permanently removed</li>
                <li>Booking history is anonymised (not deleted) for platform integrity</li>
                <li>You may request complete data deletion by contacting us at privacy@titezme.com</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 6 — Your Rights (GDPR)</h2>
              <p className="mb-2">If you are located in the European Economic Area, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with your local data protection authority</li>
              </ul>
              <p>To exercise these rights, contact us at: <a href="mailto:privacy@titezme.com" className="text-brand-yellow font-bold hover:underline">privacy@titezme.com</a><br/>We will respond within 30 days.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 7 — Cookies</h2>
              <p className="mb-2">We use essential cookies to:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Ensure platform security</li>
              </ul>
              <p>We do not use advertising or tracking cookies.<br/>You can control cookies through your browser settings.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 8 — Children&apos;s Privacy</h2>
              <p>titeZMe is not intended for users under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that a child under 16 has provided us with personal information, we will delete it immediately.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 9 — Security</h2>
              <p className="mb-2">We implement industry-standard security measures including:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Firebase security rules controlling data access</li>
                <li>Regular security audits</li>
                <li>Limited employee access to user data</li>
              </ul>
              <p>However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 10 — International Transfers</h2>
              <p>titeZMe operates globally. Your data may be transferred to and processed in countries outside your own, including the United States, where our service providers operate. We ensure appropriate safeguards are in place for such transfers in compliance with applicable law.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 11 — Changes to This Policy</h2>
              <p className="mb-2">We may update this Privacy Policy from time to time. We will notify you of significant changes by:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
                <li>Posting the new policy on this page</li>
                <li>Updating the &quot;Last updated&quot; date</li>
                <li>Sending an email notification for material changes</li>
              </ul>
              <p>Your continued use of titeZMe after changes constitutes acceptance of the updated policy.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-white mb-4">SECTION 12 — Contact Us</h2>
              <p className="mb-2">For any privacy-related questions or requests:</p>
              <p className="font-bold">
                titeZMe Privacy Team<br/>
                Email: <a href="mailto:privacy@titezme.com" className="text-brand-yellow hover:underline">privacy@titezme.com</a><br/>
                Response time: within 30 days
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
