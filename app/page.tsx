import Link from 'next/link'

export default function TopPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">就活管理アプリ</h1>
        <p className="text-slate-500 text-lg mb-12 leading-relaxed">
          企業情報・マイページ・スケジュールを<br />一つの場所でまとめて管理
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
          <Link href="/login">
            <button className="px-8 py-3 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors">
              Googleでログイン
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="px-8 py-3 bg-white text-slate-700 text-sm font-medium rounded-md border border-slate-200 hover:bg-slate-50 transition-colors">
              ダッシュボードへ
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            { icon: '🏢', title: '企業管理', desc: '説明会メモ・選考状況・志望度を一元管理' },
            { icon: '🔑', title: 'マイページ管理', desc: '企業ごとのID・パスワードを安全に管理' },
            { icon: '📅', title: 'スケジュール管理', desc: '面接・説明会・締切を企業ごとに管理' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-lg border border-slate-100 shadow-sm p-5">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}