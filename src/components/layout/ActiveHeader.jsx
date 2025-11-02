import { Avatar, Box, Button, Stack, Typography, Chip, Paper, useTheme, useMediaQuery } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'

export default function ActiveHeader({ state, onLogout }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getProgressStatus = () => {
    const currentStep = state.currentStep
    const steps = {
      'auth': 'Getting started',
      'kyc': 'Completing KYC',
      'risk': 'Risk assessment',
      'assessment': 'Suitability review',
      'docs': 'Document upload',
      'plan': 'Plan selection',
      'sign': 'Agreement signing',
      'payment': 'Payment processing'
    }
    return steps[currentStep] || 'Onboarding in progress'
  }

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 4,
        mb: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 1.1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}
    >
      <Stack 
        direction={isMobile ? 'column' : 'row'} 
        alignItems={isMobile ? 'flex-start' : 'center'} 
        justifyContent="space-between" 
        spacing={3}
      >
        {/* User Info Section */}
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center"
          sx={{ width: isMobile ? '100%' : 'auto' }}
        >
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64,
              border: `3px solid ${theme.palette.primary.main}`,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              backgroundColor: theme.palette.primary.main
            }}
          >
            <PersonIcon sx={{ fontSize: 32, color: 'white' }} />
          </Avatar>
          
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                {getWelcomeMessage()}, {state.userData?.name?.split(' ')[0] || 'Guest'}!
              </Typography>
              {state.userData?.kyc?.gender && (
                <Chip 
                  label={state.userData.kyc.gender === 'female' ? '♀ Female' : '♂ Male'}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 24, fontSize: '0.7rem' }}
                />
              )}
            </Stack>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {getProgressStatus()}
            </Typography>
            
            {/* Progress Indicators */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip 
                icon={<PersonIcon sx={{ fontSize: 16 }} />}
                label="KYC Verified"
                color="success"
                variant="filled"
                size="small"
                sx={{ 
                  fontSize: '0.75rem',
                  height: 30,
                  backgroundColor: theme.palette.success.main,
                  color: 'white'
                }}
              />
              {state.userData?.riskProfile && (
                <Chip 
                  label={`${state.userData.riskProfile} Risk`}
                  color={
                    state.userData.riskProfile === 'Conservative' ? 'success' :
                    state.userData.riskProfile === 'Moderate' ? 'warning' : 'error'
                  }
                  variant="outlined"
                  size="small"
                  sx={{ fontSize: '0.75rem', height: 28 }}
                />
              )}
            </Stack>
          </Box>
        </Stack>

        {/* Logout Button Only */}
        <Button 
          startIcon={<LogoutIcon />} 
          color="error"
          variant="outlined"
          onClick={onLogout}
          sx={{
            borderRadius: 1.1,
            fontWeight: 600,
            borderColor: 'error.main',
            color: 'error.main',
            minWidth: isMobile ? '100%' : 120,
            '&:hover': {
              backgroundColor: 'error.50',
              borderColor: 'error.dark'
            }
          }}
        >
          {isMobile ? 'Sign Out' : 'Log Out'}
        </Button>
      </Stack>
    </Paper>
  )
}