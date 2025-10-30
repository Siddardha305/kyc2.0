import { useState } from 'react'
import { 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Divider, 
  Grid, 
  Stack, 
  Typography, 
  Box, 
  Paper, 
  Fade,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress
} from '@mui/material'
import ActiveHeader from '../layout/ActiveHeader'
import StepRail from '../layout/StepRail'
import PaymentIcon from '@mui/icons-material/Payment'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SecurityIcon from '@mui/icons-material/Security'

export default function Payment({ state, onLogout }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [processing, setProcessing] = useState(false)
  
  const md = state.userData.kyc || {}
  const u = state.userData
  const p = state.userData.selectedPlan || { title: 'No Plan Selected', price: '₹0.00' }

  const handlePayment = async () => {
    setProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Payment flow stubbed. Integrate Razorpay/Stripe as needed.')
    setProcessing(false)
  }

  const getPriceAmount = (priceString) => {
    if (!priceString) return '₹0.00'
    // Extract first price from strings like "₹14,999 / ₹24,999" or "₹34,999"
    const firstPrice = priceString.split('/')[0].trim()
    return firstPrice
  }

  const memberDetails = [
    { label: 'Full Name', value: md.name || u.name, icon: <PersonIcon /> },
    { label: 'Email Address', value: u.email, icon: <EmailIcon /> },
    { label: 'Phone Number', value: u.mobile, icon: <PhoneIcon /> },
    { label: 'City', value: md.city, icon: <LocationOnIcon /> },
    { label: 'State', value: md.state, icon: <LocationOnIcon /> },
    { label: 'PAN Number', value: md.pan, icon: <CreditCardIcon /> }
  ]

  const totalAmount = getPriceAmount(p.price)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ActiveHeader state={state} onLogout={onLogout}/>
      <StepRail activeId="payment"/>

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
              <PaymentIcon sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} color="primary">
                Complete Payment
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review your details and proceed with secure payment
              </Typography>
            </Box>
          </Stack>

          {/* Progress Status */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              label="Final Step" 
              color="primary" 
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="body2" color="text.secondary">
              You're almost done! Complete payment to activate your financial plan.
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={4}>
        {/* Member Details Section */}
        <Grid item xs={12} lg={8}>
          <Fade in timeout={600}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: 'grey.100'
            }}>
              <CardContent sx={{ p: 0 }}>
                {/* Header */}
                <Box sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  color: 'white',
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PersonIcon sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Member Information
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Review your personal and contact details
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Details Grid */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {memberDetails.map((detail, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Fade in timeout={800} style={{ transitionDelay: `${index * 100}ms` }}>
                          <Paper 
                            elevation={0}
                            sx={{ 
                              p: 2,
                              border: '1px solid',
                              borderColor: 'grey.200',
                              borderRadius: 2,
                              backgroundColor: 'grey.50',
                              height: '100%'
                            }}
                          >
                            <Stack spacing={1}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ color: 'primary.main' }}>
                                  {detail.icon}
                                </Box>
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                  {detail.label}
                                </Typography>
                              </Stack>
                              <Typography variant="body1" fontWeight={600} color="text.primary">
                                {detail.value || 'Not provided'}
                              </Typography>
                            </Stack>
                          </Paper>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Payment Summary Section */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: isMobile ? 'static' : 'sticky', top: 24 }}>
            <Fade in timeout={800}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: 'none'
              }}>
                <CardContent sx={{ p: 0 }}>
                  {/* Header */}
                  <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                    color: 'white',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12
                  }}>
                    <Stack spacing={1} alignItems="center" textAlign="center">
                      <CreditCardIcon sx={{ fontSize: 32 }} />
                      <Typography variant="h6" fontWeight={700}>
                        Payment Summary
                      </Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      {/* Selected Plan */}
                      <Box>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          SELECTED PLAN
                        </Typography>
                        <Typography variant="body1" fontWeight={700} color="primary.main">
                          {p.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {p.details}
                        </Typography>
                      </Box>

                      <Divider />

                      {/* Price Breakdown */}
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="text.primary">
                            Plan Fee
                          </Typography>
                          <Typography variant="body1" fontWeight={600} color="text.primary">
                            {getPriceAmount(p.price)}
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="text.primary">
                            GST (18%)
                          </Typography>
                          <Typography variant="body1" fontWeight={600} color="text.primary">
                            {(() => {
                              const priceNum = parseInt(getPriceAmount(p.price).replace(/[^0-9]/g, '')) || 0
                              const gst = priceNum * 0.18
                              return `₹${gst.toLocaleString('en-IN')}`
                            })()}
                          </Typography>
                        </Stack>

                        <Divider />

                        {/* Total */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" fontWeight={800} color="primary.main">
                            Total Amount
                          </Typography>
                          <Typography variant="h5" fontWeight={800} color="primary.main">
                            {getPriceAmount(p.price)}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Divider />

                      {/* Security Features */}
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <SecurityIcon sx={{ fontSize: 18, color: 'success.main' }} />
                          <Typography variant="caption" color="text.secondary">
                            Secure SSL encrypted payment
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                          <Typography variant="caption" color="text.secondary">
                            PCI DSS compliant
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Payment Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handlePayment}
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                        sx={{
                          height: 52,
                          borderRadius: 2,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                          boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
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
                        {processing ? 'Processing...' : `Pay ${totalAmount}`}
                      </Button>

                      {/* Additional Info */}
                      <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
                        By proceeding, you agree to our Terms of Service and Privacy Policy
                      </Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}