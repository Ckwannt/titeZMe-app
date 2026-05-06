'use client';

export default function CookiesPage() {
  return (
    <div className="bg-[#0A0A0A] text-[#F0EDE8] pt-24 min-h-screen font-sans border-t border-[#1E1E1E]">
      <section className="bg-[#111111] py-24 px-6 min-h-screen">
        <div className="max-w-[800px] mx-auto text-left">
          <div className="text-xs font-bold text-[#FFD600] uppercase tracking-widest mb-4">LEGAL</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Cookie Policy</h1>
          <p className="text-sm font-bold text-[#888580] mb-1">Last updated: May 2026</p>
          <p className="text-sm font-bold text-[#888580] mb-12">Effective date: May 2026</p>

          <div className="text-[#888580] space-y-12 leading-relaxed">
            
            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 1 — Introduction</h2>
              <p>titeZMe (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) uses cookies and similar tracking technologies to track the activity on our Platform and store certain information. This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 2 — What Are Cookies?</h2>
              <p>Cookies are small files placed on your computer or mobile device by a website. They hold a modest amount of data specific to you and the website, enabling the website to &quot;remember&quot; your actions or preferences over time.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 3 — Types of Cookies We Use</h2>
              
              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">3.1 Essential Cookies</h3>
              <p className="mb-2">These are necessary for the website to function properly. They cannot be disabled in our systems. They are usually set in response to actions made by you, such as logging in or filling in forms.</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Firebase authentication tokens</li>
                <li>Session state management</li>
                <li>Security and fraud prevention markers</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">3.2 Preferences Cookies</h3>
              <p className="mb-2">These enable the website to provide enhanced functionality and personalization. If you do not allow these cookies, some services may not function optimally.</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Language settings</li>
                <li>Selected city or region</li>
                <li>Theme preferences</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">3.3 Analytics Cookies</h3>
              <p className="mb-2">These allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580]">
                <li>Google Analytics (anonymized usage tracking)</li>
                <li>Page load time measurement</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 4 — Your Choices</h2>
              <p className="mb-4">You have the right to decide whether to accept or reject non-essential cookies. You can set or amend your web browser controls to accept or refuse cookies, or use our Cookie Preference Center.</p>
              <p>If you choose to reject cookies, you may still use our website though your access to some functionality and areas may be restricted.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 5 — Changes to this Cookie Policy</h2>
              <p>We may update this Cookie Policy from time to time. The updated version will be indicated by an updated &quot;Last updated&quot; date. We encourage you to review this Cookie Policy frequently to be informed of how we are using cookies.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 6 — Contact Us</h2>
              <p className="mb-2">If you have any questions about our use of cookies or other technologies, please email us at:</p>
              <p className="font-bold">
                titeZMe Privacy Team<br/>
                Email: <a href="mailto:privacy@titezme.com" className="text-[#FFD600] hover:underline">privacy@titezme.com</a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
