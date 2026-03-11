# 就活管理アプリ (Shukatsu App)

就活における企業情報の整理・比較、スケジュール管理、Googleカレンダー連携を一元化するWebアプリ。

**デモ（標準版）:** https://shukatsu-app-chi.vercel.app  
**デモ（カレンダー連携版）:** https://shukatsu-app-calendar.vercel.app  
**GitHub:** https://github.com/kouta-funatsu/shukatsu-app

---

## 開発の経緯

就活を本格的に始めた頃、管理しなければならないことの多さに圧倒された。

最初に困ったのはメモの散乱だった。説明会に参加するたびにノートやメモアプリに書き留めていたが、企業数が増えるにつれてどこに何を書いたか分からなくなっていった。「あの企業の福利厚生ってどんな話だったっけ」と振り返ろうとしても、メモが複数のアプリやノートに散らばっていて見つけるだけで時間がかかった。

次に頭を悩ませたのがマイページの管理だ。就活では企業ごとに専用のマイページへの登録が求められることが多く、気づけば10社以上のID・パスワードを管理しなければならなくなっていた。パスワードマネージャーに入れるにしても、どの企業のどのURLかをひもづけて管理するのは思ったより手間がかかった。

スケジュール管理も想像以上に複雑だった。ES締切・説明会・インターン・一次面接と、企業ごとに異なる日程が重なり合う中で、Googleカレンダーに一件ずつ手入力していくのは地味に負担だった。入力し忘れて締切を危うく見逃しそうになったこともあった。

さらに、複数の就活サービスを並行して使っていたため、情報がサービスをまたいで分散してしまい、全体像を把握しにくい状態になっていた。「今自分が何社にアプローチしていて、それぞれどの段階にいるのか」を把握するだけでも一苦労だった。

こうした経験から、「企業情報・マイページ・スケジュールを一つの場所でまとめて管理できるツールがあれば、就活そのものに集中できるのではないか」と考えるようになった。

既存のツールでの管理も検討したが、必要な機能をすべて満たすツールが見当たらなかったため、自分で作ることにした。

---

## ブランチについて

このリポジトリは2つのブランチで管理されている。

| ブランチ | デプロイ先 | 対象 | 理由 |
|---|---|---|---|
| `main` | shukatsu-app-chi.vercel.app | 誰でも使える | カレンダー連携なしで一般公開するため |
| `feature/calendar` | shukatsu-app-calendar.vercel.app | テストユーザーのみ | GoogleカレンダーはGoogleの審査が必要なため |

GoogleカレンダーやGmailのAPIはGoogleの審査を受けないと誰でも使える状態にできない。審査には動画・プライバシーポリシー・セキュリティ審査（有料）が必要なため、カレンダー連携機能は`feature/calendar`ブランチに分離して運用している。`main`ブランチはカレンダー連携なしで誰でもログインできる状態を維持している。

現在テスト運用中のため、カレンダー連携版を試してみたい方はテストユーザーとして登録できます。ご希望の方は [272kouta0225@gmail.com](mailto:272kouta0225@gmail.com) までご連絡ください。

---

## 主な機能

- **Googleログイン** — Googleアカウントで安全にログイン
- **企業情報管理** — 説明会メモ・業界・職種・選考ステータスを記録
- **企業一覧の絞り込み** — 業界グループ・ステータス・志望度・キーワードで検索・フィルター
- **企業比較** — 最大3社を並べて比較
- **マイページ管理** — 企業ごとのマイページURL・ログインIDを管理
- **スケジュール管理** — 説明会・面接・ES締切を企業ごとに登録・管理
- **Googleカレンダー連携** — スケジュール登録時にGoogleカレンダーへ自動追加（feature/calendarブランチ）
- **AI企業分析** — 説明会メモをもとに企業の特徴をAIが分析（実装予定）
- **Gmail連携** — 企業ごとに受信メールを自動整理（実装予定）

---

## 技術スタック

| 技術 | 用途 |
|------|------|
| Next.js 14 (TypeScript) | フロントエンド |
| Tailwind CSS v4 | スタイリング |
| Supabase (PostgreSQL) | データベース・認証 |
| Supabase RLS | セキュリティ（行レベルセキュリティ） |
| Google OAuth | ログイン認証 |
| Google Calendar API | カレンダー連携（feature/calendarブランチ） |
| Vercel | ホスティング・デプロイ |

---

## ファイル構成

