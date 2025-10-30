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
  Divider,
  alpha
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

  const agreementSections = [
    {
      title: "Services and Scope",
      content: "This Investment Advisory Agreement outlines the comprehensive financial planning and investment advisory services to be provided. Our services include portfolio management, financial planning, risk assessment, and ongoing investment monitoring tailored to your financial goals and risk tolerance."
    },
    {
      title: "Fees and Compensation",
      content: "The fee structure for the selected plan is clearly defined herein. All fees are transparent and will be billed as per the agreed schedule. Any additional services outside the scope of this agreement will require separate written consent and fee arrangement."
    },
    {
      title: "Client Responsibilities",
      content: "As the client, you agree to provide accurate and complete financial information, promptly inform us of any material changes in your financial situation, and review all reports and recommendations provided in a timely manner."
    },
    {
      title: "Investment Strategy",
      content: "All investment recommendations will be based on your risk profile, financial objectives, and time horizon. We employ modern portfolio theory and rigorous analysis to construct and maintain your investment portfolio."
    },
    {
      title: "Disclosures and Consent",
      content: "By signing this agreement, you acknowledge receipt of all required disclosures, understand the risks involved in investing, and consent to electronic communications and electronic signature as legally binding."
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
                Between {state.userData.name || 'Client'} and Financial Advisory Services
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
                <Fade in key={index} timeout={600} style={{ transitionDelay: `${index * 200}ms` }}>
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
                        <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
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
                      '&.Mui-disabled': {
                        color: 'grey.400'
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body1" color={scrolled ? 'text.primary' : 'text.disabled'}>
                    I have read, understood, and agree to all terms and conditions of this Investment Advisory Agreement
                    {!scrolled && " (scroll to bottom to enable)"}
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

              {/* Status Indicator */}
              {!scrolled && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    📜 Please scroll to the bottom to read the entire agreement before signing
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Paper>
      </Fade>
    </Container>
  )
}