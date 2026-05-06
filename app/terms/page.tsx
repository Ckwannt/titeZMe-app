'use client';

export default function TermsPage() {
  return (
    <div className="bg-[#0A0A0A] text-[#F0EDE8] pt-24 min-h-screen font-sans border-t border-[#1a1a1a]">
      <section className="bg-[#111111] py-24 px-6 min-h-screen">
        <div className="max-w-[800px] mx-auto text-left">
          <div className="text-xs font-bold text-[#FFD600] uppercase tracking-widest mb-4">LEGAL</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Terms of Service</h1>
          <p className="text-sm font-bold text-[#888580] mb-1">Last updated: May 2026</p>
          <p className="text-sm font-bold text-[#888580] mb-12">Effective date: May 2026</p>

          <div className="text-[#888580] space-y-12 leading-relaxed">
            
            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 1 — Acceptance of Terms</h2>
              <p className="mb-4">By accessing or using titeZMe (&quot;Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use our Platform.</p>
              <p>These Terms apply to all users including clients, barbers, and barbershop owners.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 2 — Description of Service</h2>
              <p className="mb-4">titeZMe is an online marketplace that connects clients with barbers and barbershops. We provide the technology platform only. titeZMe is not a barbering service provider and does not employ barbers.</p>
              <p>Barbers and barbershops are independent professionals who use our platform to manage their bookings. titeZMe is not responsible for the quality of barbering services provided.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 3 — User Accounts</h2>
              
              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">3.1 Eligibility:</h3>
              <p className="mb-4">You must be at least 16 years old to create an account. By creating an account you confirm you meet this requirement.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">3.2 Account responsibility:</h3>
              <p className="mb-2">You are responsible for:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Maintaining the confidentiality of your password</li>
                <li>All activity that occurs under your account</li>
                <li>Providing accurate and truthful information</li>
                <li>Keeping your contact information up to date</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">3.3 One account per person:</h3>
              <p>Each person may only maintain one account per role (client or barber). Creating multiple accounts to circumvent platform rules is prohibited and may result in permanent suspension.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 4 — Booking Rules</h2>
              
              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.1 For clients:</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Bookings are confirmed only when the barber accepts the request</li>
                <li>You may cancel a booking up to 2 hours before the appointment without penalty</li>
                <li>Repeated no-shows may result in account restrictions</li>
                <li>Payment is made directly to the barber in cash at the time of service</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.2 For barbers:</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>You must honour all confirmed bookings</li>
                <li>Cancellations must be made as early as possible with notification to the client</li>
                <li>You are responsible for the accuracy of your availability, pricing and service information</li>
                <li>titeZMe reserves the right to remove barbers with consistently poor completion rates</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.3 Disputes:</h3>
              <p>titeZMe is not responsible for resolving disputes between clients and barbers. We encourage both parties to resolve issues directly and professionally.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 5 — Prohibited Conduct</h2>
              <p className="mb-2">You agree NOT to:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Provide false or misleading information</li>
                <li>Impersonate another person or entity</li>
                <li>Use the platform for any unlawful purpose</li>
                <li>Attempt to circumvent our booking system or contact clients/barbers outside the platform to avoid fees</li>
                <li>Post offensive, discriminatory or inappropriate content</li>
                <li>Spam or send unsolicited messages</li>
                <li>Attempt to hack, disrupt or damage our platform</li>
                <li>Scrape or extract data from our platform without permission</li>
              </ul>
              <p className="font-bold">Violation of these rules may result in immediate account suspension without refund.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 6 — Content and Reviews</h2>
              
              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">6.1 Your content:</h3>
              <p className="mb-4">By posting content (photos, reviews, descriptions) on titeZMe, you grant us a non-exclusive, worldwide, royalty-free licence to use, display and distribute that content on our platform.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">6.2 Reviews:</h3>
              <p className="mb-4">Reviews must be honest and based on genuine experiences. We reserve the right to remove reviews that violate our guidelines or appear fraudulent.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">6.3 Prohibited content:</h3>
              <p className="mb-2">You may not post content that is:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>Defamatory, abusive or harassing</li>
                <li>Discriminatory based on race, religion, gender, sexuality or any protected characteristic</li>
                <li>Sexually explicit or violent</li>
                <li>Infringing on third party rights</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 7 — Platform Fees</h2>
              
              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.1 Beta period:</h3>
              <p className="mb-4">titeZMe is currently in beta. During this period, the platform is free for all users including barbers and barbershop owners.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.2 Future fees:</h3>
              <p className="mb-4">We reserve the right to introduce fees in the future. We will provide at least 30 days notice before any fees take effect.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.3 Payment:</h3>
              <p>All payments for barbering services are made directly between clients and barbers. titeZMe does not currently process payments.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 8 — Intellectual Property</h2>
              <p className="mb-4">All intellectual property on titeZMe including our name, logo, wordmark, design system and codebase is owned by titeZMe and protected by applicable intellectual property laws.</p>
              <p>You may not use our branding without prior written permission.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 9 — Limitation of Liability</h2>
              <p className="mb-2">To the maximum extent permitted by law:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>titeZMe is provided &quot;as is&quot; without warranties of any kind</li>
                <li>We are not liable for any indirect, incidental or consequential damages</li>
                <li>We are not responsible for the actions or services of barbers or barbershops on our platform</li>
                <li>Our total liability to you for any claim shall not exceed €100</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 10 — Governing Law</h2>
              <p>These Terms are governed by the laws of Spain. Any disputes shall be subject to the exclusive jurisdiction of the courts of Madrid, Spain, unless mandatory consumer protection laws in your country provide otherwise.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 11 — Changes to Terms</h2>
              <p>We may modify these Terms at any time. We will notify you of material changes by email or platform notification. Your continued use after notification constitutes acceptance of the new Terms.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 12 — Contact</h2>
              <p className="mb-2">For questions about these Terms:</p>
              <p className="font-bold">
                titeZMe Legal Team<br/>
                Email: <a href="mailto:legal@titezme.com" className="text-[#FFD600] hover:underline">legal@titezme.com</a><br/>
                Response time: within 30 days
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
