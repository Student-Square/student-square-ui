'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useLanguage } from '@/components/i18n/LanguageProvider'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  const { t } = useLanguage()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      containerAriaLabel={t('common.notifications')}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
