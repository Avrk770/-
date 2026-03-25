# תיק עבודות חי עם ניהול גלריה

הפרויקט עכשיו כולל:
- `index.html` אתר גלריה ציבורי.
- דף ניהול פרטי (נתיב סודי) לניהול מדיה.
- `supabase/schema.sql` סכמת DB + RLS + Storage policies.
- `app-config.js` קובץ קונפיגורציה מקומי.

## 1. הגדרה ראשונית

1. פתח את Supabase וצור Project חדש.
2. ב-`SQL Editor` הרץ את הקובץ [`supabase/schema.sql`](./supabase/schema.sql).
3. ב-Auth צור משתמש אדמין (Email + Password).
4. מלא את `SUPABASE_URL` ו-`SUPABASE_ANON_KEY` בתוך [`app-config.js`](./app-config.js).
5. אם צריך, עדכן גם `WHATSAPP_NUMBER`.

דוגמה:

```js
window.APP_CONFIG = Object.freeze({
  SUPABASE_URL: "https://YOUR_PROJECT_ID.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
  SUPABASE_GALLERY_BUCKET: "gallery",
  WHATSAPP_NUMBER: "972501234567"
});
```

## 2. בדיקה מקומית

```bash
python3 -m http.server 8080
```

ואז:
- אתר: `http://localhost:8080/index.html`
- ניהול: `http://localhost:8080/admin.com`

## 3. העלאה לאוויר

### אפשרות מומלצת: Vercel

1. העלה את הקוד ל-GitHub.
2. ב-Vercel בצע Import לפרויקט מה-Repo.
3. לפרויקט הזה לא נדרש build step (אתר סטטי).
4. Deploy.

מסמכים רשמיים:
- Deployments: [Deploying to Vercel](https://vercel.com/docs/deployments)
- דומיין: [Add & Configure Domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)

### אפשרות חלופית: Netlify

1. העלה את הקוד ל-GitHub.
2. ב-Netlify בצע Import from repository.
3. פרסם את האתר.

מסמכים רשמיים:
- Deploy from repo: [Netlify Quickstart](https://docs.netlify.com/start/quickstarts/deploy-from-repository/)
- דומיין: [Bring a domain to Netlify DNS](https://docs.netlify.com/manage/domains/configure-domains/bring-a-domain-to-netlify/)

## 4. חיבור דומיין שלך

1. הוסף את הדומיין בתוך פאנל האחסון (Vercel/Netlify).
2. הפלטפורמה תציג רשומות DNS מדויקות לדומיין שלך (A/CNAME וכו').
3. עדכן את הרשומות אצל רשם הדומיין שלך.
4. המתן להפצת DNS (יכול לקחת עד 48 שעות).

## 5. ניהול המדיה בגלריה

1. כנס ל-`/admin.com`.
2. התחבר עם משתמש האדמין.
3. העלה תמונות + כותרת/alt/קטגוריה + סדר תצוגה.
4. ערוך או מחק פריטים מהטבלה.
5. פריט עם `Published` כבוי לא יוצג באתר הציבורי.

## 6. נקודות אבטחה חשובות

- לא לשים `service_role` באתר. רק `anon key`.
- דף הניהול מוסתר בנתיב פרטי ומוגן באמצעות התחברות Supabase.

## 7. מקורות לתשתית Supabase

- JS SDK installation (כולל CDN): [Install supabase-js](https://supabase.com/docs/reference/javascript/installing)
- Auth login: [signInWithPassword](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- Storage upload: [storage.from().upload()](https://supabase.com/docs/reference/javascript/storage-from-upload)
- Public URL: [storage.from().getPublicUrl()](https://supabase.com/docs/reference/javascript/storage-from-getpublicurl)
- Storage access control: [Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)
