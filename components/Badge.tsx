type Props = {
  status: string
}

const statusStyles: Record<string, string> = {
  検討中: 'bg-slate-100 text-slate-600',
  ES提出: 'bg-blue-50 text-blue-600',
  選考中: 'bg-amber-50 text-amber-600',
  内定:   'bg-emerald-50 text-emerald-600',
  見送り: 'bg-red-50 text-red-500',
}

export default function Badge({ status }: Props) {
  const style = statusStyles[status] ?? statusStyles['検討中']
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}