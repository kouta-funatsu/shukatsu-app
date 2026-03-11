type Props = {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
}

export default function Button({ children, onClick, variant = 'primary', disabled, type = 'button' }: Props) {
  const styles = {
    primary: 'bg-slate-800 text-white hover:bg-slate-700',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  )
}