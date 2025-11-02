import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
  Fade,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material'
import ActiveHeader from '../layout/ActiveHeader'
import StepRail from '../layout/StepRail'
import DescriptionIcon from '@mui/icons-material/Description'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function SignAgreement({ state, onLogout, navigateTo }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [scrolled, setScrolled] = useState(false)
  const [ack, setAck] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRef = useRef(null)

  // ---- date from your document ----
  const agreementDate = '18-Oct-2025'

  // Auto-enable if there's nothing to scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const noScrollNeeded = el.scrollHeight <= el.clientHeight + 1
    if (noScrollNeeded) {
      setScrolled(true)
      setScrollProgress(100)
    }
  }, [])

  // Re-check on resize
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onResize = () => {
      const noScrollNeeded = el.scrollHeight <= el.clientHeight + 1
      if (noScrollNeeded) {
        setScrolled(true)
        setScrollProgress(100)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleScroll = (e) => {
    const el = e.currentTarget
    const scrollTop = el.scrollTop
    const scrollHeight = el.scrollHeight - el.clientHeight
    const progress = Math.min(100, (scrollTop / scrollHeight) * 100)
    setScrollProgress(progress)

    const atBottom = scrollTop + el.clientHeight >= el.scrollHeight - 20
    if (atBottom) setScrolled(true)
  }

  const canProceed = scrolled && ack

  // ========= Your agreement content, split into cards (UI unchanged) =========
  const agreementSections = [
    {
      title: 'Parties & Registrations',
      content: `GROWSIN (Operating under the name of Mr. Murali Krishna Sivvala)
SEBI Registered Investment Adviser (Individual) — INA000012345
SEBI Registered Research Analyst (Individual) — INH000067890

Office: 203, Skylark Business Hub, Near Hitech Metro Station, Madhapur, Hyderabad, Telangana, India – 500081
Email: contact@growsin.in • Website: www.growsin.in • Phone: +91-98765-43210

This Investment Advisory Services Agreement (“Agreement”) is made on ${agreementDate} BETWEEN:
(1) GROWSIN, the “INVESTMENT ADVISER”; and
(2) ${state?.userData?.name || 'Client'} (“CLIENT”).`
    },
    {
      title: 'Risk Profiling Snapshot',
      content: `Client name: ${state?.userData?.name || '—'}   •   PAN: ${state?.userData?.kyc?.pan || '—'}
Risk type: ${state?.userData?.riskProfile || '—'}   •   Risk score: ${state?.userData?.riskScore ?? '—'}

Questionnaire fields included (illustrative):
• What is your age?
• What is your income per year?
• Pick one outcome from your investment after 1 year.
• What percent of your monthly income will you invest?
• What percent of your monthly income services loans/liabilities?
• Investments currently held (multi-select)
• What is your investment objective?`
    },
    {
      title: 'Suitability Assessment (SEBI-compliant)',
      content: `As per SEBI (Investment Advisers) Regulations, 2013, the Investment Adviser will:
• Ensure investments advised are appropriate to the client’s risk profile.
• Maintain documented product selection process aligned to objectives & financials.
• Understand nature/risks of products/assets recommended.
• Recommend options only where: (a) they meet objectives, (b) client can bear risks, and (c) client has requisite knowledge/experience.

Process:
• Risk profiling & risk assessment for every client.
• Offer services suitable to the client’s risk tolerance and requirements.
• Clients subscribe after evaluating features, risk, scope, strategy, T&Cs, and policies.

Investor Categories:
• Conservative (Low risk) — Products offered: NIL.
• Moderate (Medium risk) — Products offered: NIL.
• Aggressive (High risk) — Products offered: NIL.

Basis risk tolerance and horizon, clients are categorized as Conservative, Moderate, Aggressive. Advice is provided only in line with category suitability.`
    },
    {
      title: 'Appointment & Client Consents',
      content: `1) Appointment: Client appoints the Investment Adviser under Reg. 19(1)(d) of SEBI (IA) Regulations, 2013.
2) Client Consents:
• I/We have read and understood the terms & fee mechanism.
• On request, I/We interacted with persons associated with investment advice.
• I/We consent to fetch/validate/update KYC from CKYCR/KRA portals.`
    },
    {
      title: 'Declarations by the Investment Adviser',
      content: `• No advice/fee until this Agreement is executed.
• Adviser does not manage funds/securities; may only receive fee toward advisory.
• No assurance/guarantee/targets/accuracy claims or risk-free impressions will be made.`
    },
    {
      title: 'Fees — Regulatory Basis & Modes',
      content: `Regulatory basis: SEBI (IA) Regulations 2013, Clause 15A; SEBI circulars:
• SEBI/HO/IMD/DF1/CIR/P/2020/182 (23-Sep-2020)
• SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2025/003 (Jan-2025)

Payment must be traceable (NEFT/RTGS/IMPS/UPI/DD/cheque). No cash. Adviser receives consideration only from client for advised products. Detailed fee schedule: Annexure B.`
    },
    {
      title: 'Most Important Terms & Scope of Service',
      content: `• Adviser cannot execute trades without explicit, positive consent for every trade.
• Services may include: goal articulation, risk profiling, IPS creation, recommendations/implementation assistance across equity, mutual funds, insurance, commodities and other financial assets, other planning areas as needed.`
    },
    {
      title: 'Duties, Compliance & Records',
      content: `• Non-binding advisory; final investment decisions rest with Client.
• Fiduciary capacity; act bona fide in Client’s interest.
• Continuous compliance with SEBI IA Regulations; maintain eligibility, audits, and code of conduct.
• Maintain client KYC, advice, risk & suitability records, books, dated advice register; provide reports if requested.`
    },
    {
      title: 'Investment Objectives, Guidelines & Tax',
      content: `• Advice across equity, mutual funds, insurance, commodities and other financial assets.
• Recommend direct implementation where applicable (e.g., direct plans/codes).
• Advice based on risk profile, budgeted amount, and deployment timeline.
• Communicate applicable tax aspects, including on advisory fee.`
    },
    {
      title: 'Risk Factors (Highlights)',
      content: `• Market risks—no assurance objectives will be achieved; past performance is not indicative.
• Risks from policies, rates, liquidity/settlement, corporate performance, macro factors.
• Equity risks (company/sector/macro); Debt risks (default/liquidity/interest rate).`
    },
    {
      title: 'Validity, Amendments & Termination',
      content: `• Agreement effective from signing date; continues until terminated with 30 days’ notice by either party; subject to SEBI actions (suspension/cancellation).
• Amendments only by mutual written instrument.
• On termination: rights/obligations survive for prior transactions. Refunds: proportionate (if IA terminates) or after retaining up to one-quarter as breakage (if client terminates). Transition support on request.`
    },
    {
      title: 'Conflicts, Related Parties & Other Activities',
      content: `• IA operates at arm’s length from other activities; will disclose conflicts when they arise.
• No distribution to advisory clients and no advisory to distribution clients (arms-length maintained).`
    },
    {
      title: 'No POA, Confidentiality & Liability',
      content: `• IA will not seek any Power of Attorney for implementation.
• Client data confidentiality maintained except where law compels disclosure.
• IA not liable for market-driven losses or performance fluctuations.`
    },
    {
      title: 'Representations & Qualifications',
      content: `• IA registered with SEBI; maintains qualifications/certifications of adviser/principal officer/PAIA throughout service validity.`
    },
    {
      title: 'Death/Disability, Dispute Resolution & ODR',
      content: `• Authority continues until IA receives actual notice of death/incapacity; representatives must engage IA to continue service.
• Arbitration as per Arbitration and Conciliation Act, 1996; Seat: Mumbai; Language: English.
• Parties agree to Online Dispute Resolution (ODR) per SEBI circular dated 31-Jul-2023 via Smart ODR portal.`
    },
    {
      title: 'Grievances & Timelines',
      content: `• IA will resolve grievances within SEBI-specified timelines.
• Escalation path includes SEBI SCORES and Smart ODR if needed.`
    },
    {
      title: 'Force Majeure & Miscellaneous',
      content: `• IA not liable for delays/errors beyond control (acts of God, war, riots, power/comm failures, etc.).
• Parties will execute further actions/agreements necessary to effectuate this Agreement.`
    },
    {
      title: 'Standard Warning & Disclaimer',
      content: `“Investment in securities market are subject to market risks. Read all the related documents carefully before investing.”

Registration by SEBI, IAASB enlistment, and NISM certification do not guarantee performance or returns.`
    },
    {
      title: 'Annexure A — Disclosures (Summary)',
      content: `• History & Business: Registered as IA on 06-Dec-2024; provides advisory services; aligns advice to client goals, risk, and asset allocation; periodic reviews.
• T&C: As per this Agreement.
• Disciplinary History: No SEBI penalties/directions; no material litigations/inspections resulting in action.
• Affiliations: No affiliations with other SEBI intermediaries.
• Adviser’s Own Holdings: May hold advised securities; disclosed at time of advice.
• Conflicts: None material; disclosed if/when they arise.
• Material Facts: Clients should review product features, track record, warnings & disclaimers (see issuer/SEBI/NSE sites).
• Non-SEBI Products: No SEBI recourse for such products/services.
• Use of AI: IA uses Artificial Intelligence tools in providing investment advice/research.`
    },
    {
      title: 'Annexure B — Fees (Fixed Fee Mode)',
      content: `Mode: FIXED FEE • Payment mode: PAYMENT GATEWAY
Schedule:
• Product: Comprehensive Planning — Fee: ₹34,999 — Tenure: One time

Advance: Up to 1 month advance (as shared).
Evidence: INVOICE
Billing periodicity: As per schedule.

Notes (SEBI/IAASB limits for individuals/HUFs):
• Fixed-fee cap: ₹1,51,000 per family p.a.; AUA mode cap: 2.5% of AUA p.a. per family.
• Higher of the mode caps applies if fee mode changes with consent.
• Limits exclude statutory charges; not applicable to non-individual/accredited investors.`
    },
    {
      title: 'Annexure C — Terms & Client Rights/Responsibilities (Key Points)',
      content: `• IA accepts only advisory fees; never client funds/securities.
• No assured/guaranteed/fixed returns schemes (prohibited).
• SEBI-scope vs non-SEBI products clarified; no SEBI recourse for non-SEBI products.
• IA cannot execute trades without explicit per-trade consent.
• Fees may be paid in advance up to two quarters; proportionate refunds on premature termination; IA may retain up to one-quarter as breakage (per SEBI).
• Only traceable bank channels/UPI; cash not permitted.
• Client must share financial details; IA performs ongoing risk profiling/suitability; advises direct plans where applicable; promptly discloses conflicts.
• Grievances: IA ► SEBI SCORES ► Smart ODR.
• IA never asks for trading/demat/bank logins or OTPs—never share.`
    },
    {
      title: 'CKYC Consent & Investor Charter (Extracts)',
      content: `CKYC Consent: Client authorizes IA to download KYC details from CKYCR for identity/address verification and due compliance.

Investor Charter — Vision: Invest with knowledge & safety.
Mission: Enable investors to choose right products, manage/monitor them, access reports, and enjoy financial wellness.

Do’s (abridged): Deal only with SEBI-registered IAs/RAs; pay fees via banking channels; insist on risk profiling; seek written T&Cs; be vigilant; use SCORES/Smart ODR if needed.
Don’ts (abridged): No stock tips; don’t hand over funds for investment; avoid assured returns claims; don’t share credentials/OTPs.`
    },
    {
      title: 'Execution & Acceptance',
      content: `Agreement Date: ${agreementDate}
Client: ${state?.userData?.name || '_______________'}
Place: ${state?.userData?.kyc?.city || '_______________'}

For GROWSIN (Operating under the name of Mr. Murali Krishna Sivvala)
Authorised Signatory: Murali Krishna Sivvala

By proceeding, the Client confirms they have read and accept all terms and disclosures contained herein (including Annexures A, B, C).`
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ActiveHeader state={state} onLogout={onLogout} />
      <StepRail activeId="sign" />

      {/* Header Section */}
      <Paper elevation={0} sx={{
        p: 4,
        mb: 4,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%)',
        borderRadius: 3
      }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <DescriptionIcon sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} color="primary">
                Investment Agreement
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review and sign your investment advisory agreement to complete onboarding
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Agreement Date: <strong>{agreementDate}</strong>
              </Typography>
            </Box>
          </Stack>

          {/* Progress Section */}
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Reading Progress
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {Math.round(scrollProgress)}% Complete
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={scrollProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #1976d2 0%, #4dabf5 100%)'
                }
              }}
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Scroll to read entire agreement
              </Typography>
              {scrolled && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Fully Read"
                  color="success"
                  variant="outlined"
                  size="small"
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: 'grey.100',
            overflow: 'hidden'
          }}
        >
          {/* Agreement Header */}
          <Box sx={{
            p: 3,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white'
          }}>
            <Stack spacing={1}>
              <Typography variant="h5" fontWeight={700}>
                Investment Advisory Agreement
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Between {state?.userData?.name || 'Client'} and GROWSIN • Dated {agreementDate}
              </Typography>
            </Stack>
          </Box>

          {/* Scrollable Agreement Content */}
          <Box
            ref={scrollRef}
            onScroll={handleScroll}
            sx={{
              maxHeight: { xs: 400, sm: 500 },
              overflow: 'auto',
              p: 4,
              bgcolor: 'grey.50',
            }}
          >
            <Stack spacing={4}>
              {agreementSections.map((section, index) => (
                <Fade in key={section.title} timeout={600} style={{ transitionDelay: `${index * 120}ms` }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      backgroundColor: 'white'
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </Box>
                          <Typography variant="h6" fontWeight={600} color="primary">
                            {section.title}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}
                        >
                          {section.content}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </Stack>
          </Box>

          {/* Action Section */}
          <Box sx={{
            p: 3,
            backgroundColor: 'white',
            borderTop: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={!scrolled}
                    checked={ack}
                    onChange={(e) => setAck(e.target.checked)}
                    sx={{
                      '&.Mui-disabled': { color: 'grey.400' }
                    }}
                  />
                }
                label={
                  <Typography variant="body1" color={scrolled ? 'text.primary' : 'text.disabled'}>
                    I have read, understood, and agree to all terms and conditions of this Investment Advisory Agreement
                    {!scrolled && ' (scroll to bottom to enable)'}
                  </Typography>
                }
              />

              <Divider />

              <Stack
                direction={isMobile ? 'column' : 'row'}
                spacing={2}
                justifyContent="space-between"
                alignItems={isMobile ? 'stretch' : 'center'}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    Electronic Signature
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your agreement will be legally binding upon confirmation
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  disabled={!canProceed}
                  onClick={() => navigateTo('payment')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    minWidth: 200,
                    height: 48,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: 'grey.300',
                      transform: 'none',
                      boxShadow: 'none'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign Agreement
                </Button>
              </Stack>

              {!scrolled && (
                <Box sx={{ textAlign: 'center' }}>
                  {/* <Typography variant="caption" color="text.secondary">
                    📜 Please scroll to the bottom to read the entire agreement before signing
                  </Typography> */}
                </Box>
              )}
            </Stack>
          </Box>
        </Paper>
      </Fade>
    </Container>
  )
}
