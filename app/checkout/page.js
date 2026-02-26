'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PAY_METHODS = [
  {
    id: 'card',
    label: 'بطاقة ائتمانية / Visa / Mastercard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
      </svg>
    ),
  },
  {
    id: 'vodafone',
    label: 'فودافون كاش',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    id: 'etisalat',
    label: 'اتصالات كاش',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    id: 'cod',
    label: 'الدفع عند الاستلام',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    ),
  },
];

const GOVERNORATES = ['القاهرة','الجيزة','الإسكندرية','الدقهلية','البحر الأحمر','البحيرة','الفيوم','الغربية','الإسماعيلية','المنوفية','المنيا','القليوبية','الوادي الجديد','السويس','أسوان','أسيوط','بني سويف','بورسعيد','دمياط','جنوب سيناء','كفر الشيخ','مطروح','الأقصر','قنا','شمال سيناء','الشرقية','سوهاج'];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [payMethod, setPayMethod] = useState('card');
  const [step, setStep] = useState(1); // 1: info, 2: payment, 3: done
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', governorate: '', address: '', notes: '',
  });
  const [card, setCard] = useState({
    number: '', name: '', expiry: '', cvv: '',
  });
  const [mobileNum, setMobileNum] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!c.length) router.push('/cart');
    setCart(c);
  }, [router]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setC = (key, val) => setCard((f) => ({ ...f, [key]: val }));

  const formatCardNum = (v) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = (v) => {
    const n = v.replace(/\D/g,'').slice(0,4);
    return n.length >= 3 ? n.slice(0,2) + '/' + n.slice(2) : n;
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.phone.trim() || !/^01[0-9]{9}$/.test(form.phone)) e.phone = 'رقم الهاتف غير صحيح';
    if (!form.governorate) e.governorate = 'اختر المحافظة';
    if (!form.address.trim()) e.address = 'العنوان مطلوب';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validateStep2 = () => {
    const e = {};
    if (payMethod === 'card') {
      if (card.number.replace(/\s/g,'').length < 16) e.cardNum = 'رقم البطاقة غير مكتمل';
      if (!card.name.trim()) e.cardName = 'اسم حامل البطاقة مطلوب';
      if (card.expiry.length < 5) e.expiry = 'تاريخ انتهاء غير صحيح';
      if (card.cvv.length < 3) e.cvv = 'CVV غير صحيح';
    }
    if (['vodafone','etisalat'].includes(payMethod)) {
      if (!/^01[0-9]{9}$/.test(mobileNum)) e.mobileNum = 'رقم الهاتف غير صحيح';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const placeOrder = async () => {
    if (!validateStep2()) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdate'));
    setSubmitting(false);
    setStep(3);
  };

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-xs font-body font-semibold text-[#111827] dark:text-white mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs font-body text-red-500 mt-1">{error}</p>}
    </div>
  );

  if (step === 3) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0c0c0c]">
        <Navbar cartCount={0} />
        <div className="max-w-md mx-auto px-4 pt-32 pb-16 text-center">
          <div
            className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#C9A84C,#e8c96a)', boxShadow:'0 12px 32px rgba(201,168,76,0.3)' }}
          >
            <svg className="w-10 h-10 text-[#1a1208]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 className="font-display font-bold text-3xl text-[#111827] dark:text-white mb-3">تم تأكيد طلبك!</h1>
          <p className="font-body text-[#6B7280] text-sm leading-relaxed mb-8">
            شكراً {form.name}، تم استلام طلبك بنجاح. سيتم التواصل معك على {form.phone} لتأكيد موعد التوصيل.
          </p>
          <div className="rounded-2xl card-mesh p-5 mb-8 text-right">
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">رقم الطلب</span>
                <span className="font-semibold text-[#111827] dark:text-white">#{Math.random().toString(36).slice(2,8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">عدد المنتجات</span>
                <span className="font-semibold text-[#111827] dark:text-white">{count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">المبلغ الإجمالي</span>
                <span className="font-display font-bold text-[#C9A84C]">{total.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">طريقة الدفع</span>
                <span className="font-semibold text-[#111827] dark:text-white">
                  {PAY_METHODS.find(p=>p.id===payMethod)?.label}
                </span>
              </div>
            </div>
          </div>
          <Link href="/" className="btn-gold px-10 py-3.5 rounded-2xl text-sm inline-block">العودة للمتجر</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c]">
      <Navbar cartCount={count} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2 animate-fade-up" style={{ animationFillMode:'both', opacity:0 }}>
          <Link href="/cart" className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ border:'1.5px solid rgba(0,0,0,0.09)' }}>
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="font-display font-bold text-[#111827] dark:text-white" style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', letterSpacing:'-0.02em' }}>
            إتمام الطلب
          </h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8 mr-12">
          {['بيانات التوصيل','طريقة الدفع'].map((s,i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />}
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-body font-bold transition-all duration-300"
                  style={{
                    background: step > i+1 ? '#10B981' : step === i+1 ? '#C9A84C' : 'rgba(0,0,0,0.08)',
                    color: step >= i+1 ? '#fff' : '#9CA3AF',
                  }}
                >
                  {step > i+1 ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  ) : i+1}
                </div>
                <span className={`text-xs font-body ${step === i+1 ? 'text-[#111827] dark:text-white font-semibold' : 'text-[#9CA3AF]'}`}>{s}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="gold-line mb-8" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">

            {/* ── Step 1: Shipping Info ── */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-display font-semibold text-xl text-[#111827] dark:text-white mb-5">بيانات التوصيل</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="الاسم بالكامل *" error={errors.name}>
                    <input type="text" value={form.name} onChange={(e)=>set('name',e.target.value)}
                      placeholder="محمد أحمد" className="input-field" />
                  </Field>
                  <Field label="رقم الهاتف *" error={errors.phone}>
                    <input type="tel" value={form.phone} onChange={(e)=>set('phone',e.target.value)}
                      placeholder="01xxxxxxxxx" className="input-field" maxLength={11} />
                  </Field>
                </div>

                <Field label="البريد الإلكتروني (اختياري)">
                  <input type="email" value={form.email} onChange={(e)=>set('email',e.target.value)}
                    placeholder="example@email.com" className="input-field" />
                </Field>

                <Field label="المحافظة *" error={errors.governorate}>
                  <select value={form.governorate} onChange={(e)=>set('governorate',e.target.value)}
                    className="input-field" style={{ appearance:'none' }}>
                    <option value="">اختر المحافظة</option>
                    {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>

                <Field label="العنوان بالتفصيل *" error={errors.address}>
                  <textarea value={form.address} onChange={(e)=>set('address',e.target.value)}
                    placeholder="الشارع، رقم المبنى، الحي..." rows={3}
                    className="input-field resize-none" />
                </Field>

                <Field label="ملاحظات للتوصيل (اختياري)">
                  <input type="text" value={form.notes} onChange={(e)=>set('notes',e.target.value)}
                    placeholder="مثال: اتصل قبل التوصيل" className="input-field" />
                </Field>

                <button onClick={()=>{ if(validateStep1()) setStep(2); }}
                  className="btn-gold w-full py-4 rounded-2xl text-base mt-2">
                  التالي — طريقة الدفع
                </button>
              </div>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="font-display font-semibold text-xl text-[#111827] dark:text-white mb-5">طريقة الدفع</h2>

                {/* Payment method selector */}
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {PAY_METHODS.map((m) => (
                    <button key={m.id} type="button" onClick={() => setPayMethod(m.id)}
                      className={`pay-option text-right flex items-center gap-3 transition-all duration-200 ${payMethod===m.id?'selected':''}`}>
                      <div className={`p-2 rounded-xl transition-colors ${payMethod===m.id?'bg-[#C9A84C]/15 text-[#C9A84C]':'bg-gray-100 dark:bg-gray-800 text-[#6B7280]'}`}>
                        {m.icon}
                      </div>
                      <span className={`text-sm font-body font-medium ${payMethod===m.id?'text-[#111827] dark:text-white':'text-[#6B7280]'}`}>
                        {m.label}
                      </span>
                      <div className="mr-auto">
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{ borderColor: payMethod===m.id?'#C9A84C':'rgba(0,0,0,0.2)' }}>
                          {payMethod===m.id && <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Card form */}
                {payMethod === 'card' && (
                  <div className="space-y-4 p-5 rounded-2xl card-mesh mb-4 animate-fade-in">
                    <Field label="رقم البطاقة" error={errors.cardNum}>
                      <input type="text" value={card.number}
                        onChange={(e) => setC('number', formatCardNum(e.target.value))}
                        placeholder="0000 0000 0000 0000" className="input-field"
                        maxLength={19} inputMode="numeric" />
                    </Field>
                    <Field label="الاسم على البطاقة" error={errors.cardName}>
                      <input type="text" value={card.name}
                        onChange={(e) => setC('name', e.target.value)}
                        placeholder="MOHAMMED AHMED" className="input-field" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="تاريخ الانتهاء" error={errors.expiry}>
                        <input type="text" value={card.expiry}
                          onChange={(e) => setC('expiry', formatExpiry(e.target.value))}
                          placeholder="MM/YY" className="input-field" maxLength={5} inputMode="numeric" />
                      </Field>
                      <Field label="CVV" error={errors.cvv}>
                        <input type="text" value={card.cvv}
                          onChange={(e) => setC('cvv', e.target.value.replace(/\D/,'').slice(0,4))}
                          placeholder="123" className="input-field" maxLength={4} inputMode="numeric" />
                      </Field>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-body text-[#9CA3AF]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                      بيانات البطاقة محمية ومشفرة بالكامل
                    </div>
                  </div>
                )}

                {/* Mobile wallet */}
                {['vodafone','etisalat'].includes(payMethod) && (
                  <div className="p-5 rounded-2xl card-mesh mb-4 animate-fade-in">
                    <p className="text-sm font-body text-[#6B7280] mb-3">
                      أدخل رقم المحفظة الإلكترونية الخاص بك
                    </p>
                    <Field label="رقم المحفظة" error={errors.mobileNum}>
                      <input type="tel" value={mobileNum}
                        onChange={(e) => setMobileNum(e.target.value.replace(/\D/,'').slice(0,11))}
                        placeholder="01xxxxxxxxx" className="input-field" maxLength={11} />
                    </Field>
                    <p className="text-xs font-body text-[#9CA3AF] mt-3">
                      سيتم إرسال طلب دفع إلى رقمك بعد تأكيد الطلب
                    </p>
                  </div>
                )}

                {/* COD */}
                {payMethod === 'cod' && (
                  <div className="p-5 rounded-2xl card-mesh mb-4 animate-fade-in flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:'rgba(16,185,129,0.1)', color:'#10B981' }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-body font-semibold text-[#111827] dark:text-white mb-1">الدفع عند الاستلام</p>
                      <p className="text-xs font-body text-[#6B7280] leading-relaxed">
                        ادفع نقداً عند وصول طلبك. تأكد من توفر المبلغ كاملاً {total.toLocaleString('ar-EG')} ج.م
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline px-6 py-3.5 rounded-2xl text-sm">
                    رجوع
                  </button>
                  <button onClick={placeOrder} disabled={submitting}
                    className="btn-gold flex-1 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        جاري تأكيد الطلب...
                      </>
                    ) : 'تأكيد الطلب'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="sticky top-24 rounded-3xl p-5 card-mesh"
              style={{ border:'1px solid rgba(255,255,255,0.7)' }}>
              <h3 className="font-display font-semibold text-base text-[#111827] dark:text-white mb-4">
                الطلب ({count} منتج)
              </h3>

              <div className="space-y-3 mb-4">
                {cart.map((item) => {
                  const img = (() => {
                    try { const imgs = Array.isArray(item.images) ? item.images : JSON.parse(item.images||'[]'); return imgs[0]||item.image; }
                    catch { return item.image; }
                  })();
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full card-mesh" />}
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C9A84C] text-white text-[9px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-body font-medium text-[#111827] dark:text-white truncate">{item.name}</p>
                        <p className="text-xs font-body text-[#9CA3AF]">{(item.price*item.quantity).toLocaleString('ar-EG')} ج.م</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="gold-line my-3" />

              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between text-[#6B7280]">
                  <span>المجموع</span><span>{total.toLocaleString('ar-EG')} ج.م</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>الشحن</span><span style={{color:'#10B981'}}>مجاناً</span>
                </div>
                <div className="flex justify-between font-display font-bold text-[#111827] dark:text-white text-base pt-1">
                  <span>الإجمالي</span><span>{total.toLocaleString('ar-EG')} ج.م</span>
                </div>
              </div>

              {step === 1 && form.name && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-body text-[#6B7280]">التوصيل إلى: {form.name}</p>
                  {form.governorate && <p className="text-xs font-body text-[#9CA3AF]">{form.governorate}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
