import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { submitMembershipApplication } from '../lib/cmsApi';

export function JoinMovementPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get('fullName') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const phone = String(formData.get('phone') || '').trim();
    const age = Number(formData.get('age') || 0);
    const organization = String(formData.get('organization') || '').trim();
    const motivation = String(formData.get('motivation') || '').trim();
    const consent = Boolean(formData.get('consent'));

    if (!fullName || !email || !phone || !motivation || !consent) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Form backend is not configured yet. Please set Supabase env variables.');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitMembershipApplication({
        fullName,
        email,
        phone,
        age,
        organization,
        motivation,
        consent,
      });
      form.reset();
      setSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-enter min-h-screen w-full bg-slate-950 py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-white/50 text-sm font-body uppercase tracking-widest mb-3">Membership</p>
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight">
              Join the <span className="font-serif italic font-normal text-white/80">Movement</span>
            </h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-body text-sm transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>

        <section className="rounded-xl border border-white/10 bg-slate-900/80 p-6 md:p-8">
          <p className="text-white/70 font-body text-sm md:text-base leading-relaxed mb-8">
            Fill this form to submit your interest in becoming a Leo member.
          </p>

          {!isSupabaseConfigured && (
            <div className="mb-6 rounded-lg border border-amber-300/30 bg-amber-900/20 p-4">
              <p className="text-amber-100 text-sm font-body">
                Supabase is not configured. Add env vars to enable submissions.
              </p>
            </div>
          )}

          {submitted ? (
            <div className="rounded-lg border border-emerald-300/30 bg-emerald-900/20 p-5">
              <p className="text-emerald-100 font-body text-sm md:text-base">
                Thank you! Your application has been received.
              </p>
            </div>
          ) : (
            <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2">
                <span className="text-white/75 text-sm font-body">Full Name *</span>
                <input
                  name="fullName"
                  required
                  className="h-11 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white placeholder:text-white/35 outline-none focus:border-white/50"
                  placeholder="Your full name"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-white/75 text-sm font-body">Email *</span>
                <input
                  type="email"
                  name="email"
                  required
                  className="h-11 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white placeholder:text-white/35 outline-none focus:border-white/50"
                  placeholder="you@example.com"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-white/75 text-sm font-body">Phone Number *</span>
                <input
                  name="phone"
                  required
                  className="h-11 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white placeholder:text-white/35 outline-none focus:border-white/50"
                  placeholder="07X XXX XXXX"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-white/75 text-sm font-body">Age *</span>
                <input
                  type="number"
                  name="age"
                  min={16}
                  max={35}
                  required
                  className="h-11 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white placeholder:text-white/35 outline-none focus:border-white/50"
                  placeholder="18"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-white/75 text-sm font-body">School / University / Workplace</span>
                <input
                  name="organization"
                  className="h-11 rounded-md border border-white/20 bg-slate-950/60 px-3 text-white placeholder:text-white/35 outline-none focus:border-white/50"
                  placeholder="Tell us where you study/work"
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-white/75 text-sm font-body">Why do you want to join? *</span>
                <textarea
                  name="motivation"
                  required
                  rows={5}
                  className="rounded-md border border-white/20 bg-slate-950/60 px-3 py-2 text-white placeholder:text-white/35 outline-none focus:border-white/50 resize-y"
                  placeholder="Share your motivation and how you want to contribute"
                />
              </label>

              <label className="md:col-span-2 inline-flex items-start gap-3 text-white/75 text-sm font-body">
                <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent" />
                I consent to being contacted by Leo Club of Pannipitiya Paradise regarding this membership application.
              </label>

              {errorMessage && (
                <div className="md:col-span-2 rounded-lg border border-red-300/30 bg-red-900/20 p-4">
                  <p className="text-red-100 text-sm font-body">{errorMessage}</p>
                </div>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !isSupabaseConfigured}
                  className="inline-flex items-center justify-center rounded-md bg-white text-slate-950 px-5 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors duration-300"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
