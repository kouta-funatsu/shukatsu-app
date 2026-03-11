import Link from 'next/link'

export default function TopPage() {
  return (
    <div style={{ padding: '80px 40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>就活管理アプリ</h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px', lineHeight: '1.8' }}>
        企業情報・マイページ・スケジュールを<br />一つの場所でまとめて管理
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <Link href="/login">
          <button style={{ padding: '14px 48px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            Googleでログイン
          </button>
        </Link>
        <Link href="/dashboard">
          <button style={{ padding: '14px 48px', background: 'white', color: '#4285f4', border: '2px solid #4285f4', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            ダッシュボードへ
          </button>
        </Link>
      </div>

      <div style={{ marginTop: '64px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'left' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏢</div>
          <h3 style={{ margin: '0 0 8px' }}>企業管理</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>説明会メモ・選考状況・志望度を一元管理</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔑</div>
          <h3 style={{ margin: '0 0 8px' }}>マイページ管理</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>企業ごとのID・パスワードを安全に管理</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📅</div>
          <h3 style={{ margin: '0 0 8px' }}>スケジュール管理</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>面接・説明会・締切を企業ごとに管理</p>
        </div>
      </div>
    </div>
  )
}
