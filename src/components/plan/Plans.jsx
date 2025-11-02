import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
  Chip,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
  Divider,
  alpha
} from '@mui/material'
import ActiveHeader from '../layout/ActiveHeader'
import StepRail from '../layout/StepRail'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'

const plans = [
  {
    key: 'standard',
    title: 'Comprehensive Planning',
    subtitle: 'Complete financial roadmap for individuals and families',
    price: '₹34,999',
    details: 'One-time comprehensive fee',
    features: [
      'Financial Health Check & Analysis',
      'Goal-Based Financial Planning',
      'Risk Management & Insurance',
      'Strategic Investment Planning',
      'Retirement & Pension Planning',
      'Debt & Credit Advisory',
      'Tax Optimization Strategies'
    ],
    recommended: false
  },
  {
    key: 'exclusive',
    title: 'Wealth Management',
    subtitle: 'Bespoke strategies for high-net-worth clients',
    price: 'Customized',
    details: 'Preferred for > ₹1 Cr Net Worth',
    features: [
      'All Comprehensive features',
      'Strategic Wealth Structuring',
      'Global Diversification',
      'Advanced Tax Planning',
      'Legacy & Succession Planning',
      'Private Market Advisory',
      'Lifestyle & Concierge Services'
    ],
    recommended: true
  },
  {
    key: 'rebalancing',
    title: 'Portfolio Rebalancing',
    subtitle: 'Professional alignment of investment portfolio',
    price: '₹14,999 / ₹24,999',
    details: 'For Portfolio Value up to ₹50L / above ₹50L',
    features: [
      'Portfolio Analysis & Risk Profiling',
      'Intrinsic Value Analysis',
      'Asset Allocation Strategy',
      'Portfolio Optimization',
      'Rebalancing Report',
      'Execution Guidance',
      '6-month Performance Review'
    ],
    recommended: false
  },
]

