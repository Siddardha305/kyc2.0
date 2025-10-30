import { useEffect, useRef, useState } from 'react'
import {
  Alert, Avatar, Button, Card, CardActions, CardContent, CardHeader, InputAdornment,
  Paper, Stack, TextField, Typography, Box, LinearProgress, Fade,
  useTheme, useMediaQuery, CircularProgress, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import VerifiedIcon from '@mui/icons-material/Verified'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/PhoneIphone'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RefreshIcon from '@mui/icons-material/Refresh'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import { userExists, saveCurrentSession, saveUserProgress } from '../../utils/storage'
import { isEmail, isPhone } from '../../utils/validation'
import { getInitialState } from '../../rootState.js'

const DRAFT_KEY = 'signupDraft_v1'

export default function Signup({ state, persist, setState }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' })
  const [sending, setSending] = useState({ email: false, mobile: false })
  const [verifying, setVerifying] = useState({ email: false, mobile: false })
  const [otp, setOtp] = useState({ email: '', mobile: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [verified, setVerified] = useState({ email: false, mobile: false })
  const [progress, setProgress] = useState(0)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const mounted = useRef(false)

  // Calculate form completion progress
  useEffect(() => {
    let completed = 0
    const total = 5 // name, email, mobile, password, confirm
    
    if (form.name.trim()) completed++
    if (isEmail(form.email)) completed++
    if (isPhone(form.mobile)) completed++
    if (form.password.length >= 8) completed++
    if (form.confirm && form.password === form.confirm) completed++
    
    setProgress((completed / total) * 100)
  }, [form])

  // ---- draft persistence helpers ----
  const saveDraft = (next = {}) => {
    const payload = {
      form,
      otp,
      verified,
      ...next,
    }
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(payload)) } catch {}
  }

  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      if (data?.form) setForm(prev => ({ ...prev, ...data.form }))
      if (data?.otp) setOtp(prev => ({ ...prev, ...data.otp }))
      if (data?.verified) setVerified(prev => ({ ...prev, ...data.verified }))
    } catch {}
  }

  const clearDraft = () => { 
    try { localStorage.removeItem(DRAFT_KEY) } catch {} 
  }

  // Rehydrate once on mount
  useEffect(() => {
    if (mounted.current) return
    mounted.current = true
    loadDraft()
  }, [])

  // Keep local verified flags in sync with parent state
  useEffect(() => {
    if (state?.emailVerified && !verified.email) setVerified(v => ({ ...v, email: true }))
    if (state?.mobileVerified && !verified.mobile) setVerified(v => ({ ...v, mobile: true }))
  }, [state?.emailVerified, state?.mobileVerified])

  // Save draft whenever anything important changes
  useEffect(() => {
    saveDraft()
  }, [form, otp, verified])

  // ---- Field handlers ----
  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleFormChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
    setForm(prev => ({ ...prev, mobile: value }))
    if (errors.mobile) {
      setErrors(prev => ({ ...prev, mobile: '' }))
    }
  }

  // ---- Clear Data Function ----
  const handleClearData = () => {
    // Reset all form states
    setForm({ name: '', email: '', mobile: '', password: '', confirm: '' })
    setOtp({ email: '', mobile: '' })
    setErrors({})
    setTouched({})
    setVerified({ email: false, mobile: false })
    setProgress(0)
    
    // Clear from localStorage
    clearDraft()
    
    // Close dialog
    setClearDialogOpen(false)
    
    // Reset parent state if needed
    persist(s => ({ 
      ...s, 
      emailVerified: false, 
      mobileVerified: false 
    }))
  }

  // ---- OTP send/verify ----
  const sendEmailOtp = async () => {
    setSending(p => ({ ...p, email: true }))
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSending(p => ({ ...p, email: false }))
  }

  const sendMobileOtp = async () => {
    setSending(p => ({ ...p, mobile: true }))
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSending(p => ({ ...p, mobile: false }))
  }

  const verifyEmailOtp = async () => {
    setVerifying(p => ({ ...p, email: true }))
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (otp.email === '123456') {
      persist(s => ({ ...s, emailVerified: true }))
      setVerified(v => ({ ...v, email: true }))
      setErrors(e => ({ ...e, emailOtp: undefined }))
      saveDraft({ verified: { ...verified, email: true } })
    } else {
      setErrors(e => ({ ...e, emailOtp: 'Invalid OTP. Try 123456' }))
    }
    setVerifying(p => ({ ...p, email: false }))
  }

  const verifyMobileOtp = async () => {
    setVerifying(p => ({ ...p, mobile: true }))
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (otp.mobile === '654321') {
      persist(s => ({ ...s, mobileVerified: true }))
      setVerified(v => ({ ...v, mobile: true }))
      setErrors(e => ({ ...e, mobileOtp: undefined }))
      saveDraft({ verified: { ...verified, mobile: true } })
    } else {
      setErrors(e => ({ ...e, mobileOtp: 'Invalid OTP. Try 654321' }))
    }
    setVerifying(p => ({ ...p, mobile: false }))
  }

  const canContinue = (state?.emailVerified || verified.email) && 
                     (state?.mobileVerified || verified.mobile) &&
                     form.name && 
                     isEmail(form.email) && 
                     isPhone(form.mobile) && 
                     form.password.length >= 8 && 
                     form.password === form.confirm

  // ---- Continue ----
  const handleContinue = async () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!isEmail(form.email)) errs.email = 'Valid email address is required'
    if (!isPhone(form.mobile)) errs.mobile = 'Valid 10-digit mobile number is required'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    if (userExists(form.email)) errs.email = 'An account with this email already exists'
    if (userExists(form.mobile)) errs.mobile = 'An account with this phone number already exists'
    
    setTouched({
      name: true, email: true, mobile: true, password: true, confirm: true
    })
    setErrors(errs)
    
    if (Object.keys(errs).length) return

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 500))

    const fresh = getInitialState()
    const merged = {
      ...fresh,
      userData: {
        ...fresh.userData,
        name: form.name.trim(),
        email: form.email.toLowerCase(),
        mobile: form.mobile,
        password: form.password
      },
      currentUser: form.email.toLowerCase(),
      currentStep: 'kyc',
      emailVerified: true,
      mobileVerified: true,
    }
    saveCurrentSession(form.email.toLowerCase())
    saveUserProgress(form.email.toLowerCase(), merged)
    saveUserProgress(form.mobile, merged)
    clearDraft()
    setState(merged)
  }

  const getFieldColor = (field) => {
    if (errors[field]) return 'error'
    if (touched[field] && form[field]) return 'success'
    return 'primary'
  }

  // Check if there's any data to clear
  const hasData = form.name || form.email || form.mobile || form.password || form.confirm || 
                  otp.email || otp.mobile || verified.email || verified.mobile

  return (
    <>
      <Box sx={{ 
        minHeight: '100vh', 
        py: 4,
        px: 2
      }}>
        <Box sx={{ 
          maxWidth: 1200, 
          margin: '0 auto'
        }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="stretch">
            {/* Hero Section - No Animation */}
            <Paper elevation={8} sx={{ 
              p: { xs: 3, md: 4 }, 
              bgcolor: 'primary.main', 
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
              color: '#fff', 
              flex: { xs: 1, md: 0.45 },
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)'
              }
            }}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Stack alignItems="center" spacing={3} textAlign="center">
                  <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <VerifiedIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" fontWeight={800} gutterBottom>
                    Secure Digital Onboarding
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                    Join thousands of users in our secure platform
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {[1, 2, 3].map((item) => (
                      <Stack key={item} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {['Bank-level security', 'Instant verification', '24/7 Support'][item - 1]}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </Stack>
              </Box>
            </Paper>

            {/* Form Section - Keep Fade animation */}
            <Fade in timeout={1000}>
              <Card sx={{ 
                flex: 1, 
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <CardHeader 
                  title={
                    <Typography variant="h4" fontWeight={700} color="primary">
                      Create Your Account
                    </Typography>
                  } 
                  subheader={
                    <Typography variant="body1" color="text.secondary">
                      Complete your profile to begin the verification process
                    </Typography>
                  }
                  action={
                    hasData && (
                      <IconButton 
                        onClick={() => setClearDialogOpen(true)}
                        color="error"
                        title="Clear all data"
                        sx={{
                          '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'white'
                          }
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    )
                  }
                />
                
                {/* Progress Bar */}
                <Box sx={{ px: 3, pt: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Profile Completion
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {Math.round(progress)}%
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'grey.100',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, #1976d2 0%, #4dabf5 100%)'
                      }
                    }}
                  />
                </Box>

                <CardContent>
                  <Stack spacing={3}>
                    {/* Name Field */}
                    <TextField
                      label="Full Name"
                      value={form.name}
                      error={!!errors.name && touched.name}
                      helperText={errors.name || (touched.name && "Your legal name as per official documents")}
                      onChange={handleFormChange('name')}
                      onBlur={handleBlur('name')}
                      fullWidth
                      color={getFieldColor('name')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color={getFieldColor('name')} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Email Field with OTP */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-end' }}>
                      <TextField
                        label="Email Address"
                        type="email"
                        value={form.email}
                        error={!!errors.email && touched.email}
                        helperText={errors.email || (touched.email && "We'll send verification code to this email")}
                        onChange={handleFormChange('email')}
                        onBlur={handleBlur('email')}
                        fullWidth
                        color={verified.email ? 'success' : getFieldColor('email')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color={verified.email ? 'success' : getFieldColor('email')} />
                            </InputAdornment>
                          ),
                        }}
                        disabled={verified.email}
                      />
                      <Button 
                        onClick={sendEmailOtp} 
                        disabled={!isEmail(form.email) || verified.email || sending.email}
                        color={verified.email ? 'success' : 'primary'}
                        variant={verified.email ? 'contained' : 'outlined'}
                        sx={{ 
                          minWidth: { xs: '100%', sm: 140 },
                          height: 56,
                          borderRadius: 2
                        }}
                        startIcon={verified.email ? <CheckCircleIcon /> : sending.email ? <CircularProgress size={20} /> : null}
                      >
                        {sending.email ? 'Sending' : verified.email ? 'Verified' : 'Send OTP'}
                      </Button>
                    </Stack>

                    {/* Email OTP Field - FIXED */}
                    {!verified.email && isEmail(form.email) && (
                      <Fade in>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' }, 
                          gap: 2,
                          alignItems: { xs: 'stretch', sm: 'flex-end' }
                        }}>
                          <TextField 
                            label="Email Verification Code"
                            placeholder="Enter 123456"
                            value={otp.email}
                            onChange={(e) => setOtp({...otp, email: e.target.value})}
                            error={!!errors.emailOtp}
                            helperText={errors.emailOtp || "Enter the code sent to your email"}
                            fullWidth
                            sx={{ flex: 1 }}
                          />
                          <Button 
                            onClick={verifyEmailOtp}
                            disabled={!otp.email || verifying.email}
                            variant="contained"
                            sx={{ 
                              minWidth: { xs: '100%', sm: 120 },
                              height: 56,
                              borderRadius: 2
                            }}
                            startIcon={verifying.email ? <CircularProgress size={20} /> : null}
                          >
                            {verifying.email ? 'Verifying' : 'Verify'}
                          </Button>
                        </Box>
                      </Fade>
                    )}

                    {/* Mobile Field with OTP */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-end' }}>
                      <TextField
                        label="Mobile Number"
                        value={form.mobile}
                        error={!!errors.mobile && touched.mobile}
                        helperText={errors.mobile || (touched.mobile && "10-digit mobile number with country code")}
                        onChange={handleMobileChange}
                        onBlur={handleBlur('mobile')}
                        fullWidth
                        color={verified.mobile ? 'success' : getFieldColor('mobile')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color={verified.mobile ? 'success' : getFieldColor('mobile')} />
                            </InputAdornment>
                          ),
                        }}
                        disabled={verified.mobile}
                      />
                      <Button 
                        onClick={sendMobileOtp} 
                        disabled={!isPhone(form.mobile) || verified.mobile || sending.mobile}
                        color={verified.mobile ? 'success' : 'primary'}
                        variant={verified.mobile ? 'contained' : 'outlined'}
                        sx={{ 
                          minWidth: { xs: '100%', sm: 140 },
                          height: 56,
                          borderRadius: 2
                        }}
                        startIcon={verified.mobile ? <CheckCircleIcon /> : sending.mobile ? <CircularProgress size={20} /> : null}
                      >
                        {sending.mobile ? 'Sending' : verified.mobile ? 'Verified' : 'Send OTP'}
                      </Button>
                    </Stack>

                    {/* Mobile OTP Field - FIXED */}
                    {!verified.mobile && isPhone(form.mobile) && (
                      <Fade in>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' }, 
                          gap: 2,
                          alignItems: { xs: 'stretch', sm: 'flex-end' }
                        }}>
                          <TextField 
                            label="Mobile Verification Code"
                            placeholder="Enter 654321"
                            value={otp.mobile}
                            onChange={(e) => setOtp({...otp, mobile: e.target.value})}
                            error={!!errors.mobileOtp}
                            helperText={errors.mobileOtp || "Enter the code sent to your phone"}
                            fullWidth
                            sx={{ flex: 1 }}
                          />
                          <Button 
                            onClick={verifyMobileOtp}
                            disabled={!otp.mobile || verifying.mobile}
                            variant="contained"
                            sx={{ 
                              minWidth: { xs: '100%', sm: 120 },
                              height: 56,
                              borderRadius: 2
                            }}
                            startIcon={verifying.mobile ? <CircularProgress size={20} /> : null}
                          >
                            {verifying.mobile ? 'Verifying' : 'Verify'}
                          </Button>
                        </Box>
                      </Fade>
                    )}

                    {/* Password Fields */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' }, 
                      gap: 2 
                    }}>
                      <TextField 
                        type="password"
                        label="Password"
                        value={form.password}
                        error={!!errors.password && touched.password}
                        helperText={errors.password || "Minimum 8 characters with letters and numbers"}
                        onChange={handleFormChange('password')}
                        onBlur={handleBlur('password')}
                        fullWidth
                        color={getFieldColor('password')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color={getFieldColor('password')} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField 
                        type="password"
                        label="Confirm Password"
                        value={form.confirm}
                        error={!!errors.confirm && touched.confirm}
                        helperText={errors.confirm || "Re-enter your password to confirm"}
                        onChange={handleFormChange('confirm')}
                        onBlur={handleBlur('confirm')}
                        fullWidth
                        color={getFieldColor('confirm')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color={getFieldColor('confirm')} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    {/* Status Alert */}
                    <Fade in>
                      <Alert 
                        severity={canContinue ? 'success' : 'info'}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          border: '1px solid',
                          '& .MuiAlert-message': {
                            width: '100%'
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' }, 
                          justifyContent: 'space-between', 
                          alignItems: { xs: 'stretch', sm: 'center' },
                          gap: 1
                        }}>
                          <Typography variant="body2">
                            {canContinue 
                              ? 'All set! Your account is ready to be created.' 
                              : 'Complete all fields and verify your email & mobile to continue.'
                            }
                          </Typography>
                          {!canContinue && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {verified.email ? '✓ Email' : '✗ Email'} • {verified.mobile ? '✓ Mobile' : '✗ Mobile'}
                              </Typography>
                              <IconButton size="small" onClick={loadDraft} title="Reload saved draft">
                                <RefreshIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </Alert>
                    </Fade>
                  </Stack>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                    <Button 
                      onClick={() => setClearDialogOpen(true)}
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ 
                        minWidth: { xs: '100%', sm: 140 },
                        height: 56,
                        borderRadius: 2
                      }}
                    >
                      Clear Data
                    </Button>
                    <Button 
                      fullWidth
                      disabled={!canContinue}
                      onClick={handleContinue}
                      variant="contained"
                      size="large"
                      sx={{
                        height: 56,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                          transform: 'translateY(-1px)'
                        },
                        '&:disabled': {
                          background: 'grey.300'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Create Account & Continue
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Fade>
          </Stack>
        </Box>
      </Box>

      {/* Clear Data Confirmation Dialog */}
      <Dialog 
        open={clearDialogOpen} 
        onClose={() => setClearDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold" color="error">
            Clear All Data
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="warning" variant="outlined">
              <Typography variant="body2" fontWeight="bold">
                This action cannot be undone!
              </Typography>
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Are you sure you want to clear all form data? This will remove:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" color="text.secondary">
                • All entered form fields<br/>
                • OTP verification codes<br/>
                • Verification status<br/>
                • Saved draft data
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              You'll need to start over from the beginning.
            </Typography>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setClearDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearData}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Clear All Data
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}