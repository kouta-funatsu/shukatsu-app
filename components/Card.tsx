type Props = {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-100 ${className}`}>
      {children}
    </div>
  )
}