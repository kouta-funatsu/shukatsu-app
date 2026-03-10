# 就活管理アプリ (Shukatsu App)

就活における企業情報の整理・比較、自己分析、スケジュール管理を一元化するWebアプリです。

**デモ:** https://shukatsu-app-chi.vercel.app  
**GitHub:** https://github.com/kouta-funatsu/shukatsu-app

---

## 主な機能

- **Googleログイン** — Googleアカウントで安全にログイン
- **企業情報管理** — 説明会メモ・業界・職種・選考ステータスを記録
- **アカウント管理** — 企業ごとのマイページURL・ログインIDを管理
- **スケジュール管理** — 説明会・面接・ES締切をGoogleカレンダーと連携（実装予定）
- **自己分析ツール** — 質問に答えることで就活の軸を自動生成（実装予定）
- **AI企業分析** — 説明会メモをもとに企業の特徴をAIが分析（実装予定）
- **企業マッチ度スコアリング** — 自己分析×企業分析で相性を自動計算（実装予定）
- **Gmailまとめ** — 企業ごとに受信メールを自動整理（実装予定）

---

## 技術スタック

| 技術 | 用途 |
|------|------|
| Next.js 14 (TypeScript) | フロントエンド |
| Tailwind CSS | スタイリング |
| Supabase (PostgreSQL) | データベース・認証 |
| Supabase RLS | セキュリティ（行レベルセキュリティ） |
| Google OAuth | ログイン認証 |
| Vercel | ホスティング・デプロイ |

---

## セキュリティについて

### データの保護
このアプリはSupabaseの**Row Level Security (RLS)** を使用しています。RLSとは、データベースの各行（データ）に対してアクセス権限を設定する仕組みです。

```
ユーザーAのデータ → ユーザーAしか見られない
ユーザーBのデータ → ユーザーBしか見られない
```

たとえ同じデータベースを使っていても、他のユーザーのデータには一切アクセスできません。

### ログイン情報の管理
企業マイページのパスワードはSupabaseに保存されますが、RLSにより本人しかアクセスできません。

### 環境変数の管理
APIキーなどの機密情報は`.env.local`に保存し、GitHubには公開していません。

---

## データベース設計（仮）

### companiesテーブル（企業情報）
| カラム名 | 型 | Default | 説明 |
|---------|-----|---------|------|
| id | uuid | gen_random_uuid() | 主キー |
| user_id | uuid | auth.uid() | ログインユーザーのID |
| name | text | - | 企業名 |
| status | text | 検討中 | 選考ステータス（検討中/ES提出/選考中/内定/見送り） |
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
企業ごとのマイページURL・ログイン情報を管理するテーブル。companiesテーブルと紐付け。

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
企業ごとの説明会・面接・ES締切などの予定を管理するテーブル。Googleカレンダー・iPhoneカレンダーとの連携に使用。

| カラム名 | 型 | Default | 説明 |
|---------|-----|---------|------|
| id | uuid | gen_random_uuid() | 主キー |
| company_id | uuid | - | 企業ID（companiesのidと紐付け） |
| user_id | uuid | auth.uid() | ログインユーザーのID |
| title | text | - | 予定のタイトル |
| date | timestamptz | - | 日時 |
| memo | text | - | メモ |
| created_at | timestamptz | now() | 作成日時 |

---

## 今後の拡張予定

- [ ] パスワードの暗号化対応
- [ ] 自己分析ツール（質問形式で就活の軸を自動生成）
- [ ] AI企業分析（説明会メモからAIが特徴を抽出）
- [ ] 企業マッチ度スコアリング
- [ ] Googleカレンダー連携
- [ ] Gmail連携（企業ごとにメールを自動整理）
- [ ] Outlook連携
- [ ] スマホ対応（レスポンシブデザイン）
- [ ] PWA対応（スマホのホーム画面に追加可能）

---

## ローカルでの動かし方

### 必要なもの
- Node.js v18以上
- Supabaseアカウント
- Google Cloud Consoleアカウント

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/kouta-funatsu/shukatsu-app.git
cd shukatsu-app

# パッケージをインストール
npm install

# 環境変数を設定
cp .env.local.example .env.local
# .env.localにSupabaseのURLとAnon Keyを入力

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 を開く。

### 環境変数

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 開発の経緯

就活中に企業情報の管理が煩雑になったため、自分で使うツールとして開発しました。説明会のメモがバラバラになりがちな問題や、複数企業のマイページのログイン情報管理の手間を解決するために作成しています。

---

## ライセンス

MIT