```
shukatsu-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── route.ts        # Googleログイン処理（OAuthリダイレクト）
│   │   └── calendar/
│   │       ├── add/
│   │       │   └── route.ts        # Googleカレンダーにイベント追加するAPI
│   │       └── delete/
│   │           └── route.ts        # Googleカレンダーからイベント削除するAPI
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts            # Googleログイン後のコールバック処理
│   ├── companies/
│   │   ├── page.tsx                # 企業一覧（検索・フィルター・比較・業界グループ）
│   │   ├── new/
│   │   │   └── page.tsx            # 企業新規登録フォーム
│   │   └── [id]/
│   │       ├── page.tsx            # 企業詳細表示
│   │       ├── edit/
│   │       │   └── page.tsx        # 企業編集・削除
│   │       ├── accounts/
│   │       │   └── page.tsx        # マイページ情報登録・表示・削除
│   │       └── schedules/
│   │           └── page.tsx        # スケジュール登録・表示・削除・Googleカレンダー連携
│   ├── dashboard/
│   │   └── page.tsx                # ダッシュボード（選考状況サマリー・直近スケジュール）
│   ├── login/
│   │   └── page.tsx                # ログインページ
│   ├── globals.css                 # グローバルCSS（Tailwind設定）
│   ├── layout.tsx                  # 共通レイアウト（ナビゲーションバー）
│   └── page.tsx                    # トップページ
├── components/
│   ├── Badge.tsx                   # ステータスバッジ（検討中・ES提出・選考中・内定・見送り）
│   ├── Button.tsx                  # 共通ボタン（primary・secondary・danger）
│   ├── Card.tsx                    # 共通カード
│   ├── LogoutButton.tsx            # ログアウトボタン（Client Component）
│   └── PageHeader.tsx              # ページタイトル＋アクションボタン
├── utils/
│   └── supabase.ts                 # Supabaseクライアント（ブラウザ用）
├── .env.local                      # 環境変数（GitHubには公開しない）
├── .gitignore
├── next.config.ts
├── package.json
└── README.md
```

---

## セキュリティ

### データの保護
SupabaseのRow Level Security (RLS) を採用。ログイン中のユーザーは自分のデータにしかアクセスできない。

```
ユーザーAのデータ → ユーザーAしか見られない
ユーザーBのデータ → ユーザーBしか見られない
```

### 管理者からのデータアクセスについて
RLSはアプリからのアクセスに対してのみ有効。Supabaseの管理画面（管理者権限）からは全ユーザーのデータが見える状態になっている。完全な解決策としてはエンドツーエンド暗号化があるが、実装が複雑になるため現時点では対応していない。

### 環境変数の管理
APIキーなどの機密情報は`.env.local`に保存し、GitHubには公開していない。

---

## データベース設計

### companiesテーブル（企業情報）
| カラム名 | 型 | Default | 説明 |
|---------|-----|---------|------|
| id | uuid | gen_random_uuid() | 主キー |
| user_id | uuid | auth.uid() | ログインユーザーのID |
| name | text | - | 企業名 |
| status | text | 検討中 | 選考ステータス |
| industry | text | - | 業界 |
| job_type | text | - | 職種 |
| company_size | text | - | 企業規模 |
| priority | int4 | 3 | 志望度（1〜5） |
| website_url | text | - | 企業WebサイトURL |
| job | text | - | 仕事内容メモ |
| career | text | - | キャリアパスメモ |
| culture | text | - | 社風メモ |
| salary | text | - | 給与メモ |
| workstyle | text | - | 働き方メモ |
| memo | text | - | その他メモ |
| created_at | timestamptz | now() | 作成日時 |

### company_accountsテーブル（マイページ情報）
| カラム名 | 型 | Default | 説明 |
|---------|-----|---------|------|
| id | uuid | gen_random_uuid() | 主キー |
| company_id | uuid | - | 企業ID（companiesのidと紐付け） |
| user_id | uuid | auth.uid() | ログインユーザーのID |
| url | text | - | マイページURL |
| login_id | text | - | ログインID |
| password | text | - | パスワード（暗号化対応予定） |
| memo | text | - | メモ |
| created_at | timestamptz | now() | 作成日時 |

### schedulesテーブル（スケジュール）
| カラム名 | 型 | Default | 説明 |
|---------|-----|---------|------|
| id | uuid | gen_random_uuid() | 主キー |
| company_id | uuid | - | 企業ID（companiesのidと紐付け） |
| user_id | uuid | auth.uid() | ログインユーザーのID |
| title | text | - | 予定のタイトル |
| date | timestamptz | - | 日時 |
| memo | text | - | メモ |
| google_event_id | text | - | GoogleカレンダーイベントID |
| created_at | timestamptz | now() | 作成日時 |

---

## ローカルでの動かし方

### 必要なもの
- Node.js v18以上
- Supabaseアカウント
- Google Cloud Consoleアカウント

### セットアップ

```bash
git clone https://github.com/kouta-funatsu/shukatsu-app.git
cd shukatsu-app
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く。

### 環境変数（.env.local）

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## ライセンス

MIT
