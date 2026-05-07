import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ulema = [
  { name: "شیخ القرآن والحدیث حضرت العلامہ مولانا محمد طیب طاہری صاحب", orderNum: 1 },
  { name: "شیخ القرآن والحدیث حضرت العلامہ مولانا عبدالجبار خاکی صاحب", orderNum: 2 },
  { name: "شیخ القرآن حضرت العلامہ مولانا عبدالحق صاحب", orderNum: 3 },
  { name: "شیخ القرآن حضرت العلامہ مولانا عبدالحکیم صاحب", orderNum: 4 },
  { name: "حضرت العلامہ مولانا مفتی محمد مسلم صاحب", orderNum: 5 },
  { name: "حضرت العلامہ مولانا صدر الشہید صاحب", orderNum: 6 },
  { name: "حضرت العلامہ مولانا محمد ہاشم ربانی صاحب", orderNum: 7 },
  { name: "حضرت العلامہ مفتی محمد مجتبیٰ عامر صاحب", orderNum: 8 },
  { name: "حضرت العلامہ مولانا مفتی محمد ایاز صاحب", orderNum: 9 },
  { name: "حضرت العلامہ مولانا مفتی فدا بانی صاحب", orderNum: 10 },
  { name: "حضرت العلامہ مولانا مفتی محمد ایاز صاحب (دوم)", orderNum: 11 },
  { name: "حضرت العلامہ مولانا شریف حسین صاحب", orderNum: 12 },
  { name: "حضرت العلامہ مفتی توصیف صاحب", orderNum: 13 },
  { name: "حضرت العلامہ مولانا خضر حیات بھکری صاحب", orderNum: 14 },
  { name: "حضرت العلامہ مولانا احمد جمشید صاحب", orderNum: 15 },
  { name: "حضرت العلامہ مولانا عصمت اللہ خان ملتانی صاحب", orderNum: 16 },
  { name: "حضرت العلامہ مولانا عطاء اللہ بندیالوی صاحب", orderNum: 17 },
  { name: "حضرت العلامہ مولانا قاری سلیمان صاحب", orderNum: 18 },
  { name: "حضرت العلامہ مولانا فرید احمد حقانی صاحب", orderNum: 19 },
  { name: "مولانا شیخ القرآن حضرت العلامہ مولانا امداد الحق صاحب", orderNum: 20 },
];

async function seed() {
  const existing = await pool.query("SELECT COUNT(*) as cnt FROM ulema");
  const count = parseInt(existing.rows[0].cnt);
  if (count > 0) {
    console.log(`Already have ${count} ulema — skipping seed.`);
    await pool.end();
    return;
  }
  for (const u of ulema) {
    await pool.query("INSERT INTO ulema (name, order_num) VALUES ($1, $2)", [u.name, u.orderNum]);
  }
  console.log(`✓ Seeded ${ulema.length} ulema`);
  await pool.end();
}

seed().catch(e => { console.error(e.message); process.exit(1); });
