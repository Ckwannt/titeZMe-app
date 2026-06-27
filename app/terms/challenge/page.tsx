'use client';

import { useChallengeConfig } from '@/hooks/useChallengeConfig';
import { useLang } from '@/lib/i18n/LangContext';

export default function ChallengeTermsPage() {
  const { data: config } = useChallengeConfig();
  const { lang } = useLang();

  const fmt = (ms: number) => ms
    ? new Date(ms).toLocaleDateString(
        lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-GB',
        { day: 'numeric', month: 'long', year: 'numeric' }
      )
    : '—';

  const fmtDate = (iso: string) => iso
    ? new Date(iso).toLocaleDateString(
        lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-GB',
        { day: 'numeric', month: 'long', year: 'numeric' }
      )
    : '—';

  return (
    <div className="bg-[#0A0A0A] text-[#F0EDE8] pt-24 min-h-screen font-sans border-t border-[#1a1a1a]">
      <section className="bg-[#111111] py-24 px-6 min-h-screen">
        <div className="max-w-[800px] mx-auto text-left">
          <div className="text-xs font-bold text-[#FFD600] uppercase tracking-widest mb-4">LEGAL</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">titeZMe Challenge — Official Rules &amp; Terms</h1>
          <p className="text-sm font-bold text-[#888580] mb-1">Last updated: June 2026</p>
          <p className="text-sm font-bold text-[#888580] mb-12">Effective date: 25 June 2026</p>

          <div className="text-[#888580] space-y-12 leading-relaxed">

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 1 — Organizer &amp; Scope</h2>
              <p className="mb-4">These Official Rules govern the &quot;titeZMe Challenge&quot; (the &quot;Challenge&quot;), a limited-edition promotional contest operated by:</p>
              <p className="mb-4">
                Ibrahim Mellouli<br/>
                NIE: Z3592657Q<br/>
                Cristo de la Victoria, 108, Madrid, Spain<br/>
                Contact: <a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline">support@titezme.com</a>
              </p>
              <p className="mb-4">Ibrahim Mellouli acts as the Organizer in a personal capacity until the formal incorporation of titeZMe (a Spanish startup currently in registration). Upon successful incorporation, titeZMe S.L. shall automatically succeed Ibrahim Mellouli as the entity bound by these Terms, and all rights, obligations, fees, and prize commitments shall transfer to titeZMe S.L. without any requirement of further consent from participants.</p>
              <p>By participating in the Challenge you agree to be bound by these Rules, by the titeZMe <a href="/terms" className="text-[#FFD600] hover:underline">Terms of Service</a>, and by the titeZMe <a href="/privacy" className="text-[#FFD600] hover:underline">Privacy Policy</a>. Where there is any conflict between general Terms of Service and these Challenge Rules, these Challenge Rules prevail for matters specifically related to the Challenge.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 2 — Eligibility</h2>
              <p className="mb-2">The Challenge is open to:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Individual barbers who hold a valid titeZMe account, are at least 18 years old, legally operating in Spain, and meet titeZMe&apos;s standard onboarding requirements.</li>
                <li>Barbershops registered on titeZMe with a valid titeZMe account, legally operating in Spain, with an authorized owner submitting on their behalf.</li>
              </ul>
              <p className="mb-4">A barber who also owns a registered barbershop on titeZMe may submit once as an individual barber AND once on behalf of their barbershop, paying both entry fees and treated as two independent entries.</p>
              <p className="mb-4">Employees, contractors, and immediate family members of the Organizer are not eligible to enter as participants but may vote.</p>
              <p className="mb-2">Voting is open to all titeZMe clients who:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Hold a valid titeZMe account, AND</li>
                <li>Have verified their email address.</li>
              </ul>
              <p>Each voter may cast a maximum of one (1) vote for an individual barber and one (1) vote for a barbershop.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 3 — Challenge Period</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">3.1 Submission window:</h3>
              <p className="mb-4">{fmt(config?.submissionsOpenAt ?? 0)} 00:00 (Madrid time) to {fmt(config?.submissionsCloseAt ?? 0)} 00:00 (Madrid time). Late submissions will be automatically rejected.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">3.2 Voting window:</h3>
              <p className="mb-4">{fmt(config?.submissionsCloseAt ?? 0)} 00:00 (Madrid time) until the official Challenge event on {fmtDate(config?.eventDate ?? '')}.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">3.3 Modifications:</h3>
              <p>The Organizer reserves the right to extend, shorten, suspend, or cancel the Challenge at any time if technical, legal, or operational reasons require it. In the event of cancellation prior to winner selection, paid entry fees will be refunded in full.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 4 — Entry Fees</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.1 Amounts:</h3>
              <p className="mb-2">Entry fees are payable as follows:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Individual barbers: {config?.feeBarber ?? 49}€</li>
                <li>Barbershops: {config?.feeShop ?? 99}€</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.2 Payment method:</h3>
              <p className="mb-4">Entry fees are paid by bank transfer (IBAN) to the Organizer&apos;s account. The exact payment reference will be displayed to the participant after submitting their proposal and must be used verbatim.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.3 Non-refundable:</h3>
              <p className="mb-4">Entry fees are NON-REFUNDABLE once the submission has been approved by the Organizer, except in the case of cancellation under Section 3.3.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.4 Unmatched payments:</h3>
              <p className="mb-4">In the event the Organizer cannot match a payment to a submission (incorrect reference, insufficient amount, etc.), the participant will be notified via in-app notification and given a reasonable opportunity to clarify or resubmit. If no valid payment is received within 7 days of notification, the submission will be removed.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">4.5 Use of fees:</h3>
              <p>Entry fees are used to cover Challenge operating costs and to fund a portion of the prize pool. Net surplus, if any, is retained by the Organizer.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 5 — How to Enter</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">5.1 Submission steps:</h3>
              <p className="mb-2">Each eligible participant must:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>(a) Log into their titeZMe account.</li>
                <li>(b) Navigate to the Challenge section of their dashboard.</li>
                <li>(c) Download the official reference photographs of the Organizer&apos;s hair, supplied for the proposal.</li>
                <li>
                  (d) Submit one (1) proposal, consisting of:
                  <ul className="list-disc pl-5 space-y-2 text-[#888580] mt-2">
                    <li>At least one (1) and no more than four (4) photographs of their proposed haircut design. Each photo may not exceed 1 MB.</li>
                    <li>Optionally, one (1) video of their work, maximum 30 seconds and maximum 10 MB.</li>
                    <li>Optionally, a written description (maximum 1000 characters) explaining their concept.</li>
                  </ul>
                </li>
                <li>(e) Tick the box confirming acceptance of these Rules.</li>
                <li>(f) Pay the applicable entry fee via the displayed payment instructions and confirm the payment within the platform.</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">5.2 Review:</h3>
              <p className="mb-4">Submissions are reviewed manually by the Organizer. The Organizer reserves the right, at its sole discretion, to reject submissions that are incomplete, contain inappropriate content (defined in Section 6), violate intellectual property rights, or fail to comply with these Rules. Rejected participants may resubmit within the submission window if the rejection reason allows.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">5.3 Approval:</h3>
              <p>Only proposals approved by the Organizer will become eligible for voting and visible in the public Challenge gallery.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 6 — Content Restrictions</h2>
              <p className="mb-2">Submissions must not contain:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Sexual, nude, or sexually suggestive content.</li>
                <li>Violent, graphic, or shocking content.</li>
                <li>Discriminatory, hateful, or harassing content targeting any individual or group.</li>
                <li>Content that infringes third-party intellectual property, trademark, or publicity rights.</li>
                <li>Identifiable images of third parties without their documented consent.</li>
                <li>Content depicting minors.</li>
                <li>Promotional material for competing businesses or unrelated commercial activity.</li>
              </ul>
              <p>The Organizer reserves the right to reject and permanently remove any submission that violates these restrictions, in which case the entry fee is non-refundable.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 7 — Voting</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.1 One vote per category:</h3>
              <p className="mb-4">Voting is one vote per registered, email-verified client account per category (one for an individual barber, one for a barbershop).</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.2 Vote manipulation:</h3>
              <p className="mb-4">Vote manipulation, including but not limited to: creation of multiple accounts, coordinated voting through bots, paid voting services, vote trading, or any artificial inflation of votes, will result in immediate disqualification of the affected submission. Entry fees forfeited under this clause are non-refundable.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.3 Monitoring:</h3>
              <p className="mb-4">The Organizer monitors voting activity and reserves the right, at its sole discretion and without notice, to invalidate votes determined to be fraudulent, void any submission found to have benefited from such activity, and select alternative winners.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">7.4 Tie-break:</h3>
              <p>In the event of a tie in vote count, the earlier submission timestamp (first to submit) wins the position.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 8 — Prizes</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">8.1 Prize structure:</h3>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Top 10 barbershops by vote count receive five (5) years of complimentary titeZMe subscription, equivalent to a displayed marketing value of approximately {(config?.prizeShopValue ?? 100000).toLocaleString()}€ (calculated from the current platform subscription rate of €1,723.65/month including IVA).</li>
                <li>Top 10 individual barbers by vote count receive five (5) years of complimentary titeZMe subscription, equivalent to a displayed marketing value of approximately {(config?.prizeBarberValue ?? 15000).toLocaleString()}€ (calculated from the current platform subscription rate of €69/month including IVA).</li>
                <li>The single top-ranked barber and the single top-ranked barbershop (subject to public selection at the Challenge event) receive an additional honor of cutting the Organizer&apos;s hair at the public Challenge event on {fmtDate(config?.eventDate ?? '')}.</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">8.2 Nature of the prize:</h3>
              <p className="mb-4">The prize is the complimentary titeZMe subscription itself. The euro values shown above are presented for informational and marketing purposes only and represent the equivalent market price of the subscription period. The prize is NOT delivered as cash. No cash equivalent or alternative is available.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">8.3 Non-transferable:</h3>
              <p className="mb-4">Prizes are non-transferable. The prize is granted to the account and identity that submitted the winning proposal.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">8.4 Unclaimed prizes:</h3>
              <p className="mb-4">If a winner cannot be reached, fails to claim, or is disqualified within 14 days of being notified, the Organizer may, at its sole discretion, award the prize to the next ranked participant.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">8.5 Taxes:</h3>
              <p>Tax obligations, if any, arising from receipt of a prize are the sole responsibility of the winner.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 9 — Public Event</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">9.1 Event date:</h3>
              <p className="mb-4">The Challenge culminates in a public event scheduled for {fmtDate(config?.eventDate ?? '')} in Madrid, Spain. The event date, location, and final logistics will be communicated to winners and published on titezme.com no later than 30 days before the event.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">9.2 Attendance:</h3>
              <p className="mb-4">Attendance of winners at the public event is encouraged but not required to claim the subscription prize. The &quot;haircut at the event&quot; honor (Section 8.1) requires physical presence and is not redeemable remotely.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">9.3 Media consent:</h3>
              <p>By participating, winners consent to being photographed, filmed, and identified at the public event for promotional purposes by the Organizer and titeZMe, without additional consent or compensation.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 10 — Intellectual Property &amp; License</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">10.1 Ownership:</h3>
              <p className="mb-4">Participants retain ownership of the photographs, videos, and descriptions they submit (&quot;Submission Content&quot;).</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">10.2 License grant:</h3>
              <p className="mb-2">By submitting, each participant grants titeZMe and the Organizer a worldwide, royalty-free, non-exclusive, perpetual, irrevocable license to:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>(a) Reproduce, display, distribute, and publicly communicate the Submission Content on titezme.com, the titeZMe mobile applications, the titeZMe social media channels, and any titeZMe marketing material (including but not limited to advertising on TikTok, Instagram, Facebook, and similar platforms).</li>
                <li>(b) Use the Submission Content to promote the Challenge, current and future editions, the Organizer, and titeZMe generally.</li>
                <li>(c) Use the participant&apos;s name, profile photo, business name, and city in connection with such display and promotion.</li>
              </ul>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">10.3 Warranties:</h3>
              <p className="mb-4">Participants warrant that they own or have valid rights to all Submission Content and that the Submission Content does not infringe any third-party rights.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">10.4 Indemnity:</h3>
              <p>Each participant agrees to indemnify and hold harmless the Organizer and titeZMe against any claim, loss, or damage arising from breach of the warranties in Section 10.3.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 11 — Personal Data</h2>
              <p className="mb-4">The collection and processing of personal data in connection with the Challenge is governed by the titeZMe <a href="/privacy" className="text-[#FFD600] hover:underline">Privacy Policy</a> and by the European General Data Protection Regulation (GDPR). Participants have the rights described in our Privacy Policy, including the rights of access, rectification, erasure, and objection.</p>
              <p className="mb-2">For the purposes of the Challenge specifically, the Organizer processes the following categories of data:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#888580] mb-4">
                <li>Account identifiers (uid, email).</li>
                <li>Submission content (photos, video, description).</li>
                <li>Payment declarations (declared amount, declared reference).</li>
                <li>Voting records (which submissions a voter has voted for).</li>
              </ul>
              <p className="mb-4">This data is retained for the duration of the Challenge and for a reasonable period thereafter for legal, accounting, and historical record purposes.</p>
              <p>For data-related requests, contact: <a href="mailto:privacy@titezme.com" className="text-[#FFD600] hover:underline">privacy@titezme.com</a>.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 12 — Limitation of Liability (Challenge-specific)</h2>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">12.1 Prize delivery commitment:</h3>
              <p className="mb-4">Notwithstanding any limitation of liability set out in the general titeZMe Terms of Service (Section 9 thereof), the Organizer&apos;s commitment to deliver an approved prize to a verified winner is binding and shall not be subject to the general per-user liability cap.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">12.2 Other claims:</h3>
              <p className="mb-4">Outside of the prize-delivery commitment, the Organizer&apos;s liability for any other claim arising from the Challenge is limited to the amount of the entry fee paid by the affected participant.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">12.3 Technical failures:</h3>
              <p className="mb-4">The Organizer is not liable for technical failures, third-party platform issues (including but not limited to outages of Firebase, Algolia, Bizum, or banking infrastructure), internet connectivity problems, or any cause beyond the Organizer&apos;s reasonable control that affects participation or voting.</p>

              <h3 className="text-lg font-bold text-[#F0EDE8] mt-6 mb-2">12.4 Mandatory law:</h3>
              <p>Nothing in these Rules excludes or limits liability that cannot lawfully be excluded under Spanish law, including liability for fraud or wilful misconduct.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 13 — Governing Law &amp; Disputes</h2>
              <p className="mb-4">These Rules are governed by the laws of Spain. Any dispute arising out of or in connection with the Challenge shall be subject to the exclusive jurisdiction of the courts of Madrid, Spain, except where mandatory consumer protection laws provide otherwise.</p>
              <p>Before initiating any legal proceedings, participants are encouraged to contact the Organizer at <a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline">support@titezme.com</a> so a good-faith resolution can be attempted.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 14 — Acceptance</h2>
              <p className="mb-4">By submitting a proposal to the titeZMe Challenge and ticking the acceptance checkbox during submission, each participant confirms that they have read, understood, and agreed to be bound by these Official Rules in their entirety. The timestamp of acceptance is recorded as part of the submission.</p>
              <p>If you do not accept these Rules, do not submit a proposal.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#F0EDE8] mb-4">SECTION 15 — Contact</h2>
              <p className="mb-2">For any questions about the Challenge:</p>
              <p className="font-bold">
                Email: <a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline">support@titezme.com</a><br/>
                Mail: Ibrahim Mellouli — titeZMe Challenge<br/>
                Cristo de la Victoria, 108<br/>
                Madrid, Spain
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