export default function Plans({ state, persist, onLogout, navigateTo }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  const [selected, setSelected] = useState(state.userData.selectedPlan?.key || 'exclusive')
  const [rebalanceOpen, setRebalanceOpen] = useState(false)
  const [exclusiveOpen, setExclusiveOpen] = useState(false)
  const [portfolioValue, setPortfolioValue] = useState('')
  const [aumValue, setAumValue] = useState('')

  const chosen = useMemo(
    () => plans.find((p) => p.key === selected) || plans[1],
    [selected]
  )

  const applySelection = (planObj) => {
    persist((s) => ({
      ...s,
      userData: {
        ...s.userData,
        selectedPlan: {
          key: planObj.key,
          title: planObj.title,
          price: planObj.price,
          details: planObj.details,
        },
      },
    }))
  }

  const handleSelect = (key) => {
    setSelected(key)
    const planObj = plans.find((p) => p.key === key)
    if (!planObj) return

    if (key === 'rebalancing') {
      setPortfolioValue('')
      setRebalanceOpen(true)
    } else if (key === 'exclusive') {
      setAumValue('')
      setExclusiveOpen(true)
    } else {
      applySelection(planObj)
    }
  }

  const sanitizeNumber = (val) => {
    const cleaned = String(val || '').replace(/[, ]/g, '')
    const num = parseFloat(cleaned)
    return Number.isFinite(num) ? num : NaN
  }

  const confirmRebalance = () => {
    const v = sanitizeNumber(portfolioValue)
    if (!Number.isFinite(v) || v < 0) return
    const np = v <= 5000000 ? '₹14,999' : '₹24,999'
    const nd = v <= 5000000 ? 'For Portfolio Value up to ₹50L' : 'For Portfolio Value above ₹50L'
    applySelection({ key: 'rebalancing', title: 'Portfolio Rebalancing', price: np, details: nd })
    setRebalanceOpen(false)
  }

  const confirmExclusive = () => {
    const _aum = sanitizeNumber(aumValue)
    applySelection({
      key: 'exclusive',
      title: 'Wealth Management',
      price: 'AUM Based',
      details: '1.5% Annually (+ ₹99,999 Upfront)',
    })
    setExclusiveOpen(false)
  }

  const PlanCard = ({ plan, index }) => (
    <Fade in timeout={600} style={{ transitionDelay: `${index * 150}ms` }}>
      <Card
        sx={{
          height: '100%',
          borderRadius: 1.1,
          border: selected === plan.key ? `2px solid ${theme.palette.primary.main}` : '1px solid',
          borderColor: selected === plan.key ? theme.palette.primary.main : theme.palette.grey[200],
          backgroundColor: 'white',
          boxShadow: selected === plan.key ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}` : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            boxShadow: selected === plan.key
              ? `0 12px 32px ${alpha(theme.palette.primary.main, 0.2)}`
              : '0 4px 16px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        {plan.recommended && (
          <Box sx={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2
          }}>
            <Chip
              icon={<StarIcon sx={{ fontSize: 16 }} />}
              label="RECOMMENDED"
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.7rem',
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                height: 24
              }}
            />
          </Box>
        )}

        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              color="text.primary"
              gutterBottom
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                lineHeight: 1.3,
                minHeight: { xs: 'auto', md: '3.2rem' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {plan.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1.5,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                lineHeight: 1.4
              }}
            >
              {plan.subtitle}
            </Typography>

            {/* Price */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
                sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' } }}
              >
                {plan.price}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
              >
                {plan.details}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Features */}
          <Box sx={{ flex: 2, mb: 2 }}>
            <Stack spacing={2.5}>
              {plan.features.map((feature, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <CheckCircleIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.primary.main,
                      flexShrink: 0,
                      mt: 0.2
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      lineHeight: 1.4,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Select Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleSelect(plan.key)}
            sx={{
              borderRadius: 1.1,
              fontWeight: 600,
              textTransform: 'none',
              py: 1.2,
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
              ...(selected === plan.key ? {
                // Selected - Green
                backgroundColor: '#175ee2',
                '&:hover': {
                  backgroundColor: '#0470cfff'
                }
              } : {
                // Select Plan - Blue
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              })
            }}
          >
            {selected === plan.key ? 'Selected' : 'Select Plan'}
          </Button>
        </CardContent>
      </Card>
    </Fade>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ActiveHeader state={state} onLogout={onLogout} />
      <StepRail activeId="plan" />

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="text.primary"
          gutterBottom
          sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}
        >
          Choose Your Plan
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto', fontSize: { xs: '0.875rem', md: '1rem' } }}
        >
          Select the financial planning service that best fits your needs and investment goals
        </Typography>
      </Box>

      <Grid container spacing={2} alignItems="flex-start">
        {/* Plans Grid */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {plans.map((plan, index) => (
              <Grid item xs={12} md={4} key={plan.key}>
                <PlanCard plan={plan} index={index} />
              </Grid>
            ))}
          </Grid>

          {/* Next Section */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 2
            }}
          >
            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={2}
              justifyContent="space-between"
              alignItems={isMobile ? 'stretch' : 'center'}
            >
              <Box>
                <Typography variant="body1" fontWeight={600} color="text.primary" gutterBottom>
                  {chosen.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready to proceed with your selected plan?
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigateTo('sign')}
                sx={{
                  minWidth: { xs: '100%', sm: 200 },
                  borderRadius: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  py: 1,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  }
                }}
              >
                Continue to Agreement
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Summary Sidebar */}
        {/* <Grid item xs={12} lg={4}>
          <Box sx={{ position: isTablet ? 'static' : 'sticky', top: 24 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2, 
                border: `1px solid ${theme.palette.grey[200]}`,
                borderRadius: 2,
                backgroundColor: 'white'
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <PriceCheckIcon 
                    sx={{ 
                      fontSize: 32, 
                      color: theme.palette.primary.main,
                      mb: 1
                    }} 
                  />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Plan Summary
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    SELECTED PLAN
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    {state.userData.selectedPlan?.title || chosen.title}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    PRICING
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {state.userData.selectedPlan?.price || chosen.price}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {state.userData.selectedPlan?.details || chosen.details}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    WHAT'S NEXT
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    Review and sign the service agreement to begin your financial planning journey
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Grid> */}
      </Grid>

      {/* Dialogs */}
      <Dialog
        open={rebalanceOpen}
        onClose={() => setRebalanceOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Portfolio Value
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1" color="text.primary">
              Enter your current portfolio value to determine the service fee.
            </Typography>
            <TextField
              autoFocus
              label="Portfolio Value (₹)"
              fullWidth
              value={portfolioValue}
              onChange={(e) => setPortfolioValue(e.target.value)}
              placeholder="e.g., 5,000,000"
              inputProps={{ inputMode: 'decimal' }}
            />
            <Box sx={{
              p: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Typography variant="caption" fontWeight={500} color="text.primary">
                ₹14,999 for portfolios up to ₹50L
                <br />
                ₹24,999 for portfolios above ₹50L
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setRebalanceOpen(false)}
            sx={{ fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmRebalance}
            disabled={!portfolioValue}
            sx={{ fontWeight: 500 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={exclusiveOpen}
        onClose={() => setExclusiveOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Assets Under Management
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1" color="text.primary">
              Provide your approximate Assets Under Management for customized pricing.
            </Typography>
            <TextField
              autoFocus
              label="Approximate AUM (₹)"
              fullWidth
              value={aumValue}
              onChange={(e) => setAumValue(e.target.value)}
              placeholder="e.g., 15,000,000"
              inputProps={{ inputMode: 'decimal' }}
            />
            <Box sx={{
              p: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Typography variant="caption" fontWeight={500} color="text.primary">
                1.5% annual fee + ₹99,999 upfront
                <br />
                Based on Assets Under Management
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setExclusiveOpen(false)}
            sx={{ fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmExclusive}
            sx={{ fontWeight: 500 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}