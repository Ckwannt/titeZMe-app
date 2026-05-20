'use client';

export default function TermsPage() {
  return (
    <div className="bg-[#0A0A0A] text-[#F0EDE8] pt-24 min-h-screen font-sans border-t border-[#1a1a1a]">
      <section className="bg-[#111111] py-24 px-6 min-h-screen">
        <div className="max-w-[800px] mx-auto text-left">
          <div className="text-xs font-bold text-[#FFD600] uppercase tracking-widest mb-4">LEGAL</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Terms of Service</h1>
          <p className="text-sm font-bold text-[#888580] mb-12">Last updated: May 2026</p>

          <div className="text-[#888580] space-y-12 leading-relaxed">

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">ACCEPTANCE OF TERMS</h2>
              <p className="mb-4">By accessing or using titeZMe (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), operated by Ibrahim MELLOULI, you (&quot;User&quot;, &quot;Client&quot;, &quot;Barber&quot;) agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the Platform.</p>
              <p>These Terms apply to all users worldwide regardless of location.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">1. THE PLATFORM</h2>
              <p className="mb-4">1.1 titeZMe is an online marketplace that connects clients with independent barbers and barbershops. We facilitate bookings but are NOT a party to the service agreement between clients and barbers.</p>
              <p className="mb-4">1.2 titeZMe is not a barbershop, not an employer of barbers, and not responsible for the quality of haircuts or grooming services provided by barbers or shops listed on the Platform.</p>
              <p>1.3 Barbers and barbershops listed on titeZMe are independent service providers, not employees or agents of titeZMe.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">2. ELIGIBILITY</h2>
              <p className="mb-4">2.1 You must be at least 16 years old to create an account and use the Platform.</p>
              <p className="mb-4">2.2 Users between 16 and 18 years old confirm they have parental or guardian consent to use the Platform.</p>
              <p className="mb-4">2.3 By creating an account, you represent and warrant that all information you provide is accurate, complete, and current.</p>
              <p>2.4 titeZMe reserves the right to refuse service to anyone for any reason at any time, particularly where accounts are found to be fraudulent, abusive, or in violation of these Terms.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">3. ACCOUNTS</h2>
              <p className="mb-4">3.1 You are responsible for maintaining the confidentiality of your account credentials. You are fully responsible for all activity that occurs under your account.</p>
              <p className="mb-4">3.2 You must notify us immediately at <a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline">support@titezme.com</a> if you suspect unauthorized access to your account.</p>
              <p className="mb-4">3.3 titeZMe reserves the right to suspend or terminate accounts that violate these Terms without prior notice.</p>
              <p>3.4 You may not create multiple accounts to circumvent suspensions, bans, booking limits, or any other Platform restrictions.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">4. BOOKINGS AND CANCELLATIONS</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.1 Booking Process</h3>
              <p className="mb-4">Clients may book barbers directly through the Platform. A booking is confirmed only when the barber explicitly accepts the request. Pending bookings are not guaranteed.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.2 Booking Limits</h3>
              <p className="mb-4">To maintain Platform integrity and fairness, users are limited to a maximum of 2 appointments per day across all barbers and shops. Users may not book the same barber more than once per day. Overlapping appointments are not permitted.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.3 Payment</h3>
              <p className="mb-4">All services are currently paid in cash directly to the barber or barbershop at the time of service. titeZMe does not currently process payments. Future payment processing features will be subject to additional terms.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.4 Cancellations by Client</h3>
              <p className="mb-4">Clients may cancel bookings through their dashboard. Repeated no-shows or last-minute cancellations may result in account restrictions or permanent suspension.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.5 Cancellations by Barber</h3>
              <p className="mb-4">Barbers and shops may cancel bookings. titeZMe is not liable for any inconvenience, loss, or damages resulting from barber-initiated cancellations.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.6 No-Shows</h3>
              <p className="mb-4">Clients who repeatedly fail to attend confirmed bookings (&quot;no-shows&quot;) may be suspended from the Platform. Barbers who mark excessive fraudulent completions may also be suspended pending investigation.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.7 Service Completion</h3>
              <p>A booking is considered complete when the barber marks it as complete AND the client confirms receipt of the service, OR automatically after 2 hours of the barber marking completion with no client dispute.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">5. BARBER AND SHOP OBLIGATIONS</h2>
              <p className="mb-4">5.1 Barbers and shops must provide accurate information about their services, prices, availability, and location.</p>
              <p className="mb-4">5.2 Barbers and shops must maintain appropriate professional standards, hygiene, and comply with all applicable local laws and regulations governing grooming services in their jurisdiction.</p>
              <p className="mb-4">5.3 Barbers must be properly licensed or certified as required by the laws of their operating jurisdiction. titeZMe does not verify professional licenses and bears no liability for unlicensed service providers.</p>
              <p className="mb-4">5.4 All barbers and shops must receive approval from titeZMe administration before appearing live on the Platform. titeZMe reserves the right to reject or remove any barber or shop profile at its sole discretion.</p>
              <p>5.5 Barbers and shops may not use the Platform to redirect clients to external booking systems or competing platforms.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">6. REVIEWS AND RATINGS</h2>
              <p className="mb-4">6.1 Reviews may only be submitted by clients who have completed a verified booking through the Platform.</p>
              <p className="mb-4">6.2 Reviews must be honest, accurate, and based on genuine experience. Fake reviews, incentivized reviews, or reviews posted by barbers for their own profiles are strictly prohibited and may result in permanent suspension.</p>
              <p className="mb-4">6.3 titeZMe reserves the right to remove any review that violates these Terms, contains offensive content, or is determined to be fraudulent, without prior notice or obligation to explain.</p>
              <p>6.4 titeZMe is not liable for any damages arising from reviews posted on the Platform.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">7. PROHIBITED CONDUCT</h2>
              <p className="mb-4">Users may not:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>(a) Use the Platform for any unlawful purpose or in violation of any applicable laws</li>
                <li>(b) Harass, abuse, threaten, or discriminate against any user, barber, or staff member</li>
                <li>(c) Post false, misleading, or fraudulent information</li>
                <li>(d) Manipulate reviews, ratings, or booking counts</li>
                <li>(e) Attempt to access unauthorized areas of the Platform</li>
                <li>(f) Use automated scripts, bots, or scrapers on the Platform</li>
                <li>(g) Circumvent any booking limits, restrictions, or security measures</li>
                <li>(h) Collect or harvest user data without express permission</li>
                <li>(i) Use the Platform for commercial purposes not expressly permitted by titeZMe</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">8. INTELLECTUAL PROPERTY</h2>
              <p className="mb-4">8.1 All content on the Platform including but not limited to logos, wordmarks, design, code, text, graphics, and the titeZMe name are the exclusive property of titeZMe and Ibrahim MELLOULI.</p>
              <p className="mb-4">8.2 Users may not reproduce, distribute, modify, or create derivative works from any Platform content without express written permission.</p>
              <p>8.3 By submitting content to the Platform (including photos, bios, service descriptions, and reviews), users grant titeZMe a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content for Platform purposes.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">9. LIMITATION OF LIABILITY</h2>
              <p className="mb-4">9.1 TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, TITEZME, ITS OPERATORS, AND AFFILIATES SHALL NOT BE LIABLE FOR:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>(a) Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>(b) Loss of profits, data, or goodwill</li>
                <li>(c) The quality, safety, or legality of services provided by barbers or shops</li>
                <li>(d) Any injury, harm, or dissatisfaction resulting from a haircut or grooming service</li>
                <li>(e) Barber cancellations, no-shows, or failure to provide services</li>
                <li>(f) Unauthorized access to your account</li>
              </ul>
              <p>9.2 In jurisdictions that do not allow limitation of liability, our liability is limited to the maximum extent permitted by law.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">10. INDEMNIFICATION</h2>
              <p className="mb-4">You agree to indemnify, defend, and hold harmless titeZMe, Ibrahim MELLOULI, and any affiliated parties from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>(a) Your use of the Platform</li>
                <li>(b) Your violation of these Terms</li>
                <li>(c) Your violation of any third-party rights</li>
                <li>(d) Any dispute between you and another user or barber</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">11. DISPUTE RESOLUTION</h2>
              <p className="mb-4">11.1 We encourage users to contact us first at <a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline">support@titezme.com</a> to resolve any disputes informally.</p>
              <p className="mb-4">11.2 For users in the European Union: You may also use the EU Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#FFD600] hover:underline">ec.europa.eu/consumers/odr</a></p>
              <p>11.3 Nothing in these Terms limits your statutory rights as a consumer under the laws of your country of residence.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">12. GOVERNING LAW</h2>
              <p>These Terms are governed by the laws of Spain. However, nothing in this clause deprives you of the mandatory consumer protection laws of your country of residence.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">13. CHANGES TO TERMS</h2>
              <p>titeZMe reserves the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the Platform after changes constitutes acceptance of the new Terms.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">14. CONTACT</h2>
              <p className="mb-2">For questions about these Terms:</p>
              <p className="font-bold">
                Email: <a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline">support@titezme.com</a><br/>
                Platform: titezme.com
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
